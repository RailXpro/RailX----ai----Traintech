import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Clock, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  Loader2 
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const AiBlockOptimizer: React.FC = () => {
  const { metrics, runAiOptimizer, isOptimizing } = useRailway();

  const [passengerPriorityWeight, setPassengerPriorityWeight] = useState<number>(5);
  const [freightWeight, setFreightWeight] = useState<number>(3);
  const [nightWindowPreference, setNightWindowPreference] = useState<number>(85);
  const [maxTsrTolerance, setMaxTsrTolerance] = useState<number>(30);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Solver Engine Config */}
      <div className="bms-card" style={{ padding: '24px', borderLeft: '4px solid var(--bms-red)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--bms-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(248, 68, 100, 0.35)' }}>
              <Cpu size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  TrainX.ai Auto-Block Optimization Engine
                </h2>
                <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                  OR-Tools + Scikit-Learn ML
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Solves multi-commodity track possession constraints, predicts downtime, and eliminates train timetable clashes.
              </p>
            </div>
          </div>

          <button
            onClick={runAiOptimizer}
            disabled={isOptimizing}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem', fontWeight: 700 }}
          >
            {isOptimizing ? (
              <>
                <Loader2 size={18} style={{ animation: 'radar-sweep 1s linear infinite' }} />
                Solving Constraints...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Execute AI Solver & Reroute Engine
              </>
            )}
          </button>
        </div>

        {/* Interactive Constraint Parameters */}
        <div style={{ background: '#F8F8FB', padding: '18px 20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={15} color="var(--bms-red)" />
            Optimization Objective Constraints & Weights
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            {/* Passenger Priority */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Vande Bharat / Express Priority</span>
                <strong style={{ color: 'var(--bms-red)' }}>Weight {passengerPriorityWeight}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={passengerPriorityWeight}
                onChange={(e) => setPassengerPriorityWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--bms-red)' }}
              />
            </div>

            {/* Freight Corridors */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Dedicated Freight Corridor (DFC) Slot</span>
                <strong style={{ color: '#2e7d32' }}>Weight {freightWeight}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={freightWeight}
                onChange={(e) => setFreightWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--bms-green)' }}
              />
            </div>

            {/* Night Window Bias */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Night Possession Bias (00:00 - 05:00)</span>
                <strong style={{ color: 'var(--bms-cyan)' }}>{nightWindowPreference}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={nightWindowPreference}
                onChange={(e) => setNightWindowPreference(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--bms-cyan)' }}
              />
            </div>

            {/* TSR Tolerance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>TSR Buffer Delay Tolerance</span>
                <strong style={{ color: '#b7791f' }}>{maxTsrTolerance} mins max</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={maxTsrTolerance}
                onChange={(e) => setMaxTsrTolerance(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--bms-amber)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Before vs After Optimization KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* Asset Utilization Card */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Asset Fleet Utilization</span>
            <TrendingUp size={16} color="var(--bms-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--bms-red)' }} className="font-display">
              {metrics.afterOptimization.assetUtilizationPercent}%
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.assetUtilizationPercent}%
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
              +{Math.round(metrics.afterOptimization.assetUtilizationPercent - metrics.beforeOptimization.assetUtilizationPercent)}% Gain
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Locomotives, tamping rakes & crew roasters
          </p>
        </div>

        {/* Train Delay Reduction */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Avg Train Delay</span>
            <Clock size={16} color="var(--bms-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {metrics.afterOptimization.averageTrainDelayMins}m
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.averageTrainDelayMins}m
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              -89% Delay Drop
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Dynamic speed profiling & loop diversions
          </p>
        </div>

        {/* Conflicts Resolved */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Track Possession Conflicts</span>
            <CheckCircle2 size={16} color="var(--bms-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--bms-green)' }} className="font-display">
              0 Clashes
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--bms-red)', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.conflictCount} Clashes
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
              100% Resolved
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            All corridor maintenance windows locked safely
          </p>
        </div>

        {/* Energy & Traction Savings */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>Traction Energy Savings</span>
            <Zap size={16} color="var(--bms-amber)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              12.3 MWh
            </span>
            <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
              Saved / Day
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Regenerative braking optimization on gradients
          </p>
        </div>
      </div>

      {/* Visual Gantt Timeline of Block Possession */}
      <div className="bms-card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--bms-red)" />
          24-Hour Corridor Possession & Automatic Block Timeline (Gantt View)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Hour labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            <span>00:00</span>
            <span>02:00</span>
            <span>04:00</span>
            <span>06:00</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
          </div>

          {/* Track 1: CR Thane-Dadar Corridor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '160px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              CR: Dadar-Thane Up Slow
            </div>
            <div style={{ flex: 1, height: '28px', background: '#F5F5FA', borderRadius: '4px', position: 'relative', overflow: 'hidden', border: '1px solid #EAEAEA' }}>
              <div style={{
                position: 'absolute',
                left: '42%',
                width: '24%',
                height: '100%',
                background: 'var(--bms-amber)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}>
                Mega Block (Tamping Machine #09-3X)
              </div>
            </div>
          </div>

          {/* Track 2: WR Borivali-Virar Corridor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '160px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              WR: Borivali-Virar Fast
            </div>
            <div style={{ flex: 1, height: '28px', background: '#F5F5FA', borderRadius: '4px', position: 'relative', overflow: 'hidden', border: '1px solid #EAEAEA' }}>
              <div style={{
                position: 'absolute',
                left: '2%',
                width: '18%',
                height: '100%',
                background: 'var(--bms-green)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}>
                Night Jumbo (OHE Tower Wagon)
              </div>
            </div>
          </div>

          {/* Track 3: NR Ghaziabad-Aligarh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '160px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              NR: Ghaziabad-Aligarh Trunk
            </div>
            <div style={{ flex: 1, height: '28px', background: '#F5F5FA', borderRadius: '4px', position: 'relative', overflow: 'hidden', border: '1px solid #EAEAEA' }}>
              <div style={{
                position: 'absolute',
                left: '55%',
                width: '16%',
                height: '100%',
                background: 'var(--bms-red)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}>
                EI Kavach Signaling Upgrade
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Prescriptive Recommendations Log */}
      <div className="bms-card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="var(--bms-red)" />
          AI Prescriptive Action Plan & Dispatch Directives
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {metrics.recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: '#F8F8FB',
                border: '1px solid var(--border-light)',
                borderLeft: '4px solid var(--bms-green)',
                borderRadius: '6px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
                    {rec.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {rec.description}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ⚡ Impact: <strong style={{ color: '#2e7d32' }}>{rec.impact}</strong>
                </p>
              </div>

              <span className="badge" style={{ background: '#FFF0F3', color: 'var(--bms-red)', border: '1px solid var(--bms-red-border)', fontSize: '0.7rem' }}>
                Auto-Dispatched
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
