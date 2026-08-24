// ─── TrainX Complete Bilingual Translation Map ───────────────────────────────
// Comprehensive support for English ('en') & Marathi ('mr') across ALL UI & data!

export type Lang = 'en' | 'mr';

type TranslationMap = Record<string, Record<Lang, string>>;

export const translations: TranslationMap = {
  // ── Brand ──────────────────────────────────────────────────────────────
  'brand.name': { en: 'TrainX', mr: 'ट्रेनX' },
  'brand.tagline': { en: 'Rail Intelligence Platform', mr: 'रेल बुद्धिमत्ता मंच' },

  // ── Header Nav & Controls ──────────────────────────────────────────────
  'nav.corridors': { en: 'Corridors', mr: 'मार्ग (कॉरिडॉर)' },
  'nav.megaBlocks': { en: 'Mega Blocks', mr: 'मेगा ब्लॉक्स' },
  'nav.aiOptimization': { en: 'AI Optimization', mr: 'AI ऑप्टिमायझेशन' },
  'nav.incidents': { en: 'Incident Feed', mr: 'घटना व आपत्कालीन फीड' },
  'nav.fleet': { en: 'Fleet Telemetry', mr: 'वाहन दूरमापन (टेलिमेट्री)' },
  'nav.kavach': { en: 'Kavach 2.0 Live', mr: 'कवच २.० थेट सुरक्षा' },
  'nav.searchPlaceholder': {
    en: 'Search corridors, trains, mega blocks, alerts…',
    mr: 'मार्ग, गाड्या, मेगा ब्लॉक, सूचना शोधा…',
  },
  'header.division.all': { en: 'National Grid', mr: 'राष्ट्रीय ग्रिड (सर्व विभाग)' },
  'header.persona.planner': { en: 'Planner Console', mr: 'नियोजन कन्सोल' },
  'header.persona.passenger': { en: 'Passenger Portal', mr: 'प्रवासी पोर्टल' },
  'header.signIn': { en: 'Sign In', mr: 'प्रवेश करा' },
  'header.efficiency': { en: 'Efficiency', mr: 'कार्यक्षमता' },
  'header.apiOnline': { en: 'Cloud API: Online', mr: 'क्लाउड API: ऑनलाइन' },
  'header.incidents': { en: 'Critical Incident(s)', mr: 'गंभीर आपत्कालीन घटना' },
  'header.activeBlocks': { en: 'Active Mega Block(s)', mr: 'सक्रिय मेगा ब्लॉक' },

  // ── User Dropdown ──────────────────────────────────────────────────────
  'user.switchMode': { en: 'Switch Mode', mr: 'मोड बदला' },
  'user.accountDetails': { en: 'Account Details', mr: 'खाते तपशील' },
  'user.signOut': { en: 'Sign Out', mr: 'बाहेर पडा' },
  'user.roleOfficial': { en: '🛡 Official', mr: '🛡 रेल्वे अधिकारी' },
  'user.roleYatri': { en: '🚆 Yatri', mr: '🚆 रेल यात्री' },

  // ── Auth Modal ─────────────────────────────────────────────────────────
  'auth.tagline': {
    en: 'Sign in with your Google account to access real-time alerts, AI disruption forecasts, and personalised rail services.',
    mr: 'रिअल-टाइम सूचना, AI व्यत्यय अंदाज आणि वैयक्तिक रेल्वे सेवांसाठी आपल्या Google खात्याने प्रवेश करा.',
  },
  'auth.tab.consumer': { en: 'Rail Yatri / Passenger', mr: 'रेल यात्री / प्रवासी' },
  'auth.tab.official': { en: 'IR Official', mr: 'भारतीय रेल्वे अधिकारी' },
  'auth.consumer.benefit1': {
    en: 'Live PNR disruption radar & real-time block alerts',
    mr: 'थेट PNR व्यत्यय रडार आणि रिअल-टाइम ब्लॉक सूचना',
  },
  'auth.consumer.benefit2': {
    en: 'Sunday Mega Block SMS / Push notifications',
    mr: 'रविवारचे मेगा ब्लॉक SMS आणि पुश सूचना',
  },
  'auth.consumer.benefit3': {
    en: 'Saved routes, preferred trains & platform tracker',
    mr: 'जतन केलेले मार्ग, पसंतीच्या गाड्या आणि प्लॅटफॉर्म ट्रॅकर',
  },
  'auth.consumer.benefit4': {
    en: 'AI journey advisor & delay prediction (93% accuracy)',
    mr: 'AI प्रवास सल्लागार आणि उशीर अंदाज (९३% अचूकता)',
  },
  'auth.consumer.profiles': { en: 'Quick demo profiles', mr: 'जलद डेमो प्रोफाइल्स' },
  'auth.consumer.googleBtn': { en: 'Continue with Google', mr: 'Google सह सुरू ठेवा' },
  'auth.consumer.signingIn': { en: 'Signing you in…', mr: 'प्रवेश करत आहे…' },
  'auth.consumer.disclaimer': {
    en: 'By signing in, you agree to share your Google profile with the Rail Intelligence Platform.',
    mr: 'प्रवेश केल्याने, आपण आपले Google प्रोफाइल रेल बुद्धिमत्ता मंचासह सामायिक करण्यास सहमती देता.',
  },
  'auth.official.security': { en: 'CRIS SSO & RailNet Workspace Verified', mr: 'CRIS SSO आणि RailNet कार्यस्थान सत्यापित' },
  'auth.official.securitySub': {
    en: 'This portal is restricted to authorised Indian Railways staff. All access is logged and audited.',
    mr: 'हे पोर्टल अधिकृत भारतीय रेल्वे कर्मचाऱ्यांसाठी मर्यादित आहे. सर्व प्रवेश नोंदवला जातो.',
  },
  'auth.official.profiles': { en: 'Demo official profiles', mr: 'डेमो अधिकारी प्रोफाइल्स' },
  'auth.official.designation': { en: 'Official Designation', mr: 'अधिकृत पदनाम' },
  'auth.official.division': { en: 'Division', mr: 'रेल्वे विभाग' },
  'auth.official.employeeId': { en: 'Employee / CRIS ID', mr: 'कर्मचारी / CRIS आयडी' },
  'auth.official.employeeIdOptional': { en: '(optional)', mr: '(पर्यायी)' },
  'auth.official.workspaceBtn': { en: 'Sign in with IR Official Google Workspace', mr: 'IR अधिकारी Google Workspace द्वारे प्रवेश करा' },
  'auth.official.personalBtn': { en: 'Or use Personal Google Account', mr: 'किंवा वैयक्तिक Google खाते वापरा' },
  'auth.official.verifying': { en: 'Verifying with CRIS…', mr: 'CRIS सह पडताळणी करत आहे…' },
  'auth.official.customDetails': { en: 'Custom Official Details', mr: 'सानुकूल अधिकारी तपशील' },
  'auth.official.warning': {
    en: 'Access is restricted to authorised Indian Railways personnel with valid CRIS credentials.',
    mr: 'वैध CRIS क्रेडेंशियल्स असलेल्या अधिकृत भारतीय रेल्वे कर्मचाऱ्यांपुरताच प्रवेश मर्यादित आहे.',
  },

  // ── Hero Carousel ───────────────────────────────────────────────────────
  'hero.slide1.tag': { en: 'AI BLOCK SOLVER 2.4', mr: 'AI ब्लॉक सोल्व्हर २.४' },
  'hero.slide1.title': { en: 'Automated Track Possession & Constraint Solver', mr: 'स्वयंचलित ट्रॅक ताबा व मर्यादा सोल्व्हर' },
  'hero.slide1.subtitle': { en: 'Boost rolling stock availability by 95.8% with zero headway conflicts across 14 major rail divisions.', mr: '१४ प्रमुख रेल्वे विभागांमध्ये शून्य हेडवे संघर्षासह रोलिंग स्टॉक उपलब्धता ९५.८% पर्यंत वाढवा.' },
  'hero.slide1.cta': { en: 'Run AI Solver', mr: 'AI सोल्व्हर चालवा' },

  'hero.slide2.tag': { en: 'SUNDAY MEGA BLOCK', mr: 'रविवार मेगा ब्लॉक' },
  'hero.slide2.title': { en: 'Central & Western Railway Corridor Maintenance', mr: 'मध्य आणि पश्चिम रेल्वे मार्ग देखभाल' },
  'hero.slide2.subtitle': { en: 'Track relaying on Dadar-Thane & OHE maintenance between Borivali-Virar. Live diversion bulletins active.', mr: 'दादर-ठाणे ट्रॅक रिलाइंग आणि बोरिवली-विरार OHE देखभाल. थेट मार्ग वळवण्याचे बुलेटिन सक्रिय.' },
  'hero.slide2.cta': { en: 'View Schedules', mr: 'वेळापत्रक पहा' },

  'hero.slide3.tag': { en: 'SAFETY PROTOCOL', mr: 'सुरक्षा प्रोटोकॉल' },
  'hero.slide3.title': { en: 'Kavach Anti-Collision & Emergency Interlocks', mr: 'कवच टक्कर-विरोधी व आपत्कालीन इंटरलॉक्स' },
  'hero.slide3.subtitle': { en: 'Instant section cordon-off and automatic signal danger tripping with real-time SP-ARME relief dispatch.', mr: 'तात्काळ विभाग कॉर्डन-ऑफ आणि रिअल-टाइम SP-ARME मदत डिस्पॅचसह स्वयंचलित सिग्नल सुरक्षा.' },
  'hero.slide3.cta': { en: 'Incident Command', mr: 'घटना नियंत्रण' },

  // ── Simulation Controls ─────────────────────────────────────────────────
  'sim.title': { en: 'TrainX Scenario & Event Simulator', mr: 'TrainX परिस्थिती व घटना सिम्युलेटर' },
  'sim.sandbox': { en: 'SANDBOX', mr: 'सँडबॉक्स' },
  'sim.subtitle': { en: 'Test live constraints, trigger incident interlocks, or run the AI optimization engine.', mr: 'थेट मर्यादांची चाचणी घ्या, आपत्कालीन इंटरलॉक सुरू करा किंवा AI ऑप्टिमायझेशन इंजिन चालवा.' },
  'sim.triggerEmergency': { en: 'Simulate Incident (OHE Snap)', mr: 'आपत्कालीन घटना सिम्युलेट करा (OHE वायर)' },
  'sim.triggerMegaBlock': { en: 'Simulate Sunday Mega Block', mr: 'रविवार मेगा ब्लॉक सिम्युलेट करा' },
  'sim.runOptimizer': { en: 'Run AI Auto-Block Optimizer', mr: 'AI ऑटो-ब्लॉक ऑप्टिमायझर चालवा' },
  'sim.solving': { en: 'Solving Constraints...', mr: 'मर्यादा सोडवत आहे...' },
  'sim.reset': { en: 'Reset Network', mr: 'नेटवर्क रीसेट करा' },

  // ── Live Alerts Banner ──────────────────────────────────────────────────
  'alert.critical': { en: 'CRITICAL', mr: 'अति-गंभीर' },
  'alert.reported': { en: 'Reported', mr: 'नोंदणी वेळ' },
  'alert.relief': { en: 'Relief', mr: 'मदत पथक' },
  'alert.siren': { en: 'Siren', mr: 'सायरन' },
  'alert.sirenActive': { en: 'Siren Sounding', mr: 'सायरन वाजत आहे' },
  'alert.manageIncident': { en: 'Manage Incident & ART', mr: 'घटना व मदत गाडी व्यवस्थापित करा' },
  'alert.helpline': { en: 'Helpline: 139', mr: 'हेल्पलाइन: १३९' },
  'alert.callHelpline': { en: 'Call Helpline: 139', mr: 'हेल्पलाइन कॉल: १३९' },
  'alert.alternateRoute': { en: 'Find Alternate Route', mr: 'पर्यायी मार्ग शोधा' },
  'alert.activeMegaBlock': { en: 'ACTIVE MEGA BLOCK', mr: 'सक्रिय मेगा ब्लॉक' },
  'alert.timeWindow': { en: 'Time Window', mr: 'वेळ कालावधी' },
  'alert.train': { en: 'Train', mr: 'गाडी क्र.' },

  // ── Planner Dashboard Telemetry ─────────────────────────────────────────
  'metrics.networkAvailability': { en: 'Network Availability', mr: 'नेटवर्क उपलब्धता' },
  'metrics.sectionsClear': { en: 'Sections Clear', mr: 'मार्ग मोकळे आहेत' },
  'metrics.activeTrains': { en: 'Active Trains on Grid', mr: 'मार्गावरील सक्रिय गाड्या' },
  'metrics.delayedDiverted': { en: 'Delayed/Diverted', mr: 'उशिरा / वळवलेल्या' },
  'metrics.allOnTime': { en: 'All On-Time', mr: 'सर्व वेळेवर' },
  'metrics.fleetTypes': { en: 'Vande Bharat, Rajdhani, Suburban Locals', mr: 'वंदे भारत, राजधानी, उपनगरीय लोकल' },
  'metrics.blocksScheduled': { en: 'Mega Blocks Scheduled', mr: 'नियोजित मेगा ब्लॉक्स' },
  'metrics.active': { en: 'Active', mr: 'सक्रिय' },
  'metrics.total': { en: 'Total', mr: 'एकूण' },
  'metrics.blockWorkTypes': { en: 'Tamping, OHE wire maintenance, bridges', mr: 'टॅम्पिंग, ओएचई वायर देखभाल, पूल काम' },
  'metrics.fleetUtilization': { en: 'AI Fleet Utilization', mr: 'AI वाहन वापर कार्यक्षमता' },
  'metrics.optimized': { en: 'Optimized', mr: 'ऑप्टिमाइझ झाले' },
  'metrics.solverActive': { en: 'Constraint programming solver active', mr: 'मर्यादा प्रोग्रॅमिंग सोल्व्हर सक्रिय' },

  // ── Planner Dashboard Tabs ──────────────────────────────────────────────
  'tab.map': { en: 'Corridor Track Radar', mr: 'मार्ग ट्रॅक रडार' },
  'tab.optimizer': { en: 'AI Auto-Block Solver Studio', mr: 'AI ऑटो-ब्लॉक सोल्व्हर स्टुडिओ' },
  'tab.megablock': { en: 'Mega Block Manager', mr: 'मेगा ब्लॉक व्यवस्थापक' },
  'tab.accidents': { en: 'Incident Command Feed', mr: 'आपत्कालीन घटना नियंत्रण' },
  'tab.analytics': { en: 'Fleet Analytics & Reports', mr: 'वाहन विश्लेषण आणि अहवाल' },

  // ── Interactive Track Map ───────────────────────────────────────────────
  'map.title': { en: 'Recommended Corridors & Track Possession Status', mr: 'शिफारस केलेले मार्ग आणि ट्रॅक ताबा स्थिती' },
  'map.subtitle': { en: 'Real-time track occupancy, speed restrictions, and automated signal state', mr: 'रिअल-टाइम ट्रॅक ऑक्युपन्सी, वेग मर्यादा आणि स्वयंचलित सिग्नल स्थिती' },
  'map.filterAll': { en: 'All Tracks', mr: 'सर्व ट्रॅक' },
  'map.filterClear': { en: 'Clear & Open', mr: 'मोकळे व सुरू' },
  'map.filterBlock': { en: 'Under Mega Block', mr: 'मेगा ब्लॉक अंतर्गत' },
  'map.filterEmergency': { en: 'Emergency Halts', mr: 'आपत्कालीन थांबलेले' },
  'map.selectedSection': { en: 'Selected Corridor Details', mr: 'निवडलेल्या मार्गाचे तपशील' },
  'map.inspectCTA': { en: 'Inspect Corridor Details', mr: 'मार्गाची पाहणी करा' },
  'map.speedLimit': { en: 'Section Max Speed', mr: 'विभागाचा कमाल वेग' },
  'map.utilization': { en: 'Corridor Utilization', mr: 'मार्ग वापर' },
  'map.length': { en: 'Length', mr: 'लांबी' },
  'map.trainsOnSection': { en: 'Live Trains in Section', mr: 'या विभागातील थेट गाड्या' },
  'map.noTrains': { en: 'No trains currently occupying this track section.', mr: 'या ट्रॅक विभागात सध्या कोणतीही गाडी नाही.' },
  'map.statusAvailable': { en: '★ 98% AVAILABLE', mr: '★ ९८% उपलब्ध' },
  'map.statusMegaBlock': { en: 'MEGA BLOCK ACTIVE', mr: 'मेगा ब्लॉक सक्रिय' },
  'map.statusCordoned': { en: 'CORDONED OFF', mr: 'सुरक्षेसाठी बंद (कॉर्डन)' },
  'map.statusTsr': { en: 'TSR SPEED LIMIT', mr: 'TSR वेग मर्यादा' },
  'map.unitKm': { en: 'km', mr: 'किमी' },
  'map.unitKmph': { en: 'km/h', mr: 'किमी/तास' },
  'map.activeTrainsCount': { en: 'Active Trains', mr: 'सक्रिय गाड्या' },

  // ── AI Auto-Block Optimizer ─────────────────────────────────────────────
  'optimizer.title': { en: 'TrainX Auto-Block Optimization Engine', mr: 'TrainX ऑटो-ब्लॉक ऑप्टिमायझेशन इंजिन' },
  'optimizer.subtitle': { en: 'Solves multi-commodity track possession constraints, predicts downtime, and eliminates train timetable clashes.', mr: 'विविध ट्रॅक ताबा मर्यादा सोडवते, डाउनटाइमचा अंदाज लावते आणि गाड्यांचे वेळापत्रक संघर्ष दूर करते.' },
  'optimizer.execute': { en: 'Execute AI Solver & Reroute Engine', mr: 'AI सोल्व्हर आणि रीरूट इंजिन चालवा' },
  'optimizer.constraints': { en: 'Optimization Objective Constraints & Weights (Interactive)', mr: 'ऑप्टिमायझेशन उद्दिष्ट मर्यादा आणि महत्त्व (इंटरॅक्टिव्ह)' },
  'optimizer.passengerWeight': { en: 'Passenger Service Priority Weight', mr: 'प्रवासी सेवा प्राधान्य' },
  'optimizer.freightWeight': { en: 'Freight & DFC Movement Weight', mr: 'मालवाहतूक व DFC प्राधान्य' },
  'optimizer.nightWindow': { en: 'Night Maintenance Window Preference', mr: 'रात्रीच्या देखभाल खिडकीची पसंती' },
  'optimizer.tsrTolerance': { en: 'Temporary Speed Restriction (TSR) Tolerance', mr: 'तात्पुरती वेग मर्यादा सहनशीलता' },
  'optimizer.beforeVsAfter': { en: 'Optimization Impact: Before vs After AI Solving', mr: 'ऑप्टिमायझेशन परिणाम: AI सोल्व्हर पूर्वी विरूद्ध नंतर' },
  'optimizer.assetUtil': { en: 'Rolling Stock & Track Utilization', mr: 'रोलिंग स्टॉक आणि ट्रॅक वापर' },
  'optimizer.avgDelay': { en: 'Average Corridor Train Delay', mr: 'सरासरी गाडी उशीर' },
  'optimizer.conflicts': { en: 'Headway & Crossing Conflicts', mr: 'हेडवे आणि क्रॉसिंग संघर्ष' },
  'optimizer.energySaved': { en: 'Traction Energy Saved (Regenerative)', mr: 'वाचलेली ट्रॅक्शन ऊर्जा' },
  'optimizer.downloadPlan': { en: 'Download Optimization Plan (CSV)', mr: 'ऑप्टिमायझेशन आराखडा डाउनलोड करा (CSV)' },
  'optimizer.generatedSchedule': { en: 'AI Generated Deconflicted Possession Schedule', mr: 'AI द्वारे तयार केलेले संघर्षमुक्त ताबा वेळापत्रक' },

  // ── Mega Block Manager ──────────────────────────────────────────────────
  'block.title': { en: 'Mega Block Planning & Automated Scheduling', mr: 'मेगा ब्लॉक नियोजन आणि स्वयंचलित वेळापत्रक' },
  'block.subtitle': { en: 'Plan, deconflict, and publish engineering track possession blocks across rail corridors', mr: 'रेल्वे मार्गांवर अभियांत्रिकी ट्रॅक ताबा ब्लॉक्सचे नियोजन करा आणि प्रकाशित करा' },
  'block.scanCircular': { en: 'AI NLP Circular Scanner', mr: 'AI NLP परिपत्रक स्कॅनर' },
  'block.scheduleNew': { en: 'Schedule Mega Block', mr: 'नवीन मेगा ब्लॉक शेड्यूल करा' },
  'block.formSection': { en: 'Track Section', mr: 'ट्रॅक विभाग' },
  'block.formDivision': { en: 'Division', mr: 'विभाग' },
  'block.formLines': { en: 'Lines Affected', mr: 'बाधित रेल्वे मार्गिका' },
  'block.formStartTime': { en: 'Start Time', mr: 'सुरू होण्याची वेळ' },
  'block.formEndTime': { en: 'End Time', mr: 'समाप्ती वेळ' },
  'block.formDate': { en: 'Date / Shift', mr: 'तारीख / पाळी' },
  'block.formReason': { en: 'Maintenance Reason / Engineering Work', mr: 'देखभाल कारण / अभियांत्रिकी काम' },
  'block.formPublicNotice': { en: 'Public Commuter Notice', mr: 'सार्वजनिक प्रवासी सूचना' },
  'block.formBusFeeders': { en: 'Alternate Feeder Bus Services (BEST / MSRTC)', mr: 'पर्यायी बस सेवा (BEST / MSRTC)' },
  'block.submitBlock': { en: 'Schedule Possession Block', mr: 'ताबा ब्लॉक निश्चित करा' },
  'block.cancel': { en: 'Cancel', mr: 'रद्द करा' },
  'block.markComplete': { en: 'Complete Block & Restore Track', mr: 'काम पूर्ण करा व मार्ग सुरू करा' },

  // ── Accident & Incident Command Feed ────────────────────────────────────
  'incident.title': { en: 'Emergency Incident Command & Safety Interlock', mr: 'आपत्कालीन घटना नियंत्रण आणि सुरक्षा इंटरलॉक' },
  'incident.subtitle': { en: 'Real-time SOS response, automatic section cordon-off, and relief train (ART) coordination', mr: 'रिअल-टाइम SOS प्रतिसाद, स्वयंचलित विभाग कॉर्डन-ऑफ आणि मदत गाडी (ART) समन्वय' },
  'incident.reportBtn': { en: 'Report Incident SOS', mr: 'आपत्कालीन SOS घटना नोंदवा' },
  'incident.formTrain': { en: 'Train Number / Name', mr: 'गाडी क्रमांक / नाव' },
  'incident.formNature': { en: 'Nature of Incident', mr: 'घटनेचे स्वरूप' },
  'incident.formSeverity': { en: 'Severity Level', mr: 'गंभीरता पातळी' },
  'incident.formDesc': { en: 'Incident Description & On-Site Observations', mr: 'घटनेचे वर्णन व प्रत्यक्ष निरीक्षण' },
  'incident.submitSos': { en: 'Broadcast Emergency Alert & Cordon Track', mr: 'आपत्कालीन अलर्ट प्रसारित करा व मार्ग बंद करा' },
  'incident.reliefTracker': { en: 'Accident Relief Medical Equipment (SP-ARME) Status', mr: 'अपघात मदत वैद्यकीय उपकरणे (SP-ARME) स्थिती' },
  'incident.resolve': { en: 'Resolve & Clear Section', mr: 'समस्या सोडवा व मार्ग सुरू करा' },

  // ── Asset Analytics ─────────────────────────────────────────────────────
  'asset.title': { en: 'Rolling Stock & Engineering Asset Availability', mr: 'रोलिंग स्टॉक आणि अभियांत्रिकी मालमत्ता उपलब्धता' },
  'asset.subtitle': { en: 'Predictive health index, tamping machine telemetry, and division performance rankings', mr: 'भविष्यवेधी आरोग्य निर्देशांक, टॅम्पिंग मशीन टेलिमेट्री आणि विभाग कामगिरी क्रमवारी' },
  'asset.healthIndex': { en: 'Fleet Health Index', mr: 'वाहन आरोग्य निर्देशांक' },
  'asset.activeMachinery': { en: 'Active Machinery on Field', mr: 'क्षेत्रातील सक्रिय यंत्रसामग्री' },
  'asset.breakdownsPrevented': { en: 'Breakdowns Prevented (AI)', mr: 'AI द्वारे टाळलेले बिघाड' },
  'asset.divisionRankings': { en: 'Division Asset Efficiency Ranking', mr: 'विभाग मालमत्ता कार्यक्षमता क्रमवारी' },

  // ── Passenger Portal ────────────────────────────────────────────────────
  'passenger.heroBadge1': { en: 'TRAINX • COMMUTER LIVE PORTAL', mr: 'TRAINX • प्रवासी थेट पोर्टल' },
  'passenger.heroBadge2': { en: 'SUNDAY MEGA BLOCK RADAR', mr: 'रविवार मेगा ब्लॉक रडार' },
  'passenger.heroTitle': { en: 'Live Sunday Mega Block & Disruption Bulletins', mr: 'थेट रविवार मेगा ब्लॉक आणि व्यत्यय बुलेटिन' },
  'passenger.heroSubtitle': { en: 'Stay ahead of planned maintenance diversions, track possessions, and real-time safety advisories. Plan smooth commutes with TrainX smart rerouting.', mr: 'नियोजित देखभाल फेरबदल, ट्रॅक ताबा आणि रिअल-टाइम सुरक्षा सल्ल्यांची आधीच माहिती मिळवा. TrainX स्मार्ट मार्गांसह सुखकर प्रवास करा.' },
  'passenger.helpline139': { en: '139 (24x7 RailMadad Helpline)', mr: '१३९ (२४x७ रेलमदत हेल्पलाइन)' },
  'passenger.grpHelp': { en: 'GRP Emergency', mr: 'GRP आपत्कालीन' },
  'passenger.womenSafety': { en: 'Women Safety', mr: 'महिला सुरक्षा' },
  'passenger.journeyPlannerTitle': { en: 'AI Smart Disruption-Aware Journey Planner', mr: 'AI स्मार्ट व्यत्यय-जागरूक प्रवास नियोजक' },
  'passenger.journeyPlannerSubtitle': { en: 'Find the fastest suburban and express route accounting for active Sunday mega blocks', mr: 'सक्रिय रविवार मेगा ब्लॉक्स लक्षात घेऊन सर्वात जलद उपनगरीय आणि एक्सप्रेस मार्ग शोधा' },
  'passenger.origin': { en: 'Origin Station', mr: 'प्रस्थान स्टेशन' },
  'passenger.destination': { en: 'Destination Station', mr: 'गंतव्य स्टेशन' },
  'passenger.findRoute': { en: 'Find Best Route', mr: 'उत्तम मार्ग शोधा' },
  'passenger.recAi': { en: 'RECOMMENDED (AI OPTIMIZED)', mr: 'शिफारस केलेले (AI ऑप्टिमाइझ)' },
  'passenger.departingIn': { en: 'Departing in 6 mins • 98% On-Time Probability', mr: '६ मिनिटांत सुटणार • ९८% वेळेवर पोहोचण्याची शक्यता' },
  'passenger.estTime': { en: 'Est. Travel Time', mr: 'अंदाजे प्रवासाची वेळ' },
  'passenger.mins': { en: 'mins', mr: 'मिनिटे' },
  'passenger.selectTrain': { en: 'Select Train', mr: 'गाडी निवडा' },
  'passenger.multimodalTitle': { en: 'MULTIMODAL METRO + BEST BUS SHUTTLE', mr: 'मल्टीमोडल मेट्रो + बेस्ट बस शटल' },
  'passenger.metroDesc': { en: 'Take Metro from CSMT to Ghatkopar, transfer to special BEST mega block feeder bus route #F-18 running every 5 mins directly to Thane / Kalyan.', mr: 'CSMT ते घाटकोपर दरम्यान मेट्रो घ्या, त्यानंतर दर ५ मिनिटांनी थेट ठाणे / कल्याणसाठी धावणाऱ्या विशेष BEST मेगा ब्लॉक फीडर बस मार्ग #F-18 ने प्रवास करा.' },
  'passenger.bulletinsTitle': { en: 'Live Mega Block Bulletins & Maintenance Schedule', mr: 'थेट मेगा ब्लॉक बुलेटिन आणि देखभाल वेळापत्रक' },
  'passenger.bulletinsSubtitle': { en: 'Official disruption bulletin for suburban commuters & long-distance passengers', mr: 'उपनगरीय प्रवासी आणि लांब पल्ल्याच्या प्रवाशांसाठी अधिकृत व्यत्यय बुलेटिन' },
  'passenger.activeScheduledBlocks': { en: 'Active / Scheduled Blocks', mr: 'सक्रिय / नियोजित ब्लॉक्स' },
  'passenger.inProgressNow': { en: 'IN PROGRESS NOW', mr: 'सध्या सुरू आहे' },
  'passenger.upcoming': { en: 'UPCOMING', mr: 'आगामी' },
  'passenger.linesAffected': { en: 'Lines Affected', mr: 'बाधित मार्गिका' },
  'passenger.maintenanceWork': { en: 'Maintenance Work', mr: 'देखभाल काम' },
  'passenger.safetyTitle': { en: 'Safety Bulletins & Emergency Assistance', mr: 'सुरक्षा बुलेटिन आणि आपत्कालीन सहाय्य' },
  'passenger.safetySubtitle': { en: 'Real-time safety status and emergency help contact points', mr: 'रिअल-टाइम सुरक्षा स्थिती आणि आपत्कालीन संपर्क क्रमांक' },
  'passenger.allNormal': { en: 'All Rail Corridors Operating Normal with Kavach Safety Interlocks', mr: 'कवच सुरक्षा इंटरलॉक्ससह सर्व रेल्वे मार्ग सुरळीत सुरू आहेत' },
  'passenger.noAccidents': { en: 'No active emergency accidents or safety halts reported across Indian Railways network.', mr: 'भारतीय रेल्वे नेटवर्कवर कोणत्याही आपत्कालीन दुर्घटना किंवा सुरक्षेसाठी गाड्या थांबल्याची नोंद नाही.' },

  // ── Footer ─────────────────────────────────────────────────────────────
  'footer.helpline': { en: '24/7 Rail Safety & Helpline Support', mr: '२४/७ रेल सुरक्षा आणि हेल्पलाइन समर्थन' },
  'footer.helplineSub': {
    en: 'Instant assistance for passengers and section controllers via 139 & RailMadad',
    mr: 'प्रवासी आणि विभाग नियंत्रकांसाठी १३९ आणि RailMadad द्वारे त्वरित सहाय्य',
  },
  'footer.kavachActive': { en: 'Kavach Safety Active', mr: 'कवच सुरक्षा प्रणाली सक्रिय' },
  'footer.cris': { en: 'CRIS National Telemetry Gateway', mr: 'CRIS राष्ट्रीय दूरमापन (टेलिमेट्री) गेटवे' },
  'footer.corridors': { en: 'Corridor Operations', mr: 'रेल्वे मार्ग कार्यप्रणाली' },
  'footer.disruption': { en: 'Disruption & Safety', mr: 'व्यत्यय व्यवस्थापन आणि सुरक्षा' },
  'footer.divisions': { en: 'Divisions Covered', mr: 'समाविष्ट रेल्वे विभाग' },
  'footer.copyright': {
    en: 'Copyright 2026 © TrainX • Indian Railways (भारतीय रेल) & CRIS. All Rights Reserved.',
    mr: 'कॉपीराइट २०२६ © ट्रेनX • भारतीय रेल आणि CRIS. सर्व हक्क राखीव.',
  },
  'footer.aiBlock': { en: 'Automatic Block Planning (AI Solver)', mr: 'स्वयंचलित ब्लॉक नियोजन (AI सोल्व्हर)' },
  'footer.trackPossession': { en: 'Track Possession Scheduling', mr: 'ट्रॅक ताबा वेळापत्रक' },
  'footer.speedProfile': { en: 'Dynamic Speed Profiling (TSR)', mr: 'गतिमान वेग प्रोफाइलिंग (TSR)' },
  'footer.dfc': { en: 'Dedicated Freight Corridor (DFC)', mr: 'समर्पित मालवाहू मार्ग (DFC)' },
  'footer.megaBlockBulletins': { en: 'Sunday Mega Block Bulletins', mr: 'रविवार मेगा ब्लॉक बुलेटिन' },
  'footer.accidentSos': { en: 'Accident SOS & Section Interlock', mr: 'आपत्कालीन SOS आणि विभाग इंटरलॉक' },
  'footer.artTracker': { en: 'Accident Relief Train (ART) Tracker', mr: 'अपघात मदत गाडी (ART) ट्रॅकर' },
  'footer.railMadad': { en: 'RailMadad 139 Integration', mr: 'RailMadad १३९ थेट एकीकरण' },
};

