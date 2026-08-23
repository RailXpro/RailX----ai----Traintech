import React from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, PhoneCall, Volume2 } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';
import { playEmergencyAlertSound } from '../utils/audioAlert';

export const LiveAlertBanner: React.FC<{ onNavigateToIncidents?: () => void }> = ({ onNavigateToIncidents }) => {
  const { accidents, megaBlocks, persona } = useRailway();
  const { t, localize } = useLanguage();

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
            background: 'var(--rx-red-light)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            borderLeft: '5px solid var(--rx-red)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--rx-red)',
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
                  {t('alert.critical')}: {localize(incident.natureOfIncident).toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {t('alert.reported')}: {incident.reportedAt}
                </span>
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {t('alert.train')} #{incident.trainNumber} ({localize(incident.trainName)}) — {localize(incident.sectionName)}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {localize(incident.description)} • <strong>{t('alert.relief')}: {localize(incident.reliefTrainStatus)}</strong> ({incident.reliefTrainId || 'Dispatching'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => playEmergencyAlertSound()}
              className="btn btn-secondary"
              title="Play Siren"
              style={{ padding: '7px 14px', fontSize: '0.78rem', color: 'var(--rx-red)' }}
            >
              <Volume2 size={14} color="var(--rx-red)" />
              {t('alert.siren')}
            </button>

            {persona === 'passenger' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-medium)' }}>
                <PhoneCall size={14} color="var(--rx-green)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: 700 }}>{t('alert.helpline')}</span>
              </div>
            ) : (
              <button
                onClick={onNavigateToIncidents}
                className="btn btn-emergency"
                style={{ fontSize: '0.82rem', padding: '8px 18px' }}
              >
                {t('alert.manageIncident')}
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
            background: 'var(--rx-amber-light)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            borderLeft: '5px solid var(--rx-amber)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--rx-amber)',
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
                  {t('alert.activeMegaBlock')} • {localize(block.linesAffected)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {t('alert.timeWindow')}: {block.startTime} – {block.endTime} ({localize(block.division)})
                </span>
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>
                {localize(block.sectionName)} — {localize(block.reason)}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {localize(block.publicAdvisory)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
