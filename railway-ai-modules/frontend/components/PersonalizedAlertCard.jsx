/**
 * PersonalizedAlertCard.jsx
 * UI Component for Passenger Dashboard / Mobile App:
 * Displays real-time exact disruption alerts tailored to the passenger's specific PNR.
 */

import React from 'react';

export default function PersonalizedAlertCard({ 
  notification, 
  onExploreReroute,
  onCallHelpline 
}) {
  const defaultNotification = notification || {
    notification_id: "NOTIF-8421984210-ACC",
    pnr: "8421984210",
    passenger_name: "Aarav Sharma",
    train_number: "12951",
    priority: "CRITICAL_EMERGENCY",
    headline: "🚨 EMERGENCY TRACK ADVISORY: Accident ahead on your train route",
    exact_incident_details: "Derailment of Goods Train at Km 1342/12 between Agra Cantt (AGC) & Mathura Jn (MTJ). Both UP & DOWN main lines blocked.",
    impact_on_journey: "Your Train #12951 is approaching this section. Expected delay: ~3.5 hrs. AI has computed an alternative rail bypass.",
    actionable_alternatives: ["View AI Alternative Reroute", "Request Emergency Meal Assistance", "Call IR Helpline 139"],
    helpline_contacts: ["139", "0562-2421204", "1072"],
    has_reroute_available: true
  };

  const isEmergency = defaultNotification.priority === 'CRITICAL_EMERGENCY';

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      backgroundColor: isEmergency ? '#1e1b2e' : '#0f172a',
      color: '#f8fafc',
      borderRadius: '14px',
      border: isEmergency ? '1px solid #dc2626' : '1px solid #38bdf8',
      padding: '20px',
      maxWidth: '650px',
      margin: '16px auto',
      boxShadow: isEmergency ? '0 10px 25px -5px rgba(220, 38, 38, 0.3)' : '0 10px 25px -5px rgba(56, 189, 248, 0.2)'
    }}>
      {/* BADGE & PNR HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{
          backgroundColor: isEmergency ? '#ef4444' : '#0284c7',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '700',
          padding: '3px 10px',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {isEmergency ? '⚠️ High Priority Alert' : '🛠️ Planned Maintenance'}
        </span>

        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          PNR: <strong style={{ color: '#f8fafc' }}>{defaultNotification.pnr}</strong> (Train #{defaultNotification.train_number})
        </span>
      </div>

      {/* HEADLINE */}
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: isEmergency ? '#fca5a5' : '#7dd3fc' }}>
        {defaultNotification.headline}
      </h3>

      {/* EXACT DETAILS */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        borderLeft: isEmergency ? '3px solid #ef4444' : '3px solid #38bdf8'
      }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
          Exact Incident Report:
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>
          {defaultNotification.exact_incident_details}
        </p>
      </div>

      {/* IMPACT ON SPECIFIC PASSENGER */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
          Impact on Your Journey:
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
          {defaultNotification.impact_on_journey}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {defaultNotification.has_reroute_available && (
          <button
            onClick={onExploreReroute}
            style={{
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🔄</span> Explore AI Alternative Reroute
          </button>
        )}

        <button
          onClick={onCallHelpline}
          style={{
            backgroundColor: '#334155',
            color: '#f8fafc',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📞 Call Helpline 139
        </button>
      </div>
    </div>
  );
}
