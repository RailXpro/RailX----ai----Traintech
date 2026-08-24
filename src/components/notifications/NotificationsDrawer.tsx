import React, { useState, useEffect, useRef } from 'react';
import {
  X, Bell, Train, Zap, ShieldCheck, AlertTriangle,
  Clock, CheckCheck, ChevronRight, Filter, Sparkles,
  LifeBuoy, PhoneCall, MapPin, Radio
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    accidents, megaBlocks, problemReports,
    setActiveTab, setIsKavachModalOpen, setPersona, setIsProblemModalOpen
  } = useRailway();
  const { language, t } = useLanguage();
  const {
    megaBlockAlerts,
    emergencySosAlerts,
    kavachAlerts,
    toggleNotification
  } = useSettings();

  type FilterType = 'all' | 'megablock' | 'sos' | 'kavach' | 'railmadad';
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const prevProblemCount = useRef(problemReports.length);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new problem report is filed
  useEffect(() => {
    if (problemReports.length > prevProblemCount.current) {
      if (listRef.current) {
        listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    prevProblemCount.current = problemReports.length;
  }, [problemReports]);

  if (!isOpen) return null;

  // Build live notification stream from system events
  const notificationItems = [
    // ── RailMadad Problem Reports (passengers + controllers) ───────────────
    ...problemReports.map(pr => {
      const isCritical = pr.severity === 'CRITICAL_SOS';
      const isHigh = pr.severity === 'HIGH';
      const isJustNow = pr.timestamp === 'Just now';

      return {
        id: `pr_${pr.id}`,
        type: 'railmadad' as const,
        title: isCritical
          ? `🆘 SOS EMERGENCY: ${pr.title} [${pr.id}]`
          : isHigh
          ? `🚨 HIGH PRIORITY: ${pr.title} [${pr.id}]`
          : `📋 [${pr.id}] ${pr.title || pr.category}`,
        desc: `${pr.description} • Location: ${pr.stationOrSection || 'Mumbai Corridor'}${pr.trainNumber ? ` • Train #${pr.trainNumber}` : ''} • Status: ${pr.status.replace('_', ' ')}`,
        time: pr.timestamp || 'Just now',
        severity: isCritical ? 'critical' : isHigh ? 'high' : 'medium',
        enabled: true,
        isSos: isCritical,
        isNew: isJustNow,
        rawTimestamp: isJustNow ? 9999999999999 : 1,
        onClick: () => {
          setIsProblemModalOpen(true);
          onClose();
        }
      };
    }),

    // ── Emergency SOS / Accidents ──────────────────────────────────────────
    ...accidents.map(acc => ({
      id: `acc_${acc.id}`,
      type: 'sos' as const,
      title: `${acc.severity === 'critical' ? '🔴 CRITICAL SOS' : '⚠️ TRAIN INCIDENT'}: ${acc.trainName}`,
      desc: `${acc.locationDetails || acc.sectionName} • ${acc.natureOfIncident}. Relief SP-ARME dispatched.`,
      time: acc.reportedAt || 'Live Telemetry',
      severity: acc.severity,
      enabled: emergencySosAlerts,
      isSos: acc.severity === 'critical',
      isNew: false,
      rawTimestamp: 50,
      onClick: () => {
        setPersona('planner');
        setActiveTab('accidents');
        onClose();
      }
    })),

    // ── Mega Blocks ─────────────────────────────────────────────────────────
    ...megaBlocks.map(mb => ({
      id: `mb_${mb.id}`,
      type: 'megablock' as const,
      title: `🚧 ${mb.reason}: ${mb.sectionName}`,
      desc: `${mb.linesAffected} • ${mb.startTime} to ${mb.endTime} • Impact: ${mb.affectedTrainNumbers.length} trains diverted.`,
      time: mb.date || 'Sunday Block',
      severity: mb.status === 'active' ? 'high' : 'medium',
      enabled: megaBlockAlerts,
      isSos: false,
      isNew: false,
      rawTimestamp: 20,
      onClick: () => {
        setPersona('planner');
        setActiveTab('blocks');
        onClose();
      }
    })),

    // ── Kavach SIL-4 Updates ─────────────────────────────────────────────
    {
      id: 'kavach_live_1',
      type: 'kavach' as const,
      title: '🛡️ Kavach 2.0 RFID Signal Interlock Active',
      desc: 'Automatic braking loop synced across Mumbai & Delhi corridors. 0 SPAD risk.',
      time: 'Continuous Health Check',
      severity: 'info',
      enabled: kavachAlerts,
      isSos: false,
      isNew: false,
      rawTimestamp: 10,
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

  // Sort: Newly submitted reports (isNew) and SOS ALWAYS at the top!
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    if (a.isSos && !b.isSos) return -1;
    if (!a.isSos && b.isSos) return 1;
    const aRead = readIds.has(a.id);
    const bRead = readIds.has(b.id);
    if (!aRead && bRead) return -1;
    if (aRead && !bRead) return 1;
    return b.rawTimestamp - a.rawTimestamp;
  });

  const unreadCount = filteredItems.filter(i => !readIds.has(i.id)).length;
  const sosProblemCount = problemReports.filter(p =>
    p.severity === 'CRITICAL_SOS' && p.status !== 'RESOLVED'
  ).length;

  const markAllRead = () => {
    setReadIds(new Set(notificationItems.map(i => i.id)));
  };

  const getSeverityStyle = (severity: string, isSos: boolean, isNew?: boolean) => {
    if (isSos || severity === 'critical') return {
      border: '2px solid rgba(239, 68, 68, 0.7)',
      background: 'rgba(239, 68, 68, 0.1)',
      boxShadow: '0 0 16px rgba(239,68,68,0.2)'
    };
    if (isNew) return {
      border: '2px solid var(--rx-green)',
      background: 'rgba(16, 185, 129, 0.08)',
      boxShadow: '0 0 12px rgba(16,185,129,0.2)'
    };
    if (severity === 'high') return {
      border: '1.5px solid rgba(245, 158, 11, 0.5)',
      background: 'rgba(245, 158, 11, 0.06)',
      boxShadow: 'var(--shadow-card)'
    };
    return {
      border: '1px solid var(--border-light)',
      background: 'var(--rx-surface)',
      boxShadow: 'none'
    };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(12, 19, 34, 0.55)',
      backdropFilter: 'blur(6px)',
      animation: 'authFadeIn 0.2s ease'
    }}
    onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '480px', height: '100%',
          background: 'var(--rx-surface)',
          borderLeft: '1px solid var(--border-light)',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--rx-header) 0%, var(--rx-header-sub) 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: sosProblemCount > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 88, 12, 0.2)',
              border: sosProblemCount > 0 ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(234, 88, 12, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: sosProblemCount > 0 ? 'pulse 1.4s infinite' : undefined
            }}>
              {sosProblemCount > 0 ? <Zap size={18} color="#EF4444" /> : <Bell size={18} color="var(--rx-orange)" />}
            </div>
            <div>
              <div style={{ fontSize: '1.02rem', fontWeight: 900, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {language === 'mr' ? 'सूचना केंद्र' : 'Live Notifications Center'}
                {sosProblemCount > 0 && (
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.3)',
                    border: '1px solid rgba(239, 68, 68, 0.6)',
                    color: '#FCA5A5',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    padding: '2px 7px',
                    borderRadius: '20px',
                    letterSpacing: '0.08em',
                    animation: 'pulse 1s infinite'
                  }}>
                    🆘 {sosProblemCount} SOS ACTIVE
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                {unreadCount} alerts • Real-time passenger & official feed
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

        {/* ── Filter Tabs ── */}
        <div style={{
          padding: '10px 16px',
          background: 'var(--rx-surface-alt)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', gap: '6px', overflowX: 'auto'
        }}>
          {[
            { key: 'all', label: 'All', icon: <Filter size={12} />, count: notificationItems.length },
            {
              key: 'railmadad',
              label: '🚨 RailMadad Issues',
              icon: <LifeBuoy size={12} color={sosProblemCount > 0 ? '#EF4444' : 'var(--rx-orange)'} />,
              count: problemReports.length,
              pulse: sosProblemCount > 0
            },
            { key: 'sos', label: 'SOS Incidents', icon: <Zap size={12} color="#EF4444" />, count: accidents.length },
            { key: 'megablock', label: 'Mega Blocks', icon: <Train size={12} color="#3B82F6" />, count: megaBlocks.length },
            { key: 'kavach', label: 'Kavach', icon: <ShieldCheck size={12} color="#10B981" />, count: 1 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as FilterType)}
              style={{
                padding: '5px 10px',
                borderRadius: 'var(--radius-pill)',
                border: activeFilter === tab.key
                  ? (tab.key === 'railmadad' && sosProblemCount > 0 ? '1px solid #EF4444' : '1px solid var(--rx-green)')
                  : '1px solid var(--border-light)',
                background: activeFilter === tab.key
                  ? (tab.key === 'railmadad' && sosProblemCount > 0 ? '#EF4444' : 'var(--rx-green)')
                  : 'var(--rx-surface)',
                color: activeFilter === tab.key ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                animation: (tab as any).pulse ? 'pulse 1.5s infinite' : undefined,
                position: 'relative'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {(tab.count ?? 0) > 0 && (
                <span style={{
                  background: activeFilter === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(239,68,68,0.2)',
                  color: activeFilter === tab.key ? '#fff' : '#EF4444',
                  borderRadius: '8px',
                  padding: '0 5px',
                  fontSize: '0.58rem',
                  fontWeight: 900,
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Notification List ── */}
        <div
          ref={listRef}
          style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {sortedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>No notifications in this filter</div>
              <div style={{ fontSize: '0.72rem' }}>All operations running normally.</div>
            </div>
          ) : (
            sortedItems.map(item => {
              const isRead = readIds.has(item.id);
              const severityStyle = getSeverityStyle(item.severity, item.isSos, item.isNew);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setReadIds(prev => new Set([...prev, item.id]));
                    item.onClick();
                  }}
                  style={{
                    ...severityStyle,
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    opacity: isRead ? 0.8 : 1,
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: isRead ? 700 : 900,
                      color: item.isSos ? '#EF4444' : 'var(--text-dark)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      {item.isNew && (
                        <span style={{
                          background: 'var(--rx-green)',
                          color: '#fff',
                          fontSize: '0.58rem',
                          fontWeight: 900,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          animation: 'pulse 1.2s infinite'
                        }}>
                          NEW
                        </span>
                      )}
                      {!isRead && !item.isNew && (
                        <span style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: item.isSos ? '#EF4444' : 'var(--rx-green)',
                          flexShrink: 0
                        }} />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                      {item.time}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.desc}
                  </div>

                  {/* Type Badge + Action */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: '4px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.62rem', fontWeight: 900,
                        background: item.type === 'railmadad'
                          ? (item.isSos ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)')
                          : item.type === 'sos'
                          ? 'rgba(239,68,68,0.15)'
                          : item.type === 'megablock'
                          ? 'rgba(59,130,246,0.15)'
                          : 'rgba(16,185,129,0.15)',
                        color: item.type === 'railmadad'
                          ? (item.isSos ? '#EF4444' : '#D97706')
                          : item.type === 'sos' ? '#EF4444'
                          : item.type === 'megablock' ? '#93C5FD'
                          : '#6EE7B7',
                        padding: '2px 7px', borderRadius: '10px',
                        letterSpacing: '0.04em', textTransform: 'uppercase' as const
                      }}>
                        {item.type === 'railmadad' ? '🚨 RailMadad'
                          : item.type === 'sos' ? '🔴 SOS Incident'
                          : item.type === 'megablock' ? '🚧 Mega Block'
                          : '🛡️ Kavach'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--rx-green-deep)', fontWeight: 700 }}>
                        Tap to manage →
                      </span>
                    </div>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
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
              background: sosProblemCount > 0 ? '#EF4444' : '#10B981',
              boxShadow: `0 0 6px ${sosProblemCount > 0 ? '#EF4444' : '#10B981'}`
            }} />
            {sosProblemCount > 0 ? `${sosProblemCount} SOS Active` : 'Synced in real-time'}
          </div>
          <button
            onClick={() => { setIsProblemModalOpen(true); onClose(); }}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--rx-orange)', fontSize: '0.72rem',
              fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <LifeBuoy size={13} />
            + Report Problem
          </button>
        </div>
      </div>
    </div>
  );
};
