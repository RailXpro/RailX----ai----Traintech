import React from 'react';
import {
  X, Train, Gauge, Radio, ShieldCheck, MapPin, AlertTriangle,
  Zap, Calendar, Clock, Activity, Cpu, ArrowRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { TrackSection } from '../../types/railway';

interface CorridorInspectorModalProps {
  section: TrackSection | null;
  onClose: () => void;
}

const IR_STATION_META: Record<string, { code: string; hiMr: string; msl: string }> = {
  'CSMT Mumbai': { code: 'CSMT', hiMr: 'छत्रपती शिवाजी महाराज टर्मिनस', msl: '14.2m' },
  'Byculla': { code: 'BY', hiMr: 'भायखळा', msl: '11.5m' },
  'Dadar CR': { code: 'DR', hiMr: 'दादर मध्य', msl: '12.8m' },
  'Thane': { code: 'TNA', hiMr: 'ठाणे', msl: '16.0m' },
  'Kalyan Junction': { code: 'KYN', hiMr: 'कल्याण जंक्शन', msl: '19.4m' },
  'Kasara': { code: 'KSRA', hiMr: 'कसारा', msl: '280.0m' },
  'Churchgate': { code: 'CCG', hiMr: 'चर्चगेट', msl: '10.2m' },
  'Mumbai Central': { code: 'MMCT', hiMr: 'मुंबई सेंट्रल', msl: '12.0m' },
  'Dadar WR': { code: 'DDR', hiMr: 'दादर पश्चिम', msl: '12.8m' },
  'Borivali': { code: 'BVI', hiMr: 'बोरिवली', msl: '14.5m' },
  'Virar': { code: 'VR', hiMr: 'विरार', msl: '18.2m' },
  'Dahanu Road': { code: 'DRD', hiMr: 'डहाणू रोड', msl: '22.0m' },
  'New Delhi': { code: 'NDLS', hiMr: 'नई दिल्ली', msl: '216.0m' },
  'New Delhi (NDLS)': { code: 'NDLS', hiMr: 'नई दिल्ली', msl: '216.0m' },
  'Ghaziabad Junction': { code: 'GZB', hiMr: 'गाजियाबाद जंक्शन', msl: '217.0m' },
  'Aligarh Junction': { code: 'ALJN', hiMr: 'अलीगढ़ जंक्शन', msl: '186.0m' },
  'Kanpur Central': { code: 'CNB', hiMr: 'कानपुर सेंट्रल', msl: '132.0m' },
  'Howrah Junction': { code: 'HWH', hiMr: 'हावड़ा जंक्शन', msl: '12.0m' },
  'Bardhaman Junction': { code: 'BWN', hiMr: 'बर्धमान जंक्शन', msl: '36.0m' },
};

export const CorridorInspectorModal: React.FC<CorridorInspectorModalProps> = ({ section, onClose }) => {
  const {
    trains,
    megaBlocks,
    accidents,
    setActiveTab,
    setPersona,
    openTripPlanner,
    runAiOptimizer
  } = useRailway();

  const { t, localize, language } = useLanguage();

  if (!section) return null;

  const sectionTrains = trains.filter(t => t.currentSectionId === section.id);
  const activeBlock = megaBlocks.find(b => b.sectionId === section.id && b.status === 'active');
  const sectionAccident = accidents.find(a => a.sectionId === section.id && a.status !== 'resolved');

  const fromMeta = IR_STATION_META[section.fromStation] || { code: 'DEP', hiMr: section.fromStation, msl: '15m' };
  const toMeta = IR_STATION_META[section.toStation] || { code: 'ARR', hiMr: section.toStation, msl: '15m' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10, 15, 29, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--rx-surface)',
        borderRadius: '24px',
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* ── Official Indian Railways Station Signboard Header ─────── */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF08A 100%)',
          borderBottom: '3px solid #000000',
          padding: '18px 24px',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: '#000000', color: '#FFCC00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}>
              IR
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{
                  background: '#000000', color: '#FFCC00',
                  fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px'
                }}>
                  [{section.zone} / {section.code}]
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E293B' }}>
                  {localize(section.division)} • 1676mm Broad Gauge
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000000', fontFamily: 'serif' }}>
                [{fromMeta.code}] {fromMeta.hiMr} ➔ [{toMeta.code}] {toMeta.hiMr}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginTop: '1px' }}>
                {localize(section.name)} • {section.lengthKm} KM
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#000000', border: 'none', borderRadius: '10px',
              color: '#FFF', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Alert if Mega Block or Accident */}
          {activeBlock && (
            <div style={{
              background: 'var(--rx-amber-light)', border: '1.5px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px'
            }}>
              <AlertTriangle size={20} color="var(--rx-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.84rem', color: '#92400E' }}>
                  {language === 'mr' ? 'सक्रिय मेगा ब्लॉक (Traffic Possession)' : 'Active Engineering Mega Block Possession'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#78350F', margin: '3px 0 0', lineHeight: 1.45 }}>
                  {localize(activeBlock.reason)} ({activeBlock.startTime} - {activeBlock.endTime}) • Lines: {activeBlock.linesAffected}
                </p>
              </div>
            </div>
          )}

          {sectionAccident && (
            <div style={{
              background: 'var(--rx-red-light)', border: '1.5px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px'
            }}>
              <AlertTriangle size={20} color="var(--rx-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.84rem', color: 'var(--rx-red)' }}>
                  {language === 'mr' ? 'आपत्कालीन घटना अहवाल (Incident Command)' : 'Emergency Disruption & Track Cordon Notice'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#991B1B', margin: '3px 0 0', lineHeight: 1.45 }}>
                  {localize(sectionAccident.natureOfIncident)} • Train #{sectionAccident.trainNumber} ({localize(sectionAccident.description)})
                </p>
              </div>
            </div>
          )}

          {/* Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            {[
              {
                icon: <Gauge size={18} color="var(--rx-blue)" />,
                label: language === 'mr' ? 'कमाल वेग मर्यादा (MPS)' : 'Section MPS Speed',
                value: `${section.maxSpeedKmph} km/h`,
                sub: section.currentTsrKmph ? `Caution TSR: ${section.currentTsrKmph} km/h` : 'No Speed Restrictions'
              },
              {
                icon: <Activity size={18} color="var(--rx-orange)" />,
                label: language === 'mr' ? 'लाईन सॅच्युरेशन इंडेक्स' : 'Line Saturation Index',
                value: `${section.currentUtilizationPercent}%`,
                sub: `${section.lines} BG Tracks (${section.signalsCount} ABS Signals)`
              },
              {
                icon: <Train size={18} color="var(--rx-green)" />,
                label: language === 'mr' ? 'थेट धावणाऱ्या गाड्या' : 'Live Active Trains',
                value: `${sectionTrains.length} Trains`,
                sub: `WAP-7 / WAG-9 / EMU 3-Phase`
              },
              {
                icon: <ShieldCheck size={18} color="#A855F7" />,
                label: language === 'mr' ? 'कवच सुरक्षा व कर्षण' : 'Kavach & Traction',
                value: 'SIL-4 Armed',
                sub: `${section.electrification} OHE`
              }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--rx-surface-alt)',
                borderRadius: '16px', padding: '14px 16px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {stat.icon}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.18rem', fontWeight: 900, color: 'var(--text-dark)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Active Trains on Section */}
          <div style={{
            background: 'var(--rx-surface-alt)',
            borderRadius: '18px', padding: '18px 20px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Train size={16} color="var(--rx-orange)" />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {language === 'mr' ? 'या कॉरिडॉरवरील थेट गाड्या' : 'Live Trains Currently on this Section'} ({sectionTrains.length})
                </h3>
              </div>
            </div>

            {sectionTrains.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {language === 'mr' ? 'या विभागात सध्या कोणतीही गाडी नाही (मार्ग पूर्णपणे मोकळा)' : 'No trains currently in this section block (Track Clear)'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sectionTrains.map(train => (
                  <div key={train.id} style={{
                    background: 'var(--rx-surface)',
                    padding: '12px 16px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        background: 'var(--rx-orange-light)', color: 'var(--rx-orange)',
                        padding: '4px 8px', borderRadius: '8px', fontWeight: 900, fontSize: '0.74rem'
                      }}>
                        #{train.number}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                          {localize(train.name)}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                          {localize(train.origin)} ➔ {localize(train.destination)} • {train.type}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--rx-blue)' }}>
                          {train.speedKmph} km/h
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>
                          Loco: {train.locomotiveId} (WAP-7)
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
                        background: train.status === 'on_time' ? 'var(--rx-green-light)' : 'var(--rx-amber-light)',
                        color: train.status === 'on_time' ? '#15803D' : '#92400E'
                      }}>
                        {train.status === 'on_time' ? 'ON TIME' : `DELAY ${train.delayMinutes}m`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Operations CTA Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px',
            borderTop: '1px solid var(--border-light)', paddingTop: '16px'
          }}>
            <button
              onClick={() => {
                onClose();
                openTripPlanner(section.fromStation, section.toStation);
              }}
              className="btn btn-primary"
              style={{
                padding: '10px 16px', borderRadius: '12px', fontSize: '0.78rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              🧭 {language === 'mr' ? 'प्रवास योजना तयार करा' : 'Plan Trip Route'}
            </button>

            <button
              onClick={() => {
                onClose();
                setPersona('planner');
                setActiveTab('optimizer');
                runAiOptimizer();
              }}
              style={{
                background: 'var(--rx-blue)', color: '#FFF', border: 'none',
                padding: '10px 16px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              ⚡ {language === 'mr' ? 'AI ब्लॉक ऑप्टिमायझेशन' : 'Run AI Optimization'}
            </button>

            <button
              onClick={() => {
                onClose();
                setPersona('planner');
                setActiveTab('megablock');
              }}
              style={{
                background: 'var(--rx-surface-alt)', color: 'var(--text-dark)', border: '1px solid var(--border-medium)',
                padding: '10px 16px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              📅 {language === 'mr' ? 'मेगा ब्लॉक शेड्युल' : 'Schedule Mega Block'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
