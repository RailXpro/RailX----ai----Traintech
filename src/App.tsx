import React from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/Header';
import { PlannerDashboard } from './components/planner/PlannerDashboard';
import { PassengerPortal } from './components/passenger/PassengerPortal';
import { GmailAuthModal } from './components/auth/GmailAuthModal';
import { IndianRailwaysTripPlanner } from './components/planner/IndianRailwaysTripPlanner';
import { Train, ShieldCheck, PhoneCall } from 'lucide-react';

const MainView: React.FC = () => {
  const { persona } = useRailway();
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <Header />
      <GmailAuthModal />
      <IndianRailwaysTripPlanner />

      <main className="main-content">
        {persona === 'planner' ? <PlannerDashboard /> : <PassengerPortal />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--rx-footer-bg)',
        color: '#CCCCCC',
        marginTop: 'auto',
        fontSize: '0.8rem'
      }}>
        {/* Wavy top edge of footer */}
        <div style={{ lineHeight: 0, background: 'var(--rx-cream)' }}>
          <svg viewBox="0 0 1440 38" xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', width: '100%', height: '38px' }} preserveAspectRatio="none">
            <path
              d="M0,18 C180,-2 360,38 540,18 C720,-2 900,38 1080,18 C1260,-2 1380,28 1440,18 L1440,0 L0,0 Z"
              fill="var(--rx-footer-bg)"
            />
          </svg>
        </div>

        {/* Support Strip */}
        <div style={{
          background: 'var(--rx-footer-sub)',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{
            maxWidth: '1260px', margin: '0 auto',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
                boxShadow: '0 4px 12px var(--rx-orange-glow)', flexShrink: 0
              }}>
                <PhoneCall size={18} />
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '0.88rem' }}>
                  {t('footer.helpline')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#888' }}>
                  {t('footer.helplineSub')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--rx-green)', fontWeight: 600 }}>
                <ShieldCheck size={15} /> {t('footer.kavachActive')}
              </span>
              <span style={{ color: '#E0E0E0' }}>{t('footer.cris')}</span>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          maxWidth: '1260px', margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '28px'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '9px',
                background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Train size={17} color="#fff" />
              </div>
              <span className="font-display" style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF' }}>
                TrainX<span style={{ color: 'var(--rx-orange)' }}>.ai</span>
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#7A8499', lineHeight: 1.6 }}>
              Next-generation AI-powered automatic block planning, asset availability maximization, and real-time emergency disruption management for Indian Railways.
            </p>
          </div>

          {/* Corridor Ops */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t('footer.corridors')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: '#7A8499' }}>
              <li>{t('footer.aiBlock')}</li>
              <li>{t('footer.trackPossession')}</li>
              <li>{t('footer.speedProfile')}</li>
              <li>{t('footer.dfc')}</li>
            </ul>
          </div>

          {/* Disruption */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t('footer.disruption')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: '#7A8499' }}>
              <li>{t('footer.megaBlockBulletins')}</li>
              <li>{t('footer.accidentSos')}</li>
              <li>{t('footer.artTracker')}</li>
              <li>{t('footer.railMadad')}</li>
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t('footer.divisions')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: '#7A8499' }}>
              <li>Mumbai Central Railway (CR)</li>
              <li>Mumbai Western Railway (WR)</li>
              <li>Delhi Northern Railway (NR)</li>
              <li>Howrah Eastern Railway (ER)</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          background: 'var(--rx-footer-sub)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: '#555E73',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}>
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <RailwayProvider>
          <MainView />
        </RailwayProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;
