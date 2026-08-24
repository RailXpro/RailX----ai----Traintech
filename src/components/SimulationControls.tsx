import React from 'react';
import { Sparkles, ShieldAlert, CalendarClock, RotateCcw, Cpu, Loader2 } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';

export const SimulationControls: React.FC = () => {
  const { 
    runAiOptimizer, 
    isOptimizing, 
    triggerSimulatedEmergency, 
    triggerSimulatedMegaBlock, 
    resetSimulation 
  } = useRailway();
  const { t } = useLanguage();

  return (
    <div
      className="bms-card"
      style={{
        padding: '14px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        borderLeft: '4px solid var(--rx-orange)',
        borderRadius: 'var(--radius-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--rx-orange-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--rx-orange)'
        }}>
          <Cpu size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {t('sim.title')}
            <span className="badge" style={{ background: 'var(--rx-surface-alt)', color: 'var(--text-secondary)' }}>{t('sim.sandbox')}</span>
          </h4>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
            {t('sim.subtitle')}
          </p>
        </div>
      </div>

      <div className="sim-controls-btn-grid" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={triggerSimulatedEmergency}
          className="btn btn-secondary sim-btn"
          style={{ fontSize: '0.78rem', padding: '7px 14px', color: 'var(--rx-red)' }}
        >
          <ShieldAlert size={14} color="var(--rx-red)" />
          {t('sim.triggerEmergency')}
        </button>

        <button
          onClick={triggerSimulatedMegaBlock}
          className="btn btn-secondary sim-btn"
          style={{ fontSize: '0.78rem', padding: '7px 14px', color: '#92400E' }}
        >
          <CalendarClock size={14} color="#D97706" />
          {t('sim.triggerMegaBlock')}
        </button>

        <button
          onClick={runAiOptimizer}
          disabled={isOptimizing}
          className="btn btn-primary sim-btn-primary"
          style={{ fontSize: '0.84rem', padding: '8px 18px', fontWeight: 700 }}
        >
          {isOptimizing ? (
            <>
              <Loader2 size={15} className="pulse-radar" style={{ animation: 'radar-sweep 1s linear infinite' }} />
              {t('sim.solving')}
            </>
          ) : (
            <>
              <Sparkles size={15} />
              {t('sim.runOptimizer')}
            </>
          )}
        </button>

        <button
          onClick={resetSimulation}
          className="btn btn-secondary sim-btn-reset"
          title="Reset Network to Default"
          style={{ fontSize: '0.78rem', padding: '7px 14px' }}
        >
          <RotateCcw size={14} />
          {t('sim.reset')}
        </button>
      </div>
    </div>
  );
};
