import React, { useState, useMemo } from 'react';
import { 
  STATIONS, 
  TRACK_SECTIONS 
} from '../data/railwayNetwork';
import { TRAINS } from '../data/trains';
import { 
  Layers, 
  Train, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Navigation, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Compass,
  Radio
} from 'lucide-react';

export function RailNetworkMap({
  activeIncidents = [],
  activeBlocks = [],
  selectedTrain = null,
  highlightedDetour = null,
  onSelectStation,
  onSelectTrack
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showChords, setShowChords] = useState(true);
  const [showKavach, setShowKavach] = useState(true);
  const [showTrains, setShowTrains] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [selectedStationData, setSelectedStationData] = useState(null);

  // SVG Coordinate Projection helper from Geo Coordinates (Lat/Lng to SVG X/Y)
  // Geobounds for Western & Central Maharashtra-Gujarat-MP Corridor:
  // Lat: 17.5 to 28.8, Lng: 72.5 to 88.5
  const projectGeoToSvg = (lat, lng) => {
    const minLat = 17.2, maxLat = 28.8;
    const minLng = 72.4, maxLng = 88.5;

    const width = 1100;
    const height = 750;

    // Linear mapping with slight curve adjustment for clarity
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 160) + 80;
    // Invert Y because SVG coordinates increase downwards
    const y = height - (((lat - minLat) / (maxLat - minLat)) * (height - 140) + 70);

    return { x, y };
  };

  // Build quick map of station projected coordinates
  const stationCoords = useMemo(() => {
    const map = {};
    Object.keys(STATIONS).forEach(code => {
      const st = STATIONS[code];
      map[code] = projectGeoToSvg(st.lat, st.lng);
    });
    return map;
  }, []);

  // Blocked Section IDs
  const blockedSectionIds = useMemo(() => {
    const set = new Set();
    activeIncidents.forEach(inc => {
      if (inc.sectionId) set.add(inc.sectionId);
    });
    return set;
  }, [activeIncidents]);

  // Mega Block Section IDs
  const megaBlockSectionIds = useMemo(() => {
    const set = new Set();
    activeBlocks.forEach(blk => {
      if (blk.extraction?.affectedSections) {
        blk.extraction.affectedSections.forEach(s => set.add(s));
      }
    });
    return set;
  }, [activeBlocks]);

  // Pan & Zoom handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl bg-gradient-to-b from-slate-950 via-[#070e1b] to-slate-950 border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-lg">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-100">
            Indian Rail Dynamic Topology
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
            Kavach AI V4.2
          </span>
        </div>

        {/* Status Indicators */}
        {activeIncidents.length > 0 && (
          <div className="flex items-center space-x-1.5 bg-red-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/50 text-red-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>{activeIncidents.length} Incident Zone</span>
          </div>
        )}

        {highlightedDetour && (
          <div className="flex items-center space-x-1.5 bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-950/40">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Detour Active (+{highlightedDetour.extraTimeMins}m)</span>
          </div>
        )}
      </div>

      {/* Layer Control Controls Overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.65))}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Layer Chips */}
        <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-lg space-y-1.5 text-[11px]">
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showChords}
              onChange={(e) => setShowChords(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
            />
            <span>Bypass Chords</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showTrains}
              onChange={(e) => setShowTrains(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Live Train Rakes</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showKavach}
              onChange={(e) => setShowKavach(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Kavach Coverage</span>
          </label>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 shadow-xl">
        <div className="font-bold text-slate-300 flex items-center space-x-1.5 border-b border-slate-800 pb-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Track Status Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
            <span>Normal Track (110-160 km/h)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-400 font-semibold">Accident / Blocked</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded-full"></span>
            <span className="text-amber-400">Mega Block (30 km/h)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-full"></span>
            <span className="text-cyan-300 font-semibold">AI Detour Chord</span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Map Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing relative flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1100 750"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            {/* Glow Filter for Active Detours */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 1. Track Network Lines */}
          <g className="tracks-layer">
            {TRACK_SECTIONS.map((sec) => {
              const from = stationCoords[sec.from];
              const to = stationCoords[sec.to];
              if (!from || !to) return null;

              const isBlocked = blockedSectionIds.has(sec.id);
              const isMegaBlock = megaBlockSectionIds.has(sec.id);
              const isChord = sec.isChord;

              if (isChord && !showChords) return null;

              // Determine color and styling
              let strokeColor = '#22c55e'; // Normal Green
              let strokeWidth = isChord ? 2.5 : 3.5;
              let isDashed = false;
              let filter = '';

              if (isBlocked) {
                strokeColor = '#ef4444'; // Red
                strokeWidth = 5;
                filter = 'url(#red-glow)';
              } else if (isMegaBlock) {
                strokeColor = '#f59e0b'; // Amber
                strokeWidth = 4;
                isDashed = true;
              } else if (isChord) {
                strokeColor = '#38bdf8'; // Cyan Chord
              }

              return (
                <g key={sec.id} className="cursor-pointer group" onClick={() => onSelectTrack?.(sec)}>
                  {/* Outer glow line */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth + 4}
                    strokeOpacity={isBlocked ? 0.4 : 0.15}
                    strokeLinecap="round"
                  />

                  {/* Core Track Line */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isDashed ? '6 4' : isChord ? '4 2' : 'none'}
                    strokeLinecap="round"
                    filter={filter}
                    className={isBlocked ? 'animate-pulse' : ''}
                    onMouseEnter={() => setHoveredTrack(sec)}
                    onMouseLeave={() => setHoveredTrack(null)}
                  />

                  {/* Incident / Block Hazard Icon Marker on Track Center */}
                  {isBlocked && (
                    <g transform={`translate(${(from.x + to.x) / 2 - 12}, ${(from.y + to.y) / 2 - 12})`}>
                      <circle cx="12" cy="12" r="14" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" className="animate-ping" opacity="0.6" />
                      <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="12" y="15" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#ffffff">!</text>
                    </g>
                  )}

                  {isMegaBlock && !isBlocked && (
                    <g transform={`translate(${(from.x + to.x) / 2 - 10}, ${(from.y + to.y) / 2 - 10})`}>
                      <circle cx="10" cy="10" r="9" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
                      <text x="10" y="13" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ffffff">M</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* 2. Highlighted AI Detour Route Overlay (Neon Cyan / Emerald) */}
          {highlightedDetour && highlightedDetour.detourRoute && (
            <g className="ai-detour-layer" filter="url(#cyan-glow)">
              {highlightedDetour.detourRoute.map((stCode, idx) => {
                if (idx >= highlightedDetour.detourRoute.length - 1) return null;
                const nextCode = highlightedDetour.detourRoute[idx + 1];
                const from = stationCoords[stCode];
                const to = stationCoords[nextCode];
                if (!from || !to) return null;

                return (
                  <line
                    key={`detour-${stCode}-${nextCode}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#06b6d4"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="animate-detour-flow"
                  />
                );
              })}
            </g>
          )}

          {/* 3. Live Train Rakes Moving on Network */}
          {showTrains && (
            <g className="trains-layer">
              {TRAINS.map((train) => {
                const cur = train.currentLocation;
                if (!cur) return null;
                const from = stationCoords[cur.fromStation];
                const to = stationCoords[cur.toStation];
                if (!from || !to) return null;

                // Interpolate exact position
                const pct = cur.progressPct / 100;
                const trainX = from.x + (to.x - from.x) * pct;
                const trainY = from.y + (to.y - from.y) * pct;

                const isTrainSelected = selectedTrain && selectedTrain.trainNumber === train.trainNumber;

                return (
                  <g key={train.trainNumber} className="cursor-pointer" transform={`translate(${trainX}, ${trainY})`}>
                    {/* Ripple aura */}
                    <circle cx="0" cy="0" r={isTrainSelected ? "14" : "10"} fill="#38bdf8" opacity="0.3" className="animate-ping" />
                    <rect
                      x="-8"
                      y="-8"
                      width="16"
                      height="16"
                      rx="4"
                      fill={isTrainSelected ? "#f59e0b" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="3"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#ffffff"
                    >
                      🚆
                    </text>

                    {/* Label */}
                    <rect
                      x="-35"
                      y="-22"
                      width="70"
                      height="12"
                      rx="3"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke="#38bdf8"
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="-13"
                      fontSize="7"
                      fontWeight="600"
                      textAnchor="middle"
                      fill="#e2e8f0"
                    >
                      {train.trainNumber} ({cur.speedKmH}km/h)
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 4. Station Junction Nodes */}
          <g className="stations-layer">
            {Object.keys(STATIONS).map((code) => {
              const st = STATIONS[code];
              const pt = stationCoords[code];
              if (!pt) return null;

              const isJunction = st.junction;
              const isHovered = hoveredNode === code;

              return (
                <g
                  key={code}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedStationData(st);
                    onSelectStation?.(st);
                  }}
                  onMouseEnter={() => setHoveredNode(code)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isJunction ? 6 : 4}
                    fill={isJunction ? '#f8fafc' : '#94a3b8'}
                    stroke={isJunction ? '#f97316' : '#334155'}
                    strokeWidth={isJunction ? 2.5 : 1.5}
                    className="transition-all duration-150 group-hover:scale-125"
                  />

                  {/* Station Label */}
                  <text
                    x={pt.x}
                    y={pt.y + (isJunction ? 14 : 11)}
                    fontSize={isJunction ? '9' : '7.5'}
                    fontWeight={isJunction ? '700' : '500'}
                    textAnchor="middle"
                    fill={isHovered ? '#38bdf8' : isJunction ? '#f1f5f9' : '#94a3b8'}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {st.name.split(' (')[0]}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hovered Track Tooltip Card */}
        {hoveredTrack && (
          <div className="absolute top-16 right-20 z-30 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/40 text-xs shadow-2xl space-y-1.5 w-64 pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-cyan-400">{hoveredTrack.id}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {hoveredTrack.distanceKm} km
              </span>
            </div>
            <div className="font-semibold text-slate-100">
              {STATIONS[hoveredTrack.from]?.name} ➔ {STATIONS[hoveredTrack.to]?.name}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
              <div>Tracks: <span className="font-bold text-white">{hoveredTrack.tracks} Lines</span></div>
              <div>Max Speed: <span className="font-bold text-emerald-400">{hoveredTrack.maxSpeedKmH} km/h</span></div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
              <span>Kavach: {hoveredTrack.kavach ? '✅ Active' : '❌ Manual'}</span>
              <span className={hoveredTrack.isChord ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                {hoveredTrack.isChord ? 'Bypass Chord' : 'Main Corridor'}
              </span>
            </div>
          </div>
        )}

        {/* Station Selected Detail Modal */}
        {selectedStationData && (
          <div className="absolute bottom-16 right-4 z-30 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-2 w-72">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">STATION TELEMETRY</span>
                <h4 className="text-sm font-bold text-white">{selectedStationData.name} ({selectedStationData.code})</h4>
              </div>
              <button
                onClick={() => setSelectedStationData(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <div>Zone: <strong className="text-white">{selectedStationData.zone}</strong></div>
              <div>Division: <strong className="text-white">{selectedStationData.division}</strong></div>
              <div>Platforms: <strong className="text-white">{selectedStationData.platforms} Tracks</strong></div>
              <div>Type: <strong className="text-emerald-400">{selectedStationData.junction ? 'Junction Node' : 'Intermediate'}</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Geo: {selectedStationData.lat.toFixed(3)}°N, {selectedStationData.lng.toFixed(3)}°E</span>
              <span className="text-emerald-400 font-semibold">● OHE Energized</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
