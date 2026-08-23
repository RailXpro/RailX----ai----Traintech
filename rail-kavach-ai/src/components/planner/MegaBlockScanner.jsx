import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Clock, 
  Layers, 
  Train, 
  UserCheck, 
  Zap,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_CIRCULARS } from '../../data/sampleCirculars';
import { MegaBlockScannerAI } from '../../services/megaBlockParser';
import { audioAlerts } from '../../utils/audioAlerts';

export function MegaBlockScanner({ 
  activeBlocks, 
  onScheduleBlock, 
  onRemoveBlock,
  onOpenNotifications 
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_CIRCULARS[0].id);
  const [rawInputText, setRawInputText] = useState(SAMPLE_CIRCULARS[0].rawText);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleSelectTemplate = (tempId) => {
    setSelectedTemplate(tempId);
    const template = SAMPLE_CIRCULARS.find(c => c.id === tempId);
    if (template) {
      setRawInputText(template.rawText);
      setScanResult(null);
      setBroadcastSuccess(false);
    }
  };

  const handleRunAiScan = () => {
    setIsScanning(true);
    setBroadcastSuccess(false);
    audioAlerts.playNoticeChime();

    setTimeout(() => {
      const result = MegaBlockScannerAI.scanCircular(rawInputText, selectedTemplate);
      setScanResult(result);
      setIsScanning(false);
    }, 600);
  };

  const handleBroadcast = () => {
    if (!scanResult) return;
    audioAlerts.playSuccessTone();
    onScheduleBlock(scanResult);
    setBroadcastSuccess(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">
                  Mega Block Notice AI Scanner & Ingestion Hub
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Feature 2
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Upload or paste railway maintenance circulars. AI scans entities (division, timings, lines) and automatically alerts affected passengers travelling on those tracks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Scheduled Blocks Bar */}
      {activeBlocks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Currently Active Scheduled Mega Blocks ({activeBlocks.length})</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBlocks.map((blk) => (
              <div
                key={blk.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {blk.extraction.division}
                    </span>
                    <h5 className="text-sm font-bold text-white">{blk.title}</h5>
                  </div>
                  <button
                    onClick={() => onRemoveBlock(blk.id)}
                    className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                  >
                    Cancel Block
                  </button>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="text-slate-300">
                    <strong>Time Window:</strong> {blk.extraction.timeWindow}
                  </div>
                  <div className="text-slate-300">
                    <strong>Lines Affected:</strong> {blk.extraction.affectedLines.join(', ')}
                  </div>
                  <div className="text-emerald-400">
                    <strong>Passengers Alerted:</strong> {blk.passengerCount} Booked Travelers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scanner & Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Circular Input & Sample Picker (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Planner Circular Ingestion</span>
            </h4>
            <span className="text-[10px] text-slate-400">PDF / Text OCR</span>
          </div>

          {/* Preset Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Indian Railways Circular Template:
            </label>
            <div className="space-y-2">
              {SAMPLE_CIRCULARS.map((circ) => (
                <button
                  key={circ.id}
                  onClick={() => handleSelectTemplate(circ.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                    selectedTemplate === circ.id
                      ? 'bg-amber-950/40 border-amber-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-amber-300">{circ.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{circ.division} • {circ.issueDate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notice Content / OCR Extracted Stream:
            </label>
            <textarea
              rows={8}
              value={rawInputText}
              onChange={(e) => {
                setRawInputText(e.target.value);
                setSelectedTemplate(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-[11px] text-slate-200 focus:border-amber-500 focus:outline-none leading-relaxed"
              placeholder="Paste Indian Railways Mega Block press release or official operational bulletin here..."
            />
          </div>

          {/* Scan Button */}
          <button
            onClick={handleRunAiScan}
            disabled={isScanning || !rawInputText.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center justify-center space-x-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI NLP Parser Scanning Corridor Entities...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Document Intelligence Scanner</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Extraction & Passenger Match Preview (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Entity Extraction & Passenger Matching Feed</span>
            </h4>
            {scanResult && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                Confidence: {scanResult.confidence}
              </span>
            )}
          </div>

          {!scanResult ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl">
              <FileCheck className="w-12 h-12 text-slate-600 mb-3" />
              <h5 className="text-sm font-bold text-slate-300">Ready for Document Analysis</h5>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select a sample circular or paste notice text on the left and click "Run AI Document Intelligence Scanner".
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Structured AI Metadata Card */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-300">
                    {scanResult.extraction.blockType}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Date: {scanResult.extraction.date}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Division:</span>{' '}
                    <strong className="text-white block">{scanResult.extraction.division}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Time Window:</span>{' '}
                    <strong className="text-amber-300 block">{scanResult.extraction.timeWindow}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Lines Affected:</span>{' '}
                    <strong className="text-cyan-300 block">{scanResult.extraction.affectedLines.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Maintenance Nature:</span>{' '}
                    <strong className="text-emerald-400 block">{scanResult.extraction.maintenanceType}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-400">Traffic Diversion Profile:</span>{' '}
                  {scanResult.extraction.impactDescription}
                </div>
              </div>

              {/* Matched Passengers List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Matched Booked Passengers on Route ({scanResult.affectedPassengers.length})</span>
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    Automated Corridor Interception
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {scanResult.affectedPassengers.map((pax) => (
                    <div
                      key={pax.pnr}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center space-x-2">
                          <span>{pax.passengerName}</span>
                          <span className="font-mono text-[10px] text-cyan-400">PNR: {pax.pnr}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Train #{pax.trainNumber} ({pax.trainName}) • {pax.classType} • Coach {pax.coach}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Advisory Ready
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Dep: {pax.scheduledDeparture}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Broadcast Personalized Notifications */}
              {broadcastSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <strong className="block text-emerald-300">Mega Block Scheduled & Alerts Dispatched!</strong>
                      <span>Personalized advisories sent to {scanResult.affectedPassengers.length} passengers.</span>
                    </div>
                  </div>
                  <button
                    onClick={onOpenNotifications}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shrink-0"
                  >
                    View Alert Feed
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBroadcast}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    Schedule Block & Broadcast Personalized Notifications ({scanResult.affectedPassengers.length} Passengers)
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
