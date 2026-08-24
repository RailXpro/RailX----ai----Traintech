import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Zap,
  AlertTriangle,
  Radio,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export const AiLiveNotificationBar: React.FC = () => {
  const { problemReports, setIsProblemModalOpen, accidents, megaBlocks } = useRailway();
  const { language } = useLanguage();
  const { setNotificationsDrawerOpen } = useSettings();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeProblems = problemReports.filter(p => p.status !== 'RESOLVED');
  const criticalSosCount = activeProblems.filter(p => p.severity === 'CRITICAL_SOS').length;

  // Auto-rotate through active problem reports every 4.5 seconds
  useEffect(() => {
    if (activeProblems.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeProblems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeProblems.length, isPaused]);

  if (activeProblems.length === 0) {
    return (
      <div
        className="bms-card"
        style={{
          background: 'var(--rx-surface)',
          border: '1.5px solid var(--border-light)',
          borderLeft: '5px solid var(--rx-green)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'var(--rx-green-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--rx-green)', flexShrink: 0
          }}>
            <ShieldCheck size={16} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            🤖 AI Operations Radar: <span style={{ color: 'var(--rx-green)' }}>All Track Corridors Clear</span> • Zero Open Critical Disruption Grievances
          </span>
        </div>

        <button
          onClick={() => setIsProblemModalOpen(true)}
          className="btn btn-secondary"
          style={{ padding: '5px 12px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <Plus size={12} />
          {language === 'mr' ? 'समस्या नोंदवा' : 'Report Issue'}
        </button>
      </div>
    );
  }

  const currentReport = activeProblems[currentIndex] || activeProblems[0];
  const isSos = currentReport.severity === 'CRITICAL_SOS';
  const isHigh = currentReport.severity === 'HIGH';
  const isNew = currentReport.timestamp === 'Just now';

  return (
    <div
      className="bms-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: isSos ? 'var(--rx-surface)' : 'var(--rx-surface)',
        border: isSos ? '1.5px solid rgba(225, 29, 72, 0.45)' : '1.5px solid var(--border-medium)',
        borderLeft: `6px solid ${isSos ? 'var(--rx-red)' : isHigh ? 'var(--rx-amber)' : 'var(--rx-blue)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        boxShadow: isSos ? '0 4px 20px rgba(225,29,72,0.12)' : 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Top bar: AI Status & Live Counts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isSos ? 'var(--rx-red)' : 'var(--rx-header)',
            color: '#FFFFFF',
            padding: '3px 9px',
            borderRadius: '20px',
            fontSize: '0.66rem',
            fontWeight: 900,
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={11} />
            <span>AI PASSENGER LIVE RADAR</span>
          </div>

          {criticalSosCount > 0 && (
            <span style={{
              background: 'rgba(225, 29, 72, 0.12)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              color: 'var(--rx-red)',
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Zap size={10} /> {criticalSosCount} SOS Active
            </span>
          )}

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {activeProblems.length} Live Complaint{activeProblems.length > 1 ? 's' : ''} Synced
          </span>
        </div>

        {/* Counter & Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeProblems.length > 1 && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {currentIndex + 1} of {activeProblems.length}
            </span>
          )}

          <button
            onClick={() => setNotificationsDrawerOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--rx-green-deep)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            Notification Drawer <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Main Broadcast Item Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--rx-surface-alt)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-xs)',
          cursor: 'pointer'
        }}
        onClick={() => setIsProblemModalOpen(true)}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            {isNew && (
              <span style={{
                background: 'var(--rx-green)',
                color: '#fff',
                fontSize: '0.58rem',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '4px',
                animation: 'pulse 1.2s infinite'
              }}>
                ⚡ JUST FILED
              </span>
            )}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: isSos ? 'var(--rx-red)' : 'var(--rx-orange)'
            }}>
              {currentReport.id}
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '10px',
              background: isSos ? 'var(--rx-red)' : isHigh ? 'var(--rx-amber)' : 'var(--rx-blue)',
              color: '#FFFFFF'
            }}>
              {currentReport.severity.replace('_', ' ')}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              • AI Priority: <strong>{currentReport.aiPriorityScore}/100</strong>
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              • {currentReport.timestamp}
            </span>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '2px' }}>
            {currentReport.title}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.4 }}>
            {currentReport.description}
          </div>

          {currentReport.actionTaken && (
            <div style={{ fontSize: '0.72rem', color: 'var(--rx-green-deep)', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={11} color="var(--rx-green)" />
              <span>{currentReport.actionTaken}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProblemModalOpen(true);
            }}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '0.74rem',
              background: isSos ? 'var(--rx-red)' : 'var(--rx-orange)',
              boxShadow: 'none'
            }}
          >
            Track & Manage →
          </button>
        </div>
      </div>
    </div>
  );
};
