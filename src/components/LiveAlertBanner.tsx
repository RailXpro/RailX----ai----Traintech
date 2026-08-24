import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, PhoneCall, Volume2, Compass, Radio } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';
import { playEmergencyAlertSound, stopEmergencyAlertSound } from '../utils/audioAlert';

export const LiveAlertBanner: React.FC<{ onNavigateToIncidents?: () => void }> = ({ onNavigateToIncidents }) => {
  const { accidents, megaBlocks, persona, openTripPlanner, setActiveTab } = useRailway();
  const { t, localize } = useLanguage();
  const [activeSirenId, setActiveSirenId] = useState<string | null>(null);

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active');

  const handleSirenToggle = (incidentId: string) => {
    if (activeSirenId === incidentId) {
      stopEmergencyAlertSound();
      setActiveSirenId(null);
    } else {
      const started = playEmergencyAlertSound();
      if (started) {
        setActiveSirenId(incidentId);
        setTimeout(() => {
          setActiveSirenId((current) => (current === incidentId ? null : current));
        }, 2500);
      }
    }
  };

  if (activeAccidents.length === 0 && activeMegaBlocks.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* High-Priority Emergency Accident Alert */}
      {activeAccidents.map(incident => {
        const isSirenPlaying = activeSirenId === incident.id;
        const helplineNumber = incident.passengerAssistanceContact?.replace(/[^0-9]/g, '') || '139';

        return (
          <div
            key={incident.id}
            className="bms-card"
            style={{
              background: 'var(--rx-red-light)',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              borderLeft: '5px solid var(--rx-red)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'visible',
            }}
          >
            {/* Top row: icon + text content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'var(--rx-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', flexShrink: 0,
                boxShadow: '0 2px 10px rgba(225, 29, 72, 0.35)'
              }}>
                <ShieldAlert size={20} className="pulse-radar" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Badge + time */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className="badge badge-accident" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    {t('alert.critical')}: {localize(incident.natureOfIncident).toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {t('alert.reported')}: {incident.reportedAt}
                  </span>
                </div>

                {/* Train title */}
                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-dark)', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.35, marginBottom: '3px' }}>
                  {t('alert.train')} #{incident.trainNumber} ({localize(incident.trainName)})
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', wordBreak: 'break-word' }}>
                  {localize(incident.sectionName)}
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-body)', lineHeight: 1.45, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {localize(incident.description)} • <strong style={{ color: 'var(--text-dark)' }}>{t('alert.relief')}: {localize(incident.reliefTrainStatus)}</strong> ({incident.reliefTrainId || 'Dispatching'})
                </p>
              </div>
            </div>

            {/* Bottom row: action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
              {/* Siren Audio Alert Button */}
              <button
                type="button"
                onClick={() => handleSirenToggle(incident.id)}
                className={`btn ${isSirenPlaying ? 'btn-emergency' : 'btn-secondary'}`}
                title={isSirenPlaying ? 'Stop Emergency Siren' : 'Play Emergency Siren'}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.78rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  color: isSirenPlaying ? '#FFFFFF' : 'var(--rx-red)',
                  borderColor: 'rgba(225, 29, 72, 0.35)'
                }}
              >
                {isSirenPlaying ? (
                  <>
                    <Radio size={14} className="pulse-radar" />
                    <span>{t('alert.sirenActive')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} color="var(--rx-red)" />
                    <span>{t('alert.siren')}</span>
                  </>
                )}
              </button>

              {/* 139 RailMadad Emergency Helpline Clickable Call Button */}
              <a
                href={`tel:${helplineNumber}`}
                className="btn"
                title={`Call Indian Railways RailMadad Helpline ${incident.passengerAssistanceContact || '139'}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
              >
                <PhoneCall size={14} color="#FFFFFF" />
                <span>Helpline: {incident.passengerAssistanceContact || '139'}</span>
              </a>

              {/* Persona Contextual Actions */}
              {persona === 'passenger' ? (
                <button
                  type="button"
                  onClick={() => openTripPlanner(incident.sectionName, '')}
                  className="btn btn-secondary"
                  title="Find diverted routes or alternate metro/bus services"
                  style={{
                    padding: '7px 14px',
                    fontSize: '0.78rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    color: 'var(--rx-blue)',
                    borderColor: 'rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <Compass size={14} color="var(--rx-blue)" />
                  <span>{t('alert.alternateRoute')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToIncidents) {
                      onNavigateToIncidents();
                    } else {
                      setActiveTab('accidents');
                    }
                  }}
                  className="btn btn-emergency"
                  style={{ fontSize: '0.78rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{t('alert.manageIncident')}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Active Mega Block Alert */}
      {activeMegaBlocks.map(block => (
        <div
          key={block.id}
          className="bms-card"
          style={{
            background: 'var(--rx-amber-light)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            borderLeft: '5px solid var(--rx-amber)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'visible',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--rx-amber)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', flexShrink: 0
            }}>
              <AlertTriangle size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-megablock" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                  {t('alert.activeMegaBlock')} • {localize(block.linesAffected)}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {block.startTime} – {block.endTime} ({localize(block.division)})
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {localize(block.sectionName)}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px', wordBreak: 'break-word' }}>
                {localize(block.reason)}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {localize(block.publicAdvisory)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

