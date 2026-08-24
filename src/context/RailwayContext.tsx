import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrackSection, 
  Train, 
  MegaBlock, 
  AccidentIncident, 
  RailwayAsset, 
  OptimizationMetrics,
  DivisionName,
  AccidentSeverity,
  AuthUser,
  UserRole,
  ProblemReport,
  ProblemStatus
} from '../types/railway';
import { 
  INITIAL_TRACK_SECTIONS, 
  INITIAL_TRAINS, 
  INITIAL_MEGA_BLOCKS, 
  INITIAL_ACCIDENTS, 
  INITIAL_ASSETS, 
  INITIAL_OPTIMIZATION_METRICS,
  INITIAL_PROBLEM_REPORTS
} from '../data/mockData';
import { playEmergencyAlertSound, playOptimizationChime } from '../utils/audioAlert';

interface RailwayContextType {
  persona: 'planner' | 'passenger';
  setPersona: (p: 'planner' | 'passenger') => void;
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (role: UserRole, customDetails?: Partial<AuthUser>) => void;
  logout: () => void;
  selectedDivision: 'All' | DivisionName;
  setSelectedDivision: (d: 'All' | DivisionName) => void;
  trackSections: TrackSection[];
  trains: Train[];
  megaBlocks: MegaBlock[];
  accidents: AccidentIncident[];
  assets: RailwayAsset[];
  metrics: OptimizationMetrics;
  isOptimizing: boolean;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isKavachModalOpen: boolean;
  setIsKavachModalOpen: (open: boolean) => void;
  tripPlannerModalOpen: boolean;
  setTripPlannerModalOpen: (open: boolean) => void;
  tripOrigin: string;
  setTripOrigin: (origin: string) => void;
  tripDest: string;
  setTripDest: (dest: string) => void;
  openTripPlanner: (origin?: string, dest?: string) => void;
  
  // Problem Intake & RailMadad Grievance Center
  problemReports: ProblemReport[];
  isProblemModalOpen: boolean;
  setIsProblemModalOpen: (open: boolean) => void;
  submitProblemReport: (report: Omit<ProblemReport, 'id' | 'status' | 'timestamp' | 'aiPriorityScore'>) => ProblemReport;
  updateProblemStatus: (id: string, status: ProblemStatus, actionTaken?: string, assignedOfficer?: string) => void;
  resolveProblemReport: (id: string, actionTaken?: string) => void;
  
