import React, { useState } from 'react';
import { 
  Train as TrainIcon, 
  Gauge, 
  MapPin, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { TrackSection } from '../../types/railway';

export const InteractiveTrackMap: React.FC = () => {
  const { 
    trackSections, 
    trains, 
    selectedDivision, 
    selectedSectionId, 
    setSelectedSectionId
  } = useRailway();
  const { t } = useLanguage();

  const [filterStatus, setFilterStatus] = useState<'all' | 'clear' | 'mega_block' | 'accident'>('all');

  const filteredSections = trackSections.filter(sec => {
    const matchesDiv = selectedDivision === 'All' || sec.division === selectedDivision;
    const matchesStatus = filterStatus === 'all' || sec.status === filterStatus;
    return matchesDiv && matchesStatus;
  });

  const activeSection = trackSections.find(s => s.id === selectedSectionId);
  const trainsInSelectedSection = trains.filter(t => t.currentSectionId === selectedSectionId);

  const getSectionBadge = (status: TrackSection['status']) => {
    switch (status) {
      case 'clear': 
        return <span className="badge badge-clear">{t('map.statusAvailable')}</span>;
      case 'mega_block': 
        return <span className="badge badge-megablock">{t('map.statusMegaBlock')}</span>;
      case 'accident': 
        return <span className="badge badge-accident">{t('map.statusCordoned')}</span>;
      case 'speed_restriction': 
        return <span className="badge badge-cyan">{t('map.statusTsr')}</span>;
      default: 
        return <span className="badge badge-clear">{t('map.statusAvailable')}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Section Header */}
      <div className="bms-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 className="bms-section-title" style={{ fontSize: '1.2rem' }}>
            {t('map.title')}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {t('map.subtitle')}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'all' ? 'var(--rx-orange)' : 'var(--rx-surface-alt)',
              color: filterStatus === 'all' ? '#FFFFFF' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            {t('map.filterAll')} ({trackSections.length})
          </button>
          <button
            onClick={() => setFilterStatus('clear')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'clear' ? 'var(--rx-green)' : 'var(--rx-surface-alt)',
              color: filterStatus === 'clear' ? '#FFFFFF' : '#15803D',
              transition: 'all 0.15s ease'
            }}
          >
            🟢 {t('map.filterClear')} ({trackSections.filter(s => s.status === 'clear').length})
          </button>
          <button
            onClick={() => setFilterStatus('mega_block')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'mega_block' ? 'var(--rx-amber)' : 'var(--rx-surface-alt)',
              color: filterStatus === 'mega_block' ? '#FFFFFF' : '#92400E',
              transition: 'all 0.15s ease'
            }}
          >
            🟡 {t('map.filterBlock')} ({trackSections.filter(s => s.status === 'mega_block').length})
          </button>
          <button
            onClick={() => setFilterStatus('accident')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'accident' ? 'var(--rx-red)' : 'var(--rx-surface-alt)',
              color: filterStatus === 'accident' ? '#FFFFFF' : 'var(--rx-red)',
              transition: 'all 0.15s ease'
            }}
          >
            🔴 {t('map.filterEmergency')} ({trackSections.filter(s => s.status === 'accident').length})
          </button>
        </div>
      </div>

      {/* Grid of Track Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filteredSections.map(sec => {
          const isSelected = selectedSectionId === sec.id;
          const secTrains = trains.filter(t => t.currentSectionId === sec.id);

          return (
            <div
              key={sec.id}
              onClick={() => setSelectedSectionId(isSelected ? null : sec.id)}
              className="bms-card"
              style={{
                padding: '18px',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--rx-orange)' : 'none',
                boxShadow: isSelected ? '0 8px 24px var(--rx-orange-glow)' : 'var(--shadow-card)',
                transform: isSelected ? 'translateY(-2px)' : 'none'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#666666', fontWeight: 600 }}>
                  [{sec.zone}] {sec.code} • {sec.division}
                </span>
                {getSectionBadge(sec.status)}
              </div>

              {/* Title */}
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                {sec.name}
              </h4>

              {/* Stations Route */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <MapPin size={13} color="var(--rx-orange)" />
                <span>{sec.fromStation}</span>
                <span style={{ color: '#CCCCCC' }}>➔</span>
                <span>{sec.toStation}</span>
                <span className="font-mono" style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {sec.lengthKm} km
                </span>
              </div>

              {/* Reason Banner if Blocked */}
              {sec.blockReason && (
                <div style={{
                  background: sec.status === 'accident' ? 'var(--rx-red-light)' : 'var(--rx-amber-light)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '8px 10px',
                  fontSize: '0.73rem',
                  color: sec.status === 'accident' ? 'var(--rx-red)' : '#92400E',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {sec.blockReason}
                </div>
              )}

              {/* Capacity Progress Bar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>{t('map.utilization')}</span>
                  <strong style={{ color: sec.currentUtilizationPercent > 85 ? 'var(--rx-red)' : '#15803D' }}>
                    {sec.currentUtilizationPercent}%
                  </strong>
                </div>
                <div style={{ height: '6px', background: 'var(--rx-surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${sec.currentUtilizationPercent}%`,
                    background: sec.currentUtilizationPercent > 85 ? 'var(--rx-red)' : 'var(--rx-green)'
                  }} />
                </div>
              </div>

              {/* Card Footer Telemetry & Action CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Gauge size={13} color="var(--rx-blue)" />
                  {sec.maxSpeedKmph} km/h
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrainIcon size={13} color="var(--rx-orange)" />
                  {secTrains.length} {t('metrics.active')}
                </span>
                <span style={{ color: 'var(--rx-orange)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  {t('map.selectedSection')} <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Section Inspector Drawer */}
      {activeSection && (
        <div className="bms-card" style={{ padding: '22px', borderTop: '4px solid var(--rx-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-orange)' }}>
                <Info size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {t('map.selectedSection')}: {activeSection.name} ({activeSection.code})
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Division: {activeSection.division} • Electrification: {activeSection.electrification} • {t('map.length')}: {activeSection.lengthKm} KM
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSectionId(null)}
              className="btn btn-secondary"
              style={{ padding: '6px 16px', fontSize: '0.78rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Real-Time Trains on this section */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--rx-orange)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrainIcon size={15} />
                {t('map.trainsOnSection')} ({trainsInSelectedSection.length})
              </h4>
              {trainsInSelectedSection.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('map.noTrains')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trainsInSelectedSection.map(t => (
                    <div key={t.id} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', fontSize: '0.75rem', boxShadow: 'var(--shadow-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-dark)' }}>#{t.number} {t.name}</span>
                        <span style={{ color: t.status === 'on_time' ? '#15803D' : 'var(--rx-red)' }}>
                          {t.status.toUpperCase()} ({t.delayMinutes}m)
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
                        Speed: {t.speedKmph} km/h • Loco: {t.locomotiveId} • Crew: {t.crewId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Block & Safety Telemetry */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--rx-blue)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={15} />
                {t('tab.fleet') || 'Track & Signal Specifications'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('map.speedLimit')}:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.maxSpeedKmph} km/h</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>TSR:</span>
                  <div style={{ fontWeight: 700, color: activeSection.currentTsrKmph ? '#92400E' : '#15803D', marginTop: '2px' }}>
                    {activeSection.currentTsrKmph ? `${activeSection.currentTsrKmph} km/h` : 'No Restriction'}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Signals:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.signalsCount} Automatic Signals</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Lines:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.lines} Dedicated Lines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
