import { 
  TrackSection, 
  Train, 
  MegaBlock, 
  AccidentIncident, 
  RailwayAsset, 
  OptimizationMetrics,
  PassengerBooking,
  DisruptionNotification,
  RerouteOption
} from '../types/railway';

export const INITIAL_TRACK_SECTIONS: TrackSection[] = [
  // Mumbai Central Railway & Western Railway Mainlines
  {
    id: 'SEC-CR-01',
    code: 'CSMT-BY',
    name: 'CSMT to Byculla Slow & Fast Quad',
    fromStation: 'CSMT Mumbai',
    toStation: 'Byculla',
    division: 'Mumbai CR',
    zone: 'CR',
    status: 'clear',
    lines: 4,
    lengthKm: 4.8,
    maxSpeedKmph: 100,
    currentUtilizationPercent: 78,
    activeTrainsCount: 4,
    signalsCount: 16,
    electrification: '25kV AC',
    coordinates: {
      start: [100, 480],
      end: [200, 450],
    },
    connectedTo: ['SEC-CR-02']
  },
  {
    id: 'SEC-CR-02',
    code: 'BY-DR',
    name: 'Byculla to Dadar Central Junction',
    fromStation: 'Byculla',
    toStation: 'Dadar CR',
    division: 'Mumbai CR',
    zone: 'CR',
    status: 'clear',
    lines: 4,
    lengthKm: 4.2,
    maxSpeedKmph: 105,
    currentUtilizationPercent: 86,
    activeTrainsCount: 5,
    signalsCount: 18,
    electrification: '25kV AC',
    coordinates: {
      start: [200, 450],
      end: [320, 410],
    },
    connectedTo: ['SEC-CR-01', 'SEC-CR-03', 'SEC-WR-02']
  },
  {
    id: 'SEC-CR-03',
    code: 'DR-TNA',
    name: 'Dadar to Thane 6-Line Express Corridor',
    fromStation: 'Dadar CR',
    toStation: 'Thane',
    division: 'Mumbai CR',
    zone: 'CR',
    status: 'mega_block',
    lines: 6,
    lengthKm: 24.3,
    maxSpeedKmph: 110,
    currentTsrKmph: 30,
    currentUtilizationPercent: 52,
    activeTrainsCount: 3,
    signalsCount: 42,
    electrification: '25kV AC',
    blockReason: 'Sunday Mega Block: Up & Down Slow Line Track Relaying & Tamping Machine',
    coordinates: {
      start: [320, 410],
      end: [500, 340],
    },
    connectedTo: ['SEC-CR-02', 'SEC-CR-04']
  },
  {
    id: 'SEC-CR-04',
    code: 'TNA-KYN',
    name: 'Thane to Kalyan Jn Quad Line & Parsik Tunnel',
    fromStation: 'Thane',
    toStation: 'Kalyan Junction',
    division: 'Mumbai CR',
    zone: 'CR',
    status: 'clear',
    lines: 4,
    lengthKm: 19.8,
    maxSpeedKmph: 120,
    currentUtilizationPercent: 82,
    activeTrainsCount: 6,
    signalsCount: 36,
    electrification: '25kV AC',
    coordinates: {
      start: [500, 340],
      end: [680, 260],
    },
    connectedTo: ['SEC-CR-03', 'SEC-CR-05']
  },
  {
    id: 'SEC-CR-05',
    code: 'KYN-KSRA',
    name: 'Kalyan to Kasara Thull Ghat Section',
    fromStation: 'Kalyan Junction',
    toStation: 'Kasara',
    division: 'Mumbai CR',
    zone: 'CR',
    status: 'clear',
    lines: 2,
    lengthKm: 67.2,
    maxSpeedKmph: 100,
    currentUtilizationPercent: 72,
    activeTrainsCount: 3,
    signalsCount: 48,
    electrification: '25kV AC',
    coordinates: {
      start: [680, 260],
      end: [850, 180],
    },
    connectedTo: ['SEC-CR-04']
  },

  // Western Railway Mumbai Suburban & Main Line
  {
    id: 'SEC-WR-01',
    code: 'CCG-BCT',
    name: 'Churchgate to Mumbai Central 4-Line Quad',
    fromStation: 'Churchgate',
    toStation: 'Mumbai Central',
    division: 'Mumbai WR',
    zone: 'WR',
    status: 'clear',
    lines: 4,
    lengthKm: 4.5,
    maxSpeedKmph: 100,
    currentUtilizationPercent: 74,
    activeTrainsCount: 4,
    signalsCount: 16,
    electrification: '25kV AC',
    coordinates: {
      start: [80, 560],
      end: [180, 520],
    },
    connectedTo: ['SEC-WR-02']
  },
  {
    id: 'SEC-WR-02',
    code: 'BCT-DDR',
    name: 'Mumbai Central to Dadar Western',
    fromStation: 'Mumbai Central',
    toStation: 'Dadar WR',
    division: 'Mumbai WR',
    zone: 'WR',
    status: 'clear',
    lines: 5,
    lengthKm: 5.7,
    maxSpeedKmph: 105,
    currentUtilizationPercent: 81,
    activeTrainsCount: 5,
    signalsCount: 22,
    electrification: '25kV AC',
    coordinates: {
      start: [180, 520],
      end: [300, 480],
    },
    connectedTo: ['SEC-WR-01', 'SEC-WR-03', 'SEC-CR-02']
  },
  {
    id: 'SEC-WR-03',
    code: 'DDR-BVI',
    name: 'Dadar to Borivali 6th Line Corridor',
    fromStation: 'Dadar WR',
    toStation: 'Borivali',
    division: 'Mumbai WR',
    zone: 'WR',
    status: 'clear',
    lines: 6,
    lengthKm: 28.6,
    maxSpeedKmph: 110,
    currentUtilizationPercent: 89,
    activeTrainsCount: 7,
    signalsCount: 52,
    electrification: '25kV AC',
    coordinates: {
      start: [300, 480],
      end: [480, 420],
    },
    connectedTo: ['SEC-WR-02', 'SEC-WR-04']
  },
  {
    id: 'SEC-WR-04',
    code: 'BVI-VR',
    name: 'Borivali to Virar Quad & Vasai Creek Bridge',
    fromStation: 'Borivali',
    toStation: 'Virar',
    division: 'Mumbai WR',
    zone: 'WR',
    status: 'clear',
    lines: 4,
    lengthKm: 26.1,
    maxSpeedKmph: 110,
    currentUtilizationPercent: 77,
    activeTrainsCount: 4,
    signalsCount: 38,
    electrification: '25kV AC',
    coordinates: {
      start: [480, 420],
      end: [660, 360],
    },
    connectedTo: ['SEC-WR-03', 'SEC-WR-05']
  },
  {
    id: 'SEC-WR-05',
    code: 'VR-DRD',
    name: 'Virar to Dahanu Road High Speed Track',
    fromStation: 'Virar',
    toStation: 'Dahanu Road',
    division: 'Mumbai WR',
    zone: 'WR',
    status: 'clear',
    lines: 2,
    lengthKm: 64.0,
    maxSpeedKmph: 130,
    currentUtilizationPercent: 65,
    activeTrainsCount: 3,
    signalsCount: 40,
    electrification: '25kV AC',
    coordinates: {
      start: [660, 360],
      end: [840, 300],
    },
    connectedTo: ['SEC-WR-04']
  },

  // Northern Railway High-Density Corridors
  {
    id: 'SEC-NR-01',
    code: 'NDLS-GZB',
    name: 'New Delhi to Ghaziabad 4-Line Trunk',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Ghaziabad Junction',
    division: 'Delhi NR',
    zone: 'NR',
    status: 'clear',
    lines: 4,
    lengthKm: 25.5,
    maxSpeedKmph: 130,
    currentUtilizationPercent: 94,
    activeTrainsCount: 8,
    signalsCount: 44,
    electrification: '25kV AC',
    coordinates: {
      start: [150, 160],
      end: [320, 160],
    },
    connectedTo: ['SEC-NR-02']
  },
  {
    id: 'SEC-NR-02',
    code: 'GZB-ALJN',
    name: 'Ghaziabad to Aligarh Trunk Section',
    fromStation: 'Ghaziabad Junction',
    toStation: 'Aligarh Junction',
    division: 'Delhi NR',
    zone: 'NR',
    status: 'clear',
    lines: 2,
    lengthKm: 106.0,
    maxSpeedKmph: 130,
    currentUtilizationPercent: 88,
    activeTrainsCount: 6,
    signalsCount: 68,
    electrification: '25kV AC',
    coordinates: {
      start: [320, 160],
      end: [520, 160],
    },
    connectedTo: ['SEC-NR-01', 'SEC-NR-03']
  },
  {
    id: 'SEC-NR-03',
    code: 'ALJN-CNB',
    name: 'Aligarh to Kanpur Central Semi-High Speed Section',
    fromStation: 'Aligarh Junction',
    toStation: 'Kanpur Central',
    division: 'Delhi NR',
    zone: 'NCR',
    status: 'clear',
    lines: 3,
    lengthKm: 302.0,
    maxSpeedKmph: 160,
    currentUtilizationPercent: 91,
    activeTrainsCount: 9,
    signalsCount: 120,
    electrification: '25kV AC',
    coordinates: {
      start: [520, 160],
      end: [760, 160],
    },
    connectedTo: ['SEC-NR-02']
  }
];

