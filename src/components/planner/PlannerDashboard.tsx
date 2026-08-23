import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { InteractiveTrackMap } from './InteractiveTrackMap';
import { CircleRouteMap } from './CircleRouteMap';
import { LiveAlertBanner } from '../LiveAlertBanner';
import { SimulationControls } from '../SimulationControls';
import { AiBlockOptimizer } from './AiBlockOptimizer';
import { MegaBlockManager } from './MegaBlockManager';
import { AccidentIncidentManager } from './AccidentIncidentManager';
import { AssetAnalyticsView } from './AssetAnalyticsView';
import {
  Map, Cpu, AlertTriangle, BarChart3,
  Activity, Wifi, Train as TrainIcon, Zap, Calendar
} from 'lucide-react';

export const PlannerDashboard: React.FC = () => {
  const { trackSections, trains, megaBlocks, accidents, persona } = useRailway();
  const { t } = useLanguage();
  const { mapStyle } = useSettings();
  const [activeTab, setActiveTab] = useState<string>('map');

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active');

  const tabs = [
    { id: 'map', icon: <Map size={15} />, label: t('tab.map') },
    { id: 'optimizer', icon: <Cpu size={15} />, label: t('tab.optimizer') },
    { id: 'megablock', icon: <Calendar size={15} />, label: t('tab.megablock') },
    { id: 'accidents', icon: <AlertTriangle size={15} />, label: t('tab.accidents'), badge: activeAccidents.length },
    { id: 'analytics', icon: <BarChart3 size={15} />, label: t('tab.analytics') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 40px' }}>
      {/* Telemetry Ticker Strip */}
      <div style={{
        background: 'var(--rx-header)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        overflowX: 'auto',
        flexWrap: 'nowrap'
      }}>
        {[
          {
            icon: <Wifi size={13} color="var(--rx-green)" />,
            value: `${((trackSections.filter(s => s.status === 'clear').length / trackSections.length) * 100).toFixed(1)}%`,
            label: t('metrics.networkAvailability'),
            color: 'var(--rx-green)'
          },
          {
            icon: <TrainIcon size={13} color="var(--rx-blue)" />,
            value: trains.length,
            label: t('metrics.activeTrains'),
            color: 'var(--rx-blue)'
          },
          {
            icon: <Calendar size={13} color="var(--rx-amber)" />,
            value: activeMegaBlocks.length,
            label: t('metrics.blocksScheduled'),
            color: 'var(--rx-amber)'
          },
          {
            icon: <Activity size={13} color="var(--rx-orange)" />,
            value: `${megaBlocks.reduce((s, b) => s + b.crewGangCount, 0)}`,
            label: t('metrics.active'),
            color: 'var(--rx-orange)'
          },
          {
            icon: <Zap size={13} color="#22C55E" />,
            value: '95.8%',
            label: t('metrics.fleetUtilization'),
            color: '#22C55E'
          }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {item.icon}
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: '0.7rem', color: '#7A8499', whiteSpace: 'nowrap' }}>{item.label}</span>
            {i < 4 && <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1rem' }}>|</span>}
          </div>
        ))}
      </div>

      {/* Main Content Pad */}
      <div style={{ padding: '0 24px' }}>
        {/* Simulation Controls */}
        {persona === 'planner' && <SimulationControls />}

        {/* Live Alert Banners */}
        <LiveAlertBanner onNavigateToIncidents={() => setActiveTab('accidents')} />

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            {
              icon: <Wifi size={20} color="var(--rx-green)" />,
              value: `${((trackSections.filter(s => s.status === 'clear').length / trackSections.length) * 100).toFixed(1)}%`,
              label: t('metrics.networkAvailability'),
              sub: `${trackSections.filter(s => s.status === 'clear').length}/${trackSections.length} ${t('metrics.sectionsClear')}`,
              bg: 'var(--rx-green-light)',
              accent: '#15803D'
            },
            {
              icon: <TrainIcon size={20} color="var(--rx-blue)" />,
              value: trains.length,
              label: t('metrics.activeTrains'),
              sub: `${trains.filter(t => t.status !== 'on_time').length} ${t('metrics.delayedDiverted')}`,
              bg: 'var(--rx-blue-light)',
              accent: 'var(--rx-blue)'
            },
            {
              icon: <Calendar size={20} color="var(--rx-amber)" />,
              value: megaBlocks.length,
              label: t('metrics.blocksScheduled'),
              sub: `${activeMegaBlocks.length} ${t('metrics.active')}`,
              bg: 'var(--rx-amber-light)',
              accent: '#92400E'
            },
            {
              icon: <Zap size={20} color="var(--rx-orange)" />,
              value: '95.8%',
              label: t('metrics.fleetUtilization'),
              sub: t('metrics.optimized'),
              bg: 'var(--rx-orange-light)',
              accent: 'var(--rx-orange)'
            }
          ].map((card, i) => (
            <div key={i} className="metric-card" style={{
              padding: '16px',
              background: 'var(--rx-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.accent }}
                className="font-display">{card.value}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>{card.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '4px',
          background: 'var(--rx-surface-alt)',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '20px',
          width: 'fit-content',
          maxWidth: '100%'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '8px',
                  background: '#EF4444', color: '#FFFFFF',
                  borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '0.6rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'map' && (
          mapStyle === 'circle' ? <CircleRouteMap /> : <InteractiveTrackMap />
        )}
        {activeTab === 'optimizer' && <AiBlockOptimizer />}
        {activeTab === 'megablock' && <MegaBlockManager />}
        {activeTab === 'accidents' && <AccidentIncidentManager />}
        {activeTab === 'analytics' && <AssetAnalyticsView />}
      </div>
    </div>
  );
};
