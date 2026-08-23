import React from 'react';
import {
  ShieldCheck, ShieldAlert, Radio, Activity, Zap, CheckCircle2,
  AlertTriangle, X, Gauge, Train, Cpu, ArrowRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

export const KavachModal: React.FC = () => {
  const { isKavachModalOpen, setIsKavachModalOpen, trains, trackSections } = useRailway();
  const { language } = useLanguage();

  if (!isKavachModalOpen) return null;

  const kavachEquippedTrains = trains.filter(t => t.speedKmph > 0);
  const totalCoveredKm = trackSections.reduce((acc, s) => acc + s.lengthKm, 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10, 15, 29, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--rx-surface)',
        borderRadius: '24px',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F1C3D 0%, #162B60 100%)',
          padding: '24px 28px',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px var(--rx-orange-glow)'
            }}>
              <Zap size={24} color="#FFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                  Kavach 2.0 {language === 'mr' ? 'थेट सुरक्षा कवच टेलीमेट्री' : 'Live Telemetry HUD'}
                </h2>
                <span style={{
                  background: 'rgba(34, 197, 94, 0.2)', color: 'var(--rx-green)',
                  fontSize: '0.68rem', fontWeight: 800, padding: '3px 9px', borderRadius: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.4)', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rx-green)', boxShadow: '0 0 6px var(--rx-green)' }} />
                  {language === 'mr' ? 'सक्रिय प्रणाली' : 'SYSTEM ARMED'}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '4px 0 0' }}>
                {language === 'mr'
                  ? 'भारतीय रेल्वे स्वदेशी स्वयंचलित ट्रेन संरक्षण (ATP) प्रणाली • सिल-4 सुरक्षा स्तर'
                  : 'Indian Railways Indigenous Automatic Train Protection (ATP) • SIL-4 Certified Safety Level'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKavachModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)', border: 'none', borderRadius: '12px',
              color: '#FFF', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              {
                icon: <Radio size={18} color="var(--rx-blue)" />,
                label: language === 'mr' ? 'रेडिओ लिंक वारंवारता' : 'UHF Radio Link',
                value: '433.5 MHz',
                sub: language === 'mr' ? 'थेट द्वि-मार्गी ट्रान्समिशन' : 'Duplex Live Link'
              },
              {
                icon: <Cpu size={18} color="var(--rx-green)" />,
                label: language === 'mr' ? 'RFID टॅग घनता' : 'Trackside RFID Tags',
                value: '1,842 Tags',
                sub: language === 'mr' ? '१ किमी अंतरावर १ टॅग' : '1 tag per 1.0 km'
              },
              {
                icon: <Train size={18} color="var(--rx-orange)" />,
                label: language === 'mr' ? 'सुसज्ज लोकोमोटिव्ह' : 'Locos Armed',
                value: `${kavachEquippedTrains.length} Units`,
                sub: language === 'mr' ? 'थेट GPS+कवच ओसीयू' : 'Active On-Board Units'
              },
              {
                icon: <Gauge size={18} color="#A855F7" />,
                label: language === 'mr' ? 'आच्छादित कॉरिडॉर' : 'Protected Corridor',
                value: `${totalCoveredKm.toFixed(0)} KM`,
                sub: language === 'mr' ? 'स्वयंचलित ब्रेक प्रणाली' : 'Auto Brake Protocol'
              }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--rx-surface-alt)',
                borderRadius: '16px', padding: '14px 16px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {stat.icon}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-dark)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Subsystems Status */}
          <div style={{
            background: 'var(--rx-surface-alt)',
            borderRadius: '18px', padding: '18px 20px',
            border: '1px solid var(--border-light)'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--rx-green)" />
              {language === 'mr' ? 'कवच २.० उपप्रणाली थेट स्थिती' : 'Kavach Subsystem Live Health Matrix'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { name: language === 'mr' ? 'SPAD प्रतिबंध (सिग्नल पास अ‍ॅट डेंजर)' : 'SPAD Prevention (Signal Passing)', status: 'Optimal', code: 'SIL-4' },
                { name: language === 'mr' ? 'समोरासमोर धडक प्रतिबंध (Head-on Collision)' : 'Head-On Collision Avoidance', status: 'Optimal', code: 'Active' },
                { name: language === 'mr' ? 'मागील धडक प्रतिबंध (Rear-end Collision)' : 'Rear-End Collision Avoidance', status: 'Optimal', code: 'Active' },
                { name: language === 'mr' ? 'लोको पायलट SOS आणि हॉर्न ऑटो-विझल' : 'Auto Whistling at LC Gates', status: 'Optimal', code: 'Geofenced' },
                { name: language === 'mr' ? 'कवच स्टेशन ओसीयू आणि लूप लाइन स्पीड' : 'Station OCU & Loop Speed Restrict', status: 'Optimal', code: '30 km/h' },
                { name: language === 'mr' ? 'आपत्कालीन ब्रेक ट्रिगर प्रोटोकॉल' : 'Auto Brake Actuation Relay', status: 'Armed', code: 'Standby' }
              ].map((sub, idx) => (
                <div key={idx} style={{
                  background: 'var(--rx-surface)',
                  padding: '10px 12px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: '1px solid var(--border-light)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sub.code}</div>
                  </div>
                  <span style={{
                    fontSize: '0.66rem', fontWeight: 800, color: 'var(--rx-green)',
                    background: 'var(--rx-green-light)', padding: '2px 8px', borderRadius: '8px'
                  }}>
                    ✓ {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Loco Units Feed */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--rx-orange)" />
              {language === 'mr' ? 'थेट कवच-सक्रिय गाड्या आणि टेलिमेट्री' : 'Armed Trains Active Telemetry Feed'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trains.slice(0, 4).map((train, i) => (
                <div key={i} style={{
                  background: 'var(--rx-surface-alt)',
                  borderRadius: '14px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--rx-orange-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--rx-orange)', fontWeight: 800, fontSize: '0.8rem'
                    }}>
                      #{train.number.slice(-3)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>{train.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                        {language === 'mr' ? 'प्रकार' : 'Type'}: {train.type} • {language === 'mr' ? 'वेग' : 'Speed'}: {train.speedKmph} km/h • {language === 'mr' ? 'सिग्नल अंतर' : 'Next Signal'}: 1.4 km
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--rx-green)', fontWeight: 700, display: 'block' }}>
                        ● KAVACH LINK OK
                      </span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Ping: 12ms</span>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '8px',
                      background: train.status === 'on_time' ? 'var(--rx-green-light)' : 'var(--rx-amber-light)',
                      color: train.status === 'on_time' ? '#15803D' : '#92400E',
                      fontSize: '0.7rem', fontWeight: 800
                    }}>
                      {train.status === 'on_time' ? 'SAFE RUN' : 'CAUTION'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
