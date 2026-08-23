import React, { useState, useEffect, useRef } from 'react';
import {
  Train,
  ShieldAlert,
  CalendarClock,
  Search,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';
import { DivisionName } from '../types/railway';

const DIVISIONS: DivisionName[] = [
  'Mumbai CR', 'Mumbai WR', 'Delhi NR', 'Howrah ER', 'Chennai SR', 'Bengaluru SWR'
];

/* ── Wavy SVG divider (header → page) ────────────────────────────────── */
const WavyDivider: React.FC = () => (
  <div style={{ lineHeight: 0, background: 'var(--rx-header-sub)' }}>
    <svg viewBox="0 0 1440 38" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '38px' }} preserveAspectRatio="none">
      <path
        d="M0,18 C180,38 360,-2 540,18 C720,38 900,-2 1080,18 C1260,38 1380,8 1440,18 L1440,38 L0,38 Z"
        fill="var(--rx-cream)"
      />
    </svg>
  </div>
);

export const Header: React.FC = () => {
  const {
    persona,
    setPersona,
    currentUser,
    setIsAuthModalOpen,
    logout,
    selectedDivision,
    setSelectedDivision,
    accidents,
    megaBlocks,
    metrics
  } = useRailway();

  const { language, setLanguage, t } = useLanguage();

  const [currentTime, setCurrentTime] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [divDropdownOpen, setDivDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const divDropRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateIST = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }) + ' IST'
      );
    };
    updateIST();
    const timer = setInterval(updateIST, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
      if (divDropRef.current  && !divDropRef.current.contains(e.target as Node))  setDivDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeAccidentsCount  = accidents.filter(a => a.status !== 'resolved').length;
  const activeMegaBlocksCount = megaBlocks.filter(b => b.status === 'active').length;

  const divLabel = selectedDivision === 'All' ? t('header.division.all') : selectedDivision;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-header)' }}>

      {/* ── Primary Header ─── deep navy + glass ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--rx-header) 0%, #0D2252 100%)',
        padding: '10px 24px',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: '1260px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
        }}>

          {/* Brand Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setPersona('planner')}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px var(--rx-orange-glow)'
            }}>
              <Train size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
                <span className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#FFFFFF' }}>
                  TrainX
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--rx-orange)' }}>.ai</span>
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '-2px' }}>
                {t('brand.tagline')}
              </div>
            </div>
          </div>

          {/* Pill Search Bar */}
          <div className="bms-search-box" style={{ flex: 1, maxWidth: '480px' }}>
            <Search size={15} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              className="bms-search-input"
              placeholder={t('nav.searchPlaceholder')}
            />
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

            {/* Division Picker */}
            <div ref={divDropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDivDropdownOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 13px', cursor: 'pointer', color: '#E0E0E0',
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-sans)'
                }}
              >
                📍 {divLabel}
                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▾</span>
              </button>
              {divDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                  background: '#0F1C3D',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px', padding: '6px',
                  minWidth: '190px', zIndex: 300,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                  animation: 'authFadeIn 0.15s ease'
                }}>
                  {['All', ...DIVISIONS].map(d => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDivision(d as 'All' | DivisionName); setDivDropdownOpen(false); }}
                      style={{
                        width: '100%', padding: '8px 12px',
                        background: selectedDivision === d ? 'rgba(255,107,26,0.15)' : 'transparent',
                        border: 'none', borderRadius: '9px', cursor: 'pointer',
                        color: selectedDivision === d ? 'var(--rx-orange)' : '#CCCCCC',
                        fontSize: '0.78rem', fontWeight: 600, textAlign: 'left',
                        fontFamily: 'var(--font-sans)', transition: 'background 0.12s'
                      }}
                      onMouseEnter={e => { if (selectedDivision !== d) (e.currentTarget.style.background = 'rgba(255,255,255,0.05)'); }}
                      onMouseLeave={e => { if (selectedDivision !== d) (e.currentTarget.style.background = 'transparent'); }}
                    >
                      {d === 'All' ? t('header.division.all') : d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persona Pill Switcher */}
            <div className="persona-switcher">
              <button
                className={`persona-btn${persona === 'planner' ? ' active' : ''}`}
                onClick={() => setPersona('planner')}
              >
                {t('header.persona.planner')}
              </button>
              <button
                className={`persona-btn${persona === 'passenger' ? ' active' : ''}`}
                onClick={() => setPersona('passenger')}
              >
                {t('header.persona.passenger')}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="lang-toggle">
              <button
                className={`lang-toggle-btn${language === 'en' ? ' active' : ''}`}
                onClick={() => setLanguage('en')}
                title="English"
              >EN</button>
              <button
                className={`lang-toggle-btn${language === 'mr' ? ' active' : ''}`}
                onClick={() => setLanguage('mr')}
                title="मराठी"
              >मराठी</button>
            </div>

            {/* Auth Area */}
            {currentUser ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 'var(--radius-pill)', padding: '4px 12px 4px 4px',
                    cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'var(--font-sans)'
                  }}
                >
                  <img
                    src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=FF6B1A&color=fff`}
                    alt={currentUser.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,107,26,0.5)' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=FF6B1A&color=fff`; }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: currentUser.role === 'official' ? '#4ABD5D' : 'var(--rx-orange)', fontWeight: 700, lineHeight: 1 }}>
                      {currentUser.role === 'official' ? t('user.roleOfficial') : t('user.roleYatri')}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', transition: 'transform 0.15s', display: 'inline-block', transform: userDropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#0F1C3D',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '8px', minWidth: '220px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                    zIndex: 300, animation: 'authFadeIn 0.15s ease'
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>{currentUser.email}</div>
                      {currentUser.officialDesignation && (
                        <div style={{ fontSize: '0.68rem', color: '#4ABD5D', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={11} /> {currentUser.officialDesignation}
                        </div>
                      )}
                      {currentUser.employeeId && (
                        <div style={{ fontSize: '0.66rem', color: '#666', marginTop: '2px' }}>ID: {currentUser.employeeId}</div>
                      )}
                    </div>
                    {[
                      { icon: <RefreshCw size={13}/>, label: t('user.switchMode'), action: () => { setPersona(persona === 'planner' ? 'passenger' : 'planner'); setUserDropdownOpen(false); } },
                      { icon: <User size={13}/>, label: t('user.accountDetails'), action: () => setUserDropdownOpen(false) },
                      { icon: <LogOut size={13}/>, label: t('user.signOut'), action: () => { logout(); setUserDropdownOpen(false); }, danger: true },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        style={{
                          width: '100%', padding: '9px 12px',
                          background: 'transparent', border: 'none', borderRadius: '9px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font-sans)',
                          color: (item as any).danger ? 'var(--rx-orange)' : '#CCCCCC',
                          textAlign: 'left', transition: 'background 0.12s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'var(--rx-orange)',
                  border: 'none', borderRadius: 'var(--radius-pill)',
                  padding: '7px 16px', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 12px var(--rx-orange-glow)'
                }}
                onMouseEnter={e => { (e.currentTarget.style.transform = 'translateY(-1px)'); (e.currentTarget.style.boxShadow = '0 6px 20px var(--rx-orange-glow)'); }}
                onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); (e.currentTarget.style.boxShadow = '0 2px 12px var(--rx-orange-glow)'); }}
              >
                <LogIn size={14} /> {t('header.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sub-header: pill nav + status strip ── */}
      <div style={{
        background: 'var(--rx-header-sub)',
        padding: '0 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{
          maxWidth: '1260px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
          padding: '6px 0'
        }}>
          {/* Pill nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
            {[
              { key: 'nav.corridors', active: true },
              { key: 'nav.megaBlocks', active: false },
              { key: 'nav.aiOptimization', active: false },
              { key: 'nav.incidents', active: false },
              { key: 'nav.fleet', active: false },
            ].map(({ key, active }) => (
              <button key={key} className={`nav-tab-button${active ? ' active' : ''}`}>
                {t(key)}
              </button>
            ))}
            <button className="nav-tab-button" style={{ color: 'var(--rx-orange)', background: 'rgba(255,107,26,0.1)' }}>
              <Zap size={11} style={{ display: 'inline' }} />
              {t('nav.kavach')}
            </button>
          </div>

          {/* Right Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
            {activeAccidentsCount > 0 && (
              <span style={{ color: 'var(--rx-orange)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={12} className="pulse-radar" />
                {activeAccidentsCount} {t('header.incidents')}
              </span>
            )}
            {activeMegaBlocksCount > 0 && (
              <span style={{ color: 'var(--rx-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CalendarClock size={12} />
                {activeMegaBlocksCount} {t('header.activeBlocks')}
              </span>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(34,197,94,0.12)', borderRadius: 'var(--radius-pill)',
              padding: '3px 10px'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rx-green)', boxShadow: '0 0 6px var(--rx-green)' }} />
              <span style={{ color: 'var(--rx-green)', fontWeight: 700, fontSize: '0.68rem' }}>
                {t('header.apiOnline')}
              </span>
            </div>
            <span style={{ color: 'var(--rx-green)', fontWeight: 600 }}>
              {t('header.efficiency')}: {metrics.afterOptimization.assetUtilizationPercent}%
            </span>
            <span className="font-mono" style={{ color: '#FFFFFF', background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.7rem' }}>
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* ── Wavy Divider ── */}
      <WavyDivider />
    </header>
  );
};
