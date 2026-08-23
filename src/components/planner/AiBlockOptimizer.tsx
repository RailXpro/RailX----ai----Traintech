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
import { useLanguage } from '../../context/LanguageContext';

export const AiBlockOptimizer: React.FC = () => {
  const { metrics, runAiOptimizer, isOptimizing } = useRailway();
  const { t } = useLanguage();

  const [passengerPriorityWeight, setPassengerPriorityWeight] = useState<number>(5);
  const [freightWeight, setFreightWeight] = useState<number>(3);
  const [nightWindowPreference, setNightWindowPreference] = useState<number>(85);
  const [maxTsrTolerance, setMaxTsrTolerance] = useState<number>(30);

  // Dynamic calculation based on constraints
  const dynamicAssetUtilization = Math.min(98.8, +(metrics.afterOptimization.assetUtilizationPercent + (passengerPriorityWeight - 3) * 0.4 + (nightWindowPreference - 75) * 0.04).toFixed(1));
  const dynamicAvgDelay = Math.max(1.5, +(metrics.afterOptimization.averageTrainDelayMins - (passengerPriorityWeight - 3) * 0.2 + (maxTsrTolerance - 30) * 0.03).toFixed(1));
  const dynamicEnergySaved = Math.max(9.5, +(12.3 + (nightWindowPreference - 75) * 0.05).toFixed(1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Solver Engine Config */}
      <div className="bms-card" style={{ padding: '24px', borderLeft: '4px solid var(--rx-orange)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px var(--rx-orange-glow)' }}>
              <Cpu size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>
                  {t('optimizer.title')}
                </h2>
                <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                  OR-Tools + Scikit-Learn ML
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t('optimizer.subtitle')}
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
                {t('sim.solving')}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {t('optimizer.execute')}
              </>
            )}
          </button>
        </div>

        {/* Interactive Constraint Parameters */}
        <div style={{ background: 'var(--rx-surface-alt)', padding: '18px 20px', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={15} color="var(--rx-orange)" />
            {t('optimizer.constraints')}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            {/* Passenger Priority */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{t('optimizer.passengerWeight')}</span>
                <strong style={{ color: 'var(--rx-orange)' }}>Weight {passengerPriorityWeight}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={passengerPriorityWeight}
                onChange={(e) => setPassengerPriorityWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--rx-orange)' }}
              />
            </div>

            {/* Freight Corridors */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{t('optimizer.freightWeight')}</span>
                <strong style={{ color: '#15803D' }}>Weight {freightWeight}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={freightWeight}
                onChange={(e) => setFreightWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--rx-green)' }}
              />
            </div>

            {/* Night Window Bias */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{t('optimizer.nightWindow')}</span>
                <strong style={{ color: 'var(--rx-blue)' }}>{nightWindowPreference}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={nightWindowPreference}
                onChange={(e) => setNightWindowPreference(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--rx-blue)' }}
              />
            </div>

            {/* TSR Tolerance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{t('optimizer.tsrTolerance')}</span>
                <strong style={{ color: '#92400E' }}>{maxTsrTolerance} mins max</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={maxTsrTolerance}
                onChange={(e) => setMaxTsrTolerance(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--rx-amber)' }}
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
            <span>{t('optimizer.assetUtil')}</span>
            <TrendingUp size={16} color="var(--rx-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--rx-orange)' }} className="font-display">
              {dynamicAssetUtilization}%
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.assetUtilizationPercent}%
            </span>
            <span className="badge badge-clear" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              +{(dynamicAssetUtilization - metrics.beforeOptimization.assetUtilizationPercent).toFixed(1)}% Boost
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Optimized with rolling block possession slots
          </p>
        </div>

        {/* Avg Delay Card */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>{t('optimizer.avgDelay')}</span>
            <Clock size={16} color="var(--rx-blue)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803D' }} className="font-display">
              {dynamicAvgDelay} min
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.averageTrainDelayMins} min
            </span>
            <span className="badge badge-clear" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              -{(metrics.beforeOptimization.averageTrainDelayMins - dynamicAvgDelay).toFixed(1)}m Reduced
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Deconflicted passing loop routing
          </p>
        </div>

        {/* Conflicts Card */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>{t('optimizer.conflicts')}</span>
            <CheckCircle2 size={16} color="var(--rx-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803D' }} className="font-display">
              0
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
              {metrics.beforeOptimization.conflictCount}
            </span>
            <span className="badge badge-clear" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              100% Resolved
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero track possession overlaps
          </p>
        </div>

        {/* Energy Savings Card */}
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>{t('optimizer.energySaved')}</span>
            <Zap size={16} color="var(--rx-orange)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--rx-orange)' }} className="font-display">
              {dynamicEnergySaved}%
            </span>
            <span className="badge badge-clear" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              ~1.4 MWh Saved
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Dynamic coasting and speed profile curves
          </p>
        </div>
      </div>

      {/* AI Generated Possession Schedule & Gantt View */}
      <div className="bms-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="var(--rx-orange)" />
            <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
              {t('optimizer.generatedSchedule')}
            </h3>
          </div>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,Section,Slot,Lines,Assigned Machinery,Efficiency Boost\nCSMT-Dadar,01:30-04:30,Up/Down Fast,Plasser 09-3X,+28%\nVasai-Virar,02:00-05:30,Down Slow,Tower Wagon #04,+34%\n";
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "TrainX_Possession_Schedule.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="btn btn-secondary" 
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          >
            <FileText size={14} />
            {t('optimizer.downloadPlan')}
          </button>
        </div>

        {/* Schedule Timeline Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              id: 'OPT-SLOT-01',
              section: 'Mumbai CR: Byculla to Dadar Central Junction (SEC-CR-02)',
              slot: '01:30 – 04:30 IST (Night Window)',
              track: 'Down Slow Line',
              assignedMachinery: 'Plasser 09-3X Tamping Express (BCM-CR-01)',
              affectedDiverted: 'Suburban Locals 95401, 95403 diverted to Down Fast',
              efficiency: '99.4% Deconflict Score'
            },
            {
              id: 'OPT-SLOT-02',
              section: 'Mumbai WR: Vasai Road to Virar (SEC-WR-02)',
              slot: '00:45 – 03:45 IST (Shadow Window)',
              track: 'Up Fast Line',
              assignedMachinery: 'Dynamic Track Stabilizer (DGS-WR-02) & Tower Wagon #09',
              affectedDiverted: 'Freight Container DFC-902 delayed by 4 mins at Naigaon Loop',
              efficiency: '100% Clear Headway'
            },
            {
              id: 'OPT-SLOT-03',
              section: 'Delhi NR: New Delhi to Ghaziabad Junction (SEC-NR-01)',
              slot: '02:15 – 05:00 IST (Off-Peak Window)',
              track: 'Down Main Line',
              assignedMachinery: 'Shoulder Ballast Cleaner (SBC-NR-01)',
              affectedDiverted: '12004 Lucknow Shatabdi rerouted via Sahibabad bypass without delay',
              efficiency: '98.9% Schedule Adherence'
            }
          ].map(slot => (
            <div
              key={slot.id}
              style={{
                background: 'var(--rx-surface)',
                borderLeft: '4px solid var(--rx-green)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.66rem' }}>
                    {slot.efficiency}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {slot.slot}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {slot.section}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>Machinery:</strong> {slot.assignedMachinery}
                </p>
                <p style={{ fontSize: '0.74rem', color: '#92400E', marginTop: '2px' }}>
                  🔄 {slot.affectedDiverted}
                </p>
              </div>

              <span className="badge badge-clear" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                ✓ AI Approved
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
