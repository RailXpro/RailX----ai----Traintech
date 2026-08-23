import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  Radio, 
  Truck, 
  PhoneCall, 
  Plus, 
  X, 
  Volume2, 
  Send, 
  Clock 
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { AccidentIncident, AccidentSeverity } from '../../types/railway';
import { playEmergencyAlertSound } from '../../utils/audioAlert';

export const AccidentIncidentManager: React.FC = () => {
  const { 
    accidents, 
    trackSections, 
    trains, 
    reportAccident, 
    resolveIncident, 
    selectedDivision 
  } = useRailway();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trainNumber, setTrainNumber] = useState<string>('12951');
  const [sectionId, setSectionId] = useState<string>('SEC-WR-04');
  const [natureOfIncident, setNatureOfIncident] = useState<AccidentIncident['natureOfIncident']>('OHE Wire Snap');
  const [severity, setSeverity] = useState<AccidentSeverity>('severe');
  const [description, setDescription] = useState<string>('OHE traction wire parted near Vasai bridge km 48. Up & Down Fast lines isolated.');

  const filteredIncidents = accidents.filter(inc => {
    if (selectedDivision === 'All') return true;
    const sec = trackSections.find(s => s.id === inc.sectionId);
    return sec ? sec.division === selectedDivision : true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportAccident({
      trainNumber,
      sectionId,
      natureOfIncident,
      severity,
      description
    });
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Incident Header */}
      <div className="bms-card" style={{ padding: '22px', borderLeft: '4px solid var(--bms-red)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: 'var(--bms-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
            <ShieldAlert size={24} className="pulse-radar" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="bms-section-title" style={{ fontSize: '1.2rem' }}>
                Accident & Emergency Incident Command Center
              </h2>
              <span className="badge badge-accident" style={{ fontSize: '0.68rem' }}>
                SAFETY PROTOCOL ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Instant section cordon-off, automatic signal lockdown, relief train (ART/ARME) telemetry & passenger advisories
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => playEmergencyAlertSound()}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', color: 'var(--bms-red)', borderColor: 'var(--bms-red-border)' }}
          >
            <Volume2 size={15} color="var(--bms-red)" />
            Sound Siren
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            Log SOS / Incident Report
          </button>
        </div>
      </div>

      {/* Incidents List in BookMyShow Card Style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredIncidents.map(inc => (
          <div
            key={inc.id}
            className="bms-card"
            style={{
              padding: '22px',
              borderLeft: `5px solid ${inc.status === 'resolved' ? 'var(--bms-green)' : 'var(--bms-red)'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: inc.status === 'resolved' ? 'var(--bms-green-light)' : 'var(--bms-red-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: inc.status === 'resolved' ? '#2e7d32' : 'var(--bms-red)'
                }}>
                  {inc.status === 'resolved' ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} className="pulse-radar" />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: '#666666', fontWeight: 600 }}>
                      {inc.id}
                    </span>
                    <span className={`badge ${
                      inc.severity === 'critical' ? 'badge-accident' :
                      inc.severity === 'severe' ? 'badge-megablock' : 'badge-saffron'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {inc.severity.toUpperCase()} SEVERITY
                    </span>
                    <span className={`badge ${inc.status === 'resolved' ? 'badge-clear' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                      STATUS: {inc.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>
                    {inc.natureOfIncident}: Train #{inc.trainNumber} ({inc.trainName})
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  Reported at {inc.reportedAt}
                </span>
                {inc.status !== 'resolved' && (
                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.76rem', color: '#2e7d32' }}
                  >
                    <CheckCircle2 size={14} />
                    Certify Track Safe & Resolve
                  </button>
                )}
              </div>
            </div>

            {/* Description & Location */}
            <div style={{ background: '#F8F8FB', padding: '14px 16px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem', lineHeight: '1.5', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-dark)', marginBottom: '4px' }}>
                <strong>Incident Summary:</strong> {inc.description}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                📍 <strong>Location:</strong> {inc.sectionName} ({inc.locationDetails})
              </div>
            </div>

            {/* Response Telemetry & Passenger Advisory */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '0.75rem' }}>
              {/* Relief Train Status */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bms-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                  <Truck size={14} />
                  Accident Relief Train (ART/ARME)
                </div>
                <div style={{ color: 'var(--text-dark)' }}>
                  Unit: <strong>{inc.reliefTrainId || 'SP-ARME HQ'}</strong> — Status: <strong style={{ color: inc.reliefTrainStatus === 'Relief Complete' ? '#2e7d32' : 'var(--bms-amber)' }}>{inc.reliefTrainStatus}</strong>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Restoration ETA: {inc.estimatedTrackRestoration}
                </div>
              </div>

              {/* Public Advisory Broadcast */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bms-red)', fontWeight: 700, marginBottom: '4px' }}>
                  <Radio size={14} />
                  Passenger Safety Advisory Broadcast
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {inc.publicEmergencyAdvisory}
                </div>
                <div style={{ color: '#2e7d32', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PhoneCall size={12} />
                  Help Desk: {inc.passengerAssistanceContact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Report SOS Incident */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="bms-card" style={{ maxWidth: '580px', width: '100%', padding: '26px', maxHeight: '90vh', overflowY: 'auto', borderTop: '4px solid var(--bms-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bms-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Log Emergency Accident / SOS Incident
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Auto-locks block signals & alerts Section Controller, GRP, and NDRF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Involved Train Number
                  </label>
                  <select
                    className="input-control"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                  >
                    {trains.map(t => (
                      <option key={t.id} value={t.number}>#{t.number} - {t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Incident Section
                  </label>
                  <select
                    className="input-control"
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                  >
                    {trackSections.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Nature of Incident
                  </label>
                  <select
                    className="input-control"
                    value={natureOfIncident}
                    onChange={(e) => setNatureOfIncident(e.target.value as AccidentIncident['natureOfIncident'])}
                  >
                    <option value="Derailment">Derailment</option>
                    <option value="OHE Wire Snap">OHE Wire Snap / Catenary Parting</option>
                    <option value="Signal Failure">Automatic Signal Failure / Point Clashing</option>
                    <option value="Boulder Fall / Obstruction">Boulder Fall / Ghat Track Obstruction</option>
                    <option value="Cattle Run Over / Brake Defect">Cattle Run Over / Brake Defect</option>
                    <option value="Fire in Coach / Smoke">Fire in Coach / Smoke Detection</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Severity Triage
                  </label>
                  <select
                    className="input-control"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AccidentSeverity)}
                  >
                    <option value="minor">Minor (Quick Fix)</option>
                    <option value="severe">Severe (Track Disrupted)</option>
                    <option value="critical">Critical (Casualties / Major Block)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Incident Description & Location Details
                </label>
                <textarea
                  className="input-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise location, affected mast number, or nature of derailment..."
                />
              </div>

              <div style={{ background: 'var(--bms-red-light)', border: '1px solid var(--bms-red-border)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.73rem', color: 'var(--bms-red)' }}>
                ⚠️ <strong>Automatic Safety Actions:</strong> Submitting will instantly switch section signals to DANGER (Red), halt approaching rakes, and dispatch the nearest Accident Relief Train.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-emergency"
                >
                  <Send size={15} />
                  Authorize Emergency Lockdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
