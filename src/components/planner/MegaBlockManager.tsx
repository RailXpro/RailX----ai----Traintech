import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  Wrench, 
  Bus, 
  Send, 
  X,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { BlockReason, DivisionName, MegaBlock } from '../../types/railway';
import { railwayApi } from '../../services/apiClient';
import { MegaBlockUploaderModal } from './MegaBlockUploaderModal';

export const MegaBlockManager: React.FC = () => {
  const { 
    megaBlocks, 
    trackSections, 
    scheduleMegaBlock, 
    completeMegaBlock, 
    selectedDivision 
  } = useRailway();
  const { t, localize } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [circularRawText, setCircularRawText] = useState<string>(
    `CENTRAL RAILWAY PRESS RELEASE (NO. 2026/08/30)
MEGA BLOCK ON UP AND DOWN FAST LINES BETWEEN BYCULLA AND DADAR ON 30.08.2026 (SUNDAY)
Central Railway will operate a Mega Block on its suburban section for carrying out essential track tamping, ballasting, and OHE maintenance work from 11.05 hrs to 16.05 hrs on Up & Down Fast lines between Byculla and Dadar stations.
Diversion: Up & Down fast line services leaving CSMT Mumbai will be diverted onto Slow corridor. Mail/Express trains 22221 Rajdhani and 12137 Punjab Mail will arrive 15-20 minutes behind schedule. Special BEST feeder buses will operate between Byculla and Dadar.`
  );
  const [selectedDivisionForm, setSelectedDivisionForm] = useState<DivisionName>('Mumbai CR');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('SEC-CR-02');
  const [linesAffected, setLinesAffected] = useState<MegaBlock['linesAffected']>('Up Slow');
  const [startTime, setStartTime] = useState<string>('11:00');
  const [endTime, setEndTime] = useState<string>('16:00');
  const [blockDate, setBlockDate] = useState<string>('2026-08-30 (Sunday)');
  const [reason, setReason] = useState<BlockReason>('Track Relaying & Tamping');
  const [gangCount, setGangCount] = useState<number>(36);
  const [publicAdvisory, setPublicAdvisory] = useState<string>('Up Slow locals diverted to Up Fast line. Expected 10-15 mins delay.');
  const [alternativeBusServices, setAlternativeBusServices] = useState<string>('Additional Municipal feeder buses deployed at intermediate halts.');

  const filteredBlocks = megaBlocks.filter(b => 
    selectedDivision === 'All' || b.division === selectedDivision
  );

  const handleSectionChange = (secId: string) => {
    setSelectedSectionId(secId);
    const sec = trackSections.find(s => s.id === secId);
    if (sec) {
      setSelectedDivisionForm(sec.division);
      setPublicAdvisory(`Block on ${sec.name} (${linesAffected}). Suburban/Express trains diverted or regulated.`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionObj = trackSections.find(s => s.id === selectedSectionId);

    scheduleMegaBlock({
      division: selectedDivisionForm,
      sectionId: selectedSectionId,
      sectionName: sectionObj ? sectionObj.name : 'Track Section',
      linesAffected,
      startTime,
      endTime,
      date: blockDate,
      reason,
      affectedTrainNumbers: ['95401', '12951'],
      divertedTrainNumbers: ['95401'],
      cancelledTrainNumbers: ['95104'],
      assignedMachinery: ['Plasser 09-3X Tamping Express', 'Tower Wagon #04'],
      crewGangCount: gangCount,
      publicAdvisory,
      alternativeBusServices
    });

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner and Actions */}
      <div className="bms-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--rx-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }}>
            <CalendarClock size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>
              {t('block.title')}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {t('block.subtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px', color: 'var(--rx-orange)', borderColor: 'var(--rx-orange-border)' }}
          >
            <Sparkles size={15} color="var(--rx-orange)" />
            {t('block.scanCircular')}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.84rem', padding: '8px 18px', fontWeight: 700 }}
          >
            <Plus size={16} />
            {t('block.scheduleNew')}
          </button>
        </div>
      </div>

      {/* Active & Scheduled Mega Blocks List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredBlocks.map(block => (
          <div
            key={block.id}
            className="bms-card"
            style={{
              padding: 0,
              border: block.status === 'active'
                ? '1.5px solid rgba(245,158,11,0.45)'
                : block.status === 'completed'
                ? '1.5px solid rgba(22,163,74,0.4)'
                : '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.18s ease'
            }}
          >
            {/* ── IR Yellow Station Nameboard Header ── */}
            <div
              className={
                block.status === 'active'
                  ? 'ir-nameboard-block'
                  : block.status === 'completed'
                  ? 'ir-nameboard-clear'
                  : 'ir-nameboard'
              }
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span className="ir-zone-badge">[{block.division.slice(0, 2)} / {block.id}]</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1E293B' }}>
                    {localize(block.division)} • {block.linesAffected}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000', fontFamily: 'serif', lineHeight: 1.3 }}>
                  {localize(block.sectionName)}
                </div>
              </div>
              <span className={`badge ${
                block.status === 'active' ? 'badge-ir-block' :
                block.status === 'completed' ? 'badge-ir-clear' : 'badge-cyan'
              }`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                {block.status === 'active' ? '🟡 MEGA BLOCK ACTIVE' : block.status === 'completed' ? '✅ COMPLETED' : '📋 SCHEDULED'}
              </span>
            </div>

            {/* Card Body */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {/* Date & Time */}
              <div style={{
                background: 'var(--rx-surface-alt)', padding: '8px 12px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem',
                color: 'var(--text-secondary)', borderLeft: '3px solid var(--rx-amber)'
              }}>
                <Clock size={14} color="var(--rx-amber)" />
                <span>{block.date}</span>
                <span style={{ color: 'var(--border-dark)' }}>|</span>
                <strong style={{ color: 'var(--text-dark)' }}>{block.startTime} – {block.endTime} hrs</strong>
              </div>

              {/* Scope & Lines Grid */}
              <div style={{ background: 'var(--rx-surface-alt)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lines Affected:</span>
                  <strong style={{ color: '#B45309' }}>{block.linesAffected}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Maintenance Work:</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{localize(block.reason)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Engineering Gang:</span>
                  <span style={{ color: 'var(--rx-blue)', fontWeight: 700 }}>{block.crewGangCount} Personnel</span>
                </div>
              </div>

              {/* Machinery */}
              <div style={{ fontSize: '0.72rem' }}>
                <strong style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <Wrench size={12} color="var(--rx-orange)" />
                  Assigned Machinery (P-Way):
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {block.assignedMachinery.map((m, idx) => (
                    <span key={idx} style={{
                      background: 'var(--rx-orange-light)', color: '#C2410C',
                      padding: '3px 9px', borderRadius: '20px', fontSize: '0.68rem',
                      fontWeight: 700, border: '1px solid rgba(255,107,26,0.2)'
                    }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Public Advisory */}
              <div style={{
                background: 'var(--rx-amber-light)', borderLeft: '3px solid var(--rx-amber)',
                padding: '8px 12px', borderRadius: '0 6px 6px 0',
                fontSize: '0.73rem', color: '#92400E', lineHeight: '1.45'
              }}>
                📢 <strong>Passenger Advisory:</strong> {block.publicAdvisory}
              </div>

              {/* Bus Services */}
              {block.alternativeBusServices && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem',
                  color: 'var(--rx-green)', background: 'var(--rx-green-light)',
                  borderLeft: '3px solid var(--rx-green)', padding: '6px 10px', borderRadius: '0 6px 6px 0'
                }}>
                  <Bus size={13} />
                  <span>{block.alternativeBusServices}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: 'auto'
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  🛡️ IRCTC / CRIS Live Feed Sync
                </span>
                {block.status === 'active' && (
                  <button
                    onClick={() => completeMegaBlock(block.id)}
                    className="btn btn-green"
                    style={{ fontSize: '0.74rem', padding: '5px 14px', borderRadius: '8px' }}
                  >
                    <CheckCircle2 size={13} />
                    {t('block.markComplete')}
                  </button>
                )}
                {block.status === 'completed' && (
                  <span className="badge badge-ir-clear">✅ Work Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Mega Block Modal Form */}
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
          <div className="bms-card" style={{
            width: '100%',
            maxWidth: '620px',
            background: 'var(--rx-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarClock size={20} color="var(--rx-orange)" />
                {t('block.scheduleNew')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999999' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {t('block.formSection')}
                </label>
                <select
                  className="input-control"
                  value={selectedSectionId}
                  onChange={(e) => handleSectionChange(e.target.value)}
                >
                  {trackSections.map(sec => (
                    <option key={sec.id} value={sec.id}>
                      [{sec.division}] {sec.name} ({sec.code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t('block.formLines')}
                  </label>
                  <select
                    className="input-control"
                    value={linesAffected}
                    onChange={(e) => setLinesAffected(e.target.value as MegaBlock['linesAffected'])}
                  >
                    <option value="Up Slow">Up Slow Line</option>
                    <option value="Down Slow">Down Slow Line</option>
                    <option value="Up Fast">Up Fast Line</option>
                    <option value="Down Fast">Down Fast Line</option>
                    <option value="Both Up/Down Lines">Both Up/Down Lines</option>
                    <option value="All Lines">All Quad Lines</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t('block.formStartTime')}
                  </label>
                  <input
                    type="time"
                    className="input-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t('block.formEndTime')}
                  </label>
                  <input
                    type="time"
                    className="input-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {t('block.formReason')}
                  </label>
                  <select
                    className="input-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value as BlockReason)}
                  >
                    <option value="Track Relaying & Tamping">Track Relaying & Tamping</option>
                    <option value="Overhead Wire (OHE) Maintenance">Overhead Wire (OHE) Maintenance</option>
                    <option value="Electronic Interlocking (EI) Upgrade">Electronic Interlocking (EI) Upgrade</option>
                    <option value="Bridge Girder Inspection">Bridge Girder Inspection</option>
                    <option value="Point & Crossing Overhaul">Point & Crossing Overhaul</option>
                    <option value="Suburban Jumbo Block">Suburban Jumbo Block</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Gang Size
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={gangCount}
                    onChange={(e) => setGangCount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {t('block.formDate')}
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  placeholder="e.g. 2026-08-30 (Sunday Mega Block)"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {t('block.formPublicNotice')}
                </label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={publicAdvisory}
                  onChange={(e) => setPublicAdvisory(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {t('block.formBusFeeders')}
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={alternativeBusServices}
                  onChange={(e) => setAlternativeBusServices(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  {t('block.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Send size={15} />
                  {t('block.submitBlock')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Circular NLP Scanner Modal */}
      <MegaBlockUploaderModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyBlock={(extracted) => {
          scheduleMegaBlock({
            division: extracted.division,
            sectionId: 'SEC-CR-04',
            sectionName: extracted.section,
            linesAffected: extracted.affected_lines.join(', ') as any,
            startTime: extracted.start_time,
            endTime: extracted.end_time,
            date: '2026-08-30 (Sunday)',
            reason: 'Track Relaying & Tamping',
            affectedTrainNumbers: extracted.diverted_trains,
            divertedTrainNumbers: extracted.diverted_trains,
            cancelledTrainNumbers: [],
            assignedMachinery: ['Plasser 09-3X Tamping Express', 'OHE Tower Wagon'],
            crewGangCount: 42,
            publicAdvisory: extracted.train_impacts.join(' '),
            alternativeBusServices: 'BEST / MSRTC Special Feeder Buses Deployed'
          });
        }}
      />
    </div>
  );
};
