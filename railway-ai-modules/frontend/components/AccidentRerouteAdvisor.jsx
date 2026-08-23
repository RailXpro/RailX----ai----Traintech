/**
 * AccidentRerouteAdvisor.jsx
 * UI Component for Features 1 & 3:
 * Displays exact accident details, journey impact, and interactive AI Alternative Rerouting options.
 */

import React, { useState } from 'react';

export default function AccidentRerouteAdvisor({ 
  accident, 
  passengerJourney, 
  rerouteOptions = [], 
  onSelectOption 
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    rerouteOptions.length > 0 ? rerouteOptions[0].option_id : ''
  );
  const [isAdopted, setIsAdopted] = useState(false);

  const defaultAccident = accident || {
    accident_id: "ACC-2026-0822-01",
    train_number: "12951",
    train_name: "Mumbai Rajdhani Express",
    accident_type: "DERAILMENT",
    severity: "SEVERE",
    division: "Agra Division (NCR)",
    section_code: "AGC - MTJ",
    from_station: "AGC",
    to_station: "MTJ",
    kilometer_marker: "Km 1342/12 (Near Farah)",
    lines_affected: "BOTH UP & DOWN MAIN LINES",
    details: "Rear 3 wagons of Freight Train BTPN derailed at Farah crossover. Track restoration underway with crane rakes.",
    estimated_clearance_hours: 4.5,
    helplines: ["139", "0562-2421204", "1072"]
  };

  const defaultReroutes = rerouteOptions.length > 0 ? rerouteOptions : [
    {
      option_id: "REROUTE-RAIL-CHORD-01",
      strategy_type: "RAIL_DIVERSION_CHORD_BYPASS",
      title: "Direct Rail Chord Diversion via Sawai Madhopur ➔ Jaipur ➔ Rewari",
      path_stations: ["KOTA", "SWM", "JP", "RE", "DEC", "NDLS"],
      bypassed_blocked_stations: ["AGC", "MTJ", "NZM"],
      additional_distance_km: 38.0,
      revised_eta: "11:45 AM (Today)",
      delay_minutes: 190,
      comfort_score: 0.94,
      feasibility_status: "RECOMMENDED BY AI",
      reasoning: "Train remains continuous. No passenger deboarding required. Clear signal slots available via Jaipur-Rewari electrified cord."
    },
    {
      option_id: "REROUTE-MULTI-HOP-02",
      strategy_type: "MULTI_HOP_CONNECTING",
      title: "Transfer at Kota Jn to Connecting Vande Bharat Express #20977",
      path_stations: ["KOTA", "JP", "DEC", "NDLS"],
      bypassed_blocked_stations: ["AGC", "MTJ"],
      additional_distance_km: 15.0,
      revised_eta: "10:15 AM (Today)",
      delay_minutes: 105,
      comfort_score: 0.89,
      feasibility_status: "FASTEST TRANSIT",
      reasoning: "Guaranteed berth transfer at Kota Jn onto High-Speed Vande Bharat. Saves ~85 minutes vs waiting."
    },
    {
      option_id: "REROUTE-INTERMODAL-03",
      strategy_type: "INTERMODAL_SHUTTLE",
      title: "Emergency Highway Bus Shuttle (Agra Cantt ➔ Mathura Jn) + Onward Train",
      path_stations: ["AGC", "EXPRESSWAY_BUS_SHUTTLE", "MTJ", "NZM", "NDLS"],
      bypassed_blocked_stations: ["AGC-MTJ Rail Track"],
      additional_distance_km: 0.0,
      revised_eta: "09:40 AM (Today)",
      delay_minutes: 68,
      comfort_score: 0.76,
      feasibility_status: "EMERGENCY SHUTTLE",
      reasoning: "Air-conditioned express coach bridges blocked rail section via Yamuna Expressway."
    }
  ];

  const handleAdoptRoute = (optionId) => {
    setIsAdopted(true);
    if (onSelectOption) onSelectOption(optionId);
  };

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #334155',
      padding: '24px',
      maxWidth: '900px',
      margin: '20px auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* 1. EXACT ACCIDENT EMERGENCY HEADER */}
      <div style={{
        backgroundColor: '#7f1d1d',
        border: '1px solid #ef4444',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div style={{ fontSize: '32px' }}>🚨</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}>
              Critical Disruption: {defaultAccident.accident_type}
            </span>
            <span style={{ fontSize: '13px', color: '#fca5a5' }}>
              Est. Clearance: ~{defaultAccident.estimated_clearance_hours} Hours
            </span>
          </div>

          <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#ffffff' }}>
            Accident on Section: {defaultAccident.section_code} ({defaultAccident.kilometer_marker})
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#fecaca', lineHeight: '1.5' }}>
            <strong>Exact Details:</strong> {defaultAccident.details}
          </p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#fca5a5' }}>
            <strong>Track Blocked:</strong> {defaultAccident.lines_affected} | <strong>Division:</strong> {defaultAccident.division}
          </div>
        </div>
      </div>

      {/* 2. PASSENGER IMPACT SUMMARY */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        border: '1px solid #334155'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '15px' }}>
          🎯 Journey Intersect & Live Impact Analysis
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>
          This accident lies directly in the scheduled path of your train (<strong>#{defaultAccident.train_number}</strong>).
          Remaining on the blocked track will cause an estimated delay of <strong>4.5 hours</strong>.
          The AI Route Engine has computed <strong>{defaultReroutes.length} optimized alternative options</strong> below:
        </p>
      </div>

      {/* 3. DYNAMIC ALTERNATIVE REROUTE CARDS */}
      <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#f8fafc' }}>
        🤖 AI Rethought Alternative Routes
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {defaultReroutes.map((opt) => {
          const isSelected = selectedOptionId === opt.option_id;
          return (
            <div 
              key={opt.option_id}
              onClick={() => setSelectedOptionId(opt.option_id)}
              style={{
                backgroundColor: isSelected ? '#1e293b' : '#0b1329',
                border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                borderRadius: '12px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: opt.strategy_type === 'RAIL_DIVERSION_CHORD_BYPASS' ? '#0369a1' : '#475569',
                  color: '#e0f2fe'
                }}>
                  {opt.feasibility_status}
                </span>

                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                  Delay: <span style={{ color: '#fbbf24', fontWeight: '700' }}>+{opt.delay_minutes} mins</span> | 
                  Revised ETA: <strong style={{ color: '#38bdf8' }}>{opt.revised_eta}</strong>
                </div>
              </div>

              <h4 style={{ margin: '4px 0 8px 0', fontSize: '16px', color: '#ffffff' }}>
                {opt.title}
              </h4>

              {/* Station Flow Visualizer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                margin: '12px 0',
                padding: '10px 14px',
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                border: '1px solid #1e293b'
              }}>
                {opt.path_stations.map((stn, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{
                      backgroundColor: '#334155',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#f8fafc'
                    }}>
                      {stn}
                    </span>
                    {idx < opt.path_stations.length - 1 && (
                      <span style={{ color: '#64748b', fontSize: '12px' }}>➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>
                {opt.reasoning}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #334155' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Bypasses Blocked: {opt.bypassed_blocked_stations.join(', ')} | Extra Dist: +{opt.additional_distance_km} km
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdoptRoute(opt.option_id);
                  }}
                  style={{
                    backgroundColor: isAdopted && isSelected ? '#10b981' : '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {isAdopted && isSelected ? '✓ Route Adopted' : 'Adopt This AI Reroute'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. EMERGENCY HELPLINE FOOTER */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        color: '#94a3b8'
      }}>
        <span>📞 Indian Railways Emergency Helplines: <strong>139</strong> | <strong>1072</strong> | <strong>0562-2421204</strong></span>
        <span>Medical Relief Van: <strong style={{ color: '#10b981' }}>Dispatched & On-Site</strong></span>
      </div>
    </div>
  );
}
