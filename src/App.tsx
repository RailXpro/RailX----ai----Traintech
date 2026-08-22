import React from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Header } from './components/Header';
import { PlannerDashboard } from './components/planner/PlannerDashboard';
import { PassengerPortal } from './components/passenger/PassengerPortal';
import { Train, ShieldCheck, PhoneCall, HelpCircle, Mail, MapPin } from 'lucide-react';

const MainView: React.FC = () => {
  const { persona } = useRailway();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {persona === 'planner' ? <PlannerDashboard /> : <PassengerPortal />}
      </main>

      {/* BookMyShow Style Iconic Dark Footer (#333545 & #222434) */}
      <footer style={{
        background: 'var(--bms-footer-bg)',
        color: '#CCCCCC',
        marginTop: 'auto',
        fontSize: '0.8rem'
      }}>
        {/* Support Strip */}
        <div style={{
          background: 'var(--bms-footer-sub)',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bms-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <PhoneCall size={18} />
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>24/7 Rail Safety & Helpline Support</strong>
                <span style={{ fontSize: '0.75rem', color: '#999999' }}>Instant assistance for passengers and section controllers via 139 & RailMadad</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ABD5D', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                Kavach Safety Active
              </span>
              <span style={{ color: '#E0E0E0' }}>
                CRIS National Telemetry Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '36px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bms-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Train size={16} color="#ffffff" />
              </div>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                TrainX<span style={{ color: 'var(--bms-red)' }}>.ai</span>
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#999999', lineHeight: '1.5' }}>
              Next-generation AI-powered automatic block planning, asset availability maximization, and real-time emergency disruption management for Indian Railways.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Corridor Operations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#AAAAAA' }}>
              <li>Automatic Block Planning (AI Solver)</li>
              <li>Track Possession Scheduling</li>
              <li>Dynamic Speed Profiling (TSR)</li>
              <li>Dedicated Freight Corridor (DFC)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Disruption & Safety
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#AAAAAA' }}>
              <li>Sunday Mega Block Bulletins</li>
              <li>Accident SOS & Section Interlock</li>
              <li>Accident Relief Train (ART) Tracker</li>
              <li>RailMadad 139 Integration</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Divisions Covered
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#AAAAAA' }}>
              <li>Mumbai Central Railway (CR)</li>
              <li>Mumbai Western Railway (WR)</li>
              <li>Delhi Northern Railway (NR)</li>
              <li>Howrah Eastern Railway (ER)</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          background: 'var(--bms-footer-sub)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.73rem',
          color: '#777777',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          Copyright 2026 © TrainX.ai • Indian Railways (भारतीय रेल) & Centre for Railway Information Systems (CRIS). All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <RailwayProvider>
      <MainView />
    </RailwayProvider>
  );
}

export default App;
