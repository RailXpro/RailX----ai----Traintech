import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  Radio, 
  Layers, 
  FileText, 
  Train, 
  Clock, 
  MapPin,
  ChevronRight,
  Flame
} from 'lucide-react';
import { SAMPLE_ACCIDENTS } from '../../data/sampleAccidents';
import { TRACK_SECTIONS, STATIONS } from '../../data/railwayNetwork';
import { TRAINS } from '../../data/trains';
import { audioAlerts } from '../../utils/audioAlerts';

export function AccidentSimulator({ 
  activeIncidents, 
  onTriggerAccident, 
  onResolveAccident,
  onHighlightDetour
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_ACCIDENTS[0].id);
  const [customSectionId, setCustomSectionId] = useState('SEC-KSRA-IGP');
  const [customTrainNumber, setCustomTrainNumber] = useState('12859');
  const [customIncidentType, setCustomIncidentType] = useState('DERAILMENT');
  const [customSeverity, setCustomSeverity] = useState('CRITICAL');
  const [customDescription, setCustomDescription] = useState('Track fracture and derailment of leading wheelset. Kavach safe-braking engaged.');
  const [customEta, setCustomEta] = useState('3.5');
  const [activeTab, setActiveTab] = useState('PRESET'); // 'PRESET' | 'CUSTOM'

  const handleTriggerPreset = (preset) => {
    audioAlerts.playAccidentSiren();
    onTriggerAccident(preset);
    if (preset.recommendedDetour) {
      onHighlightDetour(preset.recommendedDetour);
    }
  };

  const handleTriggerCustom = (e) => {
    e.preventDefault();
    const section = TRACK_SECTIONS.find(s => s.id === customSectionId);
    const train = TRAINS.find(t => t.trainNumber === customTrainNumber);
    
    const customIncident = {
      id: `INC-CUSTOM-${Date.now()}`,
      title: `${customIncidentType.replace('_', ' ')} near ${STATIONS[section?.from]?.name || 'Section'}`,
      incidentType: customIncidentType,
      severity: customSeverity,
      locationName: `${STATIONS[section?.from]?.name} - ${STATIONS[section?.to]?.name} (Track Section ${section?.id})`,
      sectionId: customSectionId,
      fromStation: section?.from || 'KSRA',
      toStation: section?.to || 'IGP',
      involvedTrain: customTrainNumber,
      involvedTrainName: train ? train.name : 'Superfast Express',
      description: customDescription,
      clearanceEtaHours: parseFloat(customEta) || 3.0,
      oheStatus: 'POWER_ISOLATED',
      kavachStatus: 'EMERGENCY_STOP_BROADCAST_ACTIVE',
      reportedAt: new Date().toISOString(),
      impactedCorridor: `${STATIONS[section?.from]?.name} Corridor`,
      recommendedDetour: {
        detourPath: ['CSMT', 'KYN', 'KJT', 'LNL', 'PUNE', 'DD', 'ANG', 'MMR', 'NDLS'],
        detourName: 'AI Dynamic Chord Link',
        additionalDistanceKm: 120,
        extraTimeMins: 75,
        capacityAvailable: 'HIGH (85% Green)',
      }
    };

    audioAlerts.playAccidentSiren();
    onTriggerAccident(customIncident);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-red-500/30 relative overflow-hidden bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">
                  Accident & Emergency Disruption Control Center
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                  Feature 1 & 3
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real-time Corridor Interception: Senses accidents, calculates AI Detours, and notifies affected passengers with exact incident parameters.
              </p>
            </div>
          </div>

          {activeIncidents.length > 0 && (
            <button
              onClick={() => {
                onResolveAccident(activeIncidents[0].id);
                audioAlerts.playSuccessTone();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Resolve & Clear Active Incident</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Incidents Alert Feed */}
      {activeIncidents.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-red-400 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Currently Active Incident Corridors ({activeIncidents.length})</span>
          </h4>

          {activeIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-2 border-red-500/60 shadow-2xl shadow-red-950/60 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/30 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-xl bg-red-500/30 text-red-300 font-mono font-bold text-xs">
                    {inc.incidentType}
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-white">{inc.title}</h4>
                    <span className="text-xs text-slate-400 font-mono">{inc.locationName}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                    Severity: {inc.severity}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
                    ETA: {inc.clearanceEtaHours}h
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Involved Train:</span>
                  <span className="font-bold text-amber-300">
                    {inc.involvedTrain ? `Train #${inc.involvedTrain} (${inc.involvedTrainName})` : 'Freight Rake'}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Kavach Safety Broadcast:</span>
                  <span className="font-bold text-emerald-400">
                    {inc.kavachStatus || 'ACTIVE_STOP_ZONE'}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">OHE Traction Status:</span>
                  <span className="font-bold text-cyan-400">
                    {inc.oheStatus || 'ISOLATED'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong>Incident Telemetry:</strong> {inc.description}
              </p>

              {/* AI Detour Summary Card */}
              {inc.recommendedDetour && (
                <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 mb-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Dynamic Detour Route Synthesized:</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      {inc.recommendedDetour.detourName} ({inc.recommendedDetour.detourPath.join(' ➔ ')})
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span>Extra Distance: +{inc.recommendedDetour.additionalDistanceKm} km</span>
                      <span className="text-amber-300 font-semibold">ETA Delta: +{inc.recommendedDetour.extraTimeMins} mins</span>
                      <span className="text-emerald-400 font-semibold">{inc.recommendedDetour.capacityAvailable}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onHighlightDetour(inc.recommendedDetour)}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Highlight on Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Trigger New Incident Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-base font-bold text-white">Simulate & Inject Railway Incident</h4>
            <p className="text-xs text-slate-400">
              Test how AI intercepts train paths, generates detours, and delivers exact passenger notifications.
            </p>
          </div>

          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('PRESET')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'PRESET' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Realistic Scenarios
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'CUSTOM' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Injector
            </button>
          </div>
        </div>

        {/* Preset Scenarios */}
        {activeTab === 'PRESET' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_ACCIDENTS.map((preset) => {
              const isCurrentlyActive = activeIncidents.some(i => i.id === preset.id);

              return (
                <div
                  key={preset.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrentlyActive
                      ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        {preset.incidentType}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        ETA: {preset.clearanceEtaHours}h
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white leading-tight">
                      {preset.title}
                    </h5>

                    <p className="text-xs text-slate-300 line-clamp-3">
                      {preset.description}
                    </p>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 space-y-0.5">
                      <div>Track: <strong className="text-amber-300">{preset.sectionId}</strong></div>
                      <div>Train: <strong className="text-slate-200">{preset.involvedTrainName}</strong></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerPreset(preset)}
                    disabled={isCurrentlyActive}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                      isCurrentlyActive
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isCurrentlyActive ? 'Incident Injected & Active' : 'Inject Incident & Run AI'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Incident Form */
          <form onSubmit={handleTriggerCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Track Section</label>
                <select
                  value={customSectionId}
                  onChange={(e) => setCustomSectionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {TRACK_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.id} ({STATIONS[sec.from]?.name} ➔ {STATIONS[sec.to]?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Incident Type</label>
                <select
                  value={customIncidentType}
                  onChange={(e) => setCustomIncidentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="DERAILMENT">Derailment</option>
                  <option value="OHE_BREAKDOWN">OHE Catenary Breakdown</option>
                  <option value="TRACK_FRACTURE">Track Fracture / Rail Break</option>
                  <option value="LANDSLIDE_BOULDER">Landslide / Boulder Fall</option>
                  <option value="SIGNAL_INTERLOCKING_FAILURE">Signal Interlocking Failure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Affected Train Rake</label>
                <select
                  value={customTrainNumber}
                  onChange={(e) => setCustomTrainNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {TRAINS.map((t) => (
                    <option key={t.trainNumber} value={t.trainNumber}>
                      Train #{t.trainNumber} ({t.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Clearance ETA (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={customEta}
                  onChange={(e) => setCustomEta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technical Incident Description</label>
              <textarea
                rows={2}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Inject Custom Incident & Broadcast Alerts</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
