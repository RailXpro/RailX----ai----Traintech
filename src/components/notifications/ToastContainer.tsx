import React, { useEffect, useRef } from 'react';
import { X, Bell, Zap, ShieldCheck, Train, LifeBuoy } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useRailway } from '../../context/RailwayContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, addToast, setNotificationsDrawerOpen } = useSettings();
  const { problemReports } = useRailway();

  // Track prev count to detect new reports
  const prevCountRef = useRef(problemReports.length);
  const seenIdsRef = useRef<Set<string>>(new Set(problemReports.map(p => p.id)));

  useEffect(() => {
    if (problemReports.length > prevCountRef.current) {
      // Find reports we haven't seen yet
      const newReports = problemReports.filter(p => !seenIdsRef.current.has(p.id));
      newReports.forEach(report => {
        seenIdsRef.current.add(report.id);
        const isSos = report.severity === 'CRITICAL_SOS';
        const isHigh = report.severity === 'HIGH';

        addToast({
          type: isSos ? 'emergency' : isHigh ? 'warning' : 'info',
          category: isSos ? 'sos' : 'system',
          title: isSos
            ? `🆘 SOS EMERGENCY — Ref: ${report.id}`
            : isHigh
            ? `🚨 High Priority Report — ${report.id}`
            : `📋 RailMadad Report: ${report.id}`,
          message: isSos
            ? `CRITICAL: ${report.title || report.category} • AI escalated to Section Controller & Station Master. Relief team alerted.`
            : `${report.title || report.category} logged. Assigned to divisional queue. Ref: ${report.id}`
        });
      });
    }
    prevCountRef.current = problemReports.length;
  }, [problemReports, addToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        const isSos = toast.type === 'emergency';

        const getIcon = () => {
          if (toast.category === 'sos' || isSos)  return <Zap size={18} color="#EF4444" />;
          if (toast.category === 'kavach')          return <ShieldCheck size={18} color="#10B981" />;
          if (toast.category === 'megablock')       return <Train size={18} color="#3B82F6" />;
          if (toast.category === 'system')          return <LifeBuoy size={18} color="var(--rx-orange)" />;
          return <Bell size={18} color="var(--rx-orange)" />;
        };

        const getBorder = () => {
          if (isSos)                  return '2px solid #EF4444';
          if (toast.type === 'warning') return '1.5px solid #F59E0B';
          if (toast.type === 'success') return '1.5px solid #10B981';
          return '1px solid var(--border-medium)';
        };

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: isSos
                ? 'linear-gradient(135deg, #1a0505 0%, #1f0808 100%)'
                : 'var(--rx-surface)',
              borderRadius: '16px',
              padding: '14px 16px',
              boxShadow: isSos
                ? '0 0 0 2px rgba(239,68,68,0.3), 0 16px 48px rgba(239,68,68,0.25)'
                : '0 12px 36px rgba(12, 19, 34, 0.25), 0 0 0 1px rgba(255,255,255,0.08)',
              border: getBorder(),
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideInRight 0.25s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: isSos ? 'rgba(239,68,68,0.2)' : 'var(--rx-surface-alt)',
              border: isSos ? '1px solid rgba(239,68,68,0.4)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              animation: isSos ? 'pulse 1s infinite' : undefined
            }}>
              {getIcon()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{
                  fontSize: '0.84rem', fontWeight: 800,
                  color: isSos ? '#FCA5A5' : 'var(--text-dark)',
                  lineHeight: 1.3
                }}>
                  {toast.title}
                </div>
                <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {toast.timestamp}
                </span>
              </div>

              <div style={{ fontSize: '0.73rem', color: isSos ? '#FDA4A4' : 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {toast.message}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setNotificationsDrawerOpen(true);
                    removeToast(toast.id);
                  }}
                  style={{
                    background: isSos ? 'rgba(239,68,68,0.2)' : 'transparent',
                    border: isSos ? '1px solid rgba(239,68,68,0.4)' : 'none',
                    borderRadius: '6px',
                    padding: isSos ? '3px 9px' : '0',
                    color: isSos ? '#FCA5A5' : 'var(--rx-green-deep)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {isSos ? '🆘 Open Alerts →' : 'Open Center →'}
                </button>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