// ── Complete Data Entities & Messages Translation Map ───────────────────────
export const DATA_MARATHI_MAP: Record<string, string> = {
  // Divisions
  'Mumbai CR': 'मुंबई मध्य रेल्वे (CR)',
  'Mumbai WR': 'मुंबई पश्चिम रेल्वे (WR)',
  'Delhi NR': 'दिल्ली उत्तर रेल्वे (NR)',
  'Howrah ER': 'हावडा पूर्व रेल्वे (ER)',
  'Chennai SR': 'चेन्नई दक्षिण रेल्वे (SR)',
  'Bengaluru SWR': 'बंगळुरू दक्षिण-पश्चिम रेल्वे (SWR)',

  // Stations
  'CSMT Mumbai': 'सीएसएमटी मुंबई',
  'Byculla': 'भायखळा',
  'Dadar CR': 'दादर मध्य',
  'Thane': 'ठाणे',
  'Kalyan Junction': 'कल्याण जंक्शन',
  'Kasara': 'कसारा',
  'Churchgate': 'चर्चगेट',
  'Mumbai Central': 'मुंबई सेंट्रल',
  'Mumbai Central (MMCT)': 'मुंबई सेंट्रल (MMCT)',
  'Dadar WR': 'दादर पश्चिम',
  'Borivali': 'बोरिवली',
  'Virar': 'विरार',
  'Dahanu Road': 'डहाणू रोड',
  'New Delhi (NDLS)': 'नवी दिल्ली (NDLS)',
  'Ghaziabad Junction': 'गाझियाबाद जंक्शन',
  'Aligarh Junction': 'अलीगढ जंक्शन',
  'Kanpur Central': 'कानपूर सेंट्रल',
  'Gandhinagar Cap (GNC)': 'गांधीनगर कॅपिटल (GNC)',
  'Hazrat Nizamuddin (NZM)': 'हजरत निजामुद्दीन (NZM)',
  'Varanasi Junction (BSB)': 'वाराणसी जंक्शन (BSB)',
  'Howrah Junction': 'हावडा जंक्शन',
  'Bardhaman Junction': 'बर्धमान जंक्शन',
  'Chennai Central': 'चेन्नई सेंट्रल',
  'Arakkonam Junction': 'अरक्कोणम जंक्शन',
  'KSR Bengaluru': 'केएसआर बंगळुरू',
  'Whitefield': 'व्हाइटफील्ड',

  // Section Names (Exact Matches)
  'CSMT to Byculla Slow & Fast Quad': 'सीएसएमटी ते भायखळा धीम्या व जलद मार्गिका',
  'Byculla to Dadar Central Junction': 'भायखळा ते दादर मध्य जंक्शन',
  'Dadar to Thane 6-Line Corridor': 'दादर ते ठाणे ६-मार्गिका कॉरिडॉर',
  'Dadar to Thane 6-Line Express Corridor': 'दादर ते ठाणे ६-पदरी एक्सप्रेस मार्गिका',
  'Thane to Kalyan Jn Quad Line & Parsik Tunnel': 'ठाणे ते कल्याण जंक्शन व पारसिक बोगदा',
  'Kalyan to Kasara Ghat Section': 'कल्याण ते कसारा घाट विभाग',
  'Kalyan to Kasara Thull Ghat Section': 'कल्याण ते कसारा थळ घाट विभाग',
  'Churchgate to Mumbai Central 4-Line Quad': 'चर्चगेट ते मुंबई सेंट्रल ४-पदरी मार्गिका',
  'Mumbai Central to Dadar Western': 'मुंबई सेंट्रल ते दादर पश्चिम',
  'Dadar to Borivali 6th Line Corridor': 'दादर ते बोरिवली ६ वी मार्गिका',
  'Borivali to Virar Quad & Vasai Creek Bridge': 'बोरिवली ते विरार व वसई खाडी पूल',
  'Borivali to Virar (Vasai Creek Bridges 73 & 75)': 'बोरिवली ते विरार (वसई खाडी पूल ७३ आणि ७५)',
  'Virar to Dahanu Road High Speed Track': 'विरार ते डहाणू रोड हाय स्पीड ट्रॅक',
  'New Delhi to Ghaziabad 4-Line Trunk': 'नवी दिल्ली ते गाझियाबाद मुख्य मार्ग',
  'Ghaziabad to Aligarh Trunk Section': 'गाझियाबाद ते अलीगढ मुख्य ट्रंक विभाग',
  'Ghaziabad to Aligarh Trunk': 'गाझियाबाद ते अलीगढ मुख्य ट्रंक विभाग',
  'Aligarh to Kanpur Central Semi-High Speed Section': 'अलीगढ ते कानपूर सेंट्रल सेमी-हायस्पीड विभाग',
  'Howrah to Bardhaman Main & Chord Lines': 'हावडा ते बर्धमान मुख्य व कॉर्ड मार्ग',
  'Chennai Central to Arakkonam Fast Quad': 'चेन्नई सेंट्रल ते अरक्कोणम जलद मार्ग',
  'KSR Bengaluru to Whitefield IT Corridor': 'केएसआर बंगळुरू ते व्हाइटफील्ड कॉरिडॉर',

  // Nature of Incidents
  'OHE Wire Snap': 'ओएचई वायर तुटणे',
  'OHE WIRE SNAP': 'ओएचई वायर तुटणे',
  'Derailment': 'रूळावरून घसरणे (रुळभंग)',
  'Signal Failure': 'सिग्नल बिघाड',
  'Boulder Fall / Obstruction': 'दरड कोसळणे / मार्गात अडथळा',
  'Cattle Run Over / Brake Defect': 'जनावरे आडवे येणे / ब्रेक बिघाड',
  'Fire in Coach / Smoke': 'डब्यात आग / धूर निघणे',

  // Relief statuses
  'En Route': 'मार्गावर रवाना',
  'Dispatched': 'रवाना झाले',
  'On Site': 'घटनास्थळी पोहोचले',
  'Standby': 'स्टँडबाय',

  // Lines Affected
  'Up Slow': 'अप धीमा मार्ग',
  'Down Slow': 'डाउन धीमा मार्ग',
  'Up Fast': 'अप जलद मार्ग',
  'Down Fast': 'डाउन जलद मार्ग',
  'Both Up/Down Lines': 'दोन्ही अप/डाउन मार्ग',
  'All Lines': 'सर्व मार्गिका',
  'UP SLOW': 'अप धीमा मार्ग',
  'DOWN SLOW': 'डाउन धीमा मार्ग',
  'UP FAST': 'अप जलद मार्ग',
  'DOWN FAST': 'डाउन जलद मार्ग',

  // Maintenance & Block Reasons
  'Track Relaying & Tamping': 'ट्रॅक रिलाइंग आणि टॅम्पिंग',
  'Overhead Wire (OHE) Maintenance': 'ओव्हरहेड वायर (OHE) देखभाल',
  'Electronic Interlocking (EI) Upgrade': 'इलेक्ट्रॉनिक इंटरलॉकिंग (EI) अपग्रेड',
  'Bridge Girder Inspection': 'पूल गर्डर तपासणी',
  'Point & Crossing Overhaul': 'पॉइंट व क्रॉसिंग ओव्हरहॉल',
  'Suburban Jumbo Block': 'उपनगरीय जंबो ब्लॉक',
  'Sunday Mega Block: Up & Down Slow Line Track Relaying & Tamping Machine': 'रविवार मेगा ब्लॉक: अप व डाउन धीम्या मार्गावर ट्रॅक रिलाइंग व टॅम्पिंग',
  'Catenary wire sag detected near Vasai Bridge. Automatic emergency block triggered across Up/Down Fast tracks.': 'वसई पुलाजवळ ओएचई वायरमध्ये बिघाड. अप/डाउन जलद मार्गावर आपत्कालीन ब्लॉक.',

  // Live Incident Descriptions
  'Overhead 25kV traction wire entanglement with pantograph. Section power auto-tripped by SCADA safety relay.': 'पँटोग्राफमध्ये २५kV ओएचई वायर अडकल्याने बिघाड. SCADA सुरक्षा रिलेद्वारे विभागाचा वीजपुरवठा स्वयंचलित खंडित करण्यात आला.',
  'All passengers are safe inside air-conditioned coaches. Auxiliary power activated. Accident Relief Medical & Tower Wagon en route from Kalyan. Up Ghat line regulated.': 'सर्व प्रवासी डब्यांमध्ये सुरक्षित आहेत. आपत्कालीन वीज सुरू आहे. कल्याणहून मदत गाडी व टॉवर वॅगन रवाना झाली आहे.',

  // Mega Block Public Advisories
  'Up Slow Suburban Locals diverted on Up Fast Line between Thane & Matunga. Skipping halt at Vidyavihar, Kanjurmarg, and Nahur. Commuters permitted on Fast trains.': 'ठाणे ते माटुंगा दरम्यान अप धीम्या लोकल अप जलद मार्गावर वळवण्यात आल्या आहेत. विद्याविहार, कांजूरमार्ग आणि नाहूर येथे थांबा नाही. प्रवाशांना जलद गाड्यांमध्ये प्रवास करण्याची परवानगी आहे.',
  'Night Jumbo Block for 4 hours on UP & DOWN Fast lines between Borivali and Bhayandar. No disruption to morning peak suburban services.': 'बोरिवली ते भाईंदर दरम्यान अप आणि डाउन जलद मार्गावर रात्री ४ तासांचा जंबो ब्लॉक. सकाळच्या गर्दीच्या लोकल सेवांवर कोणताही परिणाम नाही.',
  'Signaling modernization for Kavach Collision Avoidance System. Express trains restricted to 80 km/h with 10-15 mins regulated delays.': 'कवच टक्कर-प्रतिबंधक यंत्रणेसाठी सिग्नल आधुनिकीकरण. एक्सप्रेस गाड्यांचा वेग ८० किमी/तास पर्यंत मर्यादित, १०-१५ मिनिटे विलंब अपेक्षित.',

  // Trains
  '12137': '१२१३७',
  'Punjab Mail Express': 'पंजाब मेल एक्सप्रेस',
  '12951 Mumbai Rajdhani Express': '१२९५१ मुंबई राजधानी एक्सप्रेस',
  '22221 CSMT Hazrat Nizamuddin Rajdhani': '२२२२१ सीएसएमटी हजरत निजामुद्दीन राजधानी',
  '12009 Mumbai Ahmedabad Shatabdi': '१२००९ मुंबई अहमदाबाद शताब्दी',
  '12137 Punjab Mail': '१२१३७ पंजाब मेल',
  '20901 Vande Bharat Express (Mumbai-Gandhinagar)': '२०९०१ वंदे भारत एक्सप्रेस (मुंबई-गांधीनगर)',
  '95401 Suburban Local': '९५४०१ उपनगरीय लोकल',
  '95104 Suburban Local': '९५१०४ उपनगरीय लोकल',
  'CSMT to Kalyan Fast Local (15-Car Rake)': 'सीएसएमटी ते कल्याण जलद लोकल (१५ डब्बे)',
  'Metro Line 3 / Line 4 + Municipal Feeder Bus Shuttle': 'मेट्रो मार्ग ३ / मार्ग ४ + पालिकेची फीडर बस शटल',
  'Mumbai Central - Gandhinagar Capital Vande Bharat Express': 'मुंबई सेंट्रल - गांधीनगर कॅपिटल वंदे भारत एक्सप्रेस',
  'Mumbai Central - New Delhi Tejas Rajdhani Express': 'मुंबई सेंट्रल - नवी दिल्ली तेजस राजधानी एक्सप्रेस',
  'CSMT - Hazrat Nizamuddin Rajdhani Express': 'सीएसएमटी - हजरत निजामुद्दीन राजधानी एक्सप्रेस',
  'CSMT - Kalyan Fast 15-Car Suburban EMU': 'सीएसएमटी - कल्याण जलद १५-डब्बे उपनगरीय ईएमयू',
  'Churchgate - Borivali Slow EMU Local': 'चर्चगेट - बोरिवली धीम्या मार्गाची ईएमयू लोकल',
  'JNPT Port to Dadri Inland Container Depot Freight': 'जेएनपीटी बंदर ते दादरी कंटेनर डेपो मालगाडी',
  'New Delhi - Varanasi Vande Bharat Express': 'नवी दिल्ली - वाराणसी वंदे भारत एक्सप्रेस'
};

