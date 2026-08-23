import React, { useState } from 'react';
import { 
  CalendarClock, 
  ShieldAlert, 
  Search, 
  Bus, 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { LiveAlertBanner } from '../LiveAlertBanner';
import { SimulationControls } from '../SimulationControls';

export const PassengerPortal: React.FC = () => {
  const { megaBlocks, accidents, selectedDivision } = useRailway();

  const [searchOrigin, setSearchOrigin] = useState<string>('CSMT Mumbai');
  const [searchDest, setSearchDest] = useState<string>('Kalyan Junction');
  const [searched, setSearched] = useState<boolean>(true);

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active' || b.status === 'scheduled');

  const filteredBlocks = activeMegaBlocks.filter(b => 
    selectedDivision === 'All' || b.division === selectedDivision
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Simulation Bar */}
      <SimulationControls />

      {/* Emergency Alerts Banner */}
      <LiveAlertBanner />

      {/* BookMyShow Style Passenger Hero Card */}
      <div
        className="bms-card"
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, #333545 0%, #222434 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge" style={{ background: 'var(--bms-red)', color: '#FFFFFF', fontSize: '0.72rem' }}>
              TRAINX.AI • COMMUTER LIVE PORTAL
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.72rem' }}>
              SUNDAY MEGA BLOCK RADAR
            </span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Live Sunday Mega Block & Disruption Bulletins
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#D0D5DD', lineHeight: '1.6' }}>
            Stay ahead of planned maintenance diversions, track possessions, and real-time safety advisories. Plan smooth commutes with TrainX.ai smart rerouting.
          </p>

          {/* Quick Helplines Strip */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '18px' }}>
            <a
              href="tel:139"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bms-red)',
                padding: '8px 18px',
                borderRadius: '6px',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(248, 68, 100, 0.4)'
              }}
            >
              <PhoneCall size={14} />
              139 (24x7 RailMadad Helpline)
            </a>
            <span style={{ fontSize: '0.82rem', color: '#E0E0E0' }}>
              GRP Emergency: <strong style={{ color: '#FFFFFF' }}>1512</strong>
            </span>
            <span style={{ fontSize: '0.82rem', color: '#E0E0E0' }}>
              Women Safety: <strong style={{ color: '#FFFFFF' }}>182</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Smart Alternate Journey Route Finder */}
      <div className="bms-card" style={{ padding: '24px' }}>
        <h3 className="bms-section-title" style={{ fontSize: '1.18rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--bms-red)" />
          AI Smart Disruption-Aware Journey Planner
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Find the fastest suburban and express route accounting for active Sunday mega blocks
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Origin Station
            </label>
            <input
              type="text"
              className="input-control"
              value={searchOrigin}
              onChange={(e) => setSearchOrigin(e.target.value)}
              placeholder="e.g. CSMT Mumbai, Churchgate, Dadar"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Destination Station
            </label>
            <input
              type="text"
              className="input-control"
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              placeholder="e.g. Kalyan, Borivali, Virar"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setSearched(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 18px', borderRadius: '6px' }}
            >
              <Search size={16} />
              Find Best Route
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Recommended Option 1: Diverted Fast Local */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderLeft: '5px solid var(--bms-green)',
              borderRadius: '8px',
              padding: '18px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                    RECOMMENDED (AI OPTIMIZED)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Departing in 6 mins • 98% On-Time Probability
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: '#2e7d32', fontWeight: 800 }}>
                  Est. Travel Time: 58 mins
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                Train #95401: CSMT to Kalyan Fast Local (15-Car Rake)
              </h4>

              <div style={{ background: 'var(--bms-amber-light)', border: '1px solid #fed7aa', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', color: '#b7791f', marginBottom: '10px', lineHeight: '1.45' }}>
                ℹ️ <strong>Block Diversion Advisory:</strong> Diverted to Fast Line between Thane & Dadar to bypass track tamping. Skipping halts at Vidyavihar and Kanjurmarg. Slow line season pass valid.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>From: <strong>CSMT Platform 4</strong> (14:30)</span>
                  <ArrowRight size={13} color="#999999" />
                  <span>To: <strong>Kalyan Platform 3</strong> (15:28)</span>
                </div>
                <button className="btn btn-primary" style={{ padding: '5px 14px', fontSize: '0.75rem' }}>
                  Select Train
                </button>
              </div>
            </div>

            {/* Multimodal Metro / Feeder Bus Link Alternative */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderLeft: '5px solid var(--bms-cyan)',
              borderRadius: '8px',
              padding: '18px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                  MULTIMODAL METRO + BEST BUS SHUTTLE
                </span>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: '#0369A1', fontWeight: 800 }}>
                  Est. Travel Time: 64 mins
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                Metro Line 3 / Line 4 + Municipal Feeder Bus Shuttle
              </h4>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Take Metro from CSMT to Ghatkopar, transfer to special BEST mega block feeder bus route #F-18 running every 5 mins directly to Thane / Kalyan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming & Active Mega Blocks Bulletin for Commuters */}
      <div className="bms-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bms-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7791f' }}>
              <CalendarClock size={20} />
            </div>
            <div>
              <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
                Live Mega Block Bulletins & Maintenance Schedule
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Official disruption bulletin for suburban commuters & long-distance passengers
              </p>
            </div>
          </div>

          <span className="badge badge-megablock" style={{ fontSize: '0.7rem' }}>
            {filteredBlocks.length} Active / Scheduled Blocks
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredBlocks.map(block => (
            <div
              key={block.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderTop: `4px solid ${block.status === 'active' ? 'var(--bms-amber)' : 'var(--bms-cyan)'}`,
                borderRadius: '8px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 600 }}>
                    {block.division}
                  </span>
                  <span className={`badge ${block.status === 'active' ? 'badge-megablock' : 'badge-cyan'}`} style={{ fontSize: '0.62rem' }}>
                    {block.status === 'active' ? 'IN PROGRESS NOW' : 'UPCOMING'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  {block.sectionName}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#b7791f', marginBottom: '10px' }}>
                  <Clock size={13} />
                  <span>{block.date} • <strong>{block.startTime} – {block.endTime}</strong></span>
                </div>

                <div style={{ background: '#F8F8FB', padding: '10px 12px', borderRadius: '6px', fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '10px', border: '1px solid var(--border-light)' }}>
                  <div><strong>Lines Affected:</strong> {block.linesAffected}</div>
                  <div><strong>Maintenance Work:</strong> {block.reason}</div>
                </div>

                <p style={{ fontSize: '0.76rem', color: '#555555', lineHeight: '1.45' }}>
                  📢 {block.publicAdvisory}
                </p>
              </div>

              {block.alternativeBusServices && (
                <div style={{ background: 'var(--bms-green-light)', border: '1px solid #c8e6c9', padding: '8px 12px', borderRadius: '6px', fontSize: '0.73rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bus size={13} />
                  <span>{block.alternativeBusServices}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Incident Advisory Feed for Commuters */}
      <div className="bms-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bms-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
              Safety Bulletins & Emergency Assistance
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Real-time safety status and emergency help contact points
            </p>
          </div>
        </div>

        {activeAccidents.length === 0 ? (
          <div style={{ background: 'var(--bms-green-light)', border: '1px solid #c8e6c9', padding: '18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={24} color="#2e7d32" />
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#2e7d32' }}>
                All Rail Corridors Operating Normal with Kavach Safety Interlocks
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                No active emergency accidents or safety halts reported across Indian Railways network.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAccidents.map(inc => (
              <div
                key={inc.id}
                style={{
                  background: 'var(--bms-red-light)',
                  border: '1px solid var(--bms-red-border)',
                  borderLeft: '5px solid var(--bms-red)',
                  borderRadius: '8px',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-accident" style={{ fontSize: '0.65rem' }}>
                    EMERGENCY INCIDENT • {inc.natureOfIncident.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Reported at {inc.reportedAt}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Train #{inc.trainNumber} ({inc.trainName}) — {inc.sectionName}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.45' }}>
                  {inc.publicEmergencyAdvisory}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.75rem', borderTop: '1px solid var(--bms-red-border)', paddingTop: '10px' }}>
                  <span style={{ color: '#2e7d32', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PhoneCall size={12} />
                    Helpline: {inc.passengerAssistanceContact}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Relief Team: <strong>{inc.reliefTrainStatus}</strong> ({inc.reliefTrainId})
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Expected Normalcy: <strong>{inc.estimatedTrackRestoration}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
