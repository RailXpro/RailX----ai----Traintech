// Indian Railway Network Topology & Corridor Graph
export const STATIONS = {
  // Mumbai Metropolitan & Central Railway Corridor
  CSMT: { code: 'CSMT', name: 'Mumbai CSMT', zone: 'CR', division: 'Mumbai', lat: 18.9401, lng: 72.8354, platforms: 18, junction: true },
  BY: { code: 'BY', name: 'Byculla', zone: 'CR', division: 'Mumbai', lat: 18.9754, lng: 72.8340, platforms: 4, junction: false },
  DR: { code: 'DR', name: 'Dadar Central', zone: 'CR', division: 'Mumbai', lat: 19.0178, lng: 72.8478, platforms: 8, junction: true },
  CLA: { code: 'CLA', name: 'Kurla Jn', zone: 'CR', division: 'Mumbai', lat: 19.0657, lng: 72.8794, platforms: 8, junction: true },
  GC: { code: 'GC', name: 'Ghatkopar', zone: 'CR', division: 'Mumbai', lat: 19.0860, lng: 72.9082, platforms: 4, junction: false },
  TNA: { code: 'TNA', name: 'Thane', zone: 'CR', division: 'Mumbai', lat: 19.1860, lng: 72.9759, platforms: 10, junction: true },
  DIVA: { code: 'DIVA', name: 'Diva Jn', zone: 'CR', division: 'Mumbai', lat: 19.1884, lng: 73.0423, platforms: 6, junction: true },
  KYN: { code: 'KYN', name: 'Kalyan Jn', zone: 'CR', division: 'Mumbai', lat: 19.2364, lng: 73.1306, platforms: 7, junction: true },
  
  // North-East Line (Kasara - Igatpuri Ghat Section)
  KSRA: { code: 'KSRA', name: 'Kasara', zone: 'CR', division: 'Mumbai', lat: 19.6465, lng: 73.4831, platforms: 4, junction: true },
  IGP: { code: 'IGP', name: 'Igatpuri (Ghat Section)', zone: 'CR', division: 'Mumbai', lat: 19.6967, lng: 73.5615, platforms: 4, junction: true },
  NK: { code: 'NK', name: 'Nashik Road', zone: 'CR', division: 'Bhusawal', lat: 19.9576, lng: 73.8344, platforms: 4, junction: false },
  MMR: { code: 'MMR', name: 'Manmad Jn', zone: 'CR', division: 'Bhusawal', lat: 20.2520, lng: 74.4363, platforms: 6, junction: true },
  BSL: { code: 'BSL', name: 'Bhusawal Jn', zone: 'CR', division: 'Bhusawal', lat: 21.0455, lng: 75.7885, platforms: 8, junction: true },
  
  // South-East Line (Karjat - Lonavala Ghat Section -> Pune -> Daund)
  KJT: { code: 'KJT', name: 'Karjat Jn', zone: 'CR', division: 'Mumbai', lat: 18.9103, lng: 73.3275, platforms: 3, junction: true },
  LNL: { code: 'LNL', name: 'Lonavala', zone: 'CR', division: 'Pune', lat: 18.7557, lng: 73.4091, platforms: 3, junction: true },
  PUNE: { code: 'PUNE', name: 'Pune Jn', zone: 'CR', division: 'Pune', lat: 18.5284, lng: 73.8743, platforms: 6, junction: true },
  DD: { code: 'DD', name: 'Daund Jn (Bypass Chord)', zone: 'CR', division: 'Pune', lat: 18.4638, lng: 74.5828, platforms: 6, junction: true },
  ANG: { code: 'ANG', name: 'Ahmednagar', zone: 'CR', division: 'Solapur', lat: 19.0948, lng: 74.7480, platforms: 3, junction: true },
  SUR: { code: 'SUR', name: 'Solapur', zone: 'CR', division: 'Solapur', lat: 17.6599, lng: 75.9064, platforms: 5, junction: true },
  
  // Western Railway Corridor (Mumbai - Surat - Vadodara - Delhi / Ahmedabad)
  MMCT: { code: 'MMCT', name: 'Mumbai Central', zone: 'WR', division: 'Mumbai WR', lat: 18.9696, lng: 72.8193, platforms: 5, junction: true },
  BDTS: { code: 'BDTS', name: 'Bandra Terminus', zone: 'WR', division: 'Mumbai WR', lat: 19.0620, lng: 72.8407, platforms: 7, junction: true },
  BVI: { code: 'BVI', name: 'Borivali', zone: 'WR', division: 'Mumbai WR', lat: 19.2288, lng: 72.8569, platforms: 8, junction: true },
  BSR: { code: 'BSR', name: 'Vasai Road (Bypass Chord)', zone: 'WR', division: 'Mumbai WR', lat: 19.3813, lng: 72.8311, platforms: 7, junction: true },
  PLG: { code: 'PLG', name: 'Palghar', zone: 'WR', division: 'Mumbai WR', lat: 19.6974, lng: 72.7667, platforms: 3, junction: false },
  VAPI: { code: 'VAPI', name: 'Vapi', zone: 'WR', division: 'Mumbai WR', lat: 20.3713, lng: 72.9048, platforms: 3, junction: false },
  ST: { code: 'ST', name: 'Surat', zone: 'WR', division: 'Vadodara', lat: 21.2050, lng: 72.8408, platforms: 6, junction: true },
  BRC: { code: 'BRC', name: 'Vadodara Jn', zone: 'WR', division: 'Vadodara', lat: 22.3107, lng: 73.1812, platforms: 7, junction: true },
  RTM: { code: 'RTM', name: 'Ratlam Jn', zone: 'WR', division: 'Ratlam', lat: 23.3364, lng: 75.0374, platforms: 7, junction: true },
  KOTA: { code: 'KOTA', name: 'Kota Jn', zone: 'WCR', division: 'Kota', lat: 25.2238, lng: 75.8774, platforms: 6, junction: true },
  NDLS: { code: 'NDLS', name: 'New Delhi', zone: 'NR', division: 'Delhi', lat: 28.6415, lng: 77.2197, platforms: 16, junction: true },
  
  // Cross Links & East-West Connecting Junctions
  JL: { code: 'JL', name: 'Jalgaon Jn', zone: 'CR', division: 'Bhusawal', lat: 21.0041, lng: 75.5626, platforms: 5, junction: true },
  NDB: { code: 'NDB', name: 'Nandurbar (Surat-Jalgaon Line)', zone: 'WR', division: 'Mumbai WR', lat: 21.3712, lng: 74.2403, platforms: 3, junction: true },
  ET: { code: 'ET', name: 'Itarsi Jn', zone: 'WCR', division: 'Bhopal', lat: 22.6139, lng: 77.7609, platforms: 8, junction: true },
  BPL: { code: 'BPL', name: 'Bhopal Jn', zone: 'WCR', division: 'Bhopal', lat: 23.2687, lng: 77.4126, platforms: 6, junction: true },
  CNB: { code: 'CNB', name: 'Kanpur Central', zone: 'NCR', division: 'Prayagraj', lat: 26.4547, lng: 80.3507, platforms: 10, junction: true },
  HWH: { code: 'HWH', name: 'Howrah Jn', zone: 'ER', division: 'Howrah', lat: 22.5839, lng: 88.3426, platforms: 23, junction: true },
};