export const t = (lang: Lang, key: string, fallback?: string): string => {
  const entry = translations[key];
  if (!entry) return fallback ?? key;
  return entry[lang] ?? entry['en'] ?? fallback ?? key;
};

export const localizeText = (lang: Lang, text?: string): string => {
  if (!text) return '';
  if (lang === 'en') return text;
  
  // 1. Direct dictionary match
  if (DATA_MARATHI_MAP[text]) return DATA_MARATHI_MAP[text];

  // 2. Sub-phrase replace for station routes "StationA to StationB [suffix]"
  let result = text;
  for (const [enKey, mrVal] of Object.entries(DATA_MARATHI_MAP)) {
    if (result.includes(enKey)) {
      result = result.split(enKey).join(mrVal);
    }
  }

  // 3. Connective word translations if still partially English
  result = result
    .replace(/\bto\b/g, 'ते')
    .replace(/\bSection\b/g, 'विभाग')
    .replace(/\bCorridor\b/g, 'मार्गिका')
    .replace(/\bTrunk\b/g, 'मुख्य ट्रंक')
    .replace(/\bExpress\b/g, 'एक्सप्रेस')
    .replace(/\bFast\b/g, 'जलद')
    .replace(/\bSlow\b/g, 'धीमी')
    .replace(/\bQuad\b/g, 'चौपदरी')
    .replace(/\bJunction\b/g, 'जंक्शन');

  return result;
};
