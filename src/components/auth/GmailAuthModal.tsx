import React, { useState, useEffect } from 'react';
import {
  X, User, ShieldCheck, Train, ChevronDown,
  Fingerprint, BadgeCheck, Zap, MapPin, Bell, Star, Lock, Building2, LogIn
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { OfficialDesignation, DivisionName } from '../../types/railway';

/* ─── Google SVG ─────────────────────────────────────────────────────── */
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

/* ─── Static Data ────────────────────────────────────────────────────── */
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
  { name: 'Er. Rajesh Kumar Sharma', email: 'controller.mumbai@railnet.gov.in', designation: 'Chief Train Controller (DOM)' as OfficialDesignation, employeeId: 'IR-CRIS-884920', division: 'Mumbai CR' as DivisionName, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
  { name: 'Smt. Priya Nair', email: 'priya.nair@railnet.gov.in', designation: 'ASTE Signal & Telecom Engineer' as OfficialDesignation, employeeId: 'IR-SIG-223411', division: 'Mumbai WR' as DivisionName, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
  { name: 'Shri Arun Verma', email: 'drm.delhi@railnet.gov.in', designation: 'Divisional Railway Manager (DRM)' as OfficialDesignation, employeeId: 'IR-DRM-100042', division: 'Delhi NR' as DivisionName, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=80' },
];
const CONSUMER_PRESETS = [
  { name: 'Rohit V. Sharma', email: 'rohit.sharma.mumbai@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80', tag: 'Suburban Commuter', division: 'Mumbai CR' as DivisionName },
  { name: 'Priya S. Verma', email: 'priya.verma@gmail.com', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&auto=format&fit=crop&q=80', tag: 'Express Passenger', division: 'Delhi NR' as DivisionName },
  { name: 'Arjun Mehta', email: 'arjun.mehta.pune@gmail.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', tag: 'Daily Commuter', division: 'Mumbai WR' as DivisionName },
];

/* ─── Modal-scoped styles ────────────────────────────────────────────── */
const STYLE_ID = 'railx-auth-modal-v2';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes authSlideIn {
      from { opacity: 0; transform: translateY(28px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    .rx-auth-preset { transition: all 0.16s ease; cursor: pointer; }
    .rx-auth-preset:hover { transform: translateY(-1px); }
    .rx-auth-preset.selected { outline: 2px solid var(--rx-orange); }
    .rx-google-btn { transition: transform 0.14s ease, box-shadow 0.14s ease; }
    .rx-google-btn:hover  { transform: translateY(-1px); }
    .rx-google-btn:active { transform: translateY(0); }
    .rx-tab { position: relative; transition: all 0.18s ease; }
    .rx-tab::after { content:''; position:absolute; bottom:0; left:16px; right:16px; height:2px; background:var(--rx-orange); border-radius:99px; transform:scaleX(0); transition:transform 0.18s ease; }
    .rx-tab.active::after { transform:scaleX(1); }
    .rx-input { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:10px; color:#E0E0E0; padding:9px 13px; font-size:0.82rem; width:100%; outline:none; font-family:var(--font-sans); transition:border-color 0.15s; }
    .rx-input:focus { border-color:var(--rx-orange); }
    .rx-select { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:10px; color:#E0E0E0; padding:9px 13px; font-size:0.82rem; width:100%; outline:none; font-family:var(--font-sans); cursor:pointer; appearance:none; }
    .rx-select:focus { border-color:var(--rx-orange); }
  `;
  document.head.appendChild(s);
}

/* ─── Component ──────────────────────────────────────────────────────── */
export const GmailAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle } = useRailway();
  const { t } = useLanguage();

  const [tab, setTab] = useState<'consumer' | 'official'>('consumer');
  const [selectedConsumer, setSelectedConsumer] = useState<number | null>(null);
  const [selectedOfficial, setSelectedOfficial] = useState<number | null>(null);
  const [officialDesignation, setOfficialDesignation] = useState<OfficialDesignation>(OFFICIAL_DESIGNATIONS[0]);
  const [officialDivision, setOfficialDivision] = useState<DivisionName>(DIVISIONS[0]);
  const [officialEmployeeId, setOfficialEmployeeId] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) { setTab('consumer'); setSelectedConsumer(null); setSelectedOfficial(null); setIsSigningIn(false); }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const closeModal = () => setIsAuthModalOpen(false);

  const handleConsumerSignIn = () => {
    setIsSigningIn(true);
    const p = selectedConsumer !== null ? CONSUMER_PRESETS[selectedConsumer] : null;
    setTimeout(() => {
      loginWithGoogle('consumer', { name: p?.name, email: p?.email, avatarUrl: p?.avatar, division: p?.division || 'Mumbai CR' });
      setIsSigningIn(false);
    }, 1400);
  };

  const handleOfficialSignIn = () => {
    setIsSigningIn(true);
    const p = selectedOfficial !== null ? OFFICIAL_PRESETS[selectedOfficial] : null;
    setTimeout(() => {
      loginWithGoogle('official', {
        name: p?.name, email: p?.email, avatarUrl: p?.avatar,
        officialDesignation: p?.designation || officialDesignation,
        employeeId: p?.employeeId || officialEmployeeId || 'IR-DEMO-000001',
        division: p?.division || officialDivision,
      });
      setIsSigningIn(false);
    }, 1600);
  };

  const consumerBenefits = [
    { icon: <Zap size={13}/>, key: 'auth.consumer.benefit1', color: 'var(--rx-orange)' },
    { icon: <Bell size={13}/>, key: 'auth.consumer.benefit2', color: 'var(--rx-orange)' },
    { icon: <MapPin size={13}/>, key: 'auth.consumer.benefit3', color: 'var(--rx-blue)' },
    { icon: <Star size={13}/>, key: 'auth.consumer.benefit4', color: '#F59E0B' },
  ];

  return (
    /* Overlay */
    <div
      onClick={closeModal}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10, 14, 35, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        animation: 'authFadeIn 0.2s ease'
      }}
    >
      {/* Modal Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111827',
          borderRadius: '24px',
          width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0,0,0,0.65)',
          border: '1px solid rgba(255,255,255,0.07)',
          animation: 'authSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)'
        }}
      >
        {/* ── Modal Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F1C3D 0%, #162248 100%)',
          padding: '26px 28px 20px',
          borderRadius: '24px 24px 0 0',
          position: 'relative',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <button onClick={closeModal} style={{
            position: 'absolute', top: '18px', right: '18px',
            background: 'rgba(255,255,255,0.06)', border: 'none', color: '#888',
            cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s'
          }}>
            <X size={15} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '10px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '13px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px var(--rx-orange-glow)'
            }}>
              <Train size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
                TrainX<span style={{ color: 'var(--rx-orange)' }}>.ai</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {t('brand.tagline')}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.81rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            {t('auth.tagline')}
          </p>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['consumer', 'official'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`rx-tab${tab === tabKey ? ' active' : ''}`}
              style={{
                padding: '14px', border: 'none', background: 'transparent', cursor: 'pointer',
                color: tab === tabKey ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                fontWeight: tab === tabKey ? 700 : 500, fontSize: '0.82rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                fontFamily: 'var(--font-sans)', transition: 'color 0.18s'
              }}
            >
              {tabKey === 'consumer' ? <User size={14}/> : <ShieldCheck size={14}/>}
              {t(`auth.tab.${tabKey}`)}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 26px' }}>

          {/* ═══ CONSUMER TAB ═══ */}
          {tab === 'consumer' && (
            <div style={{ animation: 'authFadeIn 0.18s ease' }}>
              {/* Benefits */}
              <div style={{
                background: 'rgba(255,107,26,0.07)',
                border: '1px solid rgba(255,107,26,0.18)',
                borderRadius: '14px', padding: '14px 16px', marginBottom: '20px',
                display: 'flex', flexDirection: 'column', gap: '9px'
              }}>
                {consumerBenefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.76rem', color: '#CCCCCC' }}>
                    <span style={{ color: b.color, flexShrink: 0 }}>{b.icon}</span>
                    {t(b.key)}
                  </div>
                ))}
              </div>

              {/* Presets */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {t('auth.consumer.profiles')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONSUMER_PRESETS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedConsumer(i === selectedConsumer ? null : i)}
                      className={`rx-auth-preset${selectedConsumer === i ? ' selected' : ''}`}
                      style={{
                        borderRadius: '13px', padding: '11px 14px',
                        background: selectedConsumer === i ? 'rgba(255,107,26,0.1)' : 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}
                    >
                      <img src={p.avatar} alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,107,26,0.3)' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=FF6B1A&color=fff`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</div>
                      </div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--rx-orange)', background: 'rgba(255,107,26,0.14)', padding: '3px 10px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
                        {p.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={handleConsumerSignIn}
                disabled={isSigningIn}
                className="rx-google-btn"
                style={{
                  width: '100%', padding: '13px 20px',
                  background: isSigningIn ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  border: 'none', borderRadius: '13px', cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontSize: '0.9rem', fontWeight: 700, color: isSigningIn ? '#666' : '#1A1A2E',
                  fontFamily: 'var(--font-sans)', boxShadow: isSigningIn ? 'none' : '0 4px 20px rgba(255,255,255,0.12)'
                }}
              >
                {isSigningIn
                  ? <><div style={{ width: 20, height: 20, border: '2px solid #444', borderTopColor: 'var(--rx-orange)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>{t('auth.consumer.signingIn')}</>
                  : <><GoogleIcon size={20}/>{t('auth.consumer.googleBtn')}</>
                }
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '12px', lineHeight: 1.5 }}>
                {t('auth.consumer.disclaimer')}
              </p>
            </div>
          )}

          {/* ═══ OFFICIAL TAB ═══ */}
          {tab === 'official' && (
            <div style={{ animation: 'authFadeIn 0.18s ease' }}>
              {/* Security banner */}
              <div style={{
                background: 'rgba(26,86,219,0.08)', border: '1px solid rgba(26,86,219,0.22)',
                borderRadius: '14px', padding: '12px 14px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(26,86,219,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lock size={16} color="var(--rx-blue)"/>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rx-blue)', marginBottom: '2px' }}>{t('auth.official.security')}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{t('auth.official.securitySub')}</div>
                </div>
              </div>

              {/* Presets */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {t('auth.official.profiles')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {OFFICIAL_PRESETS.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const idx = selectedOfficial === i ? null : i;
                        setSelectedOfficial(idx);
                        if (idx !== null) { setOfficialDesignation(p.designation); setOfficialDivision(p.division); setOfficialEmployeeId(p.employeeId); }
                      }}
                      className={`rx-auth-preset${selectedOfficial === i ? ' selected' : ''}`}
                      style={{
                        borderRadius: '13px', padding: '11px 14px',
                        background: selectedOfficial === i ? 'rgba(26,86,219,0.1)' : 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}
                    >
                      <img src={p.avatar} alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(26,86,219,0.35)' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1A56DB&color=fff`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</div>
                        <div style={{ fontSize: '0.67rem', color: 'var(--rx-blue)', marginTop: '1px' }}>{p.designation} · {p.division}</div>
                      </div>
                      <BadgeCheck size={17} color={selectedOfficial === i ? 'var(--rx-blue)' : 'rgba(255,255,255,0.2)'}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom form */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Fingerprint size={12}/> {t('auth.official.customDetails')}
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('auth.official.designation')}</label>
                  <div style={{ position: 'relative' }}>
                    <select className="rx-select" value={officialDesignation} onChange={e => setOfficialDesignation(e.target.value as OfficialDesignation)}>
                      {OFFICIAL_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('auth.official.division')}</label>
                  <div style={{ position: 'relative' }}>
                    <select className="rx-select" value={officialDivision} onChange={e => setOfficialDivision(e.target.value as DivisionName)}>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                    {t('auth.official.employeeId')} <span style={{ color: 'rgba(255,255,255,0.25)' }}>{t('auth.official.employeeIdOptional')}</span>
                  </label>
                  <input type="text" className="rx-input" placeholder="e.g. IR-CRIS-884920" value={officialEmployeeId} onChange={e => setOfficialEmployeeId(e.target.value)}/>
                </div>
              </div>

              {/* IR Workspace button */}
              <button
                onClick={handleOfficialSignIn}
                disabled={isSigningIn}
                className="rx-google-btn"
                style={{
                  width: '100%', padding: '13px 20px',
                  background: isSigningIn ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, var(--rx-blue) 0%, var(--rx-blue-mid) 100%)',
                  border: 'none', borderRadius: '13px', cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  fontSize: '0.9rem', fontWeight: 700, color: isSigningIn ? '#555' : '#FFFFFF',
                  fontFamily: 'var(--font-sans)', boxShadow: isSigningIn ? 'none' : '0 4px 16px var(--rx-blue-glow)'
                }}
              >
                {isSigningIn
                  ? <><div style={{ width: 20, height: 20, border: '2px solid #444', borderTopColor: 'var(--rx-blue)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>{t('auth.official.verifying')}</>
                  : <><Building2 size={18}/>{t('auth.official.workspaceBtn')}</>
                }
              </button>

              {/* Personal Google */}
              <button
                onClick={handleOfficialSignIn}
                disabled={isSigningIn}
                className="rx-google-btn"
                style={{
                  width: '100%', padding: '11px 20px', marginTop: '8px',
                  background: '#FFFFFF', border: 'none', borderRadius: '13px',
                  cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  fontSize: '0.84rem', fontWeight: 700, color: '#1A1A2E',
                  fontFamily: 'var(--font-sans)', opacity: isSigningIn ? 0.5 : 1
                }}
              >
                <GoogleIcon size={18}/> {t('auth.official.personalBtn')}
              </button>

              <div style={{
                marginTop: '14px', padding: '11px 14px',
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
                borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px'
              }}>
                <LogIn size={13} color="#F59E0B" style={{ marginTop: '1px', flexShrink: 0 }}/>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{t('auth.official.warning')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
