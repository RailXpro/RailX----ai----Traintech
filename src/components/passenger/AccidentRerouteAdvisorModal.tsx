import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ArrowRight, 
  Bus, 
  Train as TrainIcon, 
  Zap, 
  ThumbsUp,
  MapPin,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RerouteOption } from '../../types/railway';
import { useLanguage } from '../../context/LanguageContext';

interface AccidentRerouteAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber?: string;
  trainName?: string;
  sectionCode?: string;
  rerouteOptions?: RerouteOption[];
  onAdoptRoute?: (option: RerouteOption) => void;
}

export const AccidentRerouteAdvisorModal: React.FC<AccidentRerouteAdvisorModalProps> = ({
  isOpen,
  onClose,
  trainNumber = '12951',
  trainName = 'Mumbai Rajdhani Express',
  sectionCode = 'AGC - MTJ (Agra Cantt ➔ Mathura Jn)',
  rerouteOptions = [],
  onAdoptRoute
}) => {
  const { t } = useLanguage();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    rerouteOptions.length > 0 ? rerouteOptions[0].option_id : 'REROUTE-RAIL-CHORD-01'
  );
  const [adoptedOption, setAdoptedOption] = useState<RerouteOption | null>(null);

  if (!isOpen) return null;

  const activeOptions = rerouteOptions.length > 0 ? rerouteOptions : [
    {
      option_id: 'REROUTE-RAIL-CHORD-01',
      strategy_type: 'RAIL_DIVERSION_CHORD_BYPASS' as const,
      title: 'Direct Rail Chord Diversion via Sawai Madhopur ➔ Jaipur ➔ Rewari',
      path_stations: ['KOTA', 'SWM', 'JP', 'RE', 'DEC', 'NDLS'],
      bypassed_blocked_stations: ['AGC', 'MTJ', 'NZM'],
      additional_distance_km: 38.0,
      revised_eta: '11:45 AM (Today)',
      delay_minutes: 190,
      comfort_score: 0.94,
      feasibility_status: 'RECOMMENDED BY AI',
      reasoning: 'Train remains continuous. No passenger deboarding required. Clear signal slots available via Jaipur-Rewari electrified cord.',
      mode: 'Train Diversion'
    },
    {
      option_id: 'REROUTE-MULTI-HOP-02',
      strategy_type: 'MULTI_HOP_CONNECTING' as const,
      title: 'Transfer at Kota Jn to Connecting Vande Bharat Express #20977',
      path_stations: ['KOTA', 'JP', 'DEC', 'NDLS'],
      bypassed_blocked_stations: ['AGC', 'MTJ'],
      additional_distance_km: 15.0,
      revised_eta: '10:15 AM (Today)',
      delay_minutes: 105,
      comfort_score: 0.89,
      feasibility_status: 'FASTEST TRANSIT',
      reasoning: 'Guaranteed berth transfer at Kota Jn onto High-Speed Vande Bharat. Saves ~85 minutes vs waiting.',
      mode: 'High Speed Transfer'
    },
    {
      option_id: 'REROUTE-INTERMODAL-03',
      strategy_type: 'INTERMODAL_SHUTTLE' as const,
      title: 'Emergency Highway Bus Shuttle (Agra Cantt ➔ Mathura Jn) + Onward Train',
      path_stations: ['AGC', 'EXPRESSWAY_BUS_SHUTTLE', 'MTJ', 'NZM', 'NDLS'],
      bypassed_blocked_stations: ['AGC-MTJ Rail Track'],
      additional_distance_km: 0.0,
      revised_eta: '09:40 AM (Today)',
      delay_minutes: 68,
      comfort_score: 0.76,
      feasibility_status: 'EMERGENCY SHUTTLE',
      reasoning: 'Air-conditioned express coach bridges blocked rail section via Yamuna Expressway.',
      mode: 'Intermodal Coach Bridge'
    }
  ];

  const currentOption = activeOptions.find(o => o.option_id === selectedOptionId) || activeOptions[0];

  const handleConfirmAdoption = () => {
    setAdoptedOption(currentOption);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
    if (onAdoptRoute) {
      onAdoptRoute(currentOption);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 15, 30, 0.86)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div
        className="bms-card"
        style={{
          width: '100%',
          maxWidth: '860px',
          background: 'var(--rx-surface)',
          borderRadius: 'var(--radius-md)',
          maxHeight: '92vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* ── Modal Header ── */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--rx-header) 0%, #11224D 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--rx-orange-glow)'
            }}>
              <Compass size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
                  Smart Dynamic Alternative Route Advisor
                </h3>
                <span className="badge badge-clear" style={{ fontSize: '0.66rem' }}>
                  AI Multi-Strategy Solver
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.76rem', color: '#CBD5E1' }}>
                Train #{trainNumber} ({trainName}) • Disrupted Section: <strong>{sectionCode}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Success Banner if Adopted */}
          {adoptedOption && (
            <div style={{
              background: 'var(--rx-green-light)',
              border: '2px solid #16A34A',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color="#16A34A" />
                <div>
                  <strong style={{ color: '#15803D', display: 'block', fontSize: '0.9rem' }}>
                    AI Alternative Route Adopted Successfully!
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#166534' }}>
                    Your itinerary is updated. Revised ETA: <strong>{adoptedOption.revised_eta}</strong>. IRCTC berth reservations mirrored.
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn btn-green"
                style={{ padding: '7px 16px', fontSize: '0.78rem' }}
              >
                Close & Return
              </button>
            </div>
          )}

          {/* Route Strategy Selection Tabs */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
              Select AI Alternative Strategy ({activeOptions.length} Options Generated):
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {activeOptions.map((opt) => {
                const isSelected = opt.option_id === selectedOptionId;
                return (
                  <div
                    key={opt.option_id}
                    onClick={() => setSelectedOptionId(opt.option_id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--rx-surface-alt)' : 'var(--rx-surface)',
                      border: isSelected ? '2px solid var(--rx-blue)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-pill)',
                          background: opt.feasibility_status.includes('RECOMMENDED') ? 'var(--rx-green-light)' : 'rgba(37, 99, 235, 0.12)',
                          color: opt.feasibility_status.includes('RECOMMENDED') ? '#15803D' : '#1D4ED8'
                        }}
                      >
                        {opt.feasibility_status}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rx-orange)' }}>
                        Comfort: {Math.round(opt.comfort_score * 100)}%
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px', lineHeight: 1.3 }}>
                      {opt.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      <span>ETA: <strong style={{ color: 'var(--text-dark)' }}>{opt.revised_eta}</strong></span>
                      <span>+ {opt.delay_minutes} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Strategy Deep Dive */}
          {currentOption && (
            <div style={{
              background: 'var(--rx-surface-alt)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {currentOption.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Strategy: <strong style={{ color: 'var(--text-dark)' }}>{currentOption.strategy_type.replace(/_/g, ' ')}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-clear" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    Extra Distance: +{currentOption.additional_distance_km} km
                  </span>
                  <span className="badge badge-megablock" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    Delay: +{currentOption.delay_minutes} mins
                  </span>
                </div>
              </div>

              {/* Station Path Breadcrumbs */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Sequential Station Route Topology:
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  background: 'var(--rx-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-light)'
                }}>
                  {currentOption.path_stations.map((stn, idx) => (
                    <React.Fragment key={idx}>
                      <span style={{
                        padding: '4px 10px',
                        background: stn.includes('BUS') ? 'var(--rx-amber-light)' : 'rgba(37, 99, 235, 0.1)',
                        color: stn.includes('BUS') ? '#92400E' : '#1D4ED8',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        fontFamily: 'monospace'
                      }}>
                        {stn}
                      </span>
                      {idx < currentOption.path_stations.length - 1 && (
                        <ArrowRight size={13} color="#94A3B8" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bypassed Blocked Sections */}
              {currentOption.bypassed_blocked_stations.length > 0 && (
                <div style={{ fontSize: '0.76rem', color: '#DC2626', background: 'rgba(239, 68, 68, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-xs)' }}>
                  🚫 <strong>Bypasses Blocked Accidents at:</strong> {currentOption.bypassed_blocked_stations.join(', ')}
                </div>
              )}

              {/* AI Reasoning */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="var(--rx-orange)" />
                  AI Optimization Rationale:
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {currentOption.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.82rem' }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmAdoption}
              className="btn btn-primary"
              style={{ padding: '9px 22px', fontSize: '0.84rem', fontWeight: 700 }}
            >
              <ThumbsUp size={16} />
              Adopt This Alternative Route
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
