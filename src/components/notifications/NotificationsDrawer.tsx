import React, { useState } from 'react';
import {
  X, Bell, Train, Zap, ShieldCheck, AlertTriangle,
  Clock, CheckCheck, ChevronRight, ExternalLink, Filter, Sparkles
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { accidents, megaBlocks, setActiveTab, setIsKavachModalOpen, setPersona } = useRailway();
  const { language, t } = useLanguage();
  const {
    megaBlockAlerts,
    emergencySosAlerts,
    kavachAlerts,
    toggleNotification
  } = useSettings();

  const [activeFilter, setActiveFilter] = useState<'all' | 'megablock' | 'sos' | 'kavach'>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Build live notification stream from system events
  const notificationItems = [
    // Emergency SOS / Accidents
    ...accidents.map(acc => ({
      id: `acc_${acc.id}`,
      type: 'sos' as const,
      title: `${acc.severity === 'critical' ? '🔴 CRITICAL SOS' : '⚠️ TRAIN INCIDENT'}: ${acc.trainName}`,
      desc: `${acc.locationDetails || acc.sectionName} • ${acc.natureOfIncident}. Relief SP-ARME dispatched.`,
      time: acc.reportedAt || 'Live Telemetry',
      severity: acc.severity,
      enabled: emergencySosAlerts,
      onClick: () => {
        setPersona('planner');
        setActiveTab('accidents');
        onClose();
      }
    })),

    // Mega Blocks
    ...megaBlocks.map(mb => ({
      id: `mb_${mb.id}`,
      type: 'megablock' as const,
      title: `🚧 ${mb.reason}: ${mb.sectionName}`,
      desc: `${mb.linesAffected} • ${mb.startTime} to ${mb.endTime} • Impact: ${mb.affectedTrainNumbers.length} trains diverted.`,
      time: mb.date || 'Sunday Block',
      severity: mb.status === 'active' ? 'high' : 'medium',
      enabled: megaBlockAlerts,
      onClick: () => {
        setPersona('planner');
        setActiveTab('blocks');
        onClose();
      }
    })),

    // Kavach SIL-4 Updates
    {
      id: 'kavach_live_1',
      type: 'kavach' as const,
      title: '🛡️ Kavach 2.0 RFID Signal Interlock Active',
      desc: 'Automatic braking loop synced across Mumbai & Delhi corridors. 0 SPAD risk.',
      time: 'Continuous Health Check',
      severity: 'info',
      enabled: kavachAlerts,
      onClick: () => {
        setIsKavachModalOpen(true);
        onClose();
      }
    }
  ];

  const filteredItems = notificationItems.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const unreadCount = filteredItems.filter(i => !readIds.has(i.id)).length;

  const markAllRead = () => {
    setReadIds(new Set(notificationItems.map(i => i.id)));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(12, 19, 34, 0.45)',
      backdropFilter: 'blur(6px)',
      animation: 'authFadeIn 0.2s ease'
    }}
    onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px', height: '100%',
          background: 'var(--rx-surface)',
          borderLeft: '1px solid var(--border-light)',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--rx-header) 0%, var(--rx-header-sub) 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(234, 88, 12, 0.2)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bell size={18} color="var(--rx-orange)" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {language === 'mr' ? 'सूचना केंद्र' : 'Notifications Center'}
                <span style={{
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  color: '#FCD34D',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: '20px',
                  letterSpacing: '0.08em',
                  animation: 'pulse 2s infinite'
                }}>
                  ⚠ DEMO DATA
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                {unreadCount} {language === 'mr' ? 'नवीन सूचना' : 'simulated alerts'} • Not real IR feeds
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 10px',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={12} />
                <span>{language === 'mr' ? 'सर्व वाचले' : 'Read All'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: '#FFFFFF', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          padding: '12px 18px',
          background: 'var(--rx-surface-alt)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', gap: '6px', overflowX: 'auto'
        }}>
          {[
            { key: 'all', label: 'All', icon: <Filter size={12} /> },
            { key: 'sos', label: 'Emergency SOS', icon: <Zap size={12} color="#EF4444" /> },
            { key: 'megablock', label: 'Mega Blocks', icon: <Train size={12} color="#3B82F6" /> },
            { key: 'kavach', label: 'Kavach', icon: <ShieldCheck size={12} color="#10B981" /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              style={{
                padding: '5px 10px',
                borderRadius: 'var(--radius-pill)',
                border: activeFilter === tab.key ? '1px solid var(--rx-green)' : '1px solid var(--border-light)',
                background: activeFilter === tab.key ? 'var(--rx-green)' : 'var(--rx-surface)',
                color: activeFilter === tab.key ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Muted Alert Warning Banner (if user turned off a category) */}
        {((activeFilter === 'sos' && !emergencySosAlerts) ||
          (activeFilter === 'megablock' && !megaBlockAlerts) ||
          (activeFilter === 'kavach' && !kavachAlerts)) && (
          <div style={{
            padding: '10px 16px',
            background: 'rgba(234, 88, 12, 0.12)',
            borderBottom: '1px solid rgba(234, 88, 12, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="var(--rx-orange)" />
              <span>This notification category is currently disabled in Settings.</span>
            </div>
            <button
              onClick={() => toggleNotification(activeFilter as any)}
              style={{
                background: 'var(--rx-orange)',
                border: 'none',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Enable
            </button>
          </div>
        )}

        {/* Demo Data Banner */}
        <div style={{
          padding: '8px 16px',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.08) 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.72rem' }}>🧪</span>
          <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>
            These are <strong>simulated demo alerts</strong> generated from mock data. Not connected to real Indian Railways live feeds.
          </span>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>No notifications in this filter</div>
              <div style={{ fontSize: '0.72rem' }}>All Indian Railways operations are running smoothly.</div>
            </div>
          ) : (
            filteredItems.map(item => {
              const isRead = readIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  style={{
                    background: isRead ? 'var(--rx-surface-alt)' : 'var(--rx-surface)',
                    border: isRead ? '1px solid var(--border-light)' : '1.5px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    boxShadow: isRead ? 'none' : 'var(--shadow-card)',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: isRead ? 700 : 900,
                      color: 'var(--text-dark)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      {!isRead && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--rx-green)', flexShrink: 0 }} />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {item.time}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.desc}
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: '4px', paddingTop: '6px', borderTop: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--rx-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Tap to open details →
                      </span>
                      <span style={{
                        fontSize: '0.58rem',
                        fontWeight: 900,
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#B45309',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        letterSpacing: '0.05em'
                      }}>
                        SIMULATED
                      </span>
                    </div>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--rx-surface-alt)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              display: 'inline-block',
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#F59E0B',
              boxShadow: '0 0 6px #F59E0B'
            }} />
            TrainX Demo Data • Not Live
          </div>
          <button
            onClick={() => {
              toggleNotification('sos');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--rx-green)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Test Alert ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
