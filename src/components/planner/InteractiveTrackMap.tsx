import React, { useState } from 'react';
import { 
  Train as TrainIcon, 
  Zap, 
  Gauge, 
  MapPin, 
  Layers,
  Info,
  ChevronRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { TrackSection } from '../../types/railway';

export const InteractiveTrackMap: React.FC = () => {
  const { 
    trackSections, 
    trains, 
    selectedDivision, 
    selectedSectionId, 
    setSelectedSectionId
  } = useRailway();

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
        return <span className="badge badge-clear">★ 98% AVAILABLE</span>;
      case 'mega_block': 
        return <span className="badge badge-megablock">MEGA BLOCK ACTIVE</span>;
      case 'accident': 
        return <span className="badge badge-accident">CORDONED OFF</span>;
      case 'speed_restriction': 
        return <span className="badge badge-cyan">TSR SPEED LIMIT</span>;
      default: 
        return <span className="badge badge-clear">NORMAL</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* BookMyShow Section Header */}
      <div className="bms-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 className="bms-section-title" style={{ fontSize: '1.2rem' }}>
            Recommended Corridors & Track Possession Status
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Real-time track occupancy, speed restrictions, and automated signal state
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterStatus === 'all' ? 'var(--bms-red)' : '#E0E0E0',
              background: filterStatus === 'all' ? 'var(--bms-red-light)' : '#FFFFFF',
              color: filterStatus === 'all' ? 'var(--bms-red)' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            All Tracks ({trackSections.length})
          </button>
          <button
            onClick={() => setFilterStatus('clear')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterStatus === 'clear' ? '#2e7d32' : '#E0E0E0',
              background: filterStatus === 'clear' ? 'var(--bms-green-light)' : '#FFFFFF',
              color: filterStatus === 'clear' ? '#2e7d32' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            🟢 Available ({trackSections.filter(s => s.status === 'clear').length})
          </button>
          <button
            onClick={() => setFilterStatus('mega_block')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterStatus === 'mega_block' ? '#b7791f' : '#E0E0E0',
              background: filterStatus === 'mega_block' ? 'var(--bms-amber-light)' : '#FFFFFF',
              color: filterStatus === 'mega_block' ? '#b7791f' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            🟡 Mega Block ({trackSections.filter(s => s.status === 'mega_block').length})
          </button>
          <button
            onClick={() => setFilterStatus('accident')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterStatus === 'accident' ? 'var(--bms-red)' : '#E0E0E0',
              background: filterStatus === 'accident' ? 'var(--bms-red-light)' : '#FFFFFF',
              color: filterStatus === 'accident' ? 'var(--bms-red)' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            🔴 Incident ({trackSections.filter(s => s.status === 'accident').length})
          </button>
        </div>
      </div>

      {/* Grid of Track Cards in BookMyShow Poster/Event Style */}
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
                border: isSelected ? '2px solid var(--bms-red)' : '1px solid var(--border-light)',
                boxShadow: isSelected ? '0 6px 20px rgba(248, 68, 100, 0.2)' : 'var(--shadow-card)',
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
                <MapPin size={13} color="var(--bms-red)" />
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
                  background: sec.status === 'accident' ? 'var(--bms-red-light)' : 'var(--bms-amber-light)',
                  border: `1px solid ${sec.status === 'accident' ? 'var(--bms-red-border)' : '#fed7aa'}`,
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '0.73rem',
                  color: sec.status === 'accident' ? 'var(--bms-red)' : '#b7791f',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {sec.blockReason}
                </div>
              )}

              {/* Capacity Progress Bar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Section Capacity Utilization</span>
                  <strong style={{ color: sec.currentUtilizationPercent > 85 ? 'var(--bms-red)' : '#2e7d32' }}>
                    {sec.currentUtilizationPercent}%
                  </strong>
                </div>
                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${sec.currentUtilizationPercent}%`,
                    background: sec.currentUtilizationPercent > 85 ? 'var(--bms-red)' : 'var(--bms-green)'
                  }} />
                </div>
              </div>

              {/* Card Footer Telemetry & Action CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', borderTop: '1px solid #F0F0F0', paddingTop: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Gauge size={13} color="var(--bms-cyan)" />
                  {sec.maxSpeedKmph} km/h
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrainIcon size={13} color="var(--bms-red)" />
                  {secTrains.length} Active Trains
                </span>
                <span style={{ color: 'var(--bms-red)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  Inspect <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Section Inspector Drawer */}
      {activeSection && (
        <div className="bms-card" style={{ padding: '22px', borderTop: '4px solid var(--bms-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bms-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
                <Info size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  Section Telemetry: {activeSection.name} ({activeSection.code})
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Division: {activeSection.division} • Electrification: {activeSection.electrification} • Length: {activeSection.lengthKm} KM
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSectionId(null)}
              className="btn btn-secondary"
              style={{ padding: '5px 14px', fontSize: '0.78rem' }}
            >
              Close Inspector
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Real-Time Trains on this section */}
            <div style={{ background: '#F8F8FB', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--bms-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrainIcon size={15} />
                Active Trains in Section ({trainsInSelectedSection.length})
              </h4>
              {trainsInSelectedSection.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No trains currently occupying this section block.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trainsInSelectedSection.map(t => (
                    <div key={t.id} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid #EAEAEA' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-dark)' }}>#{t.number} {t.name}</span>
                        <span style={{ color: t.status === 'on_time' ? '#2e7d32' : 'var(--bms-red)' }}>
                          {t.status.toUpperCase()} ({t.delayMinutes}m delay)
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
            <div style={{ background: '#F8F8FB', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--bms-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={15} />
                Track & Signal Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Max Permissible Speed:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.maxSpeedKmph} km/h</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Current TSR (Restriction):</span>
                  <div style={{ fontWeight: 700, color: activeSection.currentTsrKmph ? '#b7791f' : '#2e7d32', marginTop: '2px' }}>
                    {activeSection.currentTsrKmph ? `${activeSection.currentTsrKmph} km/h` : 'No Restriction'}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Signal Blocks:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.signalsCount} Automatic Signals</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Corridor Track Lines:</span>
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
