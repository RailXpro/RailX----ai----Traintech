import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  Users, 
  Radio, 
  Clock, 
  AlertTriangle,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_CIRCULARS } from '../../data/mockData';
import { railwayApi } from '../../services/apiClient';
import { CircularScanResult, BroadcastSummary } from '../../types/railway';
import { useLanguage } from '../../context/LanguageContext';

interface MegaBlockUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBlock?: (extracted: CircularScanResult) => void;
}

export const MegaBlockUploaderModal: React.FC<MegaBlockUploaderModalProps> = ({
  isOpen,
  onClose,
  onApplyBlock
}) => {
  const { t } = useLanguage();
  const [rawText, setRawText] = useState<string>(SAMPLE_CIRCULARS[0].text);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<CircularScanResult | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastResult, setBroadcastResult] = useState<BroadcastSummary | null>(null);

  if (!isOpen) return null;

  const handleScanCircular = async () => {
    setIsScanning(true);
    setBroadcastResult(null);

    // Call API or fallback parser
    setTimeout(async () => {
      const res = await railwayApi.scanCircular(rawText);
      const ext = res.extracted;
      
      const parsed: CircularScanResult = {
        block_id: `MB-${Date.now().toString().slice(-6)}`,
        railway_zone: /central|cr/i.test(rawText) ? 'Central Railway (CR)' : 'Western Railway (WR)',
        division: (ext.division || 'Mumbai CR') as any,
        section: ext.sectionName || 'Thane - Kalyan Section',
        from_station: 'TNA',
        to_station: 'KYN',
        affected_lines: ext.linesAffected.includes('Fast') 
          ? ['UP Fast Line', 'DOWN Fast Line'] 
          : ['UP Slow Line', 'DOWN Slow Line'],
        start_time: ext.startTime || '10:30',
        end_time: ext.endTime || '15:30',
        duration_hours: 5.0,
        maintenance_type: ext.workNature || 'Track Renewal, OHE Overhaul & Electronic Signaling Upgrade',
        speed_restrictions_kmph: 30,
        train_impacts: ext.passengerAdvisories || [
          'Fast locals diverted to Slow lines (all stations halt)',
          'Mail/Express trains delayed by 15-25 mins'
        ],
        diverted_trains: ext.trainsRegulatedOrCancelled || ['12137', '11057', '12163', '97034'],
        confidence_score: ext.confidenceScore || 0.98,
        matched_passenger_count: 24
      };

      setExtractedData(parsed);
      setIsScanning(false);
    }, 600);
  };

  const handleBroadcastAlerts = async () => {
    if (!extractedData) return;
    setIsBroadcasting(true);

    const summary = await railwayApi.broadcastMegaBlockAlerts(extractedData);
    setBroadcastResult(summary);
    setIsBroadcasting(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleApplyToPlanner = () => {
    if (extractedData && onApplyBlock) {
      onApplyBlock(extractedData);
    }
    onClose();
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
          maxWidth: '900px',
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
        {/* Header */}
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
              <FileText size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
                  Planner Mega Block Circular AI Scanner & Broadcaster
                </h3>
                <span className="badge badge-clear" style={{ fontSize: '0.66rem' }}>
                  Feature 2 NLP Engine
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.76rem', color: '#CBD5E1' }}>
                Paste railway circulars or press releases to auto-extract structured blocks and notify affected passengers.
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

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Sample Loader Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              Input Circular Press Release Text:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SAMPLE_CIRCULARS.map((sample, idx) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setRawText(sample.text)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                >
                  Load Sample {idx + 1} ({sample.id})
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="input-control"
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: '1.45',
              background: 'var(--rx-surface-alt)'
            }}
          />

          {/* Scan Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              disabled={isScanning}
              onClick={handleScanCircular}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.86rem', fontWeight: 700 }}
            >
              <Sparkles size={16} />
              {isScanning ? 'Extracting via AI NLP...' : 'Scan & Extract Structured Block'}
            </button>
          </div>

          {/* Extracted Data Card */}
          {extractedData && (
            <div style={{
              background: 'var(--rx-surface-alt)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#16A34A" />
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                    AI Entity Extraction Preview
                  </h4>
                </div>
                <span className="badge badge-clear" style={{ fontSize: '0.72rem' }}>
                  Confidence: {Math.round(extractedData.confidence_score * 100)}%
                </span>
              </div>

              {/* Data Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                background: 'var(--rx-surface)',
                padding: '16px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Division & Zone</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{extractedData.division} ({extractedData.railway_zone})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Section Affected</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{extractedData.section}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Lines Affected</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{extractedData.affected_lines.join(', ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Timing Window</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{extractedData.start_time} – {extractedData.end_time} ({extractedData.duration_hours} hrs)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Maintenance Work</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{extractedData.maintenance_type}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Speed Restriction</span>
                  <strong style={{ color: '#D97706' }}>{extractedData.speed_restrictions_kmph} km/h TSR</strong>
                </div>
              </div>

              {/* Passenger Impact & Regulated Trains */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Diverted / Regulated Train Numbers:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {extractedData.diverted_trains.map((trn, i) => (
                    <span key={i} className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                      Train #{trn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Passenger Matching Strip */}
              <div style={{
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                borderRadius: 'var(--radius-xs)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={20} color="var(--rx-blue)" />
                  <div>
                    <strong style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.84rem' }}>
                      {extractedData.matched_passenger_count} Passenger PNRs Intersect With This Block
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Ready to broadcast tailored diversion notifications across IRCTC SMS & App channels.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={handleBroadcastAlerts}
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, var(--rx-green) 0%, #15803D 100%)',
                    color: '#FFFFFF',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} />
                  {isBroadcasting ? 'Broadcasting...' : '1-Click Broadcast Alerts'}
                </button>
              </div>

              {/* Broadcast Result Feedback */}
              {broadcastResult && (
                <div style={{
                  background: 'var(--rx-green-light)',
                  border: '1px solid #16A34A',
                  borderRadius: 'var(--radius-xs)',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 800, fontSize: '0.86rem' }}>
                    <Check size={18} />
                    Alerts Delivered to {broadcastResult.affected_passengers_count} Passengers at {broadcastResult.sent_at}!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                    Channels dispatched: {broadcastResult.channels.join(' • ')}
                  </div>
                </div>
              )}

              {/* Apply to Planner Schedule */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleApplyToPlanner}
                  className="btn btn-primary"
                  style={{ padding: '9px 20px', fontSize: '0.84rem' }}
                >
                  <CheckCircle2 size={16} />
                  Add to Active Mega Blocks
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