export const INITIAL_TRAINS: Train[] = [
  {
    id: 'TRN-20901',
    number: '20901',
    name: 'Mumbai Central - Gandhinagar Capital Vande Bharat Express',
    type: 'Vande Bharat',
    origin: 'Mumbai Central (MMCT)',
    destination: 'Gandhinagar Cap (GNC)',
    currentSectionId: 'SEC-WR-03',
    speedKmph: 115,
    status: 'on_time',
    delayMinutes: 0,
    priority: 1,
    scheduledDeparture: '06:10',
    scheduledArrival: '12:25',
    passengersEstimated: 1128,
    locomotiveId: 'WAP-7-VB-16',
    crewId: 'CREW-WR-884'
  },
  {
    id: 'TRN-12951',
    number: '12951',
    name: 'Mumbai Central - New Delhi Tejas Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    origin: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    currentSectionId: 'SEC-WR-05',
    speedKmph: 128,
    status: 'on_time',
    delayMinutes: 2,
    priority: 1,
    scheduledDeparture: '17:00',
    scheduledArrival: '08:32',
    passengersEstimated: 1350,
    locomotiveId: 'WAP-7-30219',
    crewId: 'CREW-WR-412'
  },
  {
    id: 'TRN-22221',
    number: '22221',
    name: 'CSMT - Hazrat Nizamuddin Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    origin: 'CSMT Mumbai',
    destination: 'Hazrat Nizamuddin (NZM)',
    currentSectionId: 'SEC-CR-04',
    speedKmph: 98,
    status: 'delayed',
    delayMinutes: 14,
    priority: 1,
    scheduledDeparture: '16:00',
    scheduledArrival: '09:55',
    passengersEstimated: 1240,
    locomotiveId: 'WAP-7-37012 (Push-Pull)',
    crewId: 'CREW-CR-109',
    rerouteDetails: {
      originalRoute: 'Via Dadar-Thane-Kalyan Slow Corridor',
      divertedVia: 'Diverted via 5th Line Thane-Dadar to bypass Mega Block',
      extraMinutes: 10
    }
  },
  {
    id: 'TRN-SUB-95401',
    number: '95401',
    name: 'CSMT - Kalyan Fast 15-Car Suburban EMU',
    type: 'Suburban EMU',
    origin: 'CSMT Mumbai',
    destination: 'Kalyan Junction',
    currentSectionId: 'SEC-CR-02',
    speedKmph: 85,
    status: 'rerouted',
    delayMinutes: 8,
    priority: 2,
    scheduledDeparture: '14:15',
    scheduledArrival: '15:28',
    passengersEstimated: 4200,
    locomotiveId: 'EMU-BOM-7402',
    crewId: 'CREW-CR-SUB-92'
  },
  {
    id: 'TRN-SUB-90045',
    number: '90045',
    name: 'Churchgate - Borivali Slow EMU Local',
    type: 'Suburban EMU',
    origin: 'Churchgate',
    destination: 'Borivali',
    currentSectionId: 'SEC-WR-02',
    speedKmph: 72,
    status: 'on_time',
    delayMinutes: 0,
    priority: 2,
    scheduledDeparture: '14:22',
    scheduledArrival: '15:24',
    passengersEstimated: 3800,
    locomotiveId: 'EMU-MEDHA-501',
    crewId: 'CREW-WR-SUB-19'
  },
  {
    id: 'TRN-FRT-CONCOR',
    number: 'BOXNHL-882',
    name: 'JNPT Port to Dadri Inland Container Depot Freight',
    type: 'Freight / Container',
    origin: 'JNPT Port, Navi Mumbai',
    destination: 'ICD Dadri NCR',
    currentSectionId: 'SEC-CR-05',
    speedKmph: 62,
    status: 'delayed',
    delayMinutes: 35,
    priority: 5,
    scheduledDeparture: '11:00',
    scheduledArrival: '23:45',
    passengersEstimated: 0,
    locomotiveId: 'WAG-12B-60048',
    crewId: 'CREW-CR-FRT-04'
  },
  {
    id: 'TRN-22436',
    number: '22436',
    name: 'New Delhi - Varanasi Vande Bharat Express',
    type: 'Vande Bharat',
    origin: 'New Delhi (NDLS)',
    destination: 'Varanasi Junction (BSB)',
    currentSectionId: 'SEC-NR-02',
    speedKmph: 130,
    status: 'on_time',
    delayMinutes: 0,
    priority: 1,
    scheduledDeparture: '06:00',
    scheduledArrival: '14:00',
    passengersEstimated: 1128,
    locomotiveId: 'WAP-7-VB-08',
    crewId: 'CREW-NR-211'
  }
];