export const TRACK_SECTIONS = [
  // Central Main Line (CSMT -> Kalyan)
  { id: 'SEC-CSMT-DR', from: 'CSMT', to: 'DR', distanceKm: 9, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 100, status: 'NORMAL', kavach: true },
  { id: 'SEC-DR-CLA', from: 'DR', to: 'CLA', distanceKm: 6, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 105, status: 'NORMAL', kavach: true },
  { id: 'SEC-CLA-GC', from: 'CLA', to: 'GC', distanceKm: 4, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true },
  { id: 'SEC-GC-TNA', from: 'GC', to: 'TNA', distanceKm: 14, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true },
  { id: 'SEC-TNA-DIVA', from: 'TNA', to: 'DIVA', distanceKm: 9, tracks: 6, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow', '5th Line', '6th Line'], maxSpeedKmH: 120, status: 'NORMAL', kavach: true },
  { id: 'SEC-DIVA-KYN', from: 'DIVA', to: 'KYN', distanceKm: 11, tracks: 6, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow', '5th Line', '6th Line'], maxSpeedKmH: 120, status: 'NORMAL', kavach: true },

  // North-East Main Line (Kalyan -> Kasara -> Igatpuri -> Manmad -> Bhusawal)
  { id: 'SEC-KYN-KSRA', from: 'KYN', to: 'KSRA', distanceKm: 67, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true },
  { id: 'SEC-KSRA-IGP', from: 'KSRA', to: 'IGP', distanceKm: 15, tracks: 3, lines: ['Up Ghat Line', 'Down Ghat Line', 'Middle Ghat Line (Bankers)'], maxSpeedKmH: 60, status: 'NORMAL', kavach: true, isGhatSection: true, gradient: '1 in 37' },
  { id: 'SEC-IGP-NK', from: 'IGP', to: 'NK', distanceKm: 51, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-NK-MMR', from: 'NK', to: 'MMR', distanceKm: 73, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-MMR-JL', from: 'MMR', to: 'JL', distanceKm: 160, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-JL-BSL', from: 'JL', to: 'BSL', distanceKm: 24, tracks: 3, lines: ['Up Main', 'Down Main', '3rd Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },

  // South-East Line (Kalyan -> Karjat -> Lonavala -> Pune -> Daund)
  { id: 'SEC-KYN-KJT', from: 'KYN', to: 'KJT', distanceKm: 46, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true },
  { id: 'SEC-KJT-LNL', from: 'KJT', to: 'LNL', distanceKm: 28, tracks: 3, lines: ['Up Bhor Ghat', 'Down Bhor Ghat', 'Middle Ghat Line'], maxSpeedKmH: 55, status: 'NORMAL', kavach: true, isGhatSection: true, gradient: '1 in 37' },
  { id: 'SEC-LNL-PUNE', from: 'LNL', to: 'PUNE', distanceKm: 64, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 115, status: 'NORMAL', kavach: true },
  { id: 'SEC-PUNE-DD', from: 'PUNE', to: 'DD', distanceKm: 76, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 120, status: 'NORMAL', kavach: true },
  { id: 'SEC-DD-SUR', from: 'DD', to: 'SUR', distanceKm: 187, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },

  // CR Bypass & Chords: Daund - Ahmednagar - Manmad Link (Crucial Detour for Igatpuri/Kasara blockage!)
  { id: 'SEC-DD-ANG', from: 'DD', to: 'ANG', distanceKm: 85, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true, isChord: true },
  { id: 'SEC-ANG-MMR', from: 'ANG', to: 'MMR', distanceKm: 153, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true, isChord: true },

  // Western Line (MMCT -> Bandra -> Vasai -> Surat -> Vadodara -> Ratlam -> Kota -> Delhi)
  { id: 'SEC-MMCT-BDTS', from: 'MMCT', to: 'BDTS', distanceKm: 14, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 100, status: 'NORMAL', kavach: true },
  { id: 'SEC-BDTS-BVI', from: 'BDTS', to: 'BVI', distanceKm: 18, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true },
  { id: 'SEC-BVI-BSR', from: 'BVI', to: 'BSR', distanceKm: 19, tracks: 4, lines: ['Up Fast', 'Down Fast', 'Up Slow', 'Down Slow'], maxSpeedKmH: 120, status: 'NORMAL', kavach: true },
  { id: 'SEC-BSR-PLG', from: 'BSR', to: 'PLG', distanceKm: 42, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-PLG-VAPI', from: 'PLG', to: 'VAPI', distanceKm: 76, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-VAPI-ST', from: 'VAPI', to: 'ST', distanceKm: 95, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-ST-BRC', from: 'ST', to: 'BRC', distanceKm: 130, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-BRC-RTM', from: 'BRC', to: 'RTM', distanceKm: 260, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-RTM-KOTA', from: 'RTM', to: 'KOTA', distanceKm: 266, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-KOTA-NDLS', from: 'KOTA', to: 'NDLS', distanceKm: 465, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 160, status: 'NORMAL', kavach: true },

  // Cross Bypass: Vasai Road (WR) <--> Diva Jn (CR) Connection Chord (Bypasses Mumbai City)
  { id: 'SEC-BSR-DIVA', from: 'BSR', to: 'DIVA', distanceKm: 41, tracks: 2, lines: ['Up Chord', 'Down Chord'], maxSpeedKmH: 100, status: 'NORMAL', kavach: true, isChord: true },

  // Cross Bypass: Surat (WR) <--> Nandurbar <--> Jalgaon (CR) (Surat-Bhusawal East-West Chord)
  { id: 'SEC-ST-NDB', from: 'ST', to: 'NDB', distanceKm: 161, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true, isChord: true },
  { id: 'SEC-NDB-JL', from: 'NDB', to: 'JL', distanceKm: 146, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 110, status: 'NORMAL', kavach: true, isChord: true },

  // Northern Central Lines (Bhusawal -> Itarsi -> Bhopal -> Kanpur / Delhi)
  { id: 'SEC-BSL-ET', from: 'BSL', to: 'ET', distanceKm: 307, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-ET-BPL', from: 'ET', to: 'BPL', distanceKm: 92, tracks: 3, lines: ['Up Main', 'Down Main', '3rd Line Ghats'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-BPL-NDLS', from: 'BPL', to: 'NDLS', distanceKm: 702, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 160, status: 'NORMAL', kavach: true },
  { id: 'SEC-ET-CNB', from: 'ET', to: 'CNB', distanceKm: 580, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
  { id: 'SEC-CNB-NDLS', from: 'CNB', to: 'NDLS', distanceKm: 440, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 160, status: 'NORMAL', kavach: true },
  { id: 'SEC-CNB-HWH', from: 'CNB', to: 'HWH', distanceKm: 1010, tracks: 2, lines: ['Up Line', 'Down Line'], maxSpeedKmH: 130, status: 'NORMAL', kavach: true },
];
