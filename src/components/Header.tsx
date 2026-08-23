import React, { useState, useEffect, useRef } from 'react';
import { 
  Train, 
  ShieldAlert, 
  CalendarClock, 
  Search,
  ChevronDown,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { DivisionName } from '../types/railway';

const DIVISIONS: DivisionName[] = [
  'Mumbai CR',
  'Mumbai WR',
  'Delhi NR',
  'Howrah ER',
  'Chennai SR',
  'Bengaluru SWR'
];

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

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateIST = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateIST();
    const timer = setInterval(updateIST, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAccidentsCount = accidents.filter(a => a.status !== 'resolved').length;
  const activeMegaBlocksCount = megaBlocks.filter(b => b.status === 'active').length;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-header)' }}>
      {/* BookMyShow Iconic Primary Header (#333545) */}
      <div style={{
        background: 'var(--bms-header-top)',
        padding: '10px 24px',
        color: '#FFFFFF'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Brand Logo: TrainX.ai */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setPersona('planner')}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--bms-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(248, 68, 100, 0.4)'
            }}>
              <Train size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span className="font-display" style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                  TrainX
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--bms-red)' }}>
                  .ai
                </span>
              </div>
            </div>
          </div>

          {/* BookMyShow Style Search Box */}
          <div className="bms-search-box" style={{ flex: 1 }}>
            <Search size={16} color="#777777" />
            <input
              type="text"
              className="bms-search-input"
              placeholder="Search for Corridors, Trains, Mega Blocks, or Incident Alerts..."
            />
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Division Selector */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.82rem', color: '#E0E0E0', fontWeight: 600 }}>
                {selectedDivision === 'All' ? 'National Grid' : selectedDivision}
              </span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value as 'All' | DivisionName)}
                style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              >
                <option value="All">All Divisions (National Grid)</option>
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} color="#AAAAAA" />
            </div>

            {/* Persona Switcher Toggle */}
            <div style={{ display: 'flex', background: '#222434', padding: '3px', borderRadius: '6px' }}>
              <button
                onClick={() => setPersona('planner')}
                style={{
                  padding: '5px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: persona === 'planner' ? 'var(--bms-red)' : 'transparent',
                  color: persona === 'planner' ? '#FFFFFF' : '#AAAAAA',
                  transition: 'all 0.15s ease'
                }}
              >
                Planner Console
              </button>
              <button
                onClick={() => setPersona('passenger')}
                style={{
                  padding: '5px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: persona === 'passenger' ? 'var(--bms-red)' : 'transparent',
                  color: persona === 'passenger' ? '#FFFFFF' : '#AAAAAA',
                  transition: 'all 0.15s ease'
                }}
              >
                Passenger Portal
              </button>
            </div>

            {/* ── Auth Area ── */}
            {currentUser ? (
              /* Logged-in User Chip */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px', padding: '4px 12px 4px 4px',
                    cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=F84464&color=fff`}
                    alt={currentUser.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=F84464&color=fff`; }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: currentUser.role === 'official' ? '#4ABD5D' : '#F84464', fontWeight: 600, lineHeight: 1 }}>
                      {currentUser.role === 'official' ? '🛡 Official' : '🚆 Yatri'}
                    </div>
                  </div>
                  <ChevronDown size={13} color="#AAAAAA" style={{ transition: 'transform 0.15s', transform: userDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#1a1c2a', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '8px', minWidth: '220px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                    zIndex: 200, animation: 'authFadeIn 0.15s ease'
                  }}>
                    {/* User info */}
                    <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>{currentUser.email}</div>
                      {currentUser.officialDesignation && (
                        <div style={{ fontSize: '0.68rem', color: '#4ABD5D', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={11} />
                          {currentUser.officialDesignation}
                        </div>
                      )}
                      {currentUser.employeeId && (
                        <div style={{ fontSize: '0.66rem', color: '#666', marginTop: '2px' }}>ID: {currentUser.employeeId}</div>
                      )}
                    </div>

                    {/* Actions */}
                    {[
                      { icon: <RefreshCw size={13}/>, label: 'Switch Mode', action: () => { setPersona(persona === 'planner' ? 'passenger' : 'planner'); setUserDropdownOpen(false); }},
                      { icon: <User size={13}/>, label: 'Account Details', action: () => setUserDropdownOpen(false) },
                      { icon: <LogOut size={13}/>, label: 'Sign Out', action: () => { logout(); setUserDropdownOpen(false); }, danger: true },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        style={{
                          width: '100%', padding: '9px 12px',
                          background: 'transparent', border: 'none',
                          borderRadius: '7px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          fontSize: '0.78rem', fontWeight: 600,
                          color: (item as any).danger ? '#F84464' : '#CCCCCC',
                          textAlign: 'left', transition: 'background 0.12s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Sign-In Button */
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'var(--bms-red)', border: 'none',
                  borderRadius: '7px', padding: '7px 14px',
                  color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: '0 2px 10px rgba(248,68,100,0.35)'
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <LogIn size={14} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BookMyShow Secondary Sub-Header Strip (#222434) */}
      <div style={{
        background: 'var(--bms-header-sub)',
        padding: '6px 24px',
        color: '#E0E0E0',
        fontSize: '0.78rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Navigation Links in BookMyShow style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}>
              Corridors
            </span>
            <span style={{ color: '#CCCCCC', cursor: 'pointer' }}>
              Mega Blocks
            </span>
            <span style={{ color: '#CCCCCC', cursor: 'pointer' }}>
              AI Optimization
            </span>
            <span style={{ color: '#CCCCCC', cursor: 'pointer' }}>
              Incident Feed
            </span>
            <span style={{ color: '#CCCCCC', cursor: 'pointer' }}>
              Fleet Telemetry
            </span>
            <span style={{ color: 'var(--bms-red)', fontWeight: 600, cursor: 'pointer' }}>
              Kavach 2.0 Live
            </span>
          </div>

          {/* Right Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem' }}>
            {activeAccidentsCount > 0 && (
              <span style={{ color: 'var(--bms-red)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={13} className="pulse-radar" />
                {activeAccidentsCount} Critical Incident(s)
              </span>
            )}
            {activeMegaBlocksCount > 0 && (
              <span style={{ color: '#FFAA00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CalendarClock size={13} />
                {activeMegaBlocksCount} Active Mega Block(s)
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(74, 189, 93, 0.15)', border: '1px solid rgba(74, 189, 93, 0.4)', padding: '2px 8px', borderRadius: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ABD5D', boxShadow: '0 0 6px #4ABD5D' }} />
              <span style={{ color: '#4ABD5D', fontWeight: 700, fontSize: '0.7rem' }}>
                Vercel API: Online (24ms)
              </span>
            </div>
            <span style={{ color: '#4ABD5D', fontWeight: 600 }}>
              Efficiency: {metrics.afterOptimization.assetUtilizationPercent}%
            </span>
            <span className="font-mono" style={{ color: '#FFFFFF', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              {currentTime}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