export const INITIAL_MEGA_BLOCKS: MegaBlock[] = [
  {
    id: 'BLK-CR-2026-08',
    division: 'Mumbai CR',
    sectionId: 'SEC-CR-03',
    sectionName: 'Dadar to Thane 6-Line Corridor',
    linesAffected: 'Up Slow',
    startTime: '10:30',
    endTime: '15:30',
    date: '2026-08-23 (Sunday)',
    reason: 'Track Relaying & Tamping',
    status: 'active',
    affectedTrainNumbers: ['95401', '22221', '12137', '95311'],
    divertedTrainNumbers: ['95401', '22221'],
    cancelledTrainNumbers: ['95104', '95108'],
    assignedMachinery: ['Plasser 09-3X Tamping Express', 'Track Relaying Train (TRT)', 'Dynamic Track Stabilizer (DGS)'],
    crewGangCount: 48,
    publicAdvisory: 'Up Slow Suburban Locals diverted on Up Fast Line between Thane & Matunga. Skipping halt at Vidyavihar, Kanjurmarg, and Nahur. Commuters permitted on Fast trains.',
    alternativeBusServices: 'BEST running 25 additional feeder buses between Kurla, Ghatkopar & Thane stations.'
  },
  {
    id: 'BLK-WR-2026-09',
    division: 'Mumbai WR',
    sectionId: 'SEC-WR-04',
    sectionName: 'Borivali to Virar (Vasai Creek Bridges 73 & 75)',
    linesAffected: 'Both Up/Down Lines',
    startTime: '00:30',
    endTime: '04:30',
    date: '2026-08-24 (Night Jumbo)',
    reason: 'Overhead Wire (OHE) Maintenance',
    status: 'scheduled',
    affectedTrainNumbers: ['12951', '12953', '90112'],
    divertedTrainNumbers: [],
    cancelledTrainNumbers: ['90001', '90003'],
    assignedMachinery: ['8-Wheeler Tower Wagon OHE inspection car', 'Heavy Rail Crane 140T'],
    crewGangCount: 32,
    publicAdvisory: 'Night Jumbo Block for 4 hours on UP & DOWN Fast lines between Borivali and Bhayandar. No disruption to morning peak suburban services.'
  },
  {
    id: 'BLK-NR-2026-11',
    division: 'Delhi NR',
    sectionId: 'SEC-NR-02',
    sectionName: 'Ghaziabad to Aligarh Trunk',
    linesAffected: 'Up Fast',
    startTime: '13:00',
    endTime: '17:00',
    date: '2026-08-25',
    reason: 'Electronic Interlocking (EI) Upgrade',
    status: 'scheduled',
    affectedTrainNumbers: ['22436', '12424'],
    divertedTrainNumbers: ['12424'],
    cancelledTrainNumbers: [],
    assignedMachinery: ['Signaling Test Rake', 'Automatic Point Machine Calibration Rig'],
    crewGangCount: 24,
    publicAdvisory: 'Signaling modernization for Kavach Collision Avoidance System. Express trains restricted to 80 km/h with 10-15 mins regulated delays.'
  }
];

