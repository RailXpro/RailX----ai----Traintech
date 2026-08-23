import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Radio, 
  AlertTriangle, 
  Bell, 
  Volume2, 
  VolumeX, 
  Train, 
  UserCheck, 
  Briefcase, 
  PhoneCall, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { audioAlerts } from '../utils/audioAlerts';

export function Navbar({ 
  currentPersona, 
  setCurrentPersona, 
  notifications, 
  activeIncidents, 
  activeBlocks, 
  onOpenNotifications,
  soundEnabled,
  setSoundEnabled,
  selectedPassengerPNR,
  onResetSimulation
}) {
  const [timeStr, setTimeStr] = useState('');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioAlerts.enabled = next;
    if (next) audioAlerts.playSuccessTone();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
      {/* Top Emergency Status Bar if Active Incidents */}
      {activeIncidents.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-200 animate-bounce" />
            <span>
              <strong>EMERGENCY RAILWAY INCIDENT:</strong> {activeIncidents[0].title} — AI Corridor Interception & Auto-Rerouting ACTIVE.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-black/30 px-2 py-0.5 rounded border border-white/20">Kavach Stop Area Active</span>
            <span className="bg-black/30 px-2 py-0.5 rounded border border-white/20">RailMadad SOS: 139</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPersona('PLANNER')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/20">
                <Train className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-orange-400 via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  RailKavach AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  IR AI-Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Automatic Block Planning & Smart Passenger Rerouting System
              </p>
            </div>
          </div>

          {/* Center: Dual Persona Switcher */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => {
                setCurrentPersona('PLANNER');
                audioAlerts.playSuccessTone();
              }}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentPersona === 'PLANNER'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden md:inline">Operations Controller</span>
              <span className="md:hidden">Planner</span>
            </button>

            <button
              onClick={() => {
                setCurrentPersona('PASSENGER');
                audioAlerts.playSuccessTone();
              }}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentPersona === 'PASSENGER'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden md:inline">Passenger Travel Companion</span>
              <span className="md:hidden">Passenger</span>
            </button>
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Live System Time */}
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-xs font-mono text-cyan-400 font-semibold">{timeStr}</span>
              <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Kavach 99.9% Uptime</span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Alert Audio' : 'Enable Alert Audio'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* RailMadad SOS Helpline */}
            <a
              href="tel:139"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>SOS 139</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
