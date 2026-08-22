import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  CalendarClock, 
  ShieldAlert, 
  BarChart3, 
  Train, 
  Activity, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
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
      {/* BookMyShow Hero Carousel Banner */}
      <HeroCarousel onActionClick={handleCarouselAction} />

      {/* Emergency Live Alerts Ticker */}
      <LiveAlertBanner onNavigateToIncidents={() => setActiveTab('accidents')} />

      {/* Simulation Sandbox Toolbar */}
      <SimulationControls />

      {/* BookMyShow Style Quick Telemetry Grid */}
      <div className="grid-metrics">
        {/* Track Network Availability */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Network Availability</span>
            <Activity size={15} color="var(--bms-green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {Math.round((clearTracksCount / trackSections.length) * 100)}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({clearTracksCount}/{trackSections.length} Sections Clear)
            </span>
          </div>
          <div style={{ height: '4px', background: '#EEEEEE', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(clearTracksCount / trackSections.length) * 100}%`, background: 'var(--bms-green)' }} />
          </div>
        </div>

        {/* Active Trains on Corridor */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Active Trains on Grid</span>
            <Train size={15} color="var(--bms-red)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {trains.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: delayedTrainsCount > 0 ? 'var(--bms-red)' : 'var(--bms-green)', fontWeight: 600 }}>
              {delayedTrainsCount > 0 ? `${delayedTrainsCount} Delayed/Diverted` : 'All On-Time'}
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Vande Bharat, Rajdhani, Suburban Locals
          </p>
        </div>

        {/* Mega Blocks Status */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Mega Blocks Scheduled</span>
            <CalendarClock size={15} color="var(--bms-amber)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-dark)' }} className="font-display">
              {activeBlocksCount} Active
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({megaBlocks.length} Total)
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tamping, OHE wire maintenance, bridges
          </p>
        </div>

        {/* AI Efficiency Score */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>AI Fleet Utilization</span>
            <Sparkles size={15} color="var(--bms-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--bms-red)' }} className="font-display">
              {metrics.afterOptimization.assetUtilizationPercent}%
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
              +28% Optimized
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Constraint programming solver active
          </p>
        </div>
      </div>

      {/* BookMyShow Style Category Tab Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: '8px',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-card)'
      }}>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeTab === 'map' ? 'var(--bms-red)' : 'transparent',
            color: activeTab === 'map' ? '#FFFFFF' : 'var(--text-dark)',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={15} />
          Corridor Track Radar
        </button>

        <button
          onClick={() => setActiveTab('optimizer')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeTab === 'optimizer' ? 'var(--bms-red)' : 'transparent',
            color: activeTab === 'optimizer' ? '#FFFFFF' : 'var(--text-dark)',
            transition: 'all 0.15s ease'
          }}
        >
          <Cpu size={15} />
          AI Auto-Block Solver Studio
        </button>

        <button
          onClick={() => setActiveTab('megablock')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeTab === 'megablock' ? 'var(--bms-red)' : 'transparent',
            color: activeTab === 'megablock' ? '#FFFFFF' : 'var(--text-dark)',
            transition: 'all 0.15s ease'
          }}
        >
          <CalendarClock size={15} />
          Mega Block Manager ({megaBlocks.length})
        </button>

        <button
          onClick={() => setActiveTab('accidents')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeTab === 'accidents' ? 'var(--bms-red)' : 'transparent',
            color: activeTab === 'accidents' ? '#FFFFFF' : activeAccidentsCount > 0 ? 'var(--bms-red)' : 'var(--text-dark)',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldAlert size={15} />
          Incident Command Feed {activeAccidentsCount > 0 && `(${activeAccidentsCount})`}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeTab === 'analytics' ? 'var(--bms-red)' : 'transparent',
            color: activeTab === 'analytics' ? '#FFFFFF' : 'var(--text-dark)',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart3 size={15} />
          Fleet Analytics & Reports
        </button>
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