export const INITIAL_ACCIDENTS: AccidentIncident[] = [
  {
    id: 'INC-2026-084',
    trainNumber: '12137',
    trainName: 'Punjab Mail Express',
    sectionId: 'SEC-CR-05',
    sectionName: 'Kalyan to Kasara Ghat Section',
    locationDetails: 'Pole Km 118/14 near Asangaon - OHE Mast displacement due to heavy monsoon tree fall',
    severity: 'minor',
    status: 'cordoned',
    reportedAt: '13:42 IST',
    natureOfIncident: 'OHE Wire Snap',
    description: 'Overhead 25kV traction wire entanglement with pantograph. Section power auto-tripped by SCADA safety relay.',
    casualtiesReported: 0,
    injuriesReported: 0,
    reliefTrainStatus: 'En Route',
    reliefTrainId: 'ARME-KYN-02',
    passengerAssistanceContact: '139 / CR Helpline: 022-22620173',
    publicEmergencyAdvisory: 'All passengers are safe inside air-conditioned coaches. Auxiliary power activated. Accident Relief Medical & Tower Wagon en route from Kalyan. Up Ghat line regulated.',
    estimatedTrackRestoration: '45 mins (approx 15:15 IST)'
  }
];

export const INITIAL_ASSETS: RailwayAsset[] = [
  {
    id: 'AST-LOC-30219',
    name: 'WAP-7 30219 High-Speed Electric Loco (Ghaziabad Shed)',
    type: 'Locomotive',
    division: 'Delhi NR',
    status: 'in_use',
    locationSectionId: 'SEC-WR-05',
    utilizationRate: 92,
    healthScore: 98
  },
  {
    id: 'AST-TMP-093X',
    name: 'Plasser 09-3X Continuous Action Tamping Machine',
    type: 'Tamping Machine',
    division: 'Mumbai CR',
    status: 'in_use',
    locationSectionId: 'SEC-CR-03',
    utilizationRate: 84,
    healthScore: 91
  },
  {
    id: 'AST-TOW-8W-04',
    name: '8-Wheeler High-Lift Hydraulic Tower Wagon',
    type: 'Tower Wagon',
    division: 'Mumbai CR',
    status: 'emergency_deployed',
    locationSectionId: 'SEC-CR-05',
    utilizationRate: 96,
    healthScore: 94
  },
  {
    id: 'AST-ART-KYN',
    name: 'Self-Propelled Accident Relief Medical Equipment (SP-ARME Kalyan)',
    type: 'Accident Relief Train (ART)',
    division: 'Mumbai CR',
    status: 'emergency_deployed',
    locationSectionId: 'SEC-CR-05',
    utilizationRate: 100,
    healthScore: 99
  },
  {
    id: 'AST-CRN-140T',
    name: 'Gottwald 140-Tonne Heavy Breakdown Crane (Kurla Depot)',
    type: 'Crane 140T',
    division: 'Mumbai CR',
    status: 'available',
    locationSectionId: 'SEC-CR-02',
    utilizationRate: 35,
    healthScore: 95
  },
  {
    id: 'AST-CRW-EXP-01',
    name: 'Loco Pilot & Guard Roster Group Alpha (Vande Bharat Express)',
    type: 'Crew Team',
    division: 'Mumbai WR',
    status: 'in_use',
    locationSectionId: 'SEC-WR-03',
    utilizationRate: 88,
    healthScore: 96
  }
];

