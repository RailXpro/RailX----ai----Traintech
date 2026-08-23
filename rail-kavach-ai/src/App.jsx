import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NotificationCenter } from './components/NotificationCenter';
import { PlannerDashboard } from './components/planner/PlannerDashboard';
import { PassengerPortal } from './components/passenger/PassengerPortal';
import { SAMPLE_ACCIDENTS } from './data/sampleAccidents';
import { SAMPLE_CIRCULARS } from './data/sampleCirculars';
import { MegaBlockScannerAI } from './services/megaBlockParser';
import { NotificationEngine } from './services/notificationEngine';
import { defaultRouteSolver } from './services/routeSolver';
import { TRAINS } from './data/trains';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState('PLANNER'); // 'PLANNER' | 'PASSENGER'
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [activeBlocks, setActiveBlocks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPassengerPNR, setSelectedPassengerPNR] = useState('8452190342');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [highlightedDetour, setHighlightedDetour] = useState(null);

  // Initialize with initial realistic state on mount
  useEffect(() => {
    // 1. Preload 1 sample Mega Block Notice (Central Railway Sunday Mega Block)
    const parsedBlock = MegaBlockScannerAI.scanCircular(SAMPLE_CIRCULARS[0].rawText, SAMPLE_CIRCULARS[0].id);
    setActiveBlocks([parsedBlock]);

    // Dispatch initial personalized mega block alerts to affected passengers
    const blockAlertsRes = NotificationEngine.dispatchMegaBlockAlerts(parsedBlock);

    // 2. Preload 1 active incident (Kasara-Igatpuri Ghat Derailment on Gitanjali Express)
    const initialIncident = SAMPLE_ACCIDENTS[0];
    setActiveIncidents([initialIncident]);

    // Dispatch initial exact accident alerts
    const accidentAlertsRes = NotificationEngine.dispatchAccidentAlerts(initialIncident, [parsedBlock]);

    setNotifications([
      ...accidentAlertsRes.alerts,
      ...blockAlertsRes.alerts,
    ]);

    // Set initial highlighted detour
    if (initialIncident.recommendedDetour) {
      setHighlightedDetour(initialIncident.recommendedDetour);
    }
  }, []);

  // Handler: Trigger an Accident & Run AI Interception
  const handleTriggerAccident = (incident) => {
    setActiveIncidents(prev => [incident, ...prev.filter(i => i.id !== incident.id)]);

    // Dispatch exact passenger alerts (Idea 1 & 2)
    const dispatchRes = NotificationEngine.dispatchAccidentAlerts(incident, activeBlocks);
    setNotifications(prev => [...dispatchRes.alerts, ...prev]);

    // Synthesize detour for involved train or first matched train
    const train = TRAINS.find(t => t.trainNumber === incident.involvedTrain) || TRAINS[0];
    const detour = defaultRouteSolver.generateSmartDetour(train, [incident, ...activeIncidents], activeBlocks);
    if (detour && detour.hasDetour) {
      setHighlightedDetour(detour);
    }
  };

  // Handler: Resolve Accident
  const handleResolveAccident = (id) => {
    setActiveIncidents(prev => prev.filter(i => i.id !== id));
    setHighlightedDetour(null);
  };

  // Handler: Schedule a Mega Block from Circular Scanner
  const handleScheduleBlock = (parsedBlock) => {
    setActiveBlocks(prev => [parsedBlock, ...prev.filter(b => b.id !== parsedBlock.id)]);

    // Dispatch personalized passenger advisories (Idea 2)
    const dispatchRes = NotificationEngine.dispatchMegaBlockAlerts(parsedBlock);
    setNotifications(prev => [...dispatchRes.alerts, ...prev]);
  };

  // Handler: Remove a Mega Block
  const handleRemoveBlock = (id) => {
    setActiveBlocks(prev => prev.filter(b => b.id !== id));
  };

  // Notification management
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectPassengerPNR = (pnr) => {
    setSelectedPassengerPNR(pnr);
    setCurrentPersona('PASSENGER');
  };

  const handleViewRouteOnMap = (notif) => {
    if (notif.aiAlternativeRoute) {
      setHighlightedDetour(notif.aiAlternativeRoute);
    }
    setCurrentPersona('PLANNER');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        notifications={notifications}
        activeIncidents={activeIncidents}
        activeBlocks={activeBlocks}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        selectedPassengerPNR={selectedPassengerPNR}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentPersona === 'PLANNER' ? (
          <PlannerDashboard
            activeIncidents={activeIncidents}
            activeBlocks={activeBlocks}
            notifications={notifications}
            onTriggerAccident={handleTriggerAccident}
            onResolveAccident={handleResolveAccident}
            onScheduleBlock={handleScheduleBlock}
            onRemoveBlock={handleRemoveBlock}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            highlightedDetour={highlightedDetour}
            setHighlightedDetour={setHighlightedDetour}
          />
        ) : (
          <PassengerPortal
            selectedPNR={selectedPassengerPNR}
            setSelectedPNR={setSelectedPassengerPNR}
            activeIncidents={activeIncidents}
            activeBlocks={activeBlocks}
            notifications={notifications}
            onViewRouteOnMap={handleViewRouteOnMap}
          />
        )}
      </main>

      {/* Slide-over Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAllNotifications}
        onSelectPassengerPNR={handleSelectPassengerPNR}
        onViewRouteOnMap={handleViewRouteOnMap}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>RailKavach AI — Automatic Block Planning & Disruption Intelligence System</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Center for Railway Information Systems (CRIS)</span>
            <span>•</span>
            <span>RDSO Kavach Protocol</span>
            <span>•</span>
            <span>RailMadad 139</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
