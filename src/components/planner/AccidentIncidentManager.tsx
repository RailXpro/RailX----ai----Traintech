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
  Clock,
  Sparkles,
  Compass
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { AccidentIncident, AccidentSeverity } from '../../types/railway';
import { playEmergencyAlertSound } from '../../utils/audioAlert';
import { AccidentRerouteAdvisorModal } from '../passenger/AccidentRerouteAdvisorModal';

export const AccidentIncidentManager: React.FC = () => {
  const { 
    accidents, 
    trackSections, 
    trains, 
    reportAccident, 
    resolveIncident, 
    selectedDivision 
  } = useRailway();
  const { t, localize } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncidentForReroute, setSelectedIncidentForReroute] = useState<AccidentIncident | null>(null);
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
      <div className="bms-card" style={{ padding: '22px', borderLeft: '4px solid var(--rx-red)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--rx-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-red)' }}>
            <ShieldAlert size={24} className="pulse-radar" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="bms-section-title" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                {t('incident.title')}
              </h2>
              <span className="badge badge-accident" style={{ fontSize: '0.68rem' }}>
                SAFETY PROTOCOL ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {t('incident.subtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => playEmergencyAlertSound()}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', color: 'var(--rx-red)' }}
          >
            <Volume2 size={15} color="var(--rx-red)" />
            {t('alert.siren')}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-emergency"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            {t('incident.reportBtn')}
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredIncidents.map(inc => (
          <div
            key={inc.id}
            className="bms-card"
            style={{
              padding: 0,
              border: inc.status === 'resolved'
                ? '1.5px solid rgba(22,163,74,0.4)'
                : inc.severity === 'critical'
                ? '2px solid rgba(239,68,68,0.6)'
                : '1.5px solid rgba(245,158,11,0.4)',
              overflow: 'hidden',
              opacity: inc.status === 'resolved' ? 0.85 : 1
            }}
          >
            {/* IR Red/Green Nameboard Header */}
            <div
              className={
                inc.status === 'resolved'
                  ? 'ir-nameboard-clear'
                  : inc.severity === 'critical'
                  ? 'ir-nameboard-accident'
                  : 'ir-nameboard-active'
              }
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                  <span className="ir-zone-badge">
                    [{inc.severity.toUpperCase().slice(0,3)} / {inc.id}]
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.66rem', color: '#1E293B', fontWeight: 700 }}>
                    {inc.reportedAt}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000', fontFamily: 'serif', lineHeight: 1.3 }}>
                  Train #{inc.trainNumber} — {localize(inc.sectionName)}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginTop: '2px' }}>
                  {localize(inc.trainName)}
                </div>
              </div>
              <span className={`badge ${
                inc.status === 'resolved' ? 'badge-ir-clear' : 'badge-ir-accident'
              }`} style={{ fontSize: '0.64rem', flexShrink: 0 }}>
                {inc.status === 'resolved' ? '✅ RESOLVED & RESTORED' : `🔴 ${inc.severity.toUpperCase()} ALERT`}
              </span>
            </div>

            {/* Card Body */}
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Nature of incident */}
              <div style={{
                borderLeft: `3px solid ${inc.severity === 'critical' ? 'var(--rx-red)' : 'var(--rx-amber)'}`,
                paddingLeft: '10px', fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5'
              }}>
                <strong style={{ color: 'var(--text-dark)' }}>{inc.natureOfIncident}:</strong>{' '}
                {localize(inc.description)}
              </div>

              {/* Emergency Protocols Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px', background: 'var(--rx-surface-alt)',
                padding: '10px 14px', borderRadius: '8px', fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Truck size={14} color="var(--rx-orange)" />
                  <span>
                    <strong style={{ color: 'var(--text-dark)' }}>SP-ARME Relief:</strong>{' '}
                    {localize(inc.reliefTrainStatus)} ({inc.reliefTrainId || 'None'})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Clock size={14} color="var(--rx-blue)" />
                  <span>
                    <strong style={{ color: 'var(--text-dark)' }}>Restoration ETA:</strong>{' '}
                    {inc.estimatedTrackRestoration}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <PhoneCall size={14} color="var(--rx-green)" />
                  <span>
                    <strong style={{ color: 'var(--text-dark)' }}>Helpline:</strong>{' '}
                    {inc.passengerAssistanceContact}
                  </span>
                </div>
                {inc.divisionController && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Radio size={14} color="var(--rx-red)" />
                    <span>
                      <strong style={{ color: 'var(--text-dark)' }}>Section Controller:</strong>{' '}
                      {inc.divisionController}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {inc.status !== 'resolved' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedIncidentForReroute(inc)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '7px 14px', borderRadius: '8px', color: 'var(--rx-blue)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                  >
                    <Compass size={14} color="var(--rx-blue)" />
                    AI Route Rethink & Bypass
                  </button>

                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="btn btn-green"
                    style={{ fontSize: '0.78rem', padding: '7px 16px', borderRadius: '8px' }}
                  >
                    <CheckCircle2 size={14} />
                    {t('incident.resolve')}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 14, 35, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="bms-card" style={{ maxWidth: '580px', width: '100%', padding: '26px', maxHeight: '90vh', overflowY: 'auto', borderTop: '4px solid var(--rx-red)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-red)' }}>
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    {t('incident.reportBtn')}
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
                    {t('incident.formTrain')}
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
                    {t('block.formSection')}
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
                    {t('incident.formNature')}
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
                    {t('incident.formSeverity')}
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
                  {t('incident.formDesc')}
                </label>
                <textarea
                  className="input-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise location, affected mast number, or nature of derailment..."
                />
              </div>

              <div style={{ background: 'var(--rx-red-light)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', fontSize: '0.73rem', color: 'var(--rx-red)' }}>
                ⚠️ <strong>Automatic Safety Actions:</strong> Submitting will instantly switch section signals to DANGER (Red), halt approaching rakes, and dispatch the nearest Accident Relief Train.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  {t('block.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-emergency"
                >
                  <Send size={15} />
                  {t('incident.submitSos')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Reroute Advisor Modal */}
      {selectedIncidentForReroute && (
        <AccidentRerouteAdvisorModal
          isOpen={!!selectedIncidentForReroute}
          onClose={() => setSelectedIncidentForReroute(null)}
          trainNumber={selectedIncidentForReroute.trainNumber}
          trainName={selectedIncidentForReroute.trainName}
          sectionCode={selectedIncidentForReroute.sectionName}
        />
      )}
    </div>
  );
};