export const INITIAL_OPTIMIZATION_METRICS: OptimizationMetrics = {
  beforeOptimization: {
    assetUtilizationPercent: 64.2,
    averageTrainDelayMins: 28.5,
    conflictCount: 14,
    trackPossessionEfficiency: 58.0,
    energyWastageKwh: 12400
  },
  afterOptimization: {
    assetUtilizationPercent: 92.6,
    averageTrainDelayMins: 4.8,
    conflictCount: 0,
    trackPossessionEfficiency: 89.4,
    energyWastageKwh: 3100
  },
  turnaroundReductionPercent: 38.4,
  throughputIncreasePercent: 28.4,
  conflictsResolvedCount: 14,
  generatedAt: '2026-08-22T14:10:00Z',
  status: 'completed',
  recommendations: [
    {
      id: 'REC-01',
      type: 'reroute',
      description: 'Divert Train #22221 CSMT-NZM Rajdhani via 5th Fast Line Thane-Dadar to bypass Track Tamping Block',
      impact: 'Eliminates 32 mins delay; saves ₹1.2L passenger dwell cost'
    },
    {
      id: 'REC-02',
      type: 'retime',
      description: 'Shift Freight Rake #BOXNHL-882 departure window to 01:30 AM night slot',
      impact: 'Frees 4 suburban passenger slots; +18% section capacity'
    },
    {
      id: 'REC-03',
      type: 'asset_swap',
      description: 'Reposition Plasser Tamping Machine #09-3X to Section DR-TNA at 10:25 AM without crossing main lines',
      impact: 'Reduces non-productive idle time by 44 minutes'
    },
    {
      id: 'REC-04',
      type: 'speed_tweak',
      description: 'Automate Dynamic Speed Profiling on Kalyan-Kasara section to smooth out regenerative braking pulses',
      impact: '9,300 kWh traction power saved per 100 trains'
    }
  ]
};

