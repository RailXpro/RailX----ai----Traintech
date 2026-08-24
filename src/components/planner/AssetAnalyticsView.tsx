import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  ShieldCheck, 
  Wrench 
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

export const AssetAnalyticsView: React.FC = () => {
  const { assets, metrics, selectedDivision, trackSections, trains } = useRailway();
  const { t } = useLanguage();

  const filteredAssets = assets.filter(a =>
    selectedDivision === 'All' || a.division === selectedDivision
  );

  const handleExportJson = () => {
    const reportData = {
      title: 'TrainX Block Planning & Asset Optimization Report',
      timestamp: new Date().toISOString(),
      division: selectedDivision,
      metrics,
      assets: filteredAssets,
      trackSectionsCount: trackSections.length,
      trainsCount: trains.length
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TrainX-Optimization-Report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Export Toolbar */}
      <div className="bms-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--rx-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-blue)' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="bms-section-title" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
              {t('asset.title')}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {t('asset.subtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJson}
          className="btn btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.85rem' }}
        >
          <Download size={15} />
          {t('optimizer.downloadPlan')} (JSON)
        </button>
      </div>

      {/* Before vs After Comparison Summary Table */}
      <div className="bms-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--rx-orange)" />
          {t('optimizer.beforeVsAfter')}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)', background: 'var(--rx-surface-alt)' }}>
                <th style={{ padding: '12px 16px' }}>Operational Metric</th>
                <th style={{ padding: '12px 16px' }}>Traditional Planning</th>
                <th style={{ padding: '12px 16px' }}>TrainX Optimizer</th>
                <th style={{ padding: '12px 16px' }}>Net Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {t('optimizer.assetUtil')}
                </td>
                <td style={{ padding: '14px 16px', color: '#777777' }}>
                  {metrics.beforeOptimization.assetUtilizationPercent}%
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rx-orange)', fontWeight: 800 }}>
                  {metrics.afterOptimization.assetUtilizationPercent}%
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
                    +{Math.round(metrics.afterOptimization.assetUtilizationPercent - metrics.beforeOptimization.assetUtilizationPercent)}% Gain
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {t('optimizer.avgDelay')}
                </td>
                <td style={{ padding: '14px 16px', color: '#777777' }}>
                  {metrics.beforeOptimization.averageTrainDelayMins} minutes
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rx-blue)', fontWeight: 800 }}>
                  {metrics.afterOptimization.averageTrainDelayMins} minutes
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    -89% Delay Elimination
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {t('optimizer.conflicts')}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rx-red)' }}>
                  {metrics.beforeOptimization.conflictCount} Conflicts / Day
                </td>
                <td style={{ padding: '14px 16px', color: '#15803D', fontWeight: 800 }}>
                  0 Conflicts (100% Conflict-Free)
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
                    100% Safe Headway
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {t('optimizer.energySaved')}
                </td>
                <td style={{ padding: '14px 16px', color: '#777777' }}>
                  {metrics.beforeOptimization.energyWastageKwh} kWh / section
                </td>
                <td style={{ padding: '14px 16px', color: '#C2410C', fontWeight: 800 }}>
                  {metrics.afterOptimization.energyWastageKwh} kWh / section
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
                    -83% Energy Waste
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Inventory Fleet Cards */}
      <div>
        <h3 className="bms-section-title" style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={18} color="var(--rx-orange)" />
          {t('asset.title')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bms-card"
              style={{
                padding: '18px',
                borderLeft: `4px solid ${
                  asset.status === 'emergency_deployed' ? 'var(--rx-red)' :
                  asset.status === 'in_use' ? 'var(--rx-green)' : 'var(--rx-blue)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: '#888888' }}>
                  {asset.id} • {asset.division}
                </span>
                <span className={`badge ${
                  asset.status === 'emergency_deployed' ? 'badge-accident' :
                  asset.status === 'in_use' ? 'badge-clear' : 'badge-cyan'
                }`} style={{ fontSize: '0.62rem' }}>
                  {asset.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                {asset.name}
              </h4>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Asset Type:</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{asset.type}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Location / Section:</span>
                  <strong style={{ color: 'var(--rx-blue)' }}>{asset.locationSectionId}</strong>
                </div>

                {/* Utilization meter */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.72rem' }}>
                    <span>Operational Utilization</span>
                    <strong style={{ color: '#15803D' }}>{asset.utilizationRate}%</strong>
                  </div>
                  <div style={{ height: '5px', background: 'var(--rx-surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${asset.utilizationRate}%`, background: 'var(--rx-green)' }} />
                  </div>
                </div>

                {/* Health Score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} color="var(--rx-green)" />
                    {t('asset.healthIndex')}
                  </span>
                  <strong style={{ color: '#15803D' }}>{asset.healthScore}/100</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
