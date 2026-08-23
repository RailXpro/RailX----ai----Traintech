export type RailwayZone = 'CR' | 'WR' | 'NR' | 'ER' | 'SR' | 'SWR' | 'ECoR' | 'NCR';

export type DivisionName = 
  | 'Mumbai CR' 
  | 'Mumbai WR' 
  | 'Delhi NR' 
  | 'Howrah ER' 
  | 'Chennai SR' 
  | 'Bengaluru SWR';

export type SectionStatus = 'clear' | 'mega_block' | 'accident' | 'speed_restriction';

export interface TrackSection {
  id: string;
  code: string;
  name: string;
  fromStation: string;
  toStation: string;
  division: DivisionName;
  zone: RailwayZone;
  status: SectionStatus;
  lines: number; // e.g. 2 (Up/Down) or 4 (Up Slow/Fast, Down Slow/Fast)
  lengthKm: number;
  maxSpeedKmph: number;
  currentTsrKmph?: number; // Temporary Speed Restriction if any
  currentUtilizationPercent: number;
  activeTrainsCount: number;
  signalsCount: number;
  electrification: '25kV AC' | 'Non-Electrified';
  blockReason?: string;
  coordinates: {
    start: [number, number]; // [x, y] for schematic or [lat, lng]
    end: [number, number];
  };
  connectedTo: string[]; // Neighboring section IDs
}

export type TrainType = 'Vande Bharat' | 'Rajdhani / Shatabdi' | 'Mail / Express' | 'Suburban EMU' | 'Freight / Container';

export interface Train {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  origin: string;
  destination: string;
  currentSectionId: string;
  speedKmph: number;
  status: 'on_time' | 'delayed' | 'rerouted' | 'halted_safety' | 'cancelled';
  delayMinutes: number;
  priority: 1 | 2 | 3 | 4 | 5; // 1: Vande Bharat / Rajdhani, 5: Freight
  scheduledDeparture: string;
  scheduledArrival: string;
  passengersEstimated: number;
  locomotiveId: string;
  crewId: string;
  rerouteDetails?: {
    originalRoute: string;
    divertedVia: string;
    extraMinutes: number;
  };
}

export type BlockReason = 
  | 'Track Relaying & Tamping' 
  | 'Overhead Wire (OHE) Maintenance' 
  | 'Electronic Interlocking (EI) Upgrade' 
  | 'Bridge Girder Inspection' 
  | 'Point & Crossing Overhaul' 
  | 'Suburban Jumbo Block';

export interface MegaBlock {
  id: string;
  division: DivisionName;
  sectionId: string;
  sectionName: string;
  linesAffected: 'Up Slow' | 'Down Slow' | 'Up Fast' | 'Down Fast' | 'All Lines' | 'Both Up/Down Lines';
  startTime: string; // ISO or formatted 'HH:mm'
  endTime: string;
  date: string;
  reason: BlockReason;
  status: 'scheduled' | 'active' | 'completed';
  affectedTrainNumbers: string[];
  divertedTrainNumbers: string[];
  cancelledTrainNumbers: string[];
  assignedMachinery: string[];
  crewGangCount: number;
  publicAdvisory: string;
  alternativeBusServices?: string;
}

export type AccidentSeverity = 'minor' | 'severe' | 'critical';
export type IncidentStatus = 'reported' | 'cordoned' | 'relief_dispatched' | 'site_cleared' | 'resolved';

export interface AccidentIncident {
  id: string;
  trainNumber: string;
  trainName: string;
  sectionId: string;
  sectionName: string;
  locationDetails: string;
  severity: AccidentSeverity;
  status: IncidentStatus;
  reportedAt: string;
  natureOfIncident: 
    | 'Derailment' 
    | 'OHE Wire Snap' 
    | 'Signal Failure' 
    | 'Boulder Fall / Obstruction' 
    | 'Cattle Run Over / Brake Defect' 
    | 'Fire in Coach / Smoke';
  description: string;
  casualtiesReported: number;
  injuriesReported: number;
  reliefTrainStatus: 'Not Required' | 'En Route' | 'At Incident Site' | 'Relief Complete';
  reliefTrainId?: string;
  passengerAssistanceContact: string;
  publicEmergencyAdvisory: string;
  estimatedTrackRestoration: string;
}

export interface RailwayAsset {
  id: string;
  name: string;
  type: 'Locomotive' | 'Crew Team' | 'Tamping Machine' | 'Tower Wagon' | 'Accident Relief Train (ART)' | 'Crane 140T';
  division: DivisionName;
  status: 'available' | 'in_use' | 'maintenance' | 'emergency_deployed';
  locationSectionId: string;
  utilizationRate: number; // Percentage
  healthScore: number; // 0-100
}

export interface OptimizationMetrics {
  beforeOptimization: {
    assetUtilizationPercent: number;
    averageTrainDelayMins: number;
    conflictCount: number;
    trackPossessionEfficiency: number;
    energyWastageKwh: number;
  };
  afterOptimization: {
    assetUtilizationPercent: number;
    averageTrainDelayMins: number;
    conflictCount: number;
    trackPossessionEfficiency: number;
    energyWastageKwh: number;
  };
  turnaroundReductionPercent: number;
  throughputIncreasePercent: number;
  conflictsResolvedCount: number;
  generatedAt: string;
  status: 'idle' | 'running' | 'completed';
  recommendations: Array<{
    id: string;
    type: 'retime' | 'reroute' | 'asset_swap' | 'speed_tweak';
    description: string;
    impact: string;
  }>;
}

export interface PassengerJourneyQuery {
  origin: string;
  destination: string;
  travelTime: string;
}

export interface JourneyOption {
  id: string;
  trainNumber: string;
  trainName: string;
  departure: string;
  arrival: string;
  duration: string;
  status: 'normal' | 'diverted' | 'delayed' | 'bus_bridge';
  disruptionNote?: string;
  alternateRouteSummary?: string;
  onTimeProbability: number;
}