export const INITIAL_PASSENGER_BOOKINGS: PassengerBooking[] = [
  {
    pnr: '8421984210',
    passengerName: 'Aarav Sharma',
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    journeyDate: '2026-08-24',
    sourceStation: 'KOTA (Kota Junction)',
    destinationStation: 'NDLS (New Delhi)',
    coach: 'B4',
    berthNumber: '29 (Lower)',
    status: 'CONFIRMED',
    contactPhone: '+91-9820198201',
    intersectingDisruptionId: 'INC-01',
    intersectingDisruptionType: 'ACCIDENT'
  },
  {
    pnr: '6512903341',
    passengerName: 'Priya Deshmukh',
    trainNumber: '12137',
    trainName: 'Punjab Mail',
    journeyDate: '2026-08-24',
    sourceStation: 'CSMT (Mumbai CSMT)',
    destinationStation: 'KYN (Kalyan Jn)',
    coach: 'B2',
    berthNumber: '45 (Side Lower)',
    status: 'CONFIRMED',
    contactPhone: '+91-9876543210',
    intersectingDisruptionId: 'MB-CR-01',
    intersectingDisruptionType: 'MEGA_BLOCK'
  },
  {
    pnr: '9703411209',
    passengerName: 'Sunita Patil',
    trainNumber: '97034',
    trainName: 'CSMT Fast Local Suburban',
    journeyDate: '2026-08-24',
    sourceStation: 'TNA (Thane)',
    destinationStation: 'KYN (Kalyan)',
    coach: 'FC',
    berthNumber: 'Monthly Season Pass #4419',
    status: 'CONFIRMED',
    contactPhone: '+91-9123456780',
    intersectingDisruptionId: 'MB-CR-01',
    intersectingDisruptionType: 'MEGA_BLOCK'
  },
  {
    pnr: '4410298512',
    passengerName: 'Rahul Verma',
    trainNumber: '22221',
    trainName: 'Mumbai CSMT Rajdhani Express',
    journeyDate: '2026-08-24',
    sourceStation: 'CSMT (Mumbai)',
    destinationStation: 'NZM (Hazrat Nizamuddin)',
    coach: 'A1',
    berthNumber: '12 (Cabin)',
    status: 'CONFIRMED',
    contactPhone: '+91-9988776655',
    intersectingDisruptionId: 'INC-01',
    intersectingDisruptionType: 'ACCIDENT'
  },
  {
    pnr: '1092837465',
    passengerName: 'Meera Iyer',
    trainNumber: '20977',
    trainName: 'Ajmer - Chandigarh Vande Bharat',
    journeyDate: '2026-08-24',
    sourceStation: 'JP (Jaipur)',
    destinationStation: 'DEC (Delhi Cantt)',
    coach: 'EC',
    berthNumber: 'E1-14 (Window)',
    status: 'CONFIRMED',
    contactPhone: '+91-9445566778'
  }
];

