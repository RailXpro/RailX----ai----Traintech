import React from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Info, 
  Route, 
  PhoneCall, 
  Clock, 
  Train, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DisruptionNotification, PassengerBooking } from '../../types/railway';
import { useLanguage } from '../../context/LanguageContext';

interface PersonalizedAlertCardProps {
  notification: DisruptionNotification;
  booking?: PassengerBooking | null;
  onExploreReroute?: () => void;
  onCallHelpline?: (phone: string) => void;
}

export const PersonalizedAlertCard: React.FC<PersonalizedAlertCardProps> = ({
  notification,
  booking,
  onExploreReroute,
  onCallHelpline
}) => {
  const { t } = useLanguage();

  const isEmergency = notification.priority === 'CRITICAL_EMERGENCY';
  const isMegaBlock = notification.priority === 'PLANNED_MAINTENANCE';

  return (
    <div
      className="bms-card"
      style={{
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        background: isEmergency 
          ? 'linear-gradient(135deg, #1C0F17 0%, #2A1420 100%)' 
          : isMegaBlock 
          ? 'linear-gradient(135deg, #151A2C 0%, #1A243D 100%)' 
          : 'var(--rx-surface)',
        border: isEmergency 
          ? '2px solid rgba(239, 68, 68, 0.6)' 
          : isMegaBlock 
          ? '2px solid rgba(59, 130, 246, 0.4)' 
          : '1px solid var(--border-light)',
        boxShadow: isEmergency 
          ? '0 12px 30px rgba(239, 68, 68, 0.25)' 
          : 'var(--shadow-card)',
        color: isEmergency || isMegaBlock ? '#FFFFFF' : 'var(--text-dark)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* ── Top Header Strip: Status Badge + PNR Details ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: isEmergency ? '#EF4444' : isMegaBlock ? '#2563EB' : 'var(--rx-green)',
              color: '#FFFFFF'
            }}
          >
            {isEmergency ? <ShieldAlert size={14} /> : isMegaBlock ? <Wrench size={14} /> : <Info size={14} />}
            {isEmergency ? 'Critical Safety Disruption' : isMegaBlock ? 'Planned Track Block' : 'Clear Corridor'}
          </span>

          {notification.timestamp && (
            <span style={{ fontSize: '0.72rem', color: isEmergency || isMegaBlock ? '#94A3B8' : 'var(--text-secondary)' }}>
              {notification.timestamp}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
          <span style={{ color: isEmergency || isMegaBlock ? '#CBD5E1' : 'var(--text-secondary)' }}>
            PNR: <strong style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>{notification.pnr}</strong>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: isEmergency || isMegaBlock ? '#CBD5E1' : 'var(--text-secondary)' }}>
            Train: <strong style={{ color: '#F8FAFC' }}>#{notification.train_number}</strong>
          </span>
        </div>
      </div>

      {/* ── Headline ── */}
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 800,
        marginBottom: '14px',
        color: isEmergency ? '#FCA5A5' : isMegaBlock ? '#93C5FD' : 'var(--text-dark)',
        fontFamily: 'var(--font-display)',
        lineHeight: 1.35
      }}>
        {notification.headline}
      </h3>

      {/* ── Passenger Itinerary Context (If available) ── */}
      {booking && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          fontSize: '0.76rem'
        }}>
          <div>
            <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Passenger Name</span>
            <strong style={{ color: '#FFFFFF' }}>{booking.passengerName}</strong>
          </div>
          <div>
            <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Coach & Seat</span>
            <strong style={{ color: '#FFFFFF' }}>Coach {booking.coach}, Berth {booking.berthNumber}</strong>
          </div>
          <div>
            <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Journey Segment</span>
            <strong style={{ color: '#FFFFFF' }}>{booking.sourceStation} ➔ {booking.destinationStation}</strong>
          </div>
        </div>
      )}

      {/* ── Exact Incident Report Box ── */}
      <div style={{
        background: isEmergency ? 'rgba(127, 29, 29, 0.35)' : 'rgba(30, 41, 59, 0.6)',
        borderLeft: isEmergency ? '4px solid #EF4444' : '4px solid #38BDF8',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        marginBottom: '14px'
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: isEmergency ? '#FCA5A5' : '#7DD3FC',
          marginBottom: '4px',
          letterSpacing: '0.04em'
        }}>
          Exact AI Incident Details & Location:
        </div>
        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          color: '#E2E8F0',
          lineHeight: '1.5'
        }}>
          {notification.exact_incident_details}
        </p>
      </div>

      {/* ── Impact on Passenger ── */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        marginBottom: '18px'
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#FDE047',
          marginBottom: '4px',
          letterSpacing: '0.04em'
        }}>
          Impact on Your Journey & Scheduled Timing:
        </div>
        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          color: '#CBD5E1',
          lineHeight: '1.5'
        }}>
          {notification.impact_on_journey}
        </p>
      </div>

      {/* ── Action Buttons & Helplines Strip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {notification.has_reroute_available && (
            <button
              type="button"
              onClick={onExploreReroute}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={16} />
              Explore Alternative AI Routes
              <ArrowRight size={14} />
            </button>
          )}

          {notification.helpline_contacts.map((contact, i) => {
            const rawNumber = contact.split(' ')[0].replace(/[^0-9]/g, '');
            return (
              <a
                key={i}
                href={`tel:${rawNumber}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <PhoneCall size={13} color="var(--rx-green)" />
                {contact}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
