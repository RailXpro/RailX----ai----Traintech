import React, { useState } from 'react';
import { 
  CalendarClock, 
  ShieldAlert, 
  Search, 
  Bus, 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { LiveAlertBanner } from '../LiveAlertBanner';
import { SimulationControls } from '../SimulationControls';

export const PassengerPortal: React.FC = () => {
  const { megaBlocks, accidents, selectedDivision } = useRailway();
  const { t } = useLanguage();

  const [searchOrigin, setSearchOrigin] = useState<string>('CSMT Mumbai');
  const [searchDest, setSearchDest] = useState<string>('Kalyan Junction');
  const [searched, setSearched] = useState<boolean>(true);

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active' || b.status === 'scheduled');

  const filteredBlocks = activeMegaBlocks.filter(b => 
    selectedDivision === 'All' || b.division === selectedDivision
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Simulation Bar */}
      <SimulationControls />

      {/* Emergency Alerts Banner */}
      <LiveAlertBanner />

      {/* Passenger Hero Card */}
      <div
        className="bms-card"
        style={{
          padding: '30px',
          background: 'linear-gradient(135deg, #0F1C3D 0%, #162248 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge" style={{ background: 'var(--rx-orange)', color: '#FFFFFF', fontSize: '0.72rem' }}>
              {t('passenger.heroBadge1')}
            </span>
            <span className="badge badge-clear" style={{ fontSize: '0.72rem' }}>
              {t('passenger.heroBadge2')}
            </span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>
            {t('passenger.heroTitle')}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#D0D5DD', lineHeight: '1.6' }}>
            {t('passenger.heroSubtitle')}
          </p>

          {/* Quick Helplines Strip */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
            <a
              href="tel:139"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--rx-orange)',
                padding: '9px 20px',
                borderRadius: 'var(--radius-pill)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                boxShadow: '0 2px 10px var(--rx-orange-glow)',
                transition: 'all 0.18s ease'
              }}
            >
              <PhoneCall size={14} />
              {t('passenger.helpline139')}
            </a>
            <span style={{ fontSize: '0.82rem', color: '#E0E0E0' }}>
              {t('passenger.grpHelp')}: <strong style={{ color: '#FFFFFF' }}>1512</strong>
            </span>
            <span style={{ fontSize: '0.82rem', color: '#E0E0E0' }}>
              {t('passenger.womenSafety')}: <strong style={{ color: '#FFFFFF' }}>182</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Smart Alternate Journey Route Finder */}
      <div className="bms-card" style={{ padding: '26px' }}>
        <h3 className="bms-section-title" style={{ fontSize: '1.18rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--rx-orange)" />
          {t('passenger.journeyPlannerTitle')}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          {t('passenger.journeyPlannerSubtitle')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>
              {t('passenger.origin')}
            </label>
            <input
              type="text"
              className="input-control"
              value={searchOrigin}
              onChange={(e) => setSearchOrigin(e.target.value)}
              placeholder="e.g. CSMT Mumbai, Churchgate, Dadar"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>
              {t('passenger.destination')}
            </label>
            <input
              type="text"
              className="input-control"
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              placeholder="e.g. Kalyan, Borivali, Virar"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setSearched(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px 18px', borderRadius: 'var(--radius-sm)' }}
            >
              <Search size={16} />
              {t('passenger.findRoute')}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Recommended Option 1: Diverted Fast Local */}
            <div style={{
              background: 'var(--rx-surface)',
              borderLeft: '5px solid var(--rx-green)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                    {t('passenger.recAi')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t('passenger.departingIn')}
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: '#15803D', fontWeight: 800 }}>
                  {t('passenger.estTime')}: 58 {t('passenger.mins')}
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                Train #95401: CSMT to Kalyan Fast Local (15-Car Rake)
              </h4>

              <div style={{ background: 'var(--rx-amber-light)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem', color: '#92400E', marginBottom: '10px', lineHeight: '1.45' }}>
                ℹ️ <strong>Block Diversion Advisory:</strong> Diverted to Fast Line between Thane & Dadar to bypass track tamping. Skipping halts at Vidyavihar and Kanjurmarg. Slow line season pass valid.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>From: <strong>CSMT Platform 4</strong> (14:30)</span>
                  <ArrowRight size={13} color="#999999" />
                  <span>To: <strong>Kalyan Platform 3</strong> (15:28)</span>
                </div>
                <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.75rem' }}>
                  {t('passenger.selectTrain')}
                </button>
              </div>
            </div>

            {/* Multimodal Metro / Feeder Bus Link Alternative */}
            <div style={{
              background: 'var(--rx-surface)',
              borderLeft: '5px solid var(--rx-blue)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                  {t('passenger.multimodalTitle')}
                </span>
                <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--rx-blue)', fontWeight: 800 }}>
                  {t('passenger.estTime')}: 64 {t('passenger.mins')}
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                Metro Line 3 / Line 4 + Municipal Feeder Bus Shuttle
              </h4>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {t('passenger.metroDesc')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming & Active Mega Blocks Bulletin for Commuters */}
      <div className="bms-card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--rx-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }}>
              <CalendarClock size={22} />
            </div>
            <div>
              <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
                {t('passenger.bulletinsTitle')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t('passenger.bulletinsSubtitle')}
              </p>
            </div>
          </div>

          <span className="badge badge-megablock" style={{ fontSize: '0.7rem' }}>
            {filteredBlocks.length} {t('passenger.activeScheduledBlocks')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredBlocks.map(block => (
            <div
              key={block.id}
              style={{
                background: 'var(--rx-surface)',
                borderTop: `4px solid ${block.status === 'active' ? 'var(--rx-amber)' : 'var(--rx-blue)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 600 }}>
                    {block.division}
                  </span>
                  <span className={`badge ${block.status === 'active' ? 'badge-megablock' : 'badge-cyan'}`} style={{ fontSize: '0.62rem' }}>
                    {block.status === 'active' ? t('passenger.inProgressNow') : t('passenger.upcoming')}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  {block.sectionName}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#92400E', marginBottom: '10px' }}>
                  <Clock size={13} />
                  <span>{block.date} • <strong>{block.startTime} – {block.endTime}</strong></span>
                </div>

                <div style={{ background: 'var(--rx-surface-alt)', padding: '10px 12px', borderRadius: 'var(--radius-xs)', fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <div><strong>{t('passenger.linesAffected')}:</strong> {block.linesAffected}</div>
                  <div><strong>{t('passenger.maintenanceWork')}:</strong> {block.reason}</div>
                </div>

                <p style={{ fontSize: '0.76rem', color: '#475569', lineHeight: '1.45' }}>
                  📢 {block.publicAdvisory}
                </p>
              </div>

              {block.alternativeBusServices && (
                <div style={{ background: 'var(--rx-green-light)', padding: '8px 12px', borderRadius: 'var(--radius-xs)', fontSize: '0.73rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bus size={13} />
                  <span>{block.alternativeBusServices}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Incident Advisory Feed for Commuters */}
      <div className="bms-card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--rx-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-red)' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
              {t('passenger.safetyTitle')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {t('passenger.safetySubtitle')}
            </p>
          </div>
        </div>

        {activeAccidents.length === 0 ? (
          <div style={{ background: 'var(--rx-green-light)', padding: '18px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={24} color="#15803D" />
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#15803D' }}>
                {t('passenger.allNormal')}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {t('passenger.noAccidents')}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAccidents.map(inc => (
              <div
                key={inc.id}
                style={{
                  background: 'var(--rx-red-light)',
                  borderLeft: '5px solid var(--rx-red)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-accident" style={{ fontSize: '0.65rem' }}>
                    EMERGENCY INCIDENT • {inc.natureOfIncident.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Reported at {inc.reportedAt}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Train #{inc.trainNumber} ({inc.trainName}) — {inc.sectionName}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.45' }}>
                  {inc.publicEmergencyAdvisory}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.75rem', borderTop: '1px solid rgba(239,68,68,0.2)', paddingTop: '10px' }}>
                  <span style={{ color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PhoneCall size={12} />
                    Helpline: {inc.passengerAssistanceContact}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Relief Team: <strong>{inc.reliefTrainStatus}</strong> ({inc.reliefTrainId})
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Expected Normalcy: <strong>{inc.estimatedTrackRestoration}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
