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
  Sparkles,
  Ticket,
  AlertOctagon,
  Train,
  Compass,
  LifeBuoy,
  Plus,
  Zap,
  MapPin
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { LiveAlertBanner } from '../LiveAlertBanner';
import { SimulationControls } from '../SimulationControls';
import { AiLiveNotificationBar } from '../notifications/AiLiveNotificationBar';
import { PersonalizedAlertCard } from './PersonalizedAlertCard';
import { AccidentRerouteAdvisorModal } from './AccidentRerouteAdvisorModal';
import { railwayApi } from '../../services/apiClient';
import { 
  INITIAL_PASSENGER_BOOKINGS, 
  INITIAL_DISRUPTION_NOTIFICATIONS, 
  INITIAL_REROUTE_OPTIONS 
} from '../../data/mockData';
import { DisruptionNotification, PassengerBooking, RerouteOption } from '../../types/railway';

export const PassengerPortal: React.FC = () => {
  const { 
    megaBlocks, 
    accidents, 
    problemReports,
    setIsProblemModalOpen,
    selectedDivision, 
    openTripPlanner 
  } = useRailway();
  const { t, localize, language } = useLanguage();

  const [searchOrigin, setSearchOrigin] = useState<string>('CSMT Mumbai');
  const [searchDest, setSearchDest] = useState<string>('Kalyan Junction');
  const [searched, setSearched] = useState<boolean>(true);

  // PNR Disruption Scanner State
  const [pnrInput, setPnrInput] = useState<string>('8421984210');
  const [isPnrScanning, setIsPnrScanning] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<PassengerBooking | null>(INITIAL_PASSENGER_BOOKINGS[0]);
  const [activeNotification, setActiveNotification] = useState<DisruptionNotification | null>(
    INITIAL_DISRUPTION_NOTIFICATIONS['8421984210']
  );
  const [isRerouteAdvisorOpen, setIsRerouteAdvisorOpen] = useState<boolean>(false);

  const activeAccidents = accidents.filter(a => a.status !== 'resolved');
  const activeMegaBlocks = megaBlocks.filter(b => b.status === 'active' || b.status === 'scheduled');

  const filteredBlocks = activeMegaBlocks.filter(b => 
    selectedDivision === 'All' || b.division === selectedDivision
  );

  const handlePnrSearch = async (pnrToSearch?: string) => {
    const targetPnr = pnrToSearch || pnrInput;
    setIsPnrScanning(true);
    const { booking, disruption } = await railwayApi.scanDisruptionForPnr(targetPnr);
    setActiveBooking(booking);
    setActiveNotification(disruption);
    setIsPnrScanning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Simulation Bar */}
      <SimulationControls />

      {/* AI Live Real-Time Disruption & Problem Notification Bar */}
      <AiLiveNotificationBar />

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
            {/* 139 RailMadad — main call button */}
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
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              <PhoneCall size={14} />
              {t('passenger.helpline139')}
            </a>

            {/* Direct Problem Report SOS Button */}
            <button
              onClick={() => setIsProblemModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, var(--rx-red) 0%, #DC2626 100%)',
                padding: '9px 20px',
                borderRadius: 'var(--radius-pill)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => { (e.currentTarget.style.transform = 'translateY(-1px)'); }}
              onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); }}
            >
              <LifeBuoy size={15} />
              {language === 'mr' ? '🚨 समस्या नोंदवा / SOS' : '🚨 Report Problem / SOS'}
            </button>

            {/* GRP Emergency: 1512 */}
            <a
              href="tel:1512"
              title="GRP Emergency — Police Helpline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-pill)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.18s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <PhoneCall size={13} />
              {t('passenger.grpHelp')}: <strong style={{ color: '#FCD34D', marginLeft: '2px' }}>1512</strong>
            </a>

            {/* Women Safety: 182 */}
            <a
              href="tel:182"
              title="Women Safety Helpline — 182"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-pill)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.18s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <PhoneCall size={13} />
              {t('passenger.womenSafety')}: <strong style={{ color: '#FCD34D', marginLeft: '2px' }}>182</strong>
            </a>
          </div>
        </div>
      </div>

      {/* ── AI Feature 1 & 3: PNR Live Disruption & Emergency Route Rethink ── */}
      <div className="bms-card" style={{ padding: '26px', borderLeft: '4px solid var(--rx-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-blue)' }}>
              <Ticket size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="bms-section-title" style={{ fontSize: '1.18rem', margin: 0 }}>
                  AI PNR Disruption & Exact Emergency Journey Checker
                </h3>
                <span className="badge badge-clear" style={{ fontSize: '0.66rem' }}>
                  Features 1 & 3 AI
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Check if your scheduled Indian Railways PNR intersects with active accidents or mega blocks in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* PNR Search & Quick Sample Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="input-control"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                placeholder="Enter 10-Digit Indian Railways PNR (e.g. 8421984210)"
                style={{ fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.04em' }}
              />
            </div>
            <button
              type="button"
              disabled={isPnrScanning}
              onClick={() => handlePnrSearch()}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.84rem', fontWeight: 700 }}
            >
              <Sparkles size={16} />
              {isPnrScanning ? 'Scanning Network...' : 'Check Disruption Status'}
            </button>
          </div>

          {/* Quick Sample PNR Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Try Demo PNRs:</span>
            {INITIAL_PASSENGER_BOOKINGS.map((b) => (
              <button
                key={b.pnr}
                type="button"
                onClick={() => {
                  setPnrInput(b.pnr);
                  handlePnrSearch(b.pnr);
                }}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  border: pnrInput === b.pnr ? '1.5px solid var(--rx-blue)' : '1px solid var(--border-light)',
                  background: pnrInput === b.pnr ? 'rgba(37, 99, 235, 0.08)' : 'transparent'
                }}
              >
                #{b.pnr} ({b.passengerName.split(' ')[0]} • Train #{b.trainNumber})
              </button>
            ))}
          </div>
        </div>

        {/* Render Personalized Alert Card */}
        {activeNotification && (
          <PersonalizedAlertCard
            notification={activeNotification}
            booking={activeBooking}
            onExploreReroute={() => setIsRerouteAdvisorOpen(true)}
          />
        )}
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
              onClick={() => {
                setSearched(true);
                openTripPlanner(searchOrigin, searchDest);
              }}
              className="btn btn-green"
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span>From: <strong>CSMT Platform 4</strong> (14:30)</span>
                  <ArrowRight size={13} color="#999999" />
                  <span>To: <strong>Kalyan Platform 3</strong> (15:28)</span>
                </div>
                <button
                  onClick={() => openTripPlanner('CSMT Mumbai', 'Kalyan Junction')}
                  className="btn btn-primary"
                  style={{ padding: '6px 16px', fontSize: '0.75rem' }}
                >
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: '16px' }}>
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
                    {localize(block.division)}
                  </span>
                  <span className={`badge ${block.status === 'active' ? 'badge-megablock' : 'badge-cyan'}`} style={{ fontSize: '0.62rem' }}>
                    {block.status === 'active' ? t('passenger.inProgressNow') : t('passenger.upcoming')}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  {localize(block.sectionName)}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#92400E', marginBottom: '10px' }}>
                  <Clock size={13} />
                  <span>{block.date} • <strong>{block.startTime} – {block.endTime}</strong></span>
                </div>

                <div style={{ background: 'var(--rx-surface-alt)', padding: '10px 12px', borderRadius: 'var(--radius-xs)', fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <div><strong>{t('passenger.linesAffected')}:</strong> {block.linesAffected}</div>
                  <div><strong>{t('passenger.maintenanceWork')}:</strong> {localize(block.reason)}</div>
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-accident" style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                    CRITICAL: {inc.natureOfIncident.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    Reported: {inc.reportedAt}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Train #{inc.trainNumber} ({inc.trainName})
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  {inc.sectionName}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.5', overflowWrap: 'break-word' }}>
                  {inc.publicEmergencyAdvisory}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', borderTop: '1px solid rgba(239,68,68,0.2)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <a
                      href={`tel:${inc.passengerAssistanceContact?.replace(/[^0-9]/g, '') || '139'}`}
                      style={{
                        color: '#059669',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        textDecoration: 'none',
                        background: 'rgba(5, 150, 105, 0.1)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid rgba(5, 150, 105, 0.25)'
                      }}
                      title="Call Helpline"
                    >
                      <PhoneCall size={12} />
                      Helpline: {inc.passengerAssistanceContact || '139'}
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsRerouteAdvisorOpen(true)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}
                    >
                      {t('alert.alternateRoute')}
                    </button>
                  </div>

                  <span style={{ color: 'var(--text-secondary)' }}>
                    Relief: <strong style={{ color: 'var(--text-dark)' }}>{inc.reliefTrainStatus}</strong> ({inc.reliefTrainId || 'En route'})
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Expected Normalcy: <strong style={{ color: 'var(--text-dark)' }}>{inc.estimatedTrackRestoration}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RailMadad: Live Problem & Community Issue Radar (Real-Time Passenger Sync) ── */}
      <div className="bms-card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--rx-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-orange)' }}>
              <LifeBuoy size={22} className="pulse-radar" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="bms-section-title" style={{ fontSize: '1.18rem' }}>
                  {language === 'mr' ? '🚨 रेल मदद: थेट समस्या निवारण व स्थिती' : '🚨 RailMadad: Live Problem & Grievance Radar'}
                </h3>
                <span className="badge badge-clear" style={{ fontSize: '0.65rem' }}>
                  LIVE SYNC
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {language === 'mr'
                  ? 'प्रवाशांनी व कर्मचाऱ्यांनी नोंदवलेल्या समस्या, ट्रॅक दोष व थेट कार्यवाही स्थिती'
                  : 'Real-time feed of passenger & field reports, AI triage priority, and engineering gang actions'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: 'var(--rx-orange)', fontSize: '0.72rem' }}>
              {problemReports.filter(r => r.status !== 'RESOLVED').length} Active Issues
            </span>
            <button
              onClick={() => setIsProblemModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.78rem', padding: '7px 14px', background: 'var(--rx-orange)' }}
            >
              <Plus size={14} />
              {language === 'mr' ? 'समस्या नोंदवा' : 'Report Issue'}
            </button>
          </div>
        </div>

        {problemReports.length === 0 ? (
          <div style={{ background: 'var(--rx-green-light)', padding: '18px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={24} color="#15803D" />
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#15803D' }}>
                {language === 'mr' ? 'सर्व यंत्रणा सुरळीत' : 'All Clear — No Active Track Problems'}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {language === 'mr' ? 'सध्या कोणतीही प्रलंबित तक्रार नाही.' : 'No open passenger or infrastructure grievances reported in this division.'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '14px' }}>
            {problemReports.map(report => {
              const isResolved = report.status === 'RESOLVED';
              const isDispatched = report.status === 'DISPATCHED';
              const isCritical = report.severity === 'CRITICAL_SOS';

              return (
                <div
                  key={report.id}
                  style={{
                    background: 'var(--rx-surface)',
                    borderTop: `4px solid ${
                      isResolved
                        ? 'var(--rx-green)'
                        : isCritical
                        ? 'var(--rx-red)'
                        : report.severity === 'HIGH'
                        ? 'var(--rx-orange)'
                        : 'var(--rx-blue)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--rx-orange)' }}>
                        {report.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 800,
                          background: isResolved ? 'var(--rx-green-light)' : isDispatched ? 'var(--rx-orange-light)' : 'var(--rx-blue-light)',
                          color: isResolved ? 'var(--rx-green)' : isDispatched ? 'var(--rx-orange)' : 'var(--rx-blue)'
                        }}
                      >
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 6px' }}>
                      {report.title}
                    </h4>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.45 }}>
                      {report.description}
                    </p>

                    <div style={{ background: 'var(--rx-surface-alt)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', color: 'var(--text-body)', marginBottom: '8px' }}>
                      <div><strong>Location:</strong> {report.stationOrSection}</div>
                      {report.trainNumber && <div><strong>Train:</strong> #{report.trainNumber}</div>}
                      {report.actionTaken && <div style={{ color: 'var(--rx-green)', marginTop: '4px' }}>⚡ <strong>Status:</strong> {report.actionTaken}</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>By: {report.reporterName}</span>
                    <span>{report.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reroute Advisor Modal */}
      <AccidentRerouteAdvisorModal
        isOpen={isRerouteAdvisorOpen}
        onClose={() => setIsRerouteAdvisorOpen(false)}
        trainNumber={activeNotification?.train_number || '12951'}
        trainName={activeNotification?.train_name || 'Mumbai Rajdhani Express'}
        sectionCode={activeNotification?.exact_incident_details || 'Agra Cantt ➔ Mathura Jn'}
        rerouteOptions={activeNotification?.reroute_options || INITIAL_REROUTE_OPTIONS}
      />
    </div>
  );
};
