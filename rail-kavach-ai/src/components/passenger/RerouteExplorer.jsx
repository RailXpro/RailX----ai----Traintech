import React, { useState } from 'react';
import { 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Train, 
  Download, 
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATIONS } from '../../data/railwayNetwork';
import { audioAlerts } from '../../utils/audioAlerts';

export function RerouteExplorer({ 
  passenger, 
  train, 
  activeIncidents, 
  activeBlocks, 
  aiDetour,
  onViewOnMap 
}) {
  const [acceptedDetour, setAcceptedDetour] = useState(false);
  const [activeTab, setActiveTab] = useState('DETOUR'); // 'DETOUR' | 'ALT_TRAINS'

  const handleAcceptDetour = () => {
    setAcceptedDetour(true);
    audioAlerts.playSuccessTone();

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const hasActiveDisruption = activeIncidents.length > 0 || (aiDetour && aiDetour.hasDetour);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        hasActiveDisruption 
          ? 'bg-gradient-to-r from-red-950/30 via-slate-900 to-emerald-950/30 border-red-500/40' 
          : 'glass-panel border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">
                  AI Smart Alternative Route & Dynamic Rerouting Engine
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Feature 3
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                When an accident or track blockage occurs on your corridor, AI automatically computes optimal chord bypasses to keep you moving safely.
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewOnMap?.(aiDetour)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition flex items-center space-x-2 shrink-0"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Inspect Detour on Map</span>
          </button>
        </div>
      </div>

      {/* Disruption Context Banner if Incident Active */}
      {activeIncidents.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/50 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            <span>TRACK SEVERED ON ORIGINAL ROUTE: {activeIncidents[0].title}</span>
          </div>
          <p className="text-xs text-slate-200">
            {activeIncidents[0].description} (Clearance ETA: ~{activeIncidents[0].clearanceEtaHours} Hours).
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison: Original Disrupted Route vs AI Alternative Detour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Original Route (Disrupted) */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900 to-red-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase">Original Itinerary</span>
              <h4 className="text-base font-bold text-white">Default Mainline Path</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
              {activeIncidents.length > 0 ? 'BLOCKED' : 'STANDARD'}
            </span>
          </div>

          {/* Route Stations */}
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Scheduled Waypoints:</div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {(aiDetour?.baselineRoute || passenger.routeStations).map((code, i) => (
                <span key={i} className="flex items-center">
                  <span className={`px-2 py-1 rounded-lg border ${
                    activeIncidents.some(inc => inc.fromStation === code || inc.toStation === code)
                      ? 'bg-red-500/20 border-red-500/50 text-red-300 font-bold line-through'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    {STATIONS[code]?.name || code}
                  </span>
                  {i < (aiDetour?.baselineRoute || passenger.routeStations).length - 1 && (
                    <span className="mx-1 text-slate-600">➔</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Distance</span>
              <strong className="text-white font-mono">{aiDetour?.baselineDistanceKm || 1420} km</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Estimated Travel Time</span>
              <strong className="text-white font-mono">{Math.round((aiDetour?.baselineTimeMins || 920) / 60)} hrs</strong>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800 text-rose-400 font-semibold text-[11px]">
              {activeIncidents.length > 0 
                ? '⚠️ Critical Obstruction: Would incur 4-6 hours stranded delay if not rerouted.'
                : 'Corridor operating under standard timetabled headway.'}
            </div>
          </div>
        </div>

        {/* Card 2: AI Alternative Detour (Synthesized & Safe) */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900 to-emerald-950/20 shadow-xl shadow-emerald-950/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">AI Synthesized Path</span>
                <h4 className="text-base font-bold text-white">Dynamic Bypass Chord Detour</h4>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Kavach Clear
            </span>
          </div>

          {/* Detour Route Stations */}
          <div className="space-y-2">
            <div className="text-xs text-slate-400">AI Synthesized Detour Corridor:</div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {(aiDetour?.detourRoute || ['CSMT', 'KYN', 'KJT', 'LNL', 'PUNE', 'DD', 'ANG', 'MMR', 'NDLS']).map((code, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 font-bold">
                    {STATIONS[code]?.name || code}
                  </span>
                  {i < (aiDetour?.detourRoute || []).length - 1 && (
                    <span className="mx-1 text-emerald-500 font-bold">➔</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-2xl border border-emerald-500/30">
            <div>
              <span className="text-slate-400 block text-[10px]">Detour Distance</span>
              <strong className="text-white font-mono">{aiDetour?.detourDistanceKm || 1562} km</strong>
              <span className="text-[10px] text-amber-400 block">+{aiDetour?.extraDistanceKm || 142} km chord</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ETA Adjustment</span>
              <strong className="text-emerald-400 font-mono">+{aiDetour?.extraTimeMins || 45} mins total</strong>
              <span className="text-[10px] text-emerald-400 block">Saves ~3.5h delay!</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800 text-emerald-300 font-semibold text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safety Verified: 100% Kavach automatic collision protection active.</span>
            </div>
          </div>

          {/* Passenger Actions */}
          <div className="pt-2">
            {acceptedDetour ? (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Detour Confirmed! Your Coach & Berth are protected.</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Pass</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptDetour}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept AI Detour & Protect My Seat</span>
                </button>

                <a
                  href="tel:139"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition text-center"
                >
                  Claim 100% Refund (RailMadad)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Connecting Trains Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Train className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Alternative Direct & Connecting Trains Available</h4>
          </div>
          <span className="text-[10px] text-slate-400">IRCTC Direct Switch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Train #20901 Vande Bharat Express</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Seats: 48 EC/CC</span>
            </div>
            <p className="text-[11px] text-slate-400">Via Western Mainline (MMCT ➔ Surat ➔ Vadodara)</p>
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>Departs: 06:00 hrs</span>
              <span className="text-cyan-400 font-semibold">Priority Clearance</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Train #12951 Mumbai Rajdhani Express</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Seats: 12 2A/3A</span>
            </div>
            <p className="text-[11px] text-slate-400">Via Ratlam - Kota Golden Quadrilateral</p>
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>Departs: 17:00 hrs</span>
              <span className="text-cyan-400 font-semibold">Rajdhani Class</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
