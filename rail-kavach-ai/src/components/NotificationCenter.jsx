import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ShieldAlert, 
  Train, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { STATIONS } from '../data/railwayNetwork';

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onClearAll,
  onSelectPassengerPNR,
  onViewRouteOnMap
}) {
  const [filter, setFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'ACCIDENT') return n.type === 'ACCIDENT_CORRIDOR_ALERT';
    if (filter === 'MEGABLOCK') return n.type === 'MEGA_BLOCK_PERSONALIZED_ADVISORY';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>RailKavach Live Alert Hub</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {notifications.length} Total
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personalized Passenger Disruption & AI Rerouting Feed
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex space-x-2 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              filter === 'ALL'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('ACCIDENT')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5 transition ${
              filter === 'ACCIDENT'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-400 hover:bg-red-950/40 border border-red-900/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Accidents ({notifications.filter(n => n.type === 'ACCIDENT_CORRIDOR_ALERT').length})</span>
          </button>
          <button
            onClick={() => setFilter('MEGABLOCK')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5 transition ${
              filter === 'MEGABLOCK'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-400 hover:bg-amber-950/40 border border-amber-900/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mega Blocks ({notifications.filter(n => n.type === 'MEGA_BLOCK_PERSONALIZED_ADVISORY').length})</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-base font-semibold text-slate-200">No Disruption Alerts Active</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                All railway track corridors are operating under normal schedule with Kavach safety guard active.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isAccident = notif.type === 'ACCIDENT_CORRIDOR_ALERT';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isAccident
                      ? 'bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-red-500/40 shadow-lg shadow-red-950/50'
                      : 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 shadow-lg shadow-amber-950/30'
                  } ${!notif.isRead ? 'ring-1 ring-orange-400/50' : ''}`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center space-x-2">
                      {isAccident ? (
                        <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          PNR #{notif.pnr} • {notif.passengerName}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">{notif.title}</h4>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>Just now</span>
                    </span>
                  </div>

                  {/* Body message */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {notif.message}
                  </p>

                  {/* Exact Accident Details Box (Requirement #1) */}
                  {isAccident && notif.exactAccidentDetails && (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-red-500/30 space-y-2 mb-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400">Incident Type:</span>{' '}
                          <span className="font-bold text-red-400">{notif.exactAccidentDetails.incidentType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Involved Train:</span>{' '}
                          <span className="font-bold text-slate-200">{notif.exactAccidentDetails.involvedTrain}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400">Exact Location:</span>{' '}
                          <span className="font-semibold text-amber-300">{notif.exactAccidentDetails.exactLocation}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Clearance ETA:</span>{' '}
                          <span className="font-bold text-orange-400">{notif.exactAccidentDetails.estimatedClearance}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Safety Status:</span>{' '}
                          <span className="font-semibold text-emerald-400">Kavach Safe-Braked</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                        {notif.exactAccidentDetails.officialDescription}
                      </p>
                    </div>
                  )}

                  {/* Mega Block Details Box (Requirement #2) */}
                  {!isAccident && notif.exactBlockDetails && (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1.5 mb-3 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold">{notif.exactBlockDetails.blockType}</span>
                        <span className="font-mono text-slate-300">{notif.exactBlockDetails.maintenanceDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-200">
                        <strong>Time Window:</strong> {notif.exactBlockDetails.timeWindow}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        <strong>Lines Affected:</strong> {notif.exactBlockDetails.linesAffected}
                      </p>
                      <p className="text-[11px] text-emerald-400">
                        <strong>Work:</strong> {notif.exactBlockDetails.maintenanceNature}
                      </p>
                    </div>
                  )}

                  {/* AI Alternative Detour (Requirement #3) */}
                  {notif.aiAlternativeRoute && (
                    <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 mb-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                          <span>AI Smart Alternative Route Activated</span>
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                          {notif.aiAlternativeRoute.confidence} Match
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-200 flex flex-wrap gap-1 items-center">
                        {notif.aiAlternativeRoute.detourPath.map((st, i) => (
                          <span key={i} className="flex items-center">
                            <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded font-bold">{st}</span>
                            {i < notif.aiAlternativeRoute.detourPath.length - 1 && <span className="mx-1 text-emerald-400">➔</span>}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                        <span>Extra Distance: +{notif.aiAlternativeRoute.extraDistanceKm} km</span>
                        <span className="font-semibold text-amber-300">ETA Delta: +{notif.aiAlternativeRoute.extraTimeMins} mins</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => {
                        onSelectPassengerPNR(notif.pnr);
                        onClose();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                    >
                      <span>View in Passenger Portal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onViewRouteOnMap(notif);
                        onClose();
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition flex items-center space-x-1"
                    >
                      <Navigation className="w-3 h-3 text-amber-400" />
                      <span>Inspect Map Detour</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
