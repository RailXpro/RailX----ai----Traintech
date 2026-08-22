// Authentic Indian Railways Mega Block & Jumbo Block Circulars for AI NLP Extraction
export const SAMPLE_CIRCULARS = [
  {
    id: 'CR-MB-2026-08-24',
    title: 'Central Railway: Sunday Mega Block on Main Line (Matunga - Mulund & Thane - Kalyan)',
    zone: 'CR',
    division: 'Mumbai Division',
    issueDate: '2026-08-22',
    rawText: `CENTRAL RAILWAY - MUMBAI DIVISION
OPERATING DEPARTMENT PRESS RELEASE / TRAFFIC CIRCULAR NO: CR/BB/T/2026/08/24

SUBJECT: SPECIAL MEGA BLOCK ON MAIN LINE FOR INFRASTRUCTURE & TRACK MAINTENANCE

Central Railway will operate a Mega Block on its suburban and mainline sections for carrying out various engineering and maintenance works on Sunday 24th August 2026 as under:

1. SECTION: Matunga to Mulund on UP & DOWN SLOW Lines from 11:05 hrs to 15:55 hrs.
   - All Down Slow services leaving CSMT Mumbai from 10:14 hrs to 15:18 hrs will be diverted on Down Fast line between Matunga and Mulund stations.
   - UP Slow services leaving Thane from 10:58 hrs to 15:59 hrs will be diverted on UP Fast line between Mulund and Matunga stations.

2. SECTION: Thane to Kalyan on UP & DOWN 5th and 6th Lines from 09:00 hrs to 13:00 hrs.
   - Mail/Express trains (Train No. 12859 Gitanjali Exp, Train No. 22177 Mahanagari Exp, Train No. 12137 Punjab Mail) departing CSMT/LTT will run via UP/DOWN Fast lines with 15-25 minutes delay.
   - Track renewal, Over Head Equipment (OHE) wire catenary replacement, and Point & Crossing tamping machine work will be executed.

PASSENGER ADVISORY:
Passengers are requested to bear with the Railway Administration for the inconvenience caused. These maintenance blocks are essential for infrastructure upkeep and safety.

Issued by: Senior Divisional Commercial Manager (Sr. DCM), CSMT Mumbai.`,
    expectedExtraction: {
      division: 'Mumbai Division (CR)',
      blockType: 'MEGA BLOCK (Track & OHE Renewal)',
      date: '2026-08-24',
      timeWindow: '11:05 - 15:55 (Main Slow Lines) & 09:00 - 13:00 (5th/6th Lines)',
      affectedSections: ['SEC-GC-TNA', 'SEC-TNA-DIVA', 'SEC-DIVA-KYN'],
      affectedLines: ['Up Slow', 'Down Slow', '5th Line', '6th Line'],
      impactedTrains: ['12859', '22177', '12137'],
      impactDescription: 'Suburban slow services diverted to fast line; Mail/Express trains running with 20m speed regulation delay.',
      maintenanceType: 'OHE Catenary Wire Replacement + Track Ballast Tamping'
    }
  },
  {
    id: 'WR-JB-2026-08-24',
    title: 'Western Railway: 5-Hour Jumbo Block between Borivali and Vasai Road',
    zone: 'WR',
    division: 'Mumbai WR Division',
    issueDate: '2026-08-22',
    rawText: `WESTERN RAILWAY - HEADQUARTERS, CHURCHGATE
PUBLIC RELATIONS NOTICE: WR/2026/08/JUMBO-77

SUBJECT: FIVE HOURS JUMBO BLOCK ON UP & DOWN FAST LINES BETWEEN BORIVALI AND VASAI ROAD STATIONS

To carry out maintenance work of tracks, signaling systems and Overhead Equipment (OHE), a Jumbo Block of 5 hours will be taken on UP & DOWN Fast lines between Borivali and Vasai Road stations from 10:00 hrs to 15:00 hrs on Sunday, 24th August 2026.

OPERATIONAL IMPACT:
1. During the block period, all UP & DOWN Fast line trains will be operated on Slow lines between Borivali and Vasai Road.
2. Train No. 20901 Mumbai Central - Gandhinagar Vande Bharat Express will be regulated at Borivali for 12 minutes.
3. Train No. 12951 Mumbai Rajdhani Express will be flagged out on schedule with cleared speed profile post 17:00 hrs.
4. Some suburban trains will remain cancelled. List of cancelled services is available at all station booking counters.

Issued by: Chief Public Relations Officer (CPRO), Western Railway.`,
    expectedExtraction: {
      division: 'Mumbai WR Division',
      blockType: 'JUMBO BLOCK (OHE & Signal Interlocking)',
      date: '2026-08-24',
      timeWindow: '10:00 - 15:00',
      affectedSections: ['SEC-BVI-BSR'],
      affectedLines: ['Up Fast', 'Down Fast'],
      impactedTrains: ['20901', '12951'],
      impactDescription: 'Fast corridor closed; all traffic shifted to slow tracks with 15-20 min regulation delay.',
      maintenanceType: 'Signaling Electronic Interlocking & Overhead Wire Tensioning'
    }
  },
  {
    id: 'CR-GHAT-2026-08-25',
    title: 'Central Railway: Thull Ghat Tunnel & Catch Siding Maintenance Block (Kasara - Igatpuri)',
    zone: 'CR',
    division: 'Bhusawal & Mumbai Division',
    issueDate: '2026-08-23',
    rawText: `CENTRAL RAILWAY - JOINT OPERATIONAL NOTICE
SECTION: KASARA - IGATPURI THULL GHAT SECTION

Notice is hereby given that an Emergency Safety Block will be operated on the Middle Ghat Line & Down Ghat Line between Kasara (KSRA) and Igatpuri (IGP) from 13:00 hrs to 18:00 hrs on Monday 25th August 2026 for:
- Hillside boulder mesh reinforcement at Tunnel No. 3
- Banker locomotive catch siding track renewal
- Traction sub-station breaker overhaul at km 134/2

IMPACT ON TRAIN TRAFFIC:
- Down Ghat Line will remain closed during block hours.
- Train No. 22221 CSMT NZM Rajdhani and Train No. 12859 Gitanjali Express will be subject to single-line bidirectional token working or AI-coordinated chord detour via Pune-Daund chord (SEC-DD-ANG-MMR).
- Speed restriction of 30 km/h on adjacent active track.

Issued by: Divisional Railway Manager (DRM), Mumbai CR.`,
    expectedExtraction: {
      division: 'Mumbai - Bhusawal Joint Division',
      blockType: 'SAFETY & GHAT REINFORCEMENT BLOCK',
      date: '2026-08-25',
      timeWindow: '13:00 - 18:00',
      affectedSections: ['SEC-KSRA-IGP'],
      affectedLines: ['Down Ghat Line', 'Middle Ghat Line (Bankers)'],
      impactedTrains: ['22221', '12859', '12137', '22177'],
      impactDescription: 'Down ghat line blocked; heavy speed restriction or mandatory AI detour via Pune-Daund-Manmad chord line.',
      maintenanceType: 'Ghat Boulder Netting + Catch Siding Renewal'
    }
  }
];
