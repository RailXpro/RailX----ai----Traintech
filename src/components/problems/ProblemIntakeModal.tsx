import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Train,
  Ticket,
  Camera,
  Search,
  Zap,
  LifeBuoy,
  PhoneCall,
  Copy,
  Check,
  Radio,
  FileText,
  User
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { ProblemCategory, ProblemSeverity, DivisionName, ProblemReport } from '../../types/railway';

const CATEGORIES: { id: ProblemCategory; icon: string; labelEn: string; labelMr: string; descEn: string }[] = [
  {
    id: 'TRACK_INFRASTRUCTURE',
    icon: '🛤️',
    labelEn: 'Track & Rail Infrastructure',
    labelMr: 'ट्रॅक व रेल्वे पायाभूत सुविधा',
    descEn: 'Track fracture, debris, ballast scour, waterlogging, broken rails'
  },
  {
    id: 'OHE_ELECTRICAL',
    icon: '⚡',
    labelEn: 'Overhead Equipment (OHE) & Traction',
    labelMr: 'ओव्हरहेड वायर व विद्युत ट्रॅक्शन',
    descEn: 'OHE wire snap, sparking, pantograph tangle, substation trip'
  },
  {
    id: 'SIGNALING_KAVACH',
    icon: '🚦',
    labelEn: 'Signaling, Points & Kavach AI',
    labelMr: 'सिग्नलिंग, पॉईंट्स व कवच AI',
    descEn: 'Signal aspect red flicker, point motor jam, Kavach radio drop'
  },
  {
    id: 'SAFETY_SECURITY_SOS',
    icon: '🚨',
    labelEn: 'Emergency SOS & Passenger Safety',
    labelMr: 'आपत्कालीन SOS व प्रवासी सुरक्षा',
    descEn: 'Medical emergency, crime/harassment, unauthorized chain pull'
  },
  {
    id: 'COACH_AMENITIES',
    icon: '🚆',
    labelEn: 'Coach Amenities & Cleanliness',
    labelMr: 'डबा स्वच्छता व सुविधा',
    descEn: 'AC failure, water shortage, bio-toilet blockage, lighting'
  },
  {
    id: 'PUNCTUALITY_TIMETABLE',
    icon: '⏱️',
    labelEn: 'Punctuality & Delay Disruption',
    labelMr: 'वेळपालन व अनपेक्षित उशीर',
    descEn: 'Unscheduled halt, heavy delay, platform shift confusion'
  },
  {
    id: 'APP_TECHNICAL_FEEDBACK',
    icon: '💻',
    labelEn: 'App Feedback & Tech Glitch',
    labelMr: 'अ‍ॅप अभिप्राय व तांत्रिक अडचण',
    descEn: 'Route solver glitch, map inaccuracy, feature suggestion'
  }
];

const SEVERITIES: { id: ProblemSeverity; labelEn: string; labelMr: string; color: string; bg: string }[] = [
  { id: 'CRITICAL_SOS', labelEn: 'Critical SOS (Immediate Escalation)', labelMr: 'गंभीर SOS (तातडीने)', color: 'var(--rx-red)', bg: 'var(--rx-red-light)' },
  { id: 'HIGH', labelEn: 'High Priority (15-30 Mins)', labelMr: 'उच्च प्राधान्य (१५-३० मिनिटे)', color: 'var(--rx-orange)', bg: 'var(--rx-orange-light)' },
  { id: 'MEDIUM', labelEn: 'Medium (1-2 Hours)', labelMr: 'मध्यम (१-२ तास)', color: 'var(--rx-amber)', bg: 'var(--rx-amber-light)' },
  { id: 'LOW', labelEn: 'Low / General (24 Hours)', labelMr: 'सामान्य (२४ तास)', color: 'var(--rx-blue)', bg: 'var(--rx-blue-light)' }
];

