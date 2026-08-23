import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  CalendarClock, 
  ShieldAlert, 
  BarChart3, 
  Train, 
  Activity, 
  Sparkles
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { InteractiveTrackMap } from './InteractiveTrackMap';
import { AiBlockOptimizer } from './AiBlockOptimizer';
import { MegaBlockManager } from './MegaBlockManager';
import { AccidentIncidentManager } from './AccidentIncidentManager';
import { AssetAnalyticsView } from './AssetAnalyticsView';
import { LiveAlertBanner } from '../LiveAlertBanner';
import { SimulationControls } from '../SimulationControls';
import { HeroCarousel } from '../HeroCarousel';

export const PlannerDashboard: React.FC = () => {
  const { trackSections, trains, megaBlocks, accidents, metrics } = useRailway();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'map' | 'optimizer' | 'megablock' | 'accidents' | 'analytics'>('map');

  const clearTracksCount = trackSections.filter(s => s.status === 'clear').length;
  const activeAccidentsCount = accidents.filter(a => a.status !== 'resolved').length;
  const activeBlocksCount = megaBlocks.filter(b => b.status === 'active').length;
  const delayedTrainsCount = trains.filter(t => t.status === 'delayed' || t.status === 'halted_safety').length;

  const handleCarouselAction = (action: string) => {
    if (['map', 'optimizer', 'megablock', 'accidents', 'analytics'].includes(action)) {
      setActiveTab(action as any);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero Carousel Banner */}
      <HeroCarousel onActionClick={handleCarouselAction} />

      {/* Emergency Live Alerts Ticker */}
      <LiveAlertBanner onNavigateToIncidents={() => setActiveTab('accidents')} />

      {/* Simulation Sandbox Toolbar */}
      <SimulationControls />

      {/* Quick Telemetry Grid */}
      <div className="grid-metrics">
        {/* Track Network Availability */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{t('metrics.networkAvailability')}</span>
            <Activity size={15} color="var(--rx-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {Math.round((clearTracksCount / trackSections.length) * 100)}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({clearTracksCount}/{trackSections.length} {t('metrics.sectionsClear')})
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--rx-surface-alt)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(clearTracksCount / trackSections.length) * 100}%`, background: 'var(--rx-green)' }} />
          </div>
        </div>

        {/* Active Trains on Corridor */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{t('metrics.activeTrains')}</span>
            <Train size={15} color="var(--rx-orange)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {trains.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: delayedTrainsCount > 0 ? 'var(--rx-red)' : 'var(--rx-green)', fontWeight: 600 }}>
              {delayedTrainsCount > 0 ? `${delayedTrainsCount} ${t('metrics.delayedDiverted')}` : t('metrics.allOnTime')}
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('metrics.fleetTypes')}
          </p>
        </div>

        {/* Mega Blocks Status */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{t('metrics.blocksScheduled')}</span>
            <CalendarClock size={15} color="var(--rx-amber)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {activeBlocksCount} {t('metrics.active')}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({megaBlocks.length} {t('metrics.total')})
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('metrics.blockWorkTypes')}
          </p>
        </div>

        {/* AI Efficiency Score */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{t('metrics.fleetUtilization')}</span>
            <Sparkles size={15} color="var(--rx-blue)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--rx-orange)' }} className="font-display">
              {metrics.afterOptimization.assetUtilizationPercent}%
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
              +28% {t('metrics.optimized')}
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('metrics.solverActive')}
          </p>
        </div>
      </div>

      {/* Category Tab Bar with fluid pill buttons */}
      <div style={{
        background: 'var(--rx-surface)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-card)'
      }}>
        {[
          { id: 'map', icon: <Layers size={15} />, label: t('tab.map') },
          { id: 'optimizer', icon: <Cpu size={15} />, label: t('tab.optimizer') },
          { id: 'megablock', icon: <CalendarClock size={15} />, label: `${t('tab.megablock')} (${megaBlocks.length})` },
          { id: 'accidents', icon: <ShieldAlert size={15} />, label: `${t('tab.accidents')} ${activeAccidentsCount > 0 ? `(${activeAccidentsCount})` : ''}` },
          { id: 'analytics', icon: <BarChart3 size={15} />, label: t('tab.analytics') }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === tab.id ? 'var(--rx-orange)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-body)',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-sans)',
              boxShadow: activeTab === tab.id ? '0 2px 10px var(--rx-orange-glow)' : 'none'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab View */}
      {activeTab === 'map' && <InteractiveTrackMap />}
      {activeTab === 'optimizer' && <AiBlockOptimizer />}
      {activeTab === 'megablock' && <MegaBlockManager />}
      {activeTab === 'accidents' && <AccidentIncidentManager />}
      {activeTab === 'analytics' && <AssetAnalyticsView />}
    </div>
  );
};
