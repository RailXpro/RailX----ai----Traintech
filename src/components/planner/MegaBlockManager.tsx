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
  FileText,
  UploadCloud
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { BlockReason, DivisionName, MegaBlock } from '../../types/railway';
import { railwayApi } from '../../services/apiClient';

export const MegaBlockManager: React.FC = () => {
  const { 
    megaBlocks, 
    trackSections, 
    scheduleMegaBlock, 
    completeMegaBlock, 
    selectedDivision 
  } = useRailway();

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
      cancelledTrainNumbers: [],
      assignedMachinery: ['Plasser Tamping Express 09-3X', 'Hydraulic Tower Wagon'],
      crewGangCount: gangCount,
      publicAdvisory,
      alternativeBusServices
    });

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & New Schedule Trigger */}
      <div className="bms-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--bms-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7791f' }}>
            <CalendarClock size={22} />
          </div>
          <div>
            <h2 className="bms-section-title" style={{ fontSize: '1.2rem' }}>
              Mega Block & Corridor Possession Schedules
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Plan, authorize, and broadcast scheduled infrastructure track maintenance windows
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setIsScannerOpen(true);
            }}
            className="btn btn-secondary"
            style={{ padding: '9px 16px', fontSize: '0.85rem', color: 'var(--bms-red)', borderColor: 'var(--bms-red)' }}
          >
            <Sparkles size={16} />
            AI Circular Scanner (NLP)
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            Schedule New Mega Block
          </button>
        </div>
      </div>

      {/* Active & Scheduled Mega Blocks List in BookMyShow Event Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {filteredBlocks.map(block => (
          <div
            key={block.id}
            className="bms-card"
            style={{
              padding: '20px',
              borderTop: `4px solid ${block.status === 'active' ? 'var(--bms-amber)' : block.status === 'completed' ? 'var(--bms-green)' : 'var(--bms-cyan)'}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#666666' }}>
                  {block.id} • {block.division}
                </span>
                <span className={`badge ${
                  block.status === 'active' ? 'badge-megablock' :
                  block.status === 'completed' ? 'badge-clear' : 'badge-cyan'
                }`} style={{ fontSize: '0.65rem' }}>
                  {block.status.toUpperCase()}
                </span>
              </div>

              {/* Title & Section */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                {block.sectionName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <Clock size={13} color="var(--bms-amber)" />
                <span>{block.date} | <strong>{block.startTime} – {block.endTime}</strong></span>
              </div>

              {/* Scope & Lines */}
              <div style={{ background: '#F8F8FB', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.75rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Affected Track Line:</span>
                  <strong style={{ color: '#b7791f' }}>{block.linesAffected}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nature of Work:</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{block.reason}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Workforce Gang Size:</span>
                  <span style={{ color: 'var(--bms-cyan)', fontWeight: 600 }}>{block.crewGangCount} Personnel</span>
                </div>
              </div>

              {/* Machinery Allocation */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <strong style={{ color: '#555555', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <Wrench size={12} color="var(--bms-red)" />
                  Assigned Heavy Machinery:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {block.assignedMachinery.map((m, idx) => (
                    <span key={idx} style={{ background: '#F0F0F0', color: '#444444', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Passenger Advisory */}
              <div style={{ background: 'var(--bms-amber-light)', border: '1px solid #fed7aa', padding: '10px 12px', borderRadius: '6px', fontSize: '0.74rem', color: '#b7791f', lineHeight: '1.4' }}>
                📢 {block.publicAdvisory}
              </div>
              {block.alternativeBusServices && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: '#2e7d32', marginTop: '8px' }}>
                  <Bus size={13} />
                  <span>{block.alternativeBusServices}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EEEEEE', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#888888' }}>
                IRCTC Alert Active
              </span>
              {block.status === 'active' && (
                <button
                  onClick={() => completeMegaBlock(block.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '5px 12px', color: '#2e7d32' }}
                >
                  <CheckCircle2 size={13} />
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Schedule Mega Block Form */}
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
          <div className="bms-card" style={{ maxWidth: '600px', width: '100%', padding: '26px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bms-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Schedule Track Possession (Mega Block)
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Auto-coordinates with Section Controller and Passenger Portal
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
                    Railway Division
                  </label>
                  <select
                    className="input-control"
                    value={selectedDivisionForm}
                    onChange={(e) => setSelectedDivisionForm(e.target.value as DivisionName)}
                  >
                    <option value="Mumbai CR">Mumbai CR</option>
                    <option value="Mumbai WR">Mumbai WR</option>
                    <option value="Delhi NR">Delhi NR</option>
                    <option value="Howrah ER">Howrah ER</option>
                    <option value="Chennai SR">Chennai SR</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Track Section
                  </label>
                  <select
                    className="input-control"
                    value={selectedSectionId}
                    onChange={(e) => handleSectionChange(e.target.value)}
                  >
                    {trackSections.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Lines Affected
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
                    Start Time (IST)
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
                    End Time (IST)
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
                    Work Type / Reason
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
                    Crew Gang Size
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
                  Date & Day Description
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
                  Public Passenger Advisory (Broadcasted to Commuters)
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
                  Alternative Multimodal Transport Arrangements
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={alternativeBusServices}
                  onChange={(e) => setAlternativeBusServices(e.target.value)}
                  placeholder="e.g. Additional BEST/DTC feeder buses running between stations"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Send size={15} />
                  Authorize & Dispatch Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Circular NLP Scanner Modal */}
      {isScannerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="bms-card" style={{
            width: '100%',
            maxWidth: '680px',
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #EEEEEE', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(248, 68, 100, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bms-red)' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#333333' }}>
                    AI NLP Circular Scanner & Extractor
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#666666' }}>
                    Paste raw railway circulars or press releases for instant entity extraction & block generation
                  </p>
                </div>
              </div>
              <button onClick={() => setIsScannerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999999' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#444444', marginBottom: '6px' }}>
                  Raw Circular / Press Release Text:
                </label>
                <textarea
                  className="input-control"
                  rows={6}
                  value={circularRawText}
                  onChange={(e) => setCircularRawText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.4' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCircularRawText(
                      `WESTERN RAILWAY NIGHT CORRIDOR BLOCK
Possession on 5th and 6th lines between Churchgate and Mumbai Central from 00:30 hrs to 04:30 hrs for Electronic Interlocking (Kavach 2.0) testing. All long-distance trains arriving into Mumbai Central will run at 30 kmph with pilot escort. Passengers advised to check live status on 139.`
                    );
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem' }}
                >
                  <FileText size={14} />
                  Load Sample WR Circular
                </button>

                <button
                  type="button"
                  disabled={isScanning}
                  onClick={async () => {
                    setIsScanning(true);
                    const res = await railwayApi.scanCircular(circularRawText);
                    setIsScanning(false);
                    if (res && res.extracted) {
                      const ext = res.extracted;
                      setLinesAffected(ext.linesAffected.includes('Slow') ? 'Up Slow' : 'Up & Down Fast Lines' as any);
                      setStartTime(ext.startTime || '11:05');
                      setEndTime(ext.endTime || '16:05');
                      setBlockDate(ext.date || '2026-08-30 (Sunday)');
                      setPublicAdvisory(ext.passengerAdvisories.join(' '));
                      setIsScannerOpen(false);
                      setIsModalOpen(true);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem', padding: '8px 18px' }}
                >
                  <Sparkles size={16} />
                  {isScanning ? 'Extracting via AI...' : 'Scan & Pre-Fill Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
