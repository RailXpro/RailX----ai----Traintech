import React, { useState } from 'react';
import { 
  Train, 
  Zap, 
  Users, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  ShieldCheck, 
  Activity,
  Gauge
} from 'lucide-react';

export function AssetFleetStatus() {
  const [activeCategory, setActiveCategory] = useState('LOCOS');

  const locomotives = [
    { id: 'WAP-7 #30481', type: 'Electric Passenger (6000 HP)', homeShed: 'Vadodara (BRC)', status: 'ACTIVE_HAULING', assignedTrain: '12951 Rajdhani', speed: '128 km/h', health: '98.5%' },
    { id: 'WAP-7 #37210', type: 'Electric Passenger (6000 HP)', homeShed: 'Kalyan (KYN)', status: 'ACTIVE_HAULING', assignedTrain: '22221 CSMT Rajdhani', speed: '110 km/h', health: '99.1%' },
    { id: 'VB-16 #20901', type: 'Vande Bharat Trainset 2.0 (16 Coaches)', homeShed: 'Mumbai Central (MMCT)', status: 'IN_SERVICE', assignedTrain: '20901 Vande Bharat', speed: '130 km/h', health: '99.8%' },
    { id: 'WAG-9HC #32840', type: 'Heavy Freight Electric (6000 HP)', homeShed: 'Bhusawal (BSL)', status: 'STANDBY_BANKER', assignedTrain: 'Ghat Banker Helper', speed: '0 km/h', health: '97.2%' },
  ];

  const maintenanceMachines = [
    { name: 'CSM-960 Continuous Action Tamper', division: 'Mumbai CR', section: 'Kasara-Igatpuri', status: 'DEPLOYED_ON_SITE', uptime: '94%' },
    { name: 'DGS-62N Dynamic Track Stabilizer', division: 'Mumbai WR', section: 'Borivali-Vasai', status: 'SCHEDULED_JUMBO_BLOCK', uptime: '98%' },
    { name: '25kV OHE 8-Wheeler Tower Inspection Car', division: 'Bhusawal', section: 'Manmad-Jalgaon', status: 'ACTIVE_PATROL', uptime: '99%' },
    { name: '140-Ton Hydraulic Break-down Crane', division: 'Kalyan Loco Yard', section: 'Central Main Line', status: 'EMERGENCY_READY', uptime: '100%' },
  ];

  const oheStations = [
    { name: 'Kalyan Traction Sub-Station (TSS)', voltage: '25.2 kV', currentLoad: '480 A', powerFactor: '0.98', status: 'OPTIMAL' },
    { name: 'Kasara Ghat Feeder Post', voltage: '24.8 kV', currentLoad: '720 A', powerFactor: '0.96', status: 'HEAVY_GRADIENT_DRAW' },
    { name: 'Igatpuri Neutral Section & Auto-Tension', voltage: '25.0 kV', currentLoad: '510 A', powerFactor: '0.97', status: 'OPTIMAL' },
    { name: 'Vasai Road TSS (WR-CR Grid Tie)', voltage: '25.4 kV', currentLoad: '620 A', powerFactor: '0.99', status: 'OPTIMAL' },
  ];

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex space-x-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit text-xs">
        <button
          onClick={() => setActiveCategory('LOCOS')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition ${
            activeCategory === 'LOCOS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Rolling Stock & Locomotives ({locomotives.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('MACHINES')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition ${
            activeCategory === 'MACHINES' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Track Tamping & Heavy Wagons ({maintenanceMachines.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('OHE')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition ${
            activeCategory === 'OHE' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>25kV OHE Power Grids ({oheStations.length})</span>
        </button>
      </div>

      {/* Dynamic Content */}
      {activeCategory === 'LOCOS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locomotives.map((loco) => (
            <div key={loco.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{loco.id}</h4>
                    <span className="text-[11px] text-slate-400">{loco.type}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {loco.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400">Home Shed:</span>{' '}
                  <strong className="text-slate-200">{loco.homeShed}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Train:</span>{' '}
                  <strong className="text-amber-300">{loco.assignedTrain}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Speed:</span>{' '}
                  <strong className="text-white font-mono">{loco.speed}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Telemetry Health:</span>{' '}
                  <strong className="text-emerald-400 font-mono">{loco.health}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'MACHINES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenanceMachines.map((m, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                    <span className="text-[11px] text-slate-400">{m.division} Division</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  Uptime {m.uptime}
                </span>
              </div>

              <div className="text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div>Assigned Section: <strong className="text-cyan-300">{m.section}</strong></div>
                <div>Operational Status: <strong className="text-emerald-400">{m.status}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'OHE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oheStations.map((sub, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                    <span className="text-[11px] text-slate-400">Traction Sub-Station</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {sub.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">Voltage</span>
                  <span className="font-bold text-white font-mono">{sub.voltage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current</span>
                  <span className="font-bold text-amber-300 font-mono">{sub.currentLoad}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Power Factor</span>
                  <span className="font-bold text-emerald-400 font-mono">{sub.powerFactor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