export const INITIAL_REROUTE_OPTIONS: RerouteOption[] = [
  {
    option_id: 'REROUTE-RAIL-CHORD-01',
    strategy_type: 'RAIL_DIVERSION_CHORD_BYPASS',
    title: 'Direct Rail Chord Diversion via Sawai Madhopur ➔ Jaipur ➔ Rewari',
    path_stations: ['KOTA', 'SWM', 'JP', 'RE', 'DEC', 'NDLS'],
    bypassed_blocked_stations: ['AGC', 'MTJ', 'NZM'],
    additional_distance_km: 38.0,
    revised_eta: '11:45 AM (Today)',
    delay_minutes: 190,
    comfort_score: 0.94,
    feasibility_status: 'RECOMMENDED BY AI',
    reasoning: 'Train remains continuous. No passenger deboarding required. Clear signal slots available via Jaipur-Rewari electrified cord.',
    mode: 'Train Diversion'
  },
  {
    option_id: 'REROUTE-MULTI-HOP-02',
    strategy_type: 'MULTI_HOP_CONNECTING',
    title: 'Transfer at Kota Jn to Connecting Vande Bharat Express #20977',
    path_stations: ['KOTA', 'JP', 'DEC', 'NDLS'],
    bypassed_blocked_stations: ['AGC', 'MTJ'],
    additional_distance_km: 15.0,
    revised_eta: '10:15 AM (Today)',
    delay_minutes: 105,
    comfort_score: 0.89,
    feasibility_status: 'FASTEST TRANSIT',
    reasoning: 'Guaranteed berth transfer at Kota Jn onto High-Speed Vande Bharat. Saves ~85 minutes vs waiting.',
    mode: 'High Speed Transfer'
  },
  {
    option_id: 'REROUTE-INTERMODAL-03',
    strategy_type: 'INTERMODAL_SHUTTLE',
    title: 'Emergency Highway Bus Shuttle (Agra Cantt ➔ Mathura Jn) + Onward Train',
    path_stations: ['AGC', 'EXPRESSWAY_BUS_SHUTTLE', 'MTJ', 'NZM', 'NDLS'],
    bypassed_blocked_stations: ['AGC-MTJ Rail Track'],
    additional_distance_km: 0.0,
    revised_eta: '09:40 AM (Today)',
    delay_minutes: 68,
    comfort_score: 0.76,
    feasibility_status: 'EMERGENCY SHUTTLE',
    reasoning: 'Air-conditioned express coach bridges blocked rail section via Yamuna Expressway.',
    mode: 'Intermodal Coach Bridge'
  }
];

