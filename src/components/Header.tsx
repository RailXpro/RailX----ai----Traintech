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
  Zap,
  Settings,
  Bell,
  LifeBuoy
} from 'lucide-react';
import { SettingsPanel } from './settings/SettingsPanel';
import { KavachModal } from './planner/KavachModal';
import { GlobalSearchBar } from './search/GlobalSearchBar';
import { NotificationsDrawer } from './notifications/NotificationsDrawer';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { DivisionName } from '../types/railway';

const DIVISIONS: DivisionName[] = [
  'Mumbai CR', 'Mumbai WR', 'Delhi NR', 'Howrah ER', 'Chennai SR', 'Bengaluru SWR'
];

/* ── Wavy SVG divider (header → page) ────────────────────────────────── */
const WavyDivider: React.FC = () => (
  <div className="wavy-divider-container" style={{ lineHeight: 0, background: 'var(--rx-header-sub)' }}>
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
    metrics,
    activeTab,
    setActiveTab,
    setIsKavachModalOpen,
    setIsProblemModalOpen,
    problemReports
  } = useRailway();

  const { language, setLanguage, t } = useLanguage();
  const {
    notificationsDrawerOpen,
    setNotificationsDrawerOpen,
    settingsModalOpen,
    setSettingsModalOpen
  } = useSettings();

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
  const activeSosReports      = problemReports.filter(p => p.severity === 'CRITICAL_SOS' && p.status !== 'RESOLVED').length;
  const totalBellCount = activeAccidentsCount + activeMegaBlocksCount + activeSosReports;

  const divLabel = selectedDivision === 'All' ? t('header.division.all') : selectedDivision;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-header)' }}>

      {/* ── Primary Header ─── deep navy + glass ── */}
      <div className="header-primary-inner" style={{
        background: 'linear-gradient(135deg, var(--rx-header) 0%, #0D2252 100%)',
        padding: '10px 24px',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="header-main-bar" style={{
          maxWidth: '1260px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>

          {/* Brand Logo */}
          <div
            className="header-brand-wrap"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setPersona('planner')}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px var(--rx-green-glow)'
            }}>
              <Train size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
                <span className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                  Train<span style={{ color: '#34D399' }}>X</span>
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '-2px' }}>
                {t('brand.tagline')}
              </div>
            </div>
          </div>

          {/* Global Smart Search Bar */}
          <div className="header-search-wrap">
            <GlobalSearchBar />
          </div>

          {/* Right Controls */}
          <div className="header-controls-wrap" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsDrawerOpen(true)}
              title={language === 'mr' ? 'सूचना' : 'Notifications'}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#FFFFFF',
                transition: 'all 0.18s ease', flexShrink: 0,
                position: 'relative'
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(5, 150, 105, 0.4)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }}
            >
              <Bell size={16} style={{ animation: activeSosReports > 0 ? 'pulse 1s infinite' : undefined }} />
              {totalBellCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  borderRadius: '8px',
                  background: (activeAccidentsCount > 0 || activeSosReports > 0) ? '#EF4444' : 'var(--rx-orange)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: activeSosReports > 0 ? '0 0 8px #EF4444' : '0 2px 6px rgba(0,0,0,0.35)',
                  border: '1.5px solid var(--rx-header)',
                  animation: activeSosReports > 0 ? 'pulse 1s infinite' : undefined
                }}>
                  {totalBellCount}
                </span>
              )}
            </button>

            {/* Settings Gear — always visible, even on mobile */}
            <button
              onClick={() => setSettingsModalOpen(true)}
              title={language === 'mr' ? 'सेटिंग्ज' : 'Settings'}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#FFFFFF',
                transition: 'all 0.18s ease', flexShrink: 0
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'var(--rx-orange)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }}
            >
              <Settings size={16} />
            </button>

            {/* Division Picker */}
            <div ref={divDropRef} className="header-secondary-control" style={{ position: 'relative' }}>
              <button
                onClick={() => setDivDropdownOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 10px', cursor: 'pointer', color: '#E0E0E0',
                  fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap'
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
            <div className="persona-switcher header-secondary-control">
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
            <div className="lang-toggle header-secondary-control">
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

            {/* Auth Area — Always pinned & visible */}
            {currentUser ? (
              <div ref={dropdownRef} className="header-auth-btn" style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setUserDropdownOpen(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 'var(--radius-pill)', padding: '4px 10px 4px 4px',
                    cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'var(--font-sans)'
                  }}
                >
                  <img
                    src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=FF6B1A&color=fff`}
                    alt={currentUser.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,107,26,0.5)' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=FF6B1A&color=fff`; }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.name.split(' ')[0]}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', transition: 'transform 0.15s', display: 'inline-block', transform: userDropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#0F1C3D',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px', padding: '8px', minWidth: '220px', maxWidth: 'min(280px, 90vw)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                    zIndex: 300, animation: 'authFadeIn 0.15s ease'
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', wordBreak: 'break-word' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#A0AEC0', marginTop: '2px', wordBreak: 'break-word' }}>{currentUser.email}</div>
                      {currentUser.officialDesignation && (
                        <div style={{ fontSize: '0.68rem', color: '#4ABD5D', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          <ShieldCheck size={11} style={{ flexShrink: 0 }} /> <span>{currentUser.officialDesignation}</span>
                        </div>
                      )}
                      {currentUser.employeeId && (
                        <div style={{ fontSize: '0.66rem', color: '#718096', marginTop: '2px' }}>ID: {currentUser.employeeId}</div>
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
                className="header-auth-btn"
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'var(--rx-orange)',
                  border: 'none', borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 12px var(--rx-orange-glow)', flexShrink: 0
                }}
                onMouseEnter={e => { (e.currentTarget.style.transform = 'translateY(-1px)'); (e.currentTarget.style.boxShadow = '0 6px 20px var(--rx-orange-glow)'); }}
                onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); (e.currentTarget.style.boxShadow = '0 2px 12px var(--rx-orange-glow)'); }}
              >
                <LogIn size={13} /> {t('header.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sub-header: pill nav + status strip ── */}
      <div className="header-sub-inner" style={{
        background: 'var(--rx-header-sub)',
        padding: '0 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{
          maxWidth: '1260px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px',
          padding: '6px 0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Pill nav links */}
          <div className="nav-tabs-container" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {[
              { key: 'nav.corridors', tabId: 'map' },
              { key: 'nav.megaBlocks', tabId: 'megablock' },
              { key: 'nav.aiOptimization', tabId: 'optimizer' },
              { key: 'nav.incidents', tabId: 'accidents' },
              { key: 'nav.fleet', tabId: 'analytics' },
            ].map(({ key, tabId }) => {
              const isActive = persona === 'planner' && activeTab === tabId;
              return (
                <button
                  key={key}
                  className={`nav-tab-button${isActive ? ' active' : ''}`}
                  onClick={() => {
                    setPersona('planner');
                    setActiveTab(tabId);
                  }}
                  style={{
                    cursor: 'pointer',
                    background: isActive ? 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    fontWeight: isActive ? 800 : 500,
                    boxShadow: isActive ? '0 2px 10px var(--rx-green-glow)' : 'none',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  {t(key)}
                </button>
              );
            })}
            <button
              className="nav-tab-button"
              onClick={() => setIsKavachModalOpen(true)}
              style={{
                color: '#34D399',
                background: 'rgba(16,185,129,0.14)',
                border: '1px solid rgba(16,185,129,0.3)',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--rx-green)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(16,185,129,0.14)';
                e.currentTarget.style.color = '#34D399';
              }}
            >
              <Zap size={12} style={{ display: 'inline' }} />
              {t('nav.kavach')}
            </button>

            <button
              className="nav-tab-button"
              onClick={() => setIsProblemModalOpen(true)}
              style={{
                color: '#FFB27A',
                background: 'rgba(234,88,12,0.16)',
                border: '1px solid rgba(234,88,12,0.35)',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--rx-orange)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(234,88,12,0.16)';
                e.currentTarget.style.color = '#FFB27A';
              }}
            >
              <LifeBuoy size={12} style={{ display: 'inline' }} />
              {language === 'mr' ? '🚨 रेल मदद / तक्रार' : '🚨 RailMadad / Report Issue'}
              {problemReports.filter(r => r.status !== 'RESOLVED').length > 0 && (
                <span style={{
                  background: 'var(--rx-red)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0 5px',
                  fontSize: '0.62rem',
                  fontWeight: 900
                }}>
                  {problemReports.filter(r => r.status !== 'RESOLVED').length}
                </span>
              )}
            </button>
          </div>

          {/* Right Status — hidden on mobile via .header-status-strip */}
          <div className="header-status-strip" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', flexShrink: 0, flexWrap: 'wrap' }}>
            {activeAccidentsCount > 0 && (
              <span
                onClick={() => { setPersona('planner'); setActiveTab('accidents'); }}
                style={{ color: 'var(--rx-orange)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <ShieldAlert size={12} className="pulse-radar" />
                {activeAccidentsCount} {t('header.incidents')}
              </span>
            )}
            {activeMegaBlocksCount > 0 && (
              <span
                onClick={() => { setPersona('planner'); setActiveTab('megablock'); }}
                style={{ color: 'var(--rx-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
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

      {/* ── Settings Drawer ── */}
      <SettingsPanel isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />

      {/* ── Notifications Center Drawer ── */}
      <NotificationsDrawer isOpen={notificationsDrawerOpen} onClose={() => setNotificationsDrawerOpen(false)} />

      {/* ── Kavach 2.0 Telemetry Modal ── */}
      <KavachModal />
    </header>
  );
};
