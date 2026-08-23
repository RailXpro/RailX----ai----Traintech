// ─── TrainX.ai Bilingual Translation Map ───────────────────────────────────
// Supports: English ('en') + Marathi ('mr')
// Scope: Header, Auth Modal, Passenger Portal, Footer UI chrome
// Planner Console technical labels stay in English (safety-critical)

export type Lang = 'en' | 'mr';

type TranslationMap = Record<string, Record<Lang, string>>;

export const translations: TranslationMap = {
  // ── Brand ──────────────────────────────────────────────────────────────
  'brand.name': { en: 'TrainX.ai', mr: 'ट्रेनX.ai' },
  'brand.tagline': { en: 'Rail Intelligence Platform', mr: 'रेल बुद्धिमत्ता मंच' },

  // ── Header Nav ─────────────────────────────────────────────────────────
  'nav.corridors': { en: 'Corridors', mr: 'मार्ग' },
  'nav.megaBlocks': { en: 'Mega Blocks', mr: 'मेगा ब्लॉक्स' },
  'nav.aiOptimization': { en: 'AI Optimization', mr: 'AI ऑप्टिमायझेशन' },
  'nav.incidents': { en: 'Incident Feed', mr: 'घटना फीड' },
  'nav.fleet': { en: 'Fleet Telemetry', mr: 'वाहन दूरमापन' },
  'nav.kavach': { en: 'Kavach 2.0 Live', mr: 'कवच २.० लाइव्ह' },
  'nav.searchPlaceholder': {
    en: 'Search corridors, trains, mega blocks, alerts…',
    mr: 'मार्ग, रेल्वे, मेगा ब्लॉक, सूचना शोधा…',
  },

  // ── Header UI ──────────────────────────────────────────────────────────
  'header.division.all': { en: 'National Grid', mr: 'राष्ट्रीय ग्रिड' },
  'header.persona.planner': { en: 'Planner Console', mr: 'नियोजन कन्सोल' },
  'header.persona.passenger': { en: 'Passenger Portal', mr: 'प्रवासी पोर्टल' },
  'header.signIn': { en: 'Sign In', mr: 'प्रवेश करा' },
  'header.efficiency': { en: 'Efficiency', mr: 'कार्यक्षमता' },
  'header.apiOnline': { en: 'Cloud API: Online', mr: 'क्लाउड API: ऑनलाइन' },
  'header.incidents': { en: 'Critical Incident(s)', mr: 'गंभीर घटना' },
  'header.activeBlocks': { en: 'Active Mega Block(s)', mr: 'सक्रिय मेगा ब्लॉक' },

  // ── User Dropdown ──────────────────────────────────────────────────────
  'user.switchMode': { en: 'Switch Mode', mr: 'मोड बदला' },
  'user.accountDetails': { en: 'Account Details', mr: 'खाते तपशील' },
  'user.signOut': { en: 'Sign Out', mr: 'बाहेर पडा' },
  'user.roleOfficial': { en: '🛡 Official', mr: '🛡 अधिकारी' },
  'user.roleYatri': { en: '🚆 Yatri', mr: '🚆 यात्री' },

  // ── Auth Modal ─────────────────────────────────────────────────────────
  'auth.tagline': {
    en: 'Sign in with your Google account to access real-time alerts, AI disruption forecasts, and personalised rail services.',
    mr: 'रिअल-टाइम सूचना, AI व्यत्यय अंदाज आणि वैयक्तिक रेल्वे सेवांसाठी आपल्या Google खात्याने प्रवेश करा.',
  },
  'auth.tab.consumer': { en: 'Rail Yatri / Passenger', mr: 'रेल यात्री / प्रवासी' },
  'auth.tab.official': { en: 'IR Official', mr: 'IR अधिकारी' },
  'auth.consumer.benefit1': {
    en: 'Live PNR disruption radar & real-time block alerts',
    mr: 'थेट PNR व्यत्यय रडार आणि रिअल-टाइम ब्लॉक सूचना',
  },
  'auth.consumer.benefit2': {
    en: 'Sunday Mega Block SMS / Push notifications',
    mr: 'रविवारचे मेगा ब्लॉक SMS / पुश सूचना',
  },
  'auth.consumer.benefit3': {
    en: 'Saved routes, preferred trains & platform tracker',
    mr: 'जतन केलेले मार्ग, पसंतीच्या रेल्वे आणि प्लॅटफॉर्म ट्रॅकर',
  },
  'auth.consumer.benefit4': {
    en: 'AI journey advisor & delay prediction (93% accuracy)',
    mr: 'AI प्रवास सल्लागार आणि उशीर अंदाज (९३% अचूकता)',
  },
  'auth.consumer.profiles': { en: 'Quick demo profiles', mr: 'जलद डेमो प्रोफाइल' },
  'auth.consumer.googleBtn': { en: 'Continue with Google', mr: 'Google सह सुरू ठेवा' },
  'auth.consumer.signingIn': { en: 'Signing you in…', mr: 'प्रवेश करत आहे…' },
  'auth.consumer.disclaimer': {
    en: 'By signing in, you agree to share your Google profile with the Rail Intelligence Platform.',
    mr: 'प्रवेश केल्याने, आपण आपले Google प्रोफाइल रेल बुद्धिमत्ता मंचासह सामायिक करण्यास सहमत आहात.',
  },
  'auth.official.security': { en: 'CRIS SSO & RailNet Workspace Verified', mr: 'CRIS SSO आणि RailNet कार्यस्थान सत्यापित' },
  'auth.official.securitySub': {
    en: 'This portal is restricted to authorised Indian Railways staff. All access is logged and audited.',
    mr: 'हे पोर्टल अधिकृत भारतीय रेल्वे कर्मचाऱ्यांसाठी मर्यादित आहे. सर्व प्रवेश नोंदवला जातो.',
  },
  'auth.official.profiles': { en: 'Demo official profiles', mr: 'डेमो अधिकारी प्रोफाइल' },
  'auth.official.designation': { en: 'Official Designation', mr: 'अधिकृत पदनाम' },
  'auth.official.division': { en: 'Division', mr: 'विभाग' },
  'auth.official.employeeId': { en: 'Employee / CRIS ID', mr: 'कर्मचारी / CRIS ID' },
  'auth.official.employeeIdOptional': { en: '(optional)', mr: '(पर्यायी)' },
  'auth.official.workspaceBtn': { en: 'Sign in with IR Official Google Workspace', mr: 'IR अधिकारी Google Workspace ने प्रवेश करा' },
  'auth.official.personalBtn': { en: 'Or use Personal Google Account', mr: 'किंवा वैयक्तिक Google खाते वापरा' },
  'auth.official.verifying': { en: 'Verifying with CRIS…', mr: 'CRIS सह सत्यापित करत आहे…' },
  'auth.official.customDetails': { en: 'Custom Official Details', mr: 'सानुकूल अधिकारी तपशील' },
  'auth.official.warning': {
    en: 'Access is restricted to authorised Indian Railways personnel with valid CRIS credentials.',
    mr: 'वैध CRIS क्रेडेन्शियल असलेल्या अधिकृत भारतीय रेल्वे कर्मचाऱ्यांपुरता प्रवेश मर्यादित आहे.',
  },

  // ── Passenger Portal ────────────────────────────────────────────────────
  'passenger.title': { en: 'Your Rail Journey', mr: 'तुमचा रेल्वे प्रवास' },
  'passenger.subtitle': {
    en: 'Live disruption alerts, mega block advisories, and AI-powered journey planning',
    mr: 'थेट व्यत्यय सूचना, मेगा ब्लॉक सल्ला, आणि AI-चालित प्रवास नियोजन',
  },
  'passenger.pnrSearch': { en: 'Check PNR / Train Status', mr: 'PNR / रेल्वे स्थिती तपासा' },
  'passenger.pnrPlaceholder': { en: 'Enter 10-digit PNR or Train No.', mr: '१०-अंकी PNR किंवा रेल्वे क्रमांक टाका' },
  'passenger.liveAlerts': { en: 'Live Disruption Alerts', mr: 'थेट व्यत्यय सूचना' },
  'passenger.megaBlockAdvisory': { en: 'Mega Block Advisory', mr: 'मेगा ब्लॉक सल्ला' },
  'passenger.journeyAi': { en: 'AI Journey Advisor', mr: 'AI प्रवास सल्लागार' },
  'passenger.noAlerts': { en: 'No active disruptions on your routes', mr: 'तुमच्या मार्गांवर कोणतेही सक्रिय व्यत्यय नाहीत' },
  'passenger.delay': { en: 'Delay', mr: 'उशीर' },
  'passenger.platform': { en: 'Platform', mr: 'प्लॅटफॉर्म' },
  'passenger.status.onTime': { en: 'On Time', mr: 'वेळेत' },
  'passenger.status.delayed': { en: 'Delayed', mr: 'उशिरा' },
  'passenger.status.cancelled': { en: 'Cancelled', mr: 'रद्द' },
  'passenger.status.diverted': { en: 'Diverted', mr: 'वळवले' },

  // ── Footer ─────────────────────────────────────────────────────────────
  'footer.helpline': { en: '24/7 Rail Safety & Helpline Support', mr: '२४/७ रेल सुरक्षा आणि हेल्पलाइन समर्थन' },
  'footer.helplineSub': {
    en: 'Instant assistance for passengers and section controllers via 139 & RailMadad',
    mr: 'प्रवासी आणि विभाग नियंत्रकांसाठी 139 आणि RailMadad द्वारे त्वरित सहाय्य',
  },
  'footer.kavachActive': { en: 'Kavach Safety Active', mr: 'कवच सुरक्षा सक्रिय' },
  'footer.cris': { en: 'CRIS National Telemetry Gateway', mr: 'CRIS राष्ट्रीय दूरमापन गेटवे' },
  'footer.corridors': { en: 'Corridor Operations', mr: 'मार्ग कार्य' },
  'footer.disruption': { en: 'Disruption & Safety', mr: 'व्यत्यय आणि सुरक्षा' },
  'footer.divisions': { en: 'Divisions Covered', mr: 'समाविष्ट विभाग' },
  'footer.copyright': {
    en: 'Copyright 2026 © TrainX.ai • Indian Railways (भारतीय रेल) & CRIS. All Rights Reserved.',
    mr: 'कॉपीराइट २०२६ © ट्रेनX.ai • भारतीय रेल आणि CRIS. सर्व हक्क राखीव.',
  },
  'footer.aiBlock': { en: 'Automatic Block Planning (AI Solver)', mr: 'स्वयंचलित ब्लॉक नियोजन (AI सोल्व्हर)' },
  'footer.trackPossession': { en: 'Track Possession Scheduling', mr: 'ट्रॅक ताबा वेळापत्रक' },
  'footer.speedProfile': { en: 'Dynamic Speed Profiling (TSR)', mr: 'गतिमान वेग प्रोफाइलिंग (TSR)' },
  'footer.dfc': { en: 'Dedicated Freight Corridor (DFC)', mr: 'समर्पित मालवाहू मार्ग (DFC)' },
  'footer.megaBlockBulletins': { en: 'Sunday Mega Block Bulletins', mr: 'रविवार मेगा ब्लॉक बुलेटिन' },
  'footer.accidentSos': { en: 'Accident SOS & Section Interlock', mr: 'अपघात SOS आणि विभाग इंटरलॉक' },
  'footer.artTracker': { en: 'Accident Relief Train (ART) Tracker', mr: 'अपघात राहत रेल्वे (ART) ट्रॅकर' },
  'footer.railMadad': { en: 'RailMadad 139 Integration', mr: 'RailMadad १३९ एकीकरण' },
};

export const t = (lang: Lang, key: string, fallback?: string): string => {
  const entry = translations[key];
  if (!entry) return fallback ?? key;
  return entry[lang] ?? entry['en'] ?? fallback ?? key;
};