  // Actions
  runAiOptimizer: () => Promise<void>;
  reportAccident: (incident: {
    trainNumber: string;
    sectionId: string;
    natureOfIncident: AccidentIncident['natureOfIncident'];
    severity: AccidentSeverity;
    description: string;
  }) => void;
  scheduleMegaBlock: (block: Omit<MegaBlock, 'id' | 'status'>) => void;
  resolveIncident: (incidentId: string) => void;
  completeMegaBlock: (blockId: string) => void;
  resetSimulation: () => void;
  triggerSimulatedEmergency: () => void;
  triggerSimulatedMegaBlock: () => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export const RailwayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('railx_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [persona, setPersona] = useState<'planner' | 'passenger'>(() => {
    try {
      const saved = localStorage.getItem('railx_user_session');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'official' ? 'planner' : 'passenger';
      }
    } catch {}
    return 'planner';
  });
  const [selectedDivision, setSelectedDivision] = useState<'All' | DivisionName>('All');
  const [trackSections, setTrackSections] = useState<TrackSection[]>(INITIAL_TRACK_SECTIONS);
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [megaBlocks, setMegaBlocks] = useState<MegaBlock[]>(INITIAL_MEGA_BLOCKS);
  const [accidents, setAccidents] = useState<AccidentIncident[]>(INITIAL_ACCIDENTS);
  const [assets, setAssets] = useState<RailwayAsset[]>(INITIAL_ASSETS);
  const [metrics, setMetrics] = useState<OptimizationMetrics>(INITIAL_OPTIMIZATION_METRICS);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [isKavachModalOpen, setIsKavachModalOpen] = useState<boolean>(false);
  const [tripPlannerModalOpen, setTripPlannerModalOpen] = useState<boolean>(false);
  const [tripOrigin, setTripOrigin] = useState<string>('CSMT Mumbai');
  const [tripDest, setTripDest] = useState<string>('Kalyan Junction');
  const [problemReports, setProblemReports] = useState<ProblemReport[]>(() => {
    try {
      const saved = localStorage.getItem('railx_problem_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROBLEM_REPORTS;
  });
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false);

  // Sync problem reports across browser tabs / windows in real time
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'railx_problem_reports' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProblemReports(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const openTripPlanner = (origin?: string, dest?: string) => {
    if (origin) setTripOrigin(origin);
    if (dest) setTripDest(dest);
    setTripPlannerModalOpen(true);
  };

  const loginWithGoogle = (role: UserRole, customDetails?: Partial<AuthUser>) => {
    const isOfficial = role === 'official';
    const newUser: AuthUser = {
      id: `USR-${Date.now()}`,
      name: customDetails?.name || (isOfficial ? 'Er. Rajesh Kumar Sharma' : 'Rohit V. Sharma'),
      email: customDetails?.email || (isOfficial ? 'rajesh.sharma@railnet.gov.in' : 'rohit.sharma.mumbai@gmail.com'),
      avatarUrl: isOfficial 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role,
      officialDesignation: isOfficial ? (customDetails?.officialDesignation || 'Chief Train Controller (DOM)') : undefined,
      employeeId: isOfficial ? (customDetails?.employeeId || 'IR-CRIS-884920') : undefined,
      division: customDetails?.division || 'Mumbai CR',
      authProvider: 'google',
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      securityClearanceLevel: isOfficial ? 'Level-3 Admin' : 'Standard Commuter',
      ...customDetails
    };

    setCurrentUser(newUser);
    try {
      localStorage.setItem('railx_user_session', JSON.stringify(newUser));
    } catch {}

    setPersona(isOfficial ? 'planner' : 'passenger');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('railx_user_session');
    } catch {}
  };

  // Sync track section status based on active mega blocks & accidents
  useEffect(() => {
    setTrackSections(prevSections => 
      prevSections.map(sec => {
        const activeAccident = accidents.find(a => a.sectionId === sec.id && a.status !== 'resolved');
        if (activeAccident) {
          return {
            ...sec,
            status: 'accident',
            blockReason: `EMERGENCY: ${activeAccident.natureOfIncident} on Train #${activeAccident.trainNumber}`
          };
        }

        const activeBlock = megaBlocks.find(b => b.sectionId === sec.id && b.status === 'active');
        if (activeBlock) {
          return {
            ...sec,
            status: 'mega_block',
            blockReason: `MEGA BLOCK: ${activeBlock.reason} (${activeBlock.startTime}-${activeBlock.endTime})`
          };
        }

        const scheduledBlock = megaBlocks.find(b => b.sectionId === sec.id && b.status === 'scheduled');
        if (scheduledBlock) {
          return {
            ...sec,
            status: 'clear', // scheduled for later
            blockReason: undefined
          };
        }

        return {
          ...sec,
          status: 'clear',
          blockReason: undefined
        };
      })
    );
  }, [accidents, megaBlocks]);

  // Run AI Optimization Engine (Simulates OR-Tools / Constraint Programming Solver)
  const runAiOptimizer = async () => {
    setIsOptimizing(true);

    // Simulate solver execution time
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Update metrics with boosted utilization
    setMetrics(prev => ({
      ...prev,
      status: 'completed',
      generatedAt: new Date().toISOString(),
      beforeOptimization: {
        assetUtilizationPercent: 62.4,
        averageTrainDelayMins: 31.2,
        conflictCount: 16,
        trackPossessionEfficiency: 54.0,
        energyWastageKwh: 14800
      },
      afterOptimization: {
        assetUtilizationPercent: 95.8,
        averageTrainDelayMins: 3.2,
        conflictCount: 0,
        trackPossessionEfficiency: 93.6,
        energyWastageKwh: 2450
      },
      turnaroundReductionPercent: 44.2,
      throughputIncreasePercent: 32.8,
      conflictsResolvedCount: 16
    }));

    // Update trains to on_time / optimized routes
    setTrains(prev =>
      prev.map(t => {
        if (t.status === 'delayed') {
          return {
            ...t,
            status: 'rerouted',
            delayMinutes: 2,
            rerouteDetails: {
              originalRoute: 'Standard Corridor Path',
              divertedVia: 'AI Optimal Automatic Block Slot #4',
              extraMinutes: 2
            }
          };
        }
        return t;
      })
    );

    // Update assets utilization
    setAssets(prev =>
      prev.map(a => ({
        ...a,
        utilizationRate: Math.min(98, a.utilizationRate + 14),
        status: a.status === 'emergency_deployed' ? 'emergency_deployed' : 'in_use'
      }))
    );

    setIsOptimizing(false);
    playOptimizationChime();

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Report New Accident / SOS Incident
  const reportAccident = (incidentData: {
    trainNumber: string;
    sectionId: string;
    natureOfIncident: AccidentIncident['natureOfIncident'];
    severity: AccidentSeverity;
    description: string;
  }) => {
    const sec = trackSections.find(s => s.id === incidentData.sectionId);
    const trn = trains.find(t => t.number === incidentData.trainNumber);

    const newIncident: AccidentIncident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      trainNumber: incidentData.trainNumber,
      trainName: trn ? trn.name : `Express #${incidentData.trainNumber}`,
      sectionId: incidentData.sectionId,
      sectionName: sec ? sec.name : 'Railway Corridor Section',
      locationDetails: `${sec ? sec.fromStation : 'Site'} - ${sec ? sec.toStation : 'Track'} km mark`,
      severity: incidentData.severity,
      status: 'cordoned',
      reportedAt: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`,
      natureOfIncident: incidentData.natureOfIncident,
      description: incidentData.description,
      casualtiesReported: 0,
      injuriesReported: incidentData.severity === 'critical' ? 2 : 0,
      reliefTrainStatus: 'En Route',
      reliefTrainId: 'SP-ARME-HQ-01',
      passengerAssistanceContact: '139 (Indian Railways 24x7 Helpline) / GRP Safety Cell',
      publicEmergencyAdvisory: `SAFETY ADVISORY: Section ${sec?.name || ''} temporarily cordoned off due to ${incidentData.natureOfIncident}. Relief trains dispatched immediately. Stranded passengers being transferred.`,
      estimatedTrackRestoration: incidentData.severity === 'critical' ? '120 mins' : '45 mins'
    };

    setAccidents(prev => [newIncident, ...prev]);

    // Halt train
    setTrains(prev =>
      prev.map(t => {
        if (t.number === incidentData.trainNumber) {
          return { ...t, status: 'halted_safety', speedKmph: 0, delayMinutes: 45 };
        }
        if (t.currentSectionId === incidentData.sectionId) {
          return { ...t, status: 'delayed', delayMinutes: 25 };
        }
        return t;
      })
    );

    // Play emergency warble sound
    playEmergencyAlertSound();
  };

  // Schedule New Mega Block
  const scheduleMegaBlock = (blockData: Omit<MegaBlock, 'id' | 'status'>) => {
    const newBlock: MegaBlock = {
      ...blockData,
      id: `BLK-${blockData.division.replace(/\s+/g, '-').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'scheduled'
    };

    setMegaBlocks(prev => [newBlock, ...prev]);
  };

  // Resolve Accident Incident
  const resolveIncident = (incidentId: string) => {
    setAccidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'resolved',
            reliefTrainStatus: 'Relief Complete',
            estimatedTrackRestoration: 'Completed - Normal track speed certified'
          };
        }
        return inc;
      })
    );

    // Resume trains
    setTrains(prev =>
      prev.map(t => {
        if (t.status === 'halted_safety') {
          return { ...t, status: 'on_time', speedKmph: 90, delayMinutes: 5 };
        }
        return t;
      })
    );
  };

  // Complete Mega Block
  const completeMegaBlock = (blockId: string) => {
    setMegaBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, status: 'completed' } : b))
    );
  };

  // Quick Simulation Trigger: OHE Breakdown
  const triggerSimulatedEmergency = () => {
    reportAccident({
      trainNumber: '12951',
      sectionId: 'SEC-WR-04',
      natureOfIncident: 'OHE Wire Snap',
      severity: 'severe',
      description: 'Catenary wire sag detected near Vasai Bridge. Automatic emergency block triggered across Up/Down Fast tracks.'
    });
  };

  // Quick Simulation Trigger: Sunday Mega Block
  const triggerSimulatedMegaBlock = () => {
    const newBlock: MegaBlock = {
      id: `BLK-SIM-${Date.now().toString().slice(-4)}`,
      division: 'Mumbai CR',
      sectionId: 'SEC-CR-02',
      sectionName: 'Byculla to Dadar Central Junction',
      linesAffected: 'Down Slow',
      startTime: '11:00',
      endTime: '16:00',
      date: 'Today (Special Maintenance)',
      reason: 'Electronic Interlocking (EI) Upgrade',
      status: 'active',
      affectedTrainNumbers: ['95401', '22221'],
      divertedTrainNumbers: ['95401'],
      cancelledTrainNumbers: ['95104'],
      assignedMachinery: ['Plasser 09-3X Tamping Express', 'Tower Wagon #04'],
      crewGangCount: 36,
      publicAdvisory: 'Down Slow Suburban Locals diverted to Down Fast line between Byculla and Matunga. Expected 10 mins delay.',
      alternativeBusServices: 'BEST feeder routes active from Byculla to Dadar TT.'
    };

    setMegaBlocks(prev => [newBlock, ...prev]);
  };

  // Submit Problem Report / RailMadad Grievance
  const submitProblemReport = (
    reportData: Omit<ProblemReport, 'id' | 'status' | 'timestamp' | 'aiPriorityScore'>
  ): ProblemReport => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const id = `RM-2026-${randomSuffix}`;
    
    // Calculate AI priority score based on severity & category
    let aiPriorityScore = 50;
    if (reportData.severity === 'CRITICAL_SOS') aiPriorityScore = 98;
    else if (reportData.severity === 'HIGH') aiPriorityScore = 85;
    else if (reportData.severity === 'MEDIUM') aiPriorityScore = 65;
    else aiPriorityScore = 40;

    if (reportData.category === 'TRACK_INFRASTRUCTURE' || reportData.category === 'OHE_ELECTRICAL' || reportData.category === 'SAFETY_SECURITY_SOS') {
      aiPriorityScore = Math.min(100, aiPriorityScore + 5);
    }

    const newReport: ProblemReport = {
      ...reportData,
      id,
      status: 'AI_TRIAGED',
      timestamp: 'Just now',
      aiPriorityScore,
      assignedOfficer: 'Divisional Operations Control (DOM CRIS)',
      actionTaken: reportData.severity === 'CRITICAL_SOS' 
        ? 'AI Priority Escalation: Urgent alert dispatched to Section Controller & Station Master.'
        : 'AI Ticket Logged: Assigned to field maintenance queue.'
    };

    setProblemReports(prev => {
      const next = [newReport, ...prev];
      try {
        localStorage.setItem('railx_problem_reports', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Background sync to serverless API
    try {
      fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: id,
          category: reportData.category,
          severity: reportData.severity,
          title: reportData.title,
          description: reportData.description,
          trainNumber: reportData.trainNumber,
          stationOrKm: reportData.stationOrSection
        })
      }).catch(() => {});
    } catch {}

    // If critical, trigger emergency audio sound
    if (reportData.severity === 'CRITICAL_SOS') {
      playEmergencyAlertSound();
    }

    return newReport;
  };

  // Update Problem Status
  const updateProblemStatus = (
    id: string, 
    status: ProblemStatus, 
    actionTaken?: string, 
    assignedOfficer?: string
  ) => {
    setProblemReports(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            actionTaken: actionTaken || item.actionTaken,
            assignedOfficer: assignedOfficer || item.assignedOfficer,
            resolutionEta: status === 'RESOLVED' ? 'Completed' : item.resolutionEta
          };
        }
        return item;
      })
    );
  };

  // Resolve Problem Report
  const resolveProblemReport = (id: string, actionTaken?: string) => {
    updateProblemStatus(
      id, 
      'RESOLVED', 
      actionTaken || 'Verified and resolved by Section Field Engineer. Track & passenger safety confirmed.'
    );
  };

  // Reset Simulation to Pristine State
  const resetSimulation = () => {
    setTrackSections(INITIAL_TRACK_SECTIONS);
    setTrains(INITIAL_TRAINS);
    setMegaBlocks(INITIAL_MEGA_BLOCKS);
    setAccidents(INITIAL_ACCIDENTS);
    setAssets(INITIAL_ASSETS);
    setMetrics(INITIAL_OPTIMIZATION_METRICS);
    setProblemReports(INITIAL_PROBLEM_REPORTS);
    setSelectedSectionId(null);
  };

  return (
    <RailwayContext.Provider
      value={{
        persona,
        setPersona,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        logout,
        selectedDivision,
        setSelectedDivision,
        trackSections,
        trains,
        megaBlocks,
        accidents,
        assets,
        metrics,
        isOptimizing,
        selectedSectionId,
        setSelectedSectionId,
        activeTab,
        setActiveTab,
        isKavachModalOpen,
        setIsKavachModalOpen,
        tripPlannerModalOpen,
        setTripPlannerModalOpen,
        tripOrigin,
        setTripOrigin,
        tripDest,
        setTripDest,
        openTripPlanner,
        problemReports,
        isProblemModalOpen,
        setIsProblemModalOpen,
        submitProblemReport,
        updateProblemStatus,
        resolveProblemReport,
        runAiOptimizer,
        reportAccident,
        scheduleMegaBlock,
        resolveIncident,
        completeMegaBlock,
        resetSimulation,
        triggerSimulatedEmergency,
        triggerSimulatedMegaBlock
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => {
  const ctx = useContext(RailwayContext);
  if (!ctx) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return ctx;
};
