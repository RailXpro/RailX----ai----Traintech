import React, { useState, useEffect } from 'react';
import { 
  Train, 
  ShieldAlert, 
  CalendarClock, 
  Search,
  ChevronDown
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
    selectedDivision, 
    setSelectedDivision, 
    accidents, 
    megaBlocks,
    metrics
  } = useRailway();

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

          {/* Right Controls: City/Division Dropdown & Sign In / Persona Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Division Selector */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.82rem', color: '#E0E0E0', fontWeight: 600 }}>
                {selectedDivision === 'All' ? 'National Grid' : selectedDivision}
              </span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value as 'All' | DivisionName)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Divisions (National Grid)</option>
                {DIVISIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#AAAAAA" />
            </div>

            {/* Persona Switcher Toggle */}
            <div style={{
              display: 'flex',
              background: '#222434',
              padding: '3px',
              borderRadius: '6px'
            }}>
              <button
                onClick={() => setPersona('planner')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
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
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: persona === 'passenger' ? 'var(--bms-red)' : 'transparent',
                  color: persona === 'passenger' ? '#FFFFFF' : '#AAAAAA',
                  transition: 'all 0.15s ease'
                }}
              >
                Passenger Portal
              </button>
            </div>
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
