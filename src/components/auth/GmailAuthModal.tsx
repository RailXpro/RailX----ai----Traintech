import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Train,
  ChevronDown,
  Fingerprint,
  BadgeCheck,
  Zap,
  MapPin,
  Bell,
  Star,
  Lock,
  Building2,
  LogIn
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { OfficialDesignation, DivisionName } from '../../types/railway';

/* ─── Google SVG Icon ─────────────────────────────────────────────────── */
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

/* ─── Static Data ─────────────────────────────────────────────────────── */
const OFFICIAL_DESIGNATIONS: OfficialDesignation[] = [
  'Chief Train Controller (DOM)',
  'Senior Divisional Operations Manager',
  'Traction Power Controller (TPC)',
  'ASTE Signal & Telecom Engineer',
  'Divisional Railway Manager (DRM)',
  'Assistant Divisional Engineer (ADE)',
  'Station Superintendent (SM)',
];

const DIVISIONS: DivisionName[] = [
  'Mumbai CR', 'Mumbai WR', 'Delhi NR', 'Howrah ER', 'Chennai SR', 'Bengaluru SWR'
];

const OFFICIAL_PRESETS = [
  {
    name: 'Er. Rajesh Kumar Sharma',
    email: 'controller.mumbai@railnet.gov.in',
    designation: 'Chief Train Controller (DOM)' as OfficialDesignation,
    employeeId: 'IR-CRIS-884920',
    division: 'Mumbai CR' as DivisionName,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smt. Priya Nair',
    email: 'priya.nair@railnet.gov.in',
    designation: 'ASTE Signal & Telecom Engineer' as OfficialDesignation,
    employeeId: 'IR-SIG-223411',
    division: 'Mumbai WR' as DivisionName,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
  },
  {
    name: 'Shri Arun Verma',
    email: 'drm.delhi@railnet.gov.in',
    designation: 'Divisional Railway Manager (DRM)' as OfficialDesignation,
    employeeId: 'IR-DRM-100042',
    division: 'Delhi NR' as DivisionName,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=80'
  },
];

const CONSUMER_PRESETS = [
  {
    name: 'Rohit V. Sharma',
    email: 'rohit.sharma.mumbai@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    tag: 'Suburban Commuter',
    division: 'Mumbai CR' as DivisionName
  },
  {
    name: 'Priya S. Verma',
    email: 'priya.verma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&auto=format&fit=crop&q=80',
    tag: 'Express Passenger',
    division: 'Delhi NR' as DivisionName
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta.pune@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    tag: 'Daily Commuter',
    division: 'Mumbai WR' as DivisionName
  },
];