export const INITIAL_DISRUPTION_NOTIFICATIONS: Record<string, DisruptionNotification> = {
  '8421984210': {
    notification_id: 'NOTIF-8421984210-ACC',
    pnr: '8421984210',
    passenger_name: 'Aarav Sharma',
    train_number: '12951',
    train_name: 'Mumbai Rajdhani Express',
    priority: 'CRITICAL_EMERGENCY',
    headline: '🚨 CRITICAL EMERGENCY TRACK ADVISORY: Accident ahead on your train route',
    exact_incident_details: 'Derailment of Goods Train BTPN at Km 1342/12 between Agra Cantt (AGC) & Mathura Jn (MTJ). Both UP & DOWN main lines blocked.',
    impact_on_journey: 'Your Train #12951 is approaching this section. Expected delay: ~3.5 hrs. AI has computed 3 alternative routes and bypass chords.',
    actionable_alternatives: ['View AI Alternative Reroute Options', 'Request Emergency Meal Assistance (IRCTC)', 'Call IR Helpline 139'],
    helpline_contacts: ['139 (Toll Free)', '0562-2421204 (Agra Ctrl)', '1072 (Disaster Helpline)'],
    has_reroute_available: true,
    reroute_options: INITIAL_REROUTE_OPTIONS,
    timestamp: 'Just now'
  },
  '6512903341': {
    notification_id: 'NOTIF-6512903341-MB',
    pnr: '6512903341',
    passenger_name: 'Priya Deshmukh',
    train_number: '12137',
    train_name: 'Punjab Mail',
    priority: 'PLANNED_MAINTENANCE',
    headline: '🛠️ PLANNED MEGA BLOCK ADVISORY: Thane-Kalyan Track Maintenance',
    exact_incident_details: 'Scheduled 5-hour Sunday Mega Block on UP/DOWN Fast line between Thane and Kalyan for track renewal and OHE maintenance.',
    impact_on_journey: 'Train #12137 diverted to Slow Line between Thane and Kalyan. Expected regulated run with 15-25 mins delay.',
    actionable_alternatives: ['View Regulated Schedule', 'Check Feeder Bus Connections', 'Download Delay Slip'],
    helpline_contacts: ['139', '022-22624555 (CSMT Control)'],
    has_reroute_available: true,
    timestamp: '15 mins ago'
  },
  '9703411209': {
    notification_id: 'NOTIF-9703411209-MB',
    pnr: '9703411209',
    passenger_name: 'Sunita Patil',
    train_number: '97034',
    train_name: 'CSMT Fast Local Suburban',
    priority: 'PLANNED_MAINTENANCE',
    headline: '🚇 SUBURBAN DIVERSION NOTICE: Fast Locals Halting All Stations',
    exact_incident_details: 'Fast corridor closed between Byculla and Dadar. All fast suburban services routed via slow tracks with additional intermediate halts.',
    impact_on_journey: 'Your local will halt at all stations from Byculla to Dadar. Extra journey duration: ~12 minutes.',
    actionable_alternatives: ['View Real-time Suburban Track Live', 'Use Metro Line 3 Alternative'],
    helpline_contacts: ['139', '1512 (GRP Mumbai)'],
    has_reroute_available: false,
    timestamp: '30 mins ago'
  }
};

export const SAMPLE_CIRCULARS = [
  {
    id: 'CR-MB-01',
    title: 'Central Railway Sunday Mega Block - Thane to Kalyan',
    text: `CENTRAL RAILWAY PRESS RELEASE
MUMBAI DIVISION MEGA BLOCK ON 24.08.2026

Central Railway's Mumbai Division will operate a scheduled Mega Block on its suburban network for carrying out urgent track renewal, overhead equipment (OHE) maintenance, and signaling modernization works as under:

SECTION: BETWEEN THANE AND KALYAN
TIMING: 10:30 HRS TO 15:30 HRS (5.0 Hours)
TRACKS AFFECTED: UP & DOWN FAST LINES

REGULATION OF TRAINS:
1. All UP and DOWN Fast line suburban services departing CSMT between 10:00 AM and 3:00 PM will be diverted to UP/DOWN Slow lines between Thane and Kalyan stations, halting at all intermediate stations.
2. Mail/Express Train Nos. 12137 (Punjab Mail), 11057 (Amritsar Express) and 12163 arriving in Mumbai will be regulated and delayed by 15-25 minutes.
3. Speed restriction of 30 km/h will be enforced through the maintenance corridor.

Passengers are requested to bear with the Railway Administration for the inconvenience caused.`
  },
  {
    id: 'WR-MB-02',
    title: 'Western Railway Night Jumbo Block - Churchgate to Mumbai Central',
    text: `WESTERN RAILWAY NIGHT CORRIDOR BLOCK
Possession on 5th and 6th lines between Churchgate and Mumbai Central from 00:30 hrs to 04:30 hrs for Electronic Interlocking (Kavach 2.0) testing. All long-distance trains arriving into Mumbai Central will run at 30 kmph with pilot escort. Passengers advised to check live status on 139.`
  }
];

