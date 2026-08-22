// Predefined Indian Railways Incident & Accident Scenarios for AI Interception & Rerouting
export const SAMPLE_ACCIDENTS = [
  {
    id: 'INC-2026-IGP-01',
    title: 'Ghat Section Derailment near Igatpuri (Km 137/4)',
    incidentType: 'DERAILMENT',
    severity: 'CRITICAL',
    locationName: 'Kasara - Igatpuri Thull Ghat Section (Km 137/4, Tunnel #4)',
    sectionId: 'SEC-KSRA-IGP',
    fromStation: 'KSRA',
    toStation: 'IGP',
    involvedTrain: '12859',
    involvedTrainName: 'Gitanjali Express (CSMT - HWH)',
    description: 'Two rear coaches (S4 & S5) derailed on the Down Ghat gradient curve. Kavach automatic braking triggered for following trains. No major casualties reported; rescue relief train (ART) dispatched from Kalyan & Bhusawal.',
    clearanceEtaHours: 4.5,
    oheStatus: 'POWER_SHUTDOWN',
    kavachStatus: 'EMERGENCY_STOP_BROADCAST_ACTIVE',
    reportedAt: '2026-08-22T22:15:00+05:30',
    impactedCorridor: 'Mumbai - Nashik - Manmad - Bhusawal Central Line',
    recommendedDetour: {
      detourPath: ['CSMT', 'KYN', 'KJT', 'LNL', 'PUNE', 'DD', 'ANG', 'MMR', 'JL', 'BSL', 'NDLS/HWH'],
      detourName: 'Pune - Daund Bypass Chord Link (via SEC-DD-ANG-MMR)',
      additionalDistanceKm: 142,
      extraTimeMins: 95,
      capacityAvailable: 'HIGH (88% Track Green)',
      switchoverJunction: 'Kalyan Jn -> Karjat -> Pune'
    }
  },
  {
    id: 'INC-2026-BSR-02',
    title: 'OHE Catenary Wire Snap & Pantograph Damage at Vasai - Palghar',
    incidentType: 'OHE_BREAKDOWN',
    severity: 'HIGH',
    locationName: 'Vasai Road - Palghar Section (Km 52/8)',
    sectionId: 'SEC-BSR-PLG',
    fromStation: 'BSR',
    toStation: 'PLG',
    involvedTrain: '20901',
    involvedTrainName: 'Mumbai - Gandhinagar Vande Bharat',
    description: 'High-tension 25kV OHE catenary snapped due to external bird obstruction, entangling pantograph #2 of Train 20901. Fast line dead; tower wagon deployed for splicing.',
    clearanceEtaHours: 2.5,
    oheStatus: 'TRIPPED',
    kavachStatus: 'SLOW_ORDER_ZONE',
    reportedAt: '2026-08-22T21:45:00+05:30',
    impactedCorridor: 'Mumbai - Surat - Vadodara Western Corridor',
    recommendedDetour: {
      detourPath: ['MMCT', 'BDTS', 'BVI', 'BSR', 'DIVA', 'KYN', 'KSRA', 'IGP', 'NK', 'MMR', 'JL', 'NDB', 'ST', 'BRC'],
      detourName: 'Vasai-Diva Chord ➔ Central Main Line ➔ Jalgaon-Surat Link',
      additionalDistanceKm: 198,
      extraTimeMins: 110,
      capacityAvailable: 'MODERATE (76% Track Green)',
      switchoverJunction: 'Vasai Road -> Diva Chord'
    }
  },
  {
    id: 'INC-2026-KYN-03',
    title: 'Electronic Interlocking Failure at Kalyan Junction North Yard',
    incidentType: 'SIGNAL_INTERLOCKING_FAILURE',
    severity: 'MODERATE',
    locationName: 'Kalyan Jn Route Relay Interlocking (Point 142B)',
    sectionId: 'SEC-DIVA-KYN',
    fromStation: 'DIVA',
    toStation: 'KYN',
    involvedTrain: '12137',
    involvedTrainName: 'Punjab Mail',
    description: 'Point detection circuit failure on 5th and 6th Lines. All signals failing to Danger. Manual pilot operation initiated under paper line clear ticket.',
    clearanceEtaHours: 1.5,
    oheStatus: 'ENERGIZED',
    kavachStatus: 'CAUTION_RESTRICTION_15KMH',
    reportedAt: '2026-08-22T22:00:00+05:30',
    impactedCorridor: 'Thane - Kalyan Suburban & Main Corridor',
    recommendedDetour: {
      detourPath: ['CSMT', 'DR', 'CLA', 'GC', 'TNA', 'DIVA', 'BSR', 'PLG', 'VAPI', 'ST', 'NDLS'],
      detourName: 'Diva-Vasai Chord ➔ WR Mainline Diversion',
      additionalDistanceKm: 48,
      extraTimeMins: 35,
      capacityAvailable: 'HIGH (92% Track Green)',
      switchoverJunction: 'Diva Jn Bypass Chord'
    }
  }
];
