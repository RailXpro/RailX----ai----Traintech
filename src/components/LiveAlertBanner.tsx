import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert, AlertTriangle, ChevronRight, PhoneCall,
  Volume2, Compass, Radio, LifeBuoy, Clock, Zap, CheckCircle2
} from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { playEmergencyAlertSound, stopEmergencyAlertSound } from '../utils/audioAlert';

export const LiveAlertBanner: React.FC<{ onNavigateToIncidents?: () => void }> = ({ onNavigateToIncidents }) => {
  const {
    accidents, megaBlocks, problemReports,
    persona, openTripPlanner, setActiveTab, setIsProblemModalOpen
  } = useRailway();
  const { t, localize } = useLanguage();
  const { addToast, setNotificationsDrawerOpen } = useSettings();

  const [activeSirenId, setActiveSirenId] = useState<string | null>(null);
  const [dismissedSosIds, setDismissedSosIds] = useState<Set<string>>(new Set());
  const prevProblemCount = useRef(problemReports.length);
  const seenSosIds = useRef<Set<string>>(
    new Set(problemReports.filter(p => p.severity === 'CRITICAL_SOS').map(p => p.id))
  );

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active');

  // SOS problem reports (CRITICAL_SOS)
  const activeSosReports = problemReports.filter(
    p => p.severity === 'CRITICAL_SOS' && p.status !== 'RESOLVED' && !dismissedSosIds.has(p.id)
  );

  // Active / freshly filed problem reports (HIGH, MEDIUM, LOW or just now)
  const activeGeneralReports = problemReports.filter(
    p => p.severity !== 'CRITICAL_SOS' && (p.timestamp === 'Just now' || p.status !== 'RESOLVED') && !dismissedSosIds.has(p.id)
  );

  // Watch for NEW SOS reports and auto-open notification drawer in passenger view
  useEffect(() => {
    if (problemReports.length > prevProblemCount.current) {
      const newReports = problemReports.filter(p => !seenSosIds.current.has(p.id));
      newReports.forEach(report => {
        seenSosIds.current.add(report.id);

        if (report.severity === 'CRITICAL_SOS') {
          if (persona === 'passenger') {
            setTimeout(() => setNotificationsDrawerOpen(true), 600);
          }
          addToast({
            type: 'emergency',
            category: 'sos',
            title: `🆘 SOS EMERGENCY — ${report.id}`,
            message: `CRITICAL: ${report.title} • AI escalated to Section Controller. Relief team alerted.`
          });
        } else if (report.severity === 'HIGH') {
          addToast({
            type: 'warning',
            category: 'system',
            title: `🚨 High Priority Report — ${report.id}`,
            message: `${report.title} filed. Assigned to divisional maintenance queue.`
          });
        }
      });
    }
    prevProblemCount.current = problemReports.length;
  }, [problemReports, persona, addToast, setNotificationsDrawerOpen]);

  const handleSirenToggle = (incidentId: string) => {
    if (activeSirenId === incidentId) {
      stopEmergencyAlertSound();
      setActiveSirenId(null);
    } else {
      const started = playEmergencyAlertSound();
      if (started) {
        setActiveSirenId(incidentId);
        setTimeout(() => {
          setActiveSirenId(current => current === incidentId ? null : current);
        }, 2500);
      }
    }
  };

  const dismissSos = (id: string) => setDismissedSosIds(prev => new Set([...prev, id]));

  if (
    activeAccidents.length === 0 &&
    activeMegaBlocks.length === 0 &&
    activeSosReports.length === 0 &&
    activeGeneralReports.length === 0
  ) {
    return null;
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* ── SOS Problem Report Banners (High-Contrast Theme-Safe Emergency Card) ────────────── */}
      {activeSosReports.map(report => (
        <div
          key={report.id}
          className="bms-card"
          style={{
            background: 'var(--rx-surface)',
            border: '1.5px solid rgba(225, 29, 72, 0.4)',
            borderLeft: '6px solid var(--rx-red)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px 20px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'var(--rx-red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', flexShrink: 0,
              boxShadow: '0 2px 10px rgba(225, 29, 72, 0.4)'
            }}>
              <Zap size={22} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Badges strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-accident" style={{ fontSize: '0.68rem', fontWeight: 900, whiteSpace: 'nowrap' }}>
                  🆘 SOS EMERGENCY
                </span>
                <span style={{
                  fontSize: '0.74rem', fontWeight: 800,
                  fontFamily: 'var(--font-mono)', color: 'var(--rx-red)'
                }}>
                  Ref: {report.id}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {report.timestamp}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.05rem', fontWeight: 800,
                color: 'var(--text-dark)', marginBottom: '5px',
                wordBreak: 'break-word', lineHeight: 1.35
              }}>
                {report.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '0.84rem', color: 'var(--text-body)',
                lineHeight: 1.55, wordBreak: 'break-word', margin: '0 0 6px 0'
              }}>
                {report.description}
              </p>

              {/* Location and Train */}
              {report.stationOrSection && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>📍 <strong>Location:</strong> {report.stationOrSection}</span>
                  {report.trainNumber && <span>• 🚆 <strong>Train:</strong> #{report.trainNumber}</span>}
                </div>
              )}
            </div>

            {/* Top right dismiss button */}
            <button
              onClick={() => dismissSos(report.id)}
              title="Dismiss Alert Banner"
              style={{
                background: 'var(--rx-surface-alt)', border: '1px solid var(--border-light)',
                color: 'var(--text-muted)', fontSize: '0.9rem',
                cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
                lineHeight: 1, fontWeight: 700
              }}
            >
              ✕
            </button>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <a
              href="tel:139"
              className="btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#FFFFFF', padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)'
              }}
            >
              <PhoneCall size={14} color="#FFFFFF" />
              <span>Helpline: 139</span>
            </a>

            <button
              onClick={() => setIsProblemModalOpen(true)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700,
                color: 'var(--rx-red)', borderColor: 'rgba(225, 29, 72, 0.35)',
                background: 'var(--rx-surface)'
              }}
            >
              <LifeBuoy size={14} />
              <span>Track Grievance Status</span>
            </button>

            <button
              onClick={() => setNotificationsDrawerOpen(true)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700,
                color: 'var(--text-dark)', borderColor: 'var(--border-medium)',
                background: 'var(--rx-surface)'
              }}
            >
              <span>View All Notifications →</span>
            </button>
          </div>

          {/* AI Action Status Strip */}
          {report.actionTaken && (
            <div style={{
              marginTop: '12px',
              background: 'var(--rx-surface-alt)',
              border: '1px solid rgba(225, 29, 72, 0.25)',
              borderRadius: 'var(--radius-xs)',
              padding: '10px 14px',
              fontSize: '0.78rem', color: 'var(--text-dark)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Radio size={14} color="var(--rx-red)" style={{ flexShrink: 0 }} />
              <span><strong style={{ color: 'var(--rx-red)' }}>AI Real-time Action:</strong> {report.actionTaken}</span>
            </div>
          )}
        </div>
      ))}

      {/* ── Active Problem & Grievance Report Banners ─────────────────────────── */}
      {activeGeneralReports.map(report => {
        const isHigh = report.severity === 'HIGH';
        const isJustNow = report.timestamp === 'Just now';

        return (
          <div
            key={report.id}
            className="bms-card"
            style={{
              background: 'var(--rx-surface)',
              border: isHigh ? '1.5px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-medium)',
              borderLeft: `5px solid ${isHigh ? 'var(--rx-amber)' : 'var(--rx-blue)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '16px 18px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: isHigh ? 'var(--rx-amber)' : 'rgba(37, 99, 235, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isHigh ? '#FFFFFF' : 'var(--rx-blue)', flexShrink: 0
              }}>
                <LifeBuoy size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  {isJustNow && (
                    <span style={{
                      background: 'var(--rx-green)', color: '#fff',
                      fontSize: '0.62rem', fontWeight: 900,
                      padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.06em'
                    }}>
                      ⚡ NEW LIVE REPORT
                    </span>
                  )}
                  <span style={{
                    background: isHigh ? 'var(--rx-amber)' : 'rgba(37,99,235,0.12)',
                    color: isHigh ? '#fff' : 'var(--rx-blue)',
                    fontSize: '0.63rem', fontWeight: 900,
                    padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.06em'
                  }}>
                    {isHigh ? '🚨 HIGH PRIORITY' : '📋 RAILMADAD REPORT'}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--rx-orange)', fontWeight: 700 }}>
                    {report.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    • Status: <strong>{report.status.replace('_', ' ')}</strong>
                  </span>
                </div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '3px' }}>
                  {report.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                  {report.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    📍 {report.stationOrSection || 'Mumbai Corridor'}
                  </span>
                  {report.trainNumber && (
                    <span style={{ color: 'var(--text-secondary)' }}>
                      🚆 Train #{report.trainNumber}
                    </span>
                  )}
                  <button
                    onClick={() => setNotificationsDrawerOpen(true)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'var(--rx-green-deep)', fontWeight: 700,
                      cursor: 'pointer', padding: 0, fontSize: '0.75rem'
                    }}
                  >
                    View in Notification Center →
                  </button>
                </div>
              </div>
              <button
                onClick={() => dismissSos(report.id)}
                style={{
                  background: 'var(--rx-surface-alt)', border: '1px solid var(--border-light)',
                  color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer',
                  flexShrink: 0, padding: '3px 7px', borderRadius: '6px', lineHeight: 1
                }}
              >✕</button>
            </div>
          </div>
        );
      })}

      {/* ── Emergency Accident Banners ────────────────────────────────────── */}
      {activeAccidents.map(incident => {
        const isSirenPlaying = activeSirenId === incident.id;
        const helplineNumber = incident.passengerAssistanceContact?.replace(/[^0-9]/g, '') || '139';

        return (
          <div
            key={incident.id}
            className="bms-card"
            style={{
              background: 'var(--rx-surface)',
              borderColor: 'rgba(225, 29, 72, 0.35)',
              borderLeft: '5px solid var(--rx-red)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'visible',
            }}
          >
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
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className="badge badge-accident" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    {t('alert.critical')}: {localize(incident.natureOfIncident).toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {t('alert.reported')}: {incident.reportedAt}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-dark)', wordBreak: 'break-word', lineHeight: 1.35, marginBottom: '3px' }}>
                  {t('alert.train')} #{incident.trainNumber} ({localize(incident.trainName)})
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', wordBreak: 'break-word' }}>
                  {localize(incident.sectionName)}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {localize(incident.description)} • <strong style={{ color: 'var(--text-dark)' }}>{t('alert.relief')}: {localize(incident.reliefTrainStatus)}</strong> ({incident.reliefTrainId || 'Dispatching'})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
              <button
                type="button"
                onClick={() => handleSirenToggle(incident.id)}
                className={`btn ${isSirenPlaying ? 'btn-emergency' : 'btn-secondary'}`}
                style={{
                  padding: '7px 14px', fontSize: '0.78rem',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontWeight: 700,
                  color: isSirenPlaying ? '#FFFFFF' : 'var(--rx-red)',
                  borderColor: 'rgba(225, 29, 72, 0.35)'
                }}
              >
                {isSirenPlaying ? (
                  <><Radio size={14} className="pulse-radar" /><span>{t('alert.sirenActive')}</span></>
                ) : (
                  <><Volume2 size={14} color="var(--rx-red)" /><span>{t('alert.siren')}</span></>
                )}
              </button>

              <a
                href={`tel:${helplineNumber}`}
                className="btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF', padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)',
                  border: '1px solid rgba(255,255,255,0.18)'
                }}
              >
                <PhoneCall size={14} color="#FFFFFF" />
                <span>Helpline: {incident.passengerAssistanceContact || '139'}</span>
              </a>

              {persona === 'passenger' ? (
                <button
                  type="button"
                  onClick={() => openTripPlanner(incident.sectionName, '')}
                  className="btn btn-secondary"
                  style={{
                    padding: '7px 14px', fontSize: '0.78rem',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontWeight: 600, color: 'var(--rx-blue)',
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
                    if (onNavigateToIncidents) onNavigateToIncidents();
                    else setActiveTab('accidents');
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

      {/* ── Active Mega Block Alert ───────────────────────────────────────── */}
      {activeMegaBlocks.map(block => (
        <div
          key={block.id}
          className="bms-card"
          style={{
            background: 'var(--rx-surface)',
            borderColor: 'rgba(217, 119, 6, 0.3)',
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
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '2px', wordBreak: 'break-word' }}>
                {localize(block.sectionName)}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px', wordBreak: 'break-word' }}>
                {localize(block.reason)}
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-body)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                {localize(block.publicAdvisory)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
