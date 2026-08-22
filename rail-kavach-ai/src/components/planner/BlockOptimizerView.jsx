import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Leaf,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BlockOptimizationEngine } from '../../services/blockOptimizer';

export function BlockOptimizerView({ activeBlocks, activeIncidents }) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const optimizationData = useMemo(() => {
    return BlockOptimizationEngine.computeOptimizationReport(activeBlocks, activeIncidents);
  }, [activeBlocks, activeIncidents]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 relative overflow-hidden bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">
                  AI Automatic Block Planning & Asset Availability Engine
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  PuLP / OR Solver
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Dynamically packs track maintenance windows into optimal headway slots, eliminating congestion conflicts and maximizing locomotive turnaround.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Comparison Cards (Before vs After AI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Track Utilization */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Track Corridor Utilization</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {optimizationData.ai.trackUtilizationPct}%
            </span>
            <span className="text-xs font-bold text-emerald-400">
              (+{(optimizationData.ai.trackUtilizationPct - optimizationData.legacy.trackUtilizationPct).toFixed(1)}% AI Boost)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Legacy Manual: {optimizationData.legacy.trackUtilizationPct}%</span>
            <span className="text-emerald-400 font-semibold">Max Flow</span>
          </div>
        </div>

        {/* Card 2: Fleet & Asset Availability */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Fleet Asset Availability</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {optimizationData.ai.assetAvailabilityPct}%
            </span>
            <span className="text-xs font-bold text-cyan-400">
              (+{(optimizationData.ai.assetAvailabilityPct - optimizationData.legacy.assetAvailabilityPct).toFixed(1)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Legacy Manual: {optimizationData.legacy.assetAvailabilityPct}%</span>
            <span className="text-cyan-400 font-semibold">Turnaround High</span>
          </div>
        </div>

        {/* Card 3: Average Passenger Delay */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Avg Corridor Delay</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {optimizationData.ai.averageDelayMins}m
            </span>
            <span className="text-xs font-bold text-emerald-400">
              (-{optimizationData.legacy.averageDelayMins - optimizationData.ai.averageDelayMins}m Saved)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Legacy Manual: {optimizationData.legacy.averageDelayMins}m</span>
            <span className="text-amber-400 font-semibold">Kavach Headway</span>
          </div>
        </div>

        {/* Card 4: Green Carbon Savings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">CO₂ Emissions Saved</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {optimizationData.ai.carbonSavedTons} Tons
            </span>
            <span className="text-xs font-bold text-emerald-400">
              Eco-Traction
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Idle Elimination</span>
            <span className="text-emerald-400 font-semibold">OHE Direct</span>
          </div>
        </div>
      </div>

      {/* Detailed Before vs After Optimization Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comparative Metrics Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Before vs After AI Optimization Report</span>
            </h4>
            <span className="text-[10px] text-slate-400">Live Mathematical Telemetry</span>
          </div>

          <div className="space-y-3">
            {optimizationData.comparisonMetrics.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">{item.metric}</div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-slate-400">
                      Before (Manual): <span className="line-through text-rose-400 font-mono">{item.before}</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      After (AI): {item.after}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    {item.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Applied AI Algorithms List */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Optimization Solvers Active in Real-time:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {optimizationData.aiAlgorithmsApplied.map((algo, i) => (
                <div key={i} className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{algo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 24-Hour Corridor Slot Allocation Timeline (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>24-Hour Corridor Headway Slots</span>
            </h4>
            <span className="text-[10px] text-slate-400">Load %</span>
          </div>

          <div className="space-y-3">
            {optimizationData.timeSlots.map((slot, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-200">{slot.hour}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold">
                    {slot.maintenanceWindow}
                  </span>
                </div>

                {/* Progress Comparison Bars */}
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between text-slate-400">
                    <span>AI Optimized Load</span>
                    <span className="text-emerald-400 font-bold font-mono">{slot.aiOptimizedLoad}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      style={{ width: `${slot.aiOptimizedLoad}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-slate-500 pt-0.5">
                    <span>Legacy Manual Flow</span>
                    <span className="font-mono">{slot.legacyLoad}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full"
                      style={{ width: `${slot.legacyLoad}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
