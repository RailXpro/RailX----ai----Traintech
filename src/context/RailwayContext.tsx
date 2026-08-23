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
  UserRole
} from '../types/railway';
import { 
  INITIAL_TRACK_SECTIONS, 
  INITIAL_TRAINS, 
  INITIAL_MEGA_BLOCKS, 
  INITIAL_ACCIDENTS, 
  INITIAL_ASSETS, 
  INITIAL_OPTIMIZATION_METRICS 
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

  // Reset Simulation to Pristine State
  const resetSimulation = () => {
    setTrackSections(INITIAL_TRACK_SECTIONS);
    setTrains(INITIAL_TRAINS);
    setMegaBlocks(INITIAL_MEGA_BLOCKS);
    setAccidents(INITIAL_ACCIDENTS);
    setAssets(INITIAL_ASSETS);
    setMetrics(INITIAL_OPTIMIZATION_METRICS);
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
