import React from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  Radio, 
  CheckCircle2, 
  HelpCircle, 
  HeartHandshake, 
  AlertCircle, 
  UtensilsCrossed 
} from 'lucide-react';

export function SafetyBriefing() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Kavach ATP Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Kavach Automatic Train Protection (ATP) Active
            </h3>
            <p className="text-xs text-slate-300">
              India's National Indigenous Safety Shield: Zero Head-on & Rear-end Collision Protocol.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 mb-1">Loco-to-Loco Radio:</div>
            <strong className="text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Continuous UHF 433MHz Linked</span>
            </strong>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 mb-1">Station Interlocking:</div>
            <strong className="text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fail-Safe RFID Synchronized</span>
            </strong>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 mb-1">Auto Safe-Braking:</div>
            <strong className="text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Speed Supervision Engaged</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Passenger Rights & Disruption Entitlements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <h4>Disruption & Delayed Journey Entitlements</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Free Refreshments & Bottled Water:</strong> Entitled on Rajdhani/Shatabdi/Vande Bharat if train is delayed by more than 2 hours.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>100% Full Ticket Refund:</strong> In case of route diversions or severe blockages, passengers may surrender tickets for 0 cancellation penalty.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Alternative Connection Guarantee:</strong> If missed connecting train due to late arrival, full fare of onward journey is protected.</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
            <PhoneCall className="w-4 h-4 text-red-400" />
            <h4>Emergency Railway Helplines (24x7)</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">RailMadad All-in-One Helpline</strong>
                <span className="text-slate-400 text-[11px]">Security, Medical, Accident & Passenger Assistance</span>
              </div>
              <a href="tel:139" className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold">
                Dial 139
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">National Disaster Response (NDRF Rail)</strong>
                <span className="text-slate-400 text-[11px]">Ghat & Tunnel Rescue Assistance</span>
              </div>
              <a href="tel:1072" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold">
                Dial 1072
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
