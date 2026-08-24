export type RailwayZone = 'CR' | 'WR' | 'NR' | 'ER' | 'SR' | 'SWR' | 'ECoR' | 'NCR';

export type UserRole = 'consumer' | 'official';

export type OfficialDesignation = 
  | 'Chief Train Controller (DOM)'
  | 'Senior Divisional Operations Manager'
  | 'Traction Power Controller (TPC)'
  | 'ASTE Signal & Telecom Engineer'
  | 'Divisional Railway Manager (DRM)'
  | 'Assistant Divisional Engineer (ADE)'
  | 'Station Superintendent (SM)'
  | 'Senior Divisional Operations Manager (Sr. DOM)'
  | 'Section Signal & Telecom Engineer (ASTE)'
  | 'Accident Relief Officer (ARO)';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  officialDesignation?: OfficialDesignation;
  employeeId?: string;
  division?: DivisionName;
  authProvider: 'google';
  loginTimestamp: string;
  securityClearanceLevel?: 'Level-3 Admin' | 'Level-2 Controller' | 'Standard Commuter';
}

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
  divisionController?: string;
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

export interface PassengerBooking {
  pnr: string;
  passengerName: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  sourceStation: string;
  destinationStation: string;
  coach: string;
  berthNumber: string;
  status: 'CONFIRMED' | 'RAC' | 'WAITLISTED';
  contactPhone?: string;
  intersectingDisruptionId?: string;
  intersectingDisruptionType?: 'ACCIDENT' | 'MEGA_BLOCK';
}

export interface RerouteOption {
  option_id: string;
  strategy_type: 'RAIL_DIVERSION_CHORD_BYPASS' | 'MULTI_HOP_CONNECTING' | 'INTERMODAL_SHUTTLE' | 'SLOW_QUAD_DIVERSION';
  title: string;
  path_stations: string[];
  bypassed_blocked_stations: string[];
  additional_distance_km: number;
  revised_eta: string;
  delay_minutes: number;
  comfort_score: number; // 0.0 - 1.0
  feasibility_status: string;
  reasoning: string;
  mode?: string;
}

export interface DisruptionNotification {
  notification_id: string;
  pnr: string;
  passenger_name: string;
  train_number: string;
  train_name?: string;
  priority: 'CRITICAL_EMERGENCY' | 'PLANNED_MAINTENANCE' | 'INFORMATIONAL';
  headline: string;
  exact_incident_details: string;
  impact_on_journey: string;
  actionable_alternatives: string[];
  helpline_contacts: string[];
  has_reroute_available: boolean;
  reroute_options?: RerouteOption[];
  timestamp?: string;
}

export interface CircularScanResult {
  block_id: string;
  railway_zone: string;
  division: DivisionName;
  section: string;
  from_station: string;
  to_station: string;
  affected_lines: string[];
  start_time: string;
  end_time: string;
  duration_hours: number;
  maintenance_type: string;
  speed_restrictions_kmph: number;
  train_impacts: string[];
  diverted_trains: string[];
  confidence_score: number;
  matched_passenger_count?: number;
}

export interface BroadcastSummary {
  status: 'DELIVERED' | 'QUEUED';
  affected_passengers_count: number;
  sample_recipients: Array<{
    pnr: string;
    name: string;
    train: string;
    seat: string;
  }>;
  channels: string[];
  sent_at: string;
}

