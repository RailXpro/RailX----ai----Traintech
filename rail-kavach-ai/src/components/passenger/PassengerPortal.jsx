import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Train, 
  AlertTriangle, 
  FileText, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Ticket, 
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { SAMPLE_PNRS } from '../../data/samplePNRs';
import { TRAINS } from '../../data/trains';
import { STATIONS } from '../../data/railwayNetwork';
import { defaultRouteSolver } from '../../services/routeSolver';
import { JourneyTracker } from './JourneyTracker';
import { RerouteExplorer } from './RerouteExplorer';
import { SafetyBriefing } from './SafetyBriefing';

export function PassengerPortal({
  selectedPNR,
  setSelectedPNR,
  activeIncidents,
  activeBlocks,
  notifications,
  onViewRouteOnMap
}) {
  const [pnrInput, setPnrInput] = useState(selectedPNR || '8452190342');
  const [activeTab, setActiveTab] = useState('TIMELINE'); // 'TIMELINE' | 'REROUTE' | 'ALERTS' | 'SAFETY'

  // Current active passenger profile
  const currentPassenger = useMemo(() => {
    return SAMPLE_PNRS.find(p => p.pnr === pnrInput) || SAMPLE_PNRS[0];
  }, [pnrInput]);

  // Current train
  const currentTrain = useMemo(() => {
    return TRAINS.find(t => t.trainNumber === currentPassenger.trainNumber) || TRAINS[0];
  }, [currentPassenger]);

  // AI Detour for this train/passenger
  const aiDetour = useMemo(() => {
    return defaultRouteSolver.generateSmartDetour(currentTrain, activeIncidents, activeBlocks);
  }, [currentTrain, activeIncidents, activeBlocks]);

  // Personalized alerts for this specific passenger
  const passengerAlerts = useMemo(() => {
    return notifications.filter(n => n.pnr === currentPassenger.pnr);
  }, [notifications, currentPassenger]);

  const hasAccidentAlert = passengerAlerts.some(n => n.type === 'ACCIDENT_CORRIDOR_ALERT');
  const hasMegaBlockAlert = passengerAlerts.some(n => n.type === 'MEGA_BLOCK_PERSONALIZED_ADVISORY');

  const handleSelectDemoPnr = (pnr) => {
    setPnrInput(pnr);
    setSelectedPNR(pnr);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* PNR Quick Selector & Search Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <span>Passenger Travel Companion & Disruption Hub</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized AI safety monitor for active Indian Railways bookings.
            </p>
          </div>

          {/* Quick Demo PNR Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 text-[11px]">Select Demo PNR:</span>
            {SAMPLE_PNRS.map((p) => (
              <button
                key={p.pnr}
                onClick={() => handleSelectDemoPnr(p.pnr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  pnrInput === p.pnr
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {p.passengerName.split(' ')[0]} ({p.trainNumber})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ticket & Booking Details Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1224] to-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 font-bold">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-white">
                  Train #{currentPassenger.trainNumber} • {currentPassenger.trainName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  {currentPassenger.classType}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Booked for: <span className="text-white font-semibold">{currentPassenger.passengerName}</span> • PNR: <span className="font-mono text-cyan-400 font-bold">{currentPassenger.pnr}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Confirmed ({currentPassenger.coach} / {currentPassenger.berths})</span>
            </span>
          </div>
        </div>

        {/* Origin ➔ Destination Route Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Boarding Station</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {STATIONS[currentPassenger.fromStation]?.name} ({currentPassenger.fromStation})
            </div>
            <span className="text-slate-400 text-[11px]">Departure: {currentPassenger.scheduledDeparture} hrs</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Date: {currentPassenger.journeyDate}</span>
            <div className="w-full flex items-center justify-center space-x-2 my-1">
              <span className="h-0.5 flex-1 bg-slate-800"></span>
              <span className="text-slate-500">➔</span>
              <span className="h-0.5 flex-1 bg-slate-800"></span>
            </div>
            <span className="text-[10px] text-slate-400">{currentTrain.duration} Runtime</span>
          </div>

          <div className="sm:text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination Station</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {STATIONS[currentPassenger.toStation]?.name} ({currentPassenger.toStation})
            </div>
            <span className="text-slate-400 text-[11px]">Arrival: {currentTrain.arrTime} hrs</span>
          </div>
        </div>

        {/* Live Disruption Alerts & Smart Notification Banner (Idea 1 & 2) */}
        {hasAccidentAlert ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-2 border-red-500/70 text-xs space-y-2.5 shadow-xl shadow-red-950/60 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>CRITICAL ACCIDENT REPORTED ON YOUR ROUTE</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/30 text-white font-mono font-bold">
                AI Sensed Incident
              </span>
            </div>
            <p className="text-slate-200">
              {passengerAlerts[0]?.exactAccidentDetails?.officialDescription || 'Corridor obstructed downstream. AI alternative detour synthesized.'}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-500/30 text-[11px]">
              <span className="text-amber-300">
                <strong>Exact Spot:</strong> {passengerAlerts[0]?.exactAccidentDetails?.exactLocation}
              </span>
              <button
                onClick={() => setActiveTab('REROUTE')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View AI Detour Route (+{aiDetour?.extraTimeMins || 45}m)</span>
              </button>
            </div>
          </div>
        ) : hasMegaBlockAlert ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>PLANNED MEGA BLOCK ADVISORY ON YOUR TRACK</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                Maintenance Window
              </span>
            </div>
            <p className="text-slate-300">
              {passengerAlerts[0]?.exactBlockDetails?.impactSummary || 'Engineering work scheduled on your path. Expect 15-25 min speed regulation.'}
            </p>
          </div>
        ) : null}
      </div>

      {/* Tab Navigation for Passenger View */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'TIMELINE'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Live Station Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('REROUTE')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'REROUTE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-cyan-400 hover:bg-cyan-950/40'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>AI Smart Alternative Routes (Idea 1 & 3)</span>
          {aiDetour?.hasDetour && (
            <span className="px-1.5 py-0.2 rounded-full bg-white text-cyan-800 text-[10px] font-bold">
              Detour Ready
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ALERTS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'ALERTS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-amber-400 hover:bg-amber-950/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Disruption Notices ({passengerAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'SAFETY'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kavach Safety Shield & SOS</span>
        </button>
      </div>

      {/* Sub-tab Views */}
      {activeTab === 'TIMELINE' && (
        <JourneyTracker
          passenger={currentPassenger}
          train={currentTrain}
          activeIncidents={activeIncidents}
          activeBlocks={activeBlocks}
          aiDetour={aiDetour}
        />
      )}

      {activeTab === 'REROUTE' && (
        <RerouteExplorer
          passenger={currentPassenger}
          train={currentTrain}
          activeIncidents={activeIncidents}
          activeBlocks={activeBlocks}
          aiDetour={aiDetour}
          onViewOnMap={onViewRouteOnMap}
        />
      )}

      {activeTab === 'ALERTS' && (
        <div className="space-y-4">
          {passengerAlerts.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">No Disruption Alerts on Your Itinerary</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your corridor is clear with full Kavach automatic block protection active.
              </p>
            </div>
          ) : (
            passengerAlerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-panel p-5 rounded-3xl border border-orange-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-slate-400">{alert.timestamp.split('T')[0]}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                {alert.exactAccidentDetails && (
                  <div className="bg-slate-950/80 p-3 rounded-2xl text-xs space-y-1 border border-slate-800">
                    <div>Location: <strong className="text-amber-300">{alert.exactAccidentDetails.exactLocation}</strong></div>
                    <div>Severity: <strong className="text-red-400">{alert.exactAccidentDetails.severityLevel}</strong></div>
                    <div>ETA: <strong className="text-orange-400">{alert.exactAccidentDetails.estimatedClearance}</strong></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'SAFETY' && (
        <SafetyBriefing />
      )}
    </div>
  );
}
