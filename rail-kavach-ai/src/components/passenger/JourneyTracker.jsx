import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Navigation, 
  ShieldCheck, 
  Train 
} from 'lucide-react';
import { STATIONS, TRACK_SECTIONS } from '../../data/railwayNetwork';

export function JourneyTracker({ passenger, train, activeIncidents, activeBlocks, aiDetour }) {
  if (!passenger || !train) return null;

  const routeStations = passenger.routeStations || train.route;

  // Check if any station is affected by active incident
  const isStationImpacted = (stationCode) => {
    return activeIncidents.some(inc => inc.fromStation === stationCode || inc.toStation === stationCode);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Live Journey Route Telemetry</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Train #{train.trainNumber}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white mt-1">
            {STATIONS[passenger.fromStation]?.name} ➔ {STATIONS[passenger.toStation]?.name}
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Scheduled:</span>{' '}
            <strong className="text-white">{passenger.scheduledDeparture} hrs</strong>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Status:</span>{' '}
            <strong className={activeIncidents.length > 0 ? "text-red-400" : "text-emerald-400"}>
              {activeIncidents.length > 0 ? "Corridor Diverted" : "On Schedule"}
            </strong>
          </div>
        </div>
      </div>

      {/* Station Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {routeStations.map((code, idx) => {
          const st = STATIONS[code];
          const isOrigin = idx === 0;
          const isDestination = idx === routeStations.length - 1;
          const isDisrupted = isStationImpacted(code);

          let nodeColor = 'bg-slate-700 border-slate-900';
          let textColor = 'text-slate-300';

          if (isOrigin) {
            nodeColor = 'bg-blue-500 border-slate-950 ring-4 ring-blue-500/20';
            textColor = 'text-blue-300 font-bold';
          } else if (isDestination) {
            nodeColor = 'bg-emerald-500 border-slate-950 ring-4 ring-emerald-500/20';
            textColor = 'text-emerald-300 font-bold';
          } else if (isDisrupted) {
            nodeColor = 'bg-red-500 border-slate-950 ring-4 ring-red-500/30 animate-pulse';
            textColor = 'text-red-300 font-bold';
          }

          return (
            <div key={code} className="relative flex items-start justify-between group">
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 ${nodeColor} flex items-center justify-center`}
              >
                {isDisrupted && <span className="text-[10px] text-white font-bold">!</span>}
              </div>

              {/* Station Info */}
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-sm ${textColor}`}>
                    {st ? st.name : code}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">({code})</span>
                  {isOrigin && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded font-semibold">
                      Boarding Point
                    </span>
                  )}
                  {isDestination && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                      Destination
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  {st ? `${st.division} Division • ${st.platforms} Platforms` : 'Waypoint'}
                </div>

                {isDisrupted && (
                  <div className="mt-1.5 p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Active Incident Zone: Track Blocked. AI Detour in progress.</span>
                  </div>
                )}
              </div>

              {/* Speed & Kavach Status */}
              <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                <div className="flex items-center space-x-1 justify-end text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Kavach 100%</span>
                </div>
                <span>Platform #1/2</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
