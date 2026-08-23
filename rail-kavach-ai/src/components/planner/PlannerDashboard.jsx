import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Train, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { RailNetworkMap } from '../RailNetworkMap';
import { AccidentSimulator } from './AccidentSimulator';
import { MegaBlockScanner } from './MegaBlockScanner';
import { BlockOptimizerView } from './BlockOptimizerView';
import { AssetFleetStatus } from './AssetFleetStatus';

export function PlannerDashboard({
  activeIncidents,
  activeBlocks,
  notifications,
  onTriggerAccident,
  onResolveAccident,
  onScheduleBlock,
  onRemoveBlock,
  onOpenNotifications,
  highlightedDetour,
  setHighlightedDetour
}) {
  const [activeTab, setActiveTab] = useState('MAP'); // 'MAP' | 'ACCIDENTS' | 'MEGABLOCK' | 'OPTIMIZER' | 'ASSETS'
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Top Operations KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Track Corridor Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">99.4%</div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-1 font-semibold">
            <span>● 44 Active Corridors Clear</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Incidents</span>
            <AlertTriangle className={`w-4 h-4 ${activeIncidents.length > 0 ? 'text-red-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-extrabold ${activeIncidents.length > 0 ? 'text-red-400' : 'text-white'}`}>
            {activeIncidents.length}
          </div>
          <div className="text-[10px] text-slate-400">
            {activeIncidents.length > 0 ? 'AI Detours Active' : 'Zero Disruption Zones'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Scheduled Mega Blocks</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {activeBlocks.length}
          </div>
          <div className="text-[10px] text-slate-400">
            AI Tamping & OHE Windows
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Asset Utilization</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">92.8%</div>
          <div className="text-[10px] text-cyan-300 font-semibold">
            +31.2% vs Legacy Manual
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('MAP')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'MAP'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive Rail Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('ACCIDENTS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'ACCIDENTS'
              ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Accident Control & AI Detour (Idea 1 & 3)</span>
          {activeIncidents.length > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-red-700 text-[10px] font-bold rounded-full">
              {activeIncidents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('MEGABLOCK')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'MEGABLOCK'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mega Block Notice AI Scanner (Idea 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('OPTIMIZER')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'OPTIMIZER'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Block Optimizer (Before vs After)</span>
        </button>

        <button
          onClick={() => setActiveTab('ASSETS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'ASSETS'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Asset & Rolling Stock Telemetry</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'MAP' && (
        <div className="space-y-4">
          <RailNetworkMap
            activeIncidents={activeIncidents}
            activeBlocks={activeBlocks}
            highlightedDetour={highlightedDetour}
            onSelectTrack={(track) => setSelectedTrack(track)}
          />
        </div>
      )}

      {activeTab === 'ACCIDENTS' && (
        <AccidentSimulator
          activeIncidents={activeIncidents}
          onTriggerAccident={onTriggerAccident}
          onResolveAccident={onResolveAccident}
          onHighlightDetour={(detour) => {
            setHighlightedDetour(detour);
            setActiveTab('MAP');
          }}
        />
      )}

      {activeTab === 'MEGABLOCK' && (
        <MegaBlockScanner
          activeBlocks={activeBlocks}
          onScheduleBlock={onScheduleBlock}
          onRemoveBlock={onRemoveBlock}
          onOpenNotifications={onOpenNotifications}
        />
      )}

      {activeTab === 'OPTIMIZER' && (
        <BlockOptimizerView
          activeBlocks={activeBlocks}
          activeIncidents={activeIncidents}
        />
      )}

      {activeTab === 'ASSETS' && (
        <AssetFleetStatus />
      )}
    </div>
  );
}
