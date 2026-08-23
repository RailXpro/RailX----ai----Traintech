import React from 'react';
import { Sparkles, ShieldAlert, CalendarClock, RotateCcw, Cpu, Loader2 } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';

export const SimulationControls: React.FC = () => {
  const { 
    runAiOptimizer, 
    isOptimizing, 
    triggerSimulatedEmergency, 
    triggerSimulatedMegaBlock, 
    resetSimulation 
  } = useRailway();

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
        borderLeft: '4px solid var(--bms-red)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'var(--bms-red-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bms-red)'
        }}>
          <Cpu size={19} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            TrainX.ai Scenario & Event Simulator
            <span className="badge" style={{ background: '#F5F5FA', color: '#555555', border: '1px solid #DDDDDD' }}>SANDBOX</span>
          </h4>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
            Test live constraints, trigger incident interlocks, or run the AI optimization engine.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={triggerSimulatedEmergency}
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '7px 14px', color: 'var(--bms-red)', borderColor: 'var(--bms-red-border)' }}
        >
          <ShieldAlert size={14} color="var(--bms-red)" />
          Simulate Incident (OHE Snap)
        </button>

        <button
          onClick={triggerSimulatedMegaBlock}
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '7px 14px', color: '#b7791f', borderColor: '#fed7aa' }}
        >
          <CalendarClock size={14} color="#f59e0b" />
          Simulate Sunday Mega Block
        </button>

        <button
          onClick={runAiOptimizer}
          disabled={isOptimizing}
          className="btn btn-primary"
          style={{ fontSize: '0.84rem', padding: '8px 18px', fontWeight: 700 }}
        >
          {isOptimizing ? (
            <>
              <Loader2 size={15} className="pulse-radar" style={{ animation: 'radar-sweep 1s linear infinite' }} />
              Solving Constraints...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Run AI Auto-Block Optimizer
            </>
          )}
        </button>

        <button
          onClick={resetSimulation}
          className="btn btn-secondary"
          title="Reset Network to Default"
          style={{ fontSize: '0.78rem', padding: '7px 12px' }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};