/* ─── Animation keyframes (injected once) ────────────────────────────── */
const STYLE_ID = 'railx-auth-modal-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes authSlideIn {
      from { opacity: 0; transform: translateY(32px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes authFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .auth-google-btn {
      position: relative;
      overflow: hidden;
      transition: transform 0.14s ease, box-shadow 0.14s ease;
    }
    .auth-google-btn:hover  { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.28); }
    .auth-google-btn:active { transform: translateY(0px);  box-shadow: none; }
    .auth-preset-card { transition: all 0.14s ease; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); }
    .auth-preset-card:hover { border-color: rgba(248,68,100,0.55); background: rgba(248,68,100,0.08) !important; transform: translateY(-1px); }
    .auth-preset-card.selected { border-color: #F84464; background: rgba(248,68,100,0.14) !important; }
    .auth-tab-btn { transition: all 0.18s ease; position: relative; }
    .auth-tab-btn::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0;
      height: 2px;
      background: #F84464;
      transform: scaleX(0);
      transition: transform 0.18s ease;
    }
    .auth-tab-btn.active::after { transform: scaleX(1); }
    .auth-select {
      background: #2a2c3d;
      color: #E0E0E0;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.82rem;
      width: 100%;
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
    }
    .auth-select:focus { border-color: #F84464; }
  `;
  document.head.appendChild(s);
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export const GmailAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle } = useRailway();

  const [tab, setTab] = useState<'consumer' | 'official'>('consumer');
  const [selectedConsumer, setSelectedConsumer] = useState<number | null>(null);
  const [selectedOfficial, setSelectedOfficial] = useState<number | null>(null);
  const [officialDesignation, setOfficialDesignation] = useState<OfficialDesignation>(OFFICIAL_DESIGNATIONS[0]);
  const [officialDivision, setOfficialDivision] = useState<DivisionName>(DIVISIONS[0]);
  const [officialEmployeeId, setOfficialEmployeeId] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  /* reset on open */
  useEffect(() => {
    if (isAuthModalOpen) {
      setTab('consumer');
      setSelectedConsumer(null);
      setSelectedOfficial(null);
      setIsSigningIn(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const closeModal = () => setIsAuthModalOpen(false);

  const handleConsumerSignIn = () => {
    setIsSigningIn(true);
    const preset = selectedConsumer !== null ? CONSUMER_PRESETS[selectedConsumer] : null;
    setTimeout(() => {
      loginWithGoogle('consumer', {
        name: preset?.name,
        email: preset?.email,
        avatarUrl: preset?.avatar,
        division: preset?.division || 'Mumbai CR',
      });
      setIsSigningIn(false);
    }, 1400);
  };

  const handleOfficialSignIn = () => {
    setIsSigningIn(true);
    const preset = selectedOfficial !== null ? OFFICIAL_PRESETS[selectedOfficial] : null;
    setTimeout(() => {
      loginWithGoogle('official', {
        name: preset?.name,
        email: preset?.email,
        avatarUrl: preset?.avatar,
        officialDesignation: preset?.designation || officialDesignation,
        employeeId: preset?.employeeId || officialEmployeeId || 'IR-DEMO-000001',
        division: preset?.division || officialDivision,
      });
      setIsSigningIn(false);
    }, 1600);
  };

  /* ── Overlay */
  return (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10, 10, 18, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'authFadeIn 0.2s ease'
      }}
    >
      {/* Modal Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1a1c2a',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'authSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)'
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1f2136 0%, #222434 100%)',
          padding: '24px 28px 20px',
          borderRadius: '18px 18px 0 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative'
        }}>
          <button
            onClick={closeModal}
            style={{
              position: 'absolute', top: '18px', right: '18px',
              background: 'rgba(255,255,255,0.06)',
              border: 'none', color: '#AAAAAA', cursor: 'pointer',
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: '#F84464',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(248,68,100,0.45)'
            }}>
              <Train size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                TrainX<span style={{ color: '#F84464' }}>.ai</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Rail Intelligence Platform
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#AAAAAA', marginTop: '10px', lineHeight: 1.5 }}>
            Sign in with your Google account to access real-time alerts, AI disruption forecasts, and personalized rail services.
          </p>
        </div>

        {/* ── Tab Switcher ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: '#16182a'
        }}>
          <button
            onClick={() => setTab('consumer')}
            className={`auth-tab-btn${tab === 'consumer' ? ' active' : ''}`}
            style={{
              padding: '14px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: tab === 'consumer' ? '#FFFFFF' : '#888',
              fontWeight: tab === 'consumer' ? 700 : 500,
              fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <User size={14} />
            Rail Yatri / Passenger
          </button>
          <button
            onClick={() => setTab('official')}
            className={`auth-tab-btn${tab === 'official' ? ' active' : ''}`}
            style={{
              padding: '14px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: tab === 'official' ? '#FFFFFF' : '#888',
              fontWeight: tab === 'official' ? 700 : 500,
              fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <ShieldCheck size={14} />
            IR Official
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 28px' }}>

          {/* ════════════════════════ CONSUMER TAB ════════════════════════ */}
          {tab === 'consumer' && (
            <div style={{ animation: 'authFadeIn 0.18s ease' }}>
              {/* Benefits strip */}
              <div style={{
                background: 'rgba(248,68,100,0.07)',
                border: '1px solid rgba(248,68,100,0.18)',
                borderRadius: '10px', padding: '12px 14px',
                marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                {[
                  { icon: <Zap size={13} color="#F84464"/>, label: 'Live PNR disruption radar & real-time block alerts' },
                  { icon: <Bell size={13} color="#F84464"/>, label: 'Sunday Mega Block SMS / Push notifications' },
                  { icon: <MapPin size={13} color="#F84464"/>, label: 'Saved routes, preferred trains & platform tracker' },
                  { icon: <Star size={13} color="#FFAA00"/>, label: 'AI journey advisor & delay prediction (93% accuracy)' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#CCCCCC' }}>
                    {b.icon}
                    {b.label}
                  </div>
                ))}
              </div>

              {/* Quick preset selection */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Quick demo profiles
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONSUMER_PRESETS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedConsumer(i === selectedConsumer ? null : i)}
                      className={`auth-preset-card${selectedConsumer === i ? ' selected' : ''}`}
                      style={{
                        borderRadius: '9px', padding: '10px 14px', background: '#1e2032',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}
                    >
                      <img
                        src={p.avatar} alt={p.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=F84464&color=fff`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
                      </div>
                      <div style={{
                        fontSize: '0.65rem', fontWeight: 700, color: '#F84464',
                        background: 'rgba(248,68,100,0.12)', padding: '2px 8px', borderRadius: '10px',
                        whiteSpace: 'nowrap'
                      }}>
                        {p.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Sign-In button */}
              <button
                onClick={handleConsumerSignIn}
                disabled={isSigningIn}
                className="auth-google-btn"
                style={{
                  width: '100%', padding: '13px 20px',
                  background: isSigningIn ? '#2a2c3d' : '#FFFFFF',
                  border: 'none', borderRadius: '9px', cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: isSigningIn ? '#888' : '#333',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSigningIn ? (
                  <>
                    <div style={{ width: 20, height: 20, border: '2px solid #888', borderTopColor: '#F84464', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Signing you in...
                  </>
                ) : (
                  <>
                    <GoogleIcon size={20} />
                    Continue with Google
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#666', marginTop: '12px', lineHeight: 1.5 }}>
                By signing in, you agree to share your Google profile with the Rail Intelligence Platform for personalised journey services.
              </p>
            </div>
          )}

          {/* ════════════════════════ OFFICIAL TAB ════════════════════════ */}
          {tab === 'official' && (
            <div style={{ animation: 'authFadeIn 0.18s ease' }}>
              {/* Security Banner */}
              <div style={{
                background: 'rgba(74,189,93,0.07)',
                border: '1px solid rgba(74,189,93,0.22)',
                borderRadius: '10px', padding: '10px 14px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(74,189,93,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Lock size={16} color="#4ABD5D" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ABD5D', marginBottom: '2px' }}>
                    CRIS SSO & RailNet Workspace Verified
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#888' }}>
                    This portal is restricted to authorised Indian Railways staff. All access is logged and audited.
                  </div>
                </div>
              </div>

              {/* Quick official preset selection */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Demo official profiles
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {OFFICIAL_PRESETS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const idx = selectedOfficial === i ? null : i;
                        setSelectedOfficial(idx);
                        if (idx !== null) {
                          setOfficialDesignation(p.designation);
                          setOfficialDivision(p.division);
                          setOfficialEmployeeId(p.employeeId);
                        }
                      }}
                      className={`auth-preset-card${selectedOfficial === i ? ' selected' : ''}`}
                      style={{
                        borderRadius: '9px', padding: '10px 14px', background: '#1e2032',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}
                    >
                      <img
                        src={p.avatar} alt={p.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=4ABD5D&color=fff`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
                        <div style={{ fontSize: '0.68rem', color: '#4ABD5D', marginTop: '2px' }}>{p.designation} · {p.division}</div>
                      </div>
                      <BadgeCheck size={18} color={selectedOfficial === i ? '#4ABD5D' : '#444'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom official form */}
              <div style={{ background: '#1e2032', borderRadius: '10px', padding: '14px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Fingerprint size={12} />
                  Custom Official Details
                </div>

                {/* Designation */}
                <div>
                  <label style={{ fontSize: '0.71rem', color: '#AAAAAA', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Official Designation
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="auth-select"
                      value={officialDesignation}
                      onChange={e => setOfficialDesignation(e.target.value as OfficialDesignation)}
                    >
                      {OFFICIAL_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Division */}
                <div>
                  <label style={{ fontSize: '0.71rem', color: '#AAAAAA', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Division
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="auth-select"
                      value={officialDivision}
                      onChange={e => setOfficialDivision(e.target.value as DivisionName)}
                    >
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label style={{ fontSize: '0.71rem', color: '#AAAAAA', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Employee / CRIS ID <span style={{ color: '#555' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IR-CRIS-884920"
                    value={officialEmployeeId}
                    onChange={e => setOfficialEmployeeId(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px',
                      background: '#2a2c3d', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px', color: '#E0E0E0', fontSize: '0.82rem',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* IR Google Workspace Sign-In button */}
              <button
                onClick={handleOfficialSignIn}
                disabled={isSigningIn}
                className="auth-google-btn"
                style={{
                  width: '100%', padding: '13px 20px',
                  background: isSigningIn ? '#1e2032' : 'linear-gradient(135deg, #1a5c2b 0%, #1d6b31 100%)',
                  border: isSigningIn ? '1px solid #333' : '1px solid rgba(74,189,93,0.3)',
                  borderRadius: '9px', cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: isSigningIn ? '#888' : '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSigningIn ? (
                  <>
                    <div style={{ width: 20, height: 20, border: '2px solid #555', borderTopColor: '#4ABD5D', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Verifying with CRIS...
                  </>
                ) : (
                  <>
                    <Building2 size={18} />
                    Sign in with IR Official Google Workspace
                  </>
                )}
              </button>

              {/* Secondary Google option for officials */}
              <button
                onClick={handleOfficialSignIn}
                disabled={isSigningIn}
                className="auth-google-btn"
                style={{
                  width: '100%', padding: '11px 20px', marginTop: '8px',
                  background: '#FFFFFF',
                  border: 'none', borderRadius: '9px', cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontSize: '0.84rem', fontWeight: 700, color: '#333',
                  transition: 'all 0.15s ease', opacity: isSigningIn ? 0.5 : 1
                }}
              >
                <GoogleIcon size={18} />
                Or use Personal Google Account
              </button>

              <div style={{
                marginTop: '14px', padding: '10px 14px',
                background: 'rgba(255,170,0,0.07)', border: '1px solid rgba(255,170,0,0.18)',
                borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px'
              }}>
                <LogIn size={13} color="#FFAA00" style={{ marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.7rem', color: '#BBBBBB', lineHeight: 1.5 }}>
                  Access is restricted to authorised Indian Railways personnel with valid CRIS credentials.
                  Unauthorised access attempts are logged and reported to Cyber Security Cell.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
