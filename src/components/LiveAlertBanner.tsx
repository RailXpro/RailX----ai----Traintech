import React from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, PhoneCall, Volume2 } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { playEmergencyAlertSound } from '../utils/audioAlert';

export const LiveAlertBanner: React.FC<{ onNavigateToIncidents?: () => void }> = ({ onNavigateToIncidents }) => {
  const { accidents, megaBlocks, persona } = useRailway();

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active');

  if (activeAccidents.length === 0 && activeMegaBlocks.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* High-Priority Emergency Accident Alert */}
      {activeAccidents.map(incident => (
        <div
          key={incident.id}
          className="bms-card"
          style={{
            background: 'var(--bms-red-light)',
            borderColor: 'var(--bms-red-border)',
            borderLeft: '5px solid var(--bms-red)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--bms-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ShieldAlert size={20} className="pulse-radar" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge badge-accident">
                  CRITICAL: {incident.natureOfIncident.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Reported: {incident.reportedAt}
                </span>
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                Train #{incident.trainNumber} ({incident.trainName}) on {incident.sectionName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {incident.description} • <strong>Relief: {incident.reliefTrainStatus}</strong> ({incident.reliefTrainId || 'Dispatching'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => playEmergencyAlertSound()}
              className="btn btn-secondary"
              title="Play Siren"
              style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--bms-red)' }}
            >
              <Volume2 size={14} color="var(--bms-red)" />
              Siren
            </button>

            {persona === 'passenger' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 14px', borderRadius: '6px', border: '1px solid #E0E0E0' }}>
                <PhoneCall size={14} color="#2e7d32" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: 700 }}>Helpline: 139</span>
              </div>
            ) : (
              <button
                onClick={onNavigateToIncidents}
                className="btn btn-emergency"
                style={{ fontSize: '0.82rem', padding: '7px 16px' }}
              >
                Manage Incident & ART
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Active Mega Block Alert */}
      {activeMegaBlocks.map(block => (
        <div
          key={block.id}
          className="bms-card"
          style={{
            background: 'var(--bms-amber-light)',
            borderColor: '#fed7aa',
            borderLeft: '5px solid var(--bms-amber)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--bms-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-megablock" style={{ fontSize: '0.68rem' }}>
                  ACTIVE MEGA BLOCK • {block.linesAffected}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Time Window: {block.startTime} – {block.endTime} ({block.division})
                </span>
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>
                {block.sectionName} — {block.reason}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {block.publicAdvisory}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
