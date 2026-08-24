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
import { ProblemIntakeManager } from './ProblemIntakeManager';
import {
  Map, Cpu, AlertTriangle, BarChart3,
  Activity, Wifi, Train as TrainIcon, Zap, Calendar, LifeBuoy
} from 'lucide-react';

export const PlannerDashboard: React.FC = () => {
  const { trackSections, trains, megaBlocks, accidents, problemReports, persona, activeTab, setActiveTab } = useRailway();
  const { t, language } = useLanguage();
  const { mapStyle } = useSettings();

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active');
  const activeProblems = problemReports.filter(r => r.status !== 'RESOLVED');

  const tabs = [
    { id: 'map', icon: <Map size={15} />, label: t('tab.map') },
    { id: 'optimizer', icon: <Cpu size={15} />, label: t('tab.optimizer') },
    { id: 'megablock', icon: <Calendar size={15} />, label: t('tab.megablock') },
    { id: 'accidents', icon: <AlertTriangle size={15} />, label: t('tab.accidents'), badge: activeAccidents.length },
    { id: 'problems', icon: <LifeBuoy size={15} />, label: language === 'mr' ? 'समस्या निवारण' : 'RailMadad & Issues', badge: activeProblems.length },
    { id: 'analytics', icon: <BarChart3 size={15} />, label: t('tab.analytics') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 40px' }}>
      {/* Telemetry Ticker Strip */}
      <div style={{
        background: 'linear-gradient(135deg, var(--rx-header) 0%, var(--rx-header-sub) 100%)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        overflowX: 'auto',
        flexWrap: 'nowrap',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(255,255,255,0.06)'
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

        {/* Metric Cards in Circular Orbital Format */}
        <div className="circle-metrics-deck">
          {[
            {
              icon: <Wifi size={16} color="var(--rx-green)" />,
              value: `${((trackSections.filter(s => s.status === 'clear').length / trackSections.length) * 100).toFixed(1)}%`,
              percentage: (trackSections.filter(s => s.status === 'clear').length / trackSections.length) * 100,
              label: t('metrics.networkAvailability'),
              sub: `${trackSections.filter(s => s.status === 'clear').length}/${trackSections.length} ${t('metrics.sectionsClear')}`,
              color: 'var(--rx-green)',
              trackColor: 'rgba(5, 150, 105, 0.15)',
              strokeColor: '#059669'
            },
            {
              icon: <TrainIcon size={16} color="var(--rx-blue)" />,
              value: `${trains.length}`,
              percentage: Math.min(100, (trains.length / 15) * 100),
              label: t('metrics.activeTrains'),
              sub: `${trains.filter(t => t.status !== 'on_time').length} ${t('metrics.delayedDiverted')}`,
              color: 'var(--rx-blue)',
              trackColor: 'rgba(37, 99, 235, 0.15)',
              strokeColor: '#2563EB'
            },
            {
              icon: <Calendar size={16} color="var(--rx-amber)" />,
              value: `${megaBlocks.length}`,
              percentage: Math.min(100, (megaBlocks.length / 8) * 100),
              label: t('metrics.blocksScheduled'),
              sub: `${activeMegaBlocks.length} ${t('metrics.active')}`,
              color: 'var(--rx-amber)',
              trackColor: 'rgba(217, 119, 6, 0.15)',
              strokeColor: '#D97706'
            },
            {
              icon: <Zap size={16} color="var(--rx-orange)" />,
              value: '95.8%',
              percentage: 95.8,
              label: t('metrics.fleetUtilization'),
              sub: t('metrics.optimized'),
              color: 'var(--rx-orange)',
              trackColor: 'rgba(234, 88, 12, 0.15)',
              strokeColor: '#EA580C'
            }
          ].map((card, i) => {
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (card.percentage / 100) * circumference;

            return (
              <div key={i} className="circle-metric-pod">
                {/* Circular Gauge Dial */}
                <div className="circle-dial-container">
                  <svg className="circle-dial-svg" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={card.trackColor}
                      strokeWidth="7"
                    />
                    {/* Active Circular Progress Arc */}
                    <circle
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={card.strokeColor}
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>

                  {/* Dial Center Content */}
                  <div className="circle-dial-content">
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: card.trackColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '2px'
                    }}>
                      {card.icon}
                    </div>
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: card.color,
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-display)'
                    }}>
                      {card.value}
                    </div>
                  </div>
                </div>

                {/* Metric Label & Subtitle */}
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '2px' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {card.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation (Responsive horizontal swipe on mobile) */}
        <div className="nav-tabs-container" style={{
          display: 'flex',
          gap: '6px',
          padding: '4px',
          background: 'var(--rx-surface-alt)',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '20px',
          width: 'fit-content',
          maxWidth: '100%',
          border: '1px solid var(--border-light)'
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
                  ? 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
                boxShadow: activeTab === tab.id ? '0 2px 10px var(--rx-green-glow)' : 'none'
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '4px',
                  background: 'var(--rx-red)', color: '#FFFFFF',
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
        {activeTab === 'problems' && <ProblemIntakeManager />}
        {activeTab === 'analytics' && <AssetAnalyticsView />}
      </div>
    </div>
  );
};