export const ProblemIntakeModal: React.FC = () => {
  const {
    isProblemModalOpen,
    setIsProblemModalOpen,
    submitProblemReport,
    problemReports,
    currentUser,
    selectedDivision
  } = useRailway();
  const { language } = useLanguage();
  const { addToast, setNotificationsDrawerOpen } = useSettings();

  const [modalTab, setModalTab] = useState<'submit' | 'track'>('submit');
  const [category, setCategory] = useState<ProblemCategory>('TRACK_INFRASTRUCTURE');
  const [severity, setSeverity] = useState<ProblemSeverity>('HIGH');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [trainNumber, setTrainNumber] = useState<string>('');
  const [pnr, setPnr] = useState<string>('');
  const [stationOrSection, setStationOrSection] = useState<string>('');
  const [division, setDivision] = useState<DivisionName>(selectedDivision === 'All' ? 'Mumbai CR' : selectedDivision);
  const [reporterName, setReporterName] = useState<string>(currentUser?.name || 'Rohit Sharma');
  const [reporterContact, setReporterContact] = useState<string>('+91 98201 88492');
  const [attachGps, setAttachGps] = useState<boolean>(true);
  const [attachPhoto, setAttachPhoto] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<ProblemReport | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isProblemModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const report = submitProblemReport({
      category,
      severity,
      title,
      description,
      trainNumber: trainNumber.trim() || undefined,
      pnr: pnr.trim() || undefined,
      stationOrSection: stationOrSection.trim() || 'Mumbai Suburban Corridor',
      division,
      reporterName: reporterName || 'Concerned Citizen',
      reporterContact: reporterContact || '+91 98201 00000',
      locationGps: attachGps ? { lat: 19.076, lng: 72.8777 } : undefined,
      photoAttached: attachPhoto
    });

    setSubmittedTicket(report);

    // Instant toast notification for passengers and controllers
    addToast({
      type: severity === 'CRITICAL_SOS' ? 'emergency' : severity === 'HIGH' ? 'warning' : 'info',
      category: severity === 'CRITICAL_SOS' ? 'sos' : 'system',
      title: severity === 'CRITICAL_SOS' ? `🆘 SOS DISPATCHED: [${report.id}] ${title}` : `📋 Report Live: [${report.id}] ${title}`,
      message: `${description.slice(0, 90)}${description.length > 90 ? '…' : ''} • AI Priority: ${report.aiPriorityScore}/100. Synchronized to notifications feed.`
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setTitle('');
    setDescription('');
    setTrainNumber('');
    setPnr('');
    setStationOrSection('');
  };

  const filteredReports = problemReports.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      (r.pnr && r.pnr.includes(q)) ||
      (r.trainNumber && r.trainNumber.includes(q)) ||
      (r.stationOrSection && r.stationOrSection.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(12, 19, 34, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsProblemModalOpen(false)}
    >
      <div
        className="bms-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--rx-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, var(--rx-header) 0%, var(--rx-header-sub) 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px var(--rx-orange-glow)'
              }}
            >
              <LifeBuoy size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>
                  {language === 'mr' ? 'रेल मदद: समस्या नोंदणी व निवारण केंद्र' : 'RailMadad: Problem & Grievance Intake Center'}
                </h3>
                <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.2)', color: '#FFB27A', border: '1px solid rgba(234, 88, 12, 0.4)', fontSize: '0.65rem' }}>
                  CRIS AI 24x7
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#94A3B8' }}>
                {language === 'mr'
                  ? 'प्रवासी, मोटरमन व कर्मचारी यांच्या समस्यांचे रिअल-टाइम निवारण आणि थेट कन्सोल अद्यतन'
                  : 'Instant AI triage, field engineer dispatch, and live sync across Passenger Portal & Operations Console'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProblemModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '12px 24px',
            background: 'var(--rx-surface-alt)',
            borderBottom: '1px solid var(--border-light)',
            gap: '12px'
          }}
        >
          <button
            onClick={() => { setModalTab('submit'); setSubmittedTicket(null); }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: modalTab === 'submit' ? 'var(--rx-orange)' : 'transparent',
              color: modalTab === 'submit' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} />
            {language === 'mr' ? 'नवीन समस्या नोंदवा' : 'Report New Problem'}
          </button>

          <button
            onClick={() => setModalTab('track')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: modalTab === 'track' ? 'var(--rx-blue)' : 'transparent',
              color: modalTab === 'track' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative'
            }}
          >
            <Search size={15} />
            {language === 'mr' ? 'नोंदवलेल्या तक्रारींची थेट स्थिती' : 'Track Active Grievances'}
            <span
              style={{
                background: 'var(--rx-red)',
                color: '#fff',
                fontSize: '0.62rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}
            >
              {problemReports.filter(r => r.status !== 'RESOLVED').length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {modalTab === 'submit' ? (
            submittedTicket ? (
              /* Success Submission Card */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0', gap: '16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--rx-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--rx-green)'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <span className="badge badge-clear" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
                    {language === 'mr' ? 'समस्या यशस्वीरीत्या नोंदवली गेली' : 'Problem Successfully Logged'}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-dark)' }}>
                    {submittedTicket.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
                    {language === 'mr'
                      ? 'आपली समस्या IR-CRIS नियंत्रण कक्षाला पाठवण्यात आली असून पॅसेंजर पोर्टल व ऑपरेशन्स कन्सोलवर रिअल-टाइम सिंक्रोनाईज झाली आहे.'
                      : 'Your problem has been broadcast to Divisional Operations Control and is now live across the Passenger Portal & Controller Radar.'}
                  </p>
                </div>

                {/* Ticket Reference Badge Box */}
                <div
                  style={{
                    background: 'var(--rx-surface-alt)',
                    padding: '16px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                      RailMadad Reference ID
                    </span>
                    <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--rx-orange)' }}>
                      {submittedTicket.id}
                    </strong>
                  </div>

                  <button
                    onClick={() => handleCopyId(submittedTicket.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    {copiedId ? <Check size={14} color="var(--rx-green)" /> : <Copy size={14} />}
                    {copiedId ? 'Copied!' : 'Copy Reference'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', width: '100%', maxWidth: '580px', textAlign: 'left' }}>
                  <div style={{ padding: '12px', background: 'var(--rx-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AI Priority Score</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--rx-green)' }}>
                      {submittedTicket.aiPriorityScore}/100
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--rx-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Assigned Officer</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {submittedTicket.assignedOfficer}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--rx-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Action Protocol</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {submittedTicket.actionTaken}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    onClick={() => setModalTab('track')}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                  >
                    {language === 'mr' ? 'थेट प्रगती ट्रॅक करा' : 'Track Live Progress'}
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="btn btn-secondary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                  >
                    {language === 'mr' ? 'दुसरी समस्या नोंदवा' : 'Report Another Issue'}
                  </button>
                </div>
              </div>
            ) : (
              /* Problem Input Form */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 1. Category Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    1. {language === 'mr' ? 'समस्येचा प्रकार निवडा (Category)' : 'Select Issue Category'}
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: '8px'
                    }}
                  >
                    {CATEGORIES.map(cat => {
                      const isSelected = category === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--rx-orange)' : '1px solid var(--border-light)',
                            background: isSelected ? 'var(--rx-orange-light)' : 'var(--rx-surface-alt)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? 'var(--rx-orange)' : 'var(--text-dark)' }}>
                              {language === 'mr' ? cat.labelMr : cat.labelEn}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                            {cat.descEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Urgency Severity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    2. {language === 'mr' ? 'तीव्रता व तातडीची पातळी (Urgency / Severity)' : 'Urgency & Severity Level'}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SEVERITIES.map(sev => {
                      const isSelected = severity === sev.id;
                      return (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setSeverity(sev.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? `2px solid ${sev.color}` : '1px solid var(--border-light)',
                            background: isSelected ? sev.bg : 'var(--rx-surface-alt)',
                            color: isSelected ? sev.color : 'var(--text-secondary)',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {language === 'mr' ? sev.labelMr : sev.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Problem Title & Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                      3. {language === 'mr' ? 'समस्येचे मुख्य शीर्षक (Headline)' : 'Problem Headline / Summary'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'mr' ? 'उदा. ठाणे ते कल्याण दरम्यान ट्रॅकवर मोठा आवाज/कंपन' : 'e.g. Broken rail fastener / Heavy OHE sparking observed'}
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-medium)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                      {language === 'mr' ? 'सविस्तर तपशील (Detailed Description)' : 'Detailed Description'} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={language === 'mr' ? 'समस्येचे अचूक स्थान, दृश्य लक्षणे आणि धोका स्पष्ट करा...' : 'Describe what happened, exact symptoms, coach/pole number, or observed hazard...'}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-medium)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.85rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                {/* 4. Train, PNR, Station, Division Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <Train size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {language === 'mr' ? 'गाडी क्रमांक (Train No.)' : 'Train No. (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12137 / 95401"
                      value={trainNumber}
                      onChange={e => setTrainNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <Ticket size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {language === 'mr' ? 'PNR क्रमांक' : 'PNR (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8421984210"
                      value={pnr}
                      onChange={e => setPnr(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {language === 'mr' ? 'स्थान / कॉरिडॉर' : 'Station / Section'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dadar - Thane Slow"
                      value={stationOrSection}
                      onChange={e => setStationOrSection(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {language === 'mr' ? 'रेल्वे विभाग (Division)' : 'Division'}
                    </label>
                    <select
                      value={division}
                      onChange={e => setDivision(e.target.value as DivisionName)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--rx-surface)',
                        color: 'var(--text-dark)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <option value="Mumbai CR">Mumbai CR</option>
                      <option value="Mumbai WR">Mumbai WR</option>
                      <option value="Delhi NR">Delhi NR</option>
                      <option value="Howrah ER">Howrah ER</option>
                      <option value="Chennai SR">Chennai SR</option>
                      <option value="Bengaluru SWR">Bengaluru SWR</option>
                    </select>
                  </div>
                </div>

                {/* 5. Attachments and Reporter Toggles */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--rx-surface-alt)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-body)' }}>
                    <input
                      type="checkbox"
                      checked={attachGps}
                      onChange={e => setAttachGps(e.target.checked)}
                      style={{ accentColor: 'var(--rx-orange)' }}
                    />
                    <MapPin size={14} color="var(--rx-green)" />
                    {language === 'mr' ? 'थेट GPS स्थान जोडा (19.076° N, 72.877° E)' : 'Attach Real-time GPS Location (Auto-tagged)'}
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-body)' }}>
                    <input
                      type="checkbox"
                      checked={attachPhoto}
                      onChange={e => setAttachPhoto(e.target.checked)}
                      style={{ accentColor: 'var(--rx-orange)' }}
                    />
                    <Camera size={14} color="var(--rx-blue)" />
                    {language === 'mr' ? 'घटनास्थळाचे छायाचित्र जोडा' : 'Attach Photo Evidence'}
                  </label>
                </div>

                {/* Submit Action Strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <PhoneCall size={14} />
                    {language === 'mr' ? 'आपत्कालीन हेल्पलाइन: 139 / 1512' : 'Emergency Railway Helplines: 139 / 1512'}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      padding: '12px 28px',
                      fontSize: '0.9rem',
                      background: severity === 'CRITICAL_SOS'
                        ? 'linear-gradient(135deg, var(--rx-red) 0%, #DC2626 100%)'
                        : 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
                      boxShadow: severity === 'CRITICAL_SOS'
                        ? '0 4px 16px rgba(225, 29, 72, 0.4)'
                        : '0 4px 16px var(--rx-orange-glow)'
                    }}
                  >
                    <Send size={16} />
                    {severity === 'CRITICAL_SOS'
                      ? (language === 'mr' ? '⚡ आपत्कालीन SOS नोंदवा' : '⚡ Submit Critical SOS')
                      : (language === 'mr' ? 'समस्या नोंदवा व AI ट्राइएज करा' : 'Submit Problem & Run AI Triage')}
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Active Grievances & Problem Tracker List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search input */}
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder={language === 'mr' ? 'रेफरन्स ID, PNR, ट्रेन क्रमांक किंवा स्थान शोधा...' : 'Search by Reference ID, PNR, Train No, or Corridor...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--rx-surface)',
                    color: 'var(--text-dark)',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              {filteredReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                  <LifeBuoy size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>No active problem reports matching search.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredReports.map(report => {
                    const isResolved = report.status === 'RESOLVED';
                    const isDispatched = report.status === 'DISPATCHED';
                    const isCritical = report.severity === 'CRITICAL_SOS';

                    return (
                      <div
                        key={report.id}
                        style={{
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--rx-surface-alt)',
                          border: isCritical ? '1px solid var(--rx-red)' : '1px solid var(--border-light)',
                          borderLeft: `4px solid ${
                            isResolved
                              ? 'var(--rx-green)'
                              : isCritical
                              ? 'var(--rx-red)'
                              : report.severity === 'HIGH'
                              ? 'var(--rx-orange)'
                              : 'var(--rx-blue)'
                          }`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--rx-orange)' }}>
                              {report.id}
                            </span>
                            <span className="badge" style={{ fontSize: '0.65rem' }}>
                              {report.division || 'Mumbai CR'}
                            </span>
                            {report.trainNumber && (
                              <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
                                Train #{report.trainNumber}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-pill)',
                                fontWeight: 800,
                                background: isResolved ? 'var(--rx-green-light)' : isDispatched ? 'var(--rx-orange-light)' : 'var(--rx-blue-light)',
                                color: isResolved ? 'var(--rx-green)' : isDispatched ? 'var(--rx-orange)' : 'var(--rx-blue)'
                              }}
                            >
                              {report.status.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {report.timestamp}
                            </span>
                          </div>
                        </div>

                        <h4 style={{ margin: '0 0 6px', fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {report.title}
                        </h4>
                        <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {report.description}
                        </p>

                        {/* Location and Officer info */}
                        <div
                          style={{
                            padding: '10px 14px',
                            background: 'var(--rx-surface)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                            <strong style={{ color: 'var(--text-body)' }}>{report.stationOrSection || 'Section Corridor'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Assigned: </span>
                            <strong style={{ color: 'var(--text-body)' }}>{report.assignedOfficer || 'Operations Control'}</strong>
                          </div>
                          {report.actionTaken && (
                            <div style={{ width: '100%', color: 'var(--rx-green)', fontWeight: 600 }}>
                              ⚡ Action: {report.actionTaken}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
