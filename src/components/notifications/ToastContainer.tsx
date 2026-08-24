import React from 'react';
import { X, Bell, Zap, ShieldCheck, Train, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, setNotificationsDrawerOpen } = useSettings();

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
      maxWidth: '380px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        const getIcon = () => {
          if (toast.category === 'sos' || toast.type === 'emergency') return <Zap size={18} color="#EF4444" />;
          if (toast.category === 'kavach') return <ShieldCheck size={18} color="#10B981" />;
          if (toast.category === 'megablock') return <Train size={18} color="#3B82F6" />;
          return <Bell size={18} color="var(--rx-orange)" />;
        };

        const getBorder = () => {
          if (toast.type === 'emergency') return '1.5px solid #EF4444';
          if (toast.type === 'success') return '1.5px solid #10B981';
          return '1px solid var(--border-medium)';
        };

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: 'var(--rx-surface)',
              borderRadius: '16px',
              padding: '14px 16px',
              boxShadow: '0 12px 36px rgba(12, 19, 34, 0.25), 0 0 0 1px rgba(255,255,255,0.08)',
              border: getBorder(),
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideInRight 0.25s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--rx-surface-alt)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {getIcon()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {toast.title}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {toast.timestamp}
                </span>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {toast.message}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    setNotificationsDrawerOpen(true);
                    removeToast(toast.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: 'var(--rx-green-deep)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Open Center →
                </button>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
