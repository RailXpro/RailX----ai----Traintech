import React, { useState, useEffect } from 'react';
import {
  Train, MapPin, Calendar, Clock, ArrowRight, ArrowLeftRight,
  ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, X,
  Compass, Gauge, Radio, Bus, ExternalLink
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

const POPULAR_STATIONS = [
  'CSMT Mumbai', 'Churchgate', 'Byculla', 'Dadar CR', 'Dadar WR',
  'Thane', 'Kalyan Junction', 'Kasara', 'Igatpuri', 'Mumbai Central',
  'Bandra Terminus', 'Andheri', 'Borivali', 'Virar', 'Ghaziabad Junction',
  'Aligarh Junction', 'Kanpur Central', 'New Delhi', 'Howrah Junction'
];

interface RouteStop {
  name: string;
  code: string;
  distanceKm: number;
  timeFromOriginMins: number;
  status: 'clear' | 'mega_block' | 'accident' | 'speed_restriction';
  kavach: boolean;
  platform: string;
}

interface TrainOption {
  trainNumber: string;
  trainName: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm: number;
  fareClasses: { code: string; price: number; available: boolean }[];
  status: 'on_time' | 'delayed' | 'diverted';
  delayMins?: number;
  platform: string;
  kavachArmed: boolean;
  disruptionAdvisory?: string;
}

export const IndianRailwaysTripPlanner: React.FC = () => {
  const {
    tripPlannerModalOpen,
    setTripPlannerModalOpen,
    tripOrigin,
    setTripOrigin,
    tripDest,
    setTripDest,
    trackSections,
    megaBlocks,
    accidents,
    trains
  } = useRailway();

  const { t, localize, language } = useLanguage();

  const [origin, setOrigin] = useState<string>(tripOrigin || 'CSMT Mumbai');
  const [destination, setDestination] = useState<string>(tripDest || 'Kalyan Junction');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStationIndex, setSelectedStationIndex] = useState<number | null>(null);

  useEffect(() => {
    if (tripOrigin) setOrigin(tripOrigin);
    if (tripDest) setDestination(tripDest);
  }, [tripOrigin, tripDest]);

  if (!tripPlannerModalOpen) return null;

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setTripOrigin(destination);
    setTripDest(temp);
  };

  // Generate intermediate route stops based on selected origin & destination
  const getRouteStops = (): RouteStop[] => {
    // Check if matching known corridors
    const isCentralMumbai = origin.includes('CSMT') || origin.includes('Byculla') || origin.includes('Dadar') || origin.includes('Thane') || origin.includes('Kalyan') || origin.includes('Kasara');
    const isWesternMumbai = origin.includes('Churchgate') || origin.includes('Borivali') || origin.includes('Virar') || origin.includes('Andheri') || origin.includes('Bandra');
    const isNorthIndia = origin.includes('Delhi') || origin.includes('Ghaziabad') || origin.includes('Aligarh') || origin.includes('Kanpur');

    if (isCentralMumbai) {
      return [
        { name: 'CSMT Mumbai', code: 'CSMT', distanceKm: 0, timeFromOriginMins: 0, status: 'clear', kavach: true, platform: 'PF 4' },
        { name: 'Byculla', code: 'BY', distanceKm: 4.8, timeFromOriginMins: 7, status: 'clear', kavach: true, platform: 'PF 1' },
        { name: 'Dadar CR', code: 'DR', distanceKm: 9.0, timeFromOriginMins: 14, status: 'clear', kavach: true, platform: 'PF 3' },
        { name: 'Kurla Junction', code: 'CLA', distanceKm: 15.2, timeFromOriginMins: 22, status: 'clear', kavach: true, platform: 'PF 5' },
        { name: 'Thane', code: 'TNA', distanceKm: 33.2, timeFromOriginMins: 38, status: 'mega_block', kavach: true, platform: 'PF 2' },
        { name: 'Dombivli', code: 'DI', distanceKm: 48.0, timeFromOriginMins: 48, status: 'clear', kavach: true, platform: 'PF 3' },
        { name: 'Kalyan Junction', code: 'KYN', distanceKm: 53.6, timeFromOriginMins: 56, status: 'clear', kavach: true, platform: 'PF 4' },
        { name: 'Kasara Ghat', code: 'KSRA', distanceKm: 120.4, timeFromOriginMins: 110, status: 'accident', kavach: true, platform: 'PF 1' }
      ];
    } else if (isWesternMumbai) {
      return [
        { name: 'Churchgate', code: 'CCG', distanceKm: 0, timeFromOriginMins: 0, status: 'clear', kavach: true, platform: 'PF 2' },
        { name: 'Mumbai Central', code: 'MMCT', distanceKm: 4.2, timeFromOriginMins: 6, status: 'clear', kavach: true, platform: 'PF 1' },
        { name: 'Dadar WR', code: 'DDR', distanceKm: 10.1, timeFromOriginMins: 15, status: 'clear', kavach: true, platform: 'PF 4' },
        { name: 'Bandra Terminus', code: 'BDTS', distanceKm: 14.8, timeFromOriginMins: 21, status: 'clear', kavach: true, platform: 'PF 3' },
        { name: 'Andheri', code: 'ADH', distanceKm: 21.6, timeFromOriginMins: 30, status: 'clear', kavach: true, platform: 'PF 5' },
        { name: 'Borivali', code: 'BVI', distanceKm: 34.0, timeFromOriginMins: 42, status: 'clear', kavach: true, platform: 'PF 6' },
        { name: 'Virar', code: 'VR', distanceKm: 59.8, timeFromOriginMins: 68, status: 'clear', kavach: true, platform: 'PF 3' }
      ];
    } else {
      return [
        { name: 'New Delhi', code: 'NDLS', distanceKm: 0, timeFromOriginMins: 0, status: 'clear', kavach: true, platform: 'PF 16' },
        { name: 'Ghaziabad Junction', code: 'GZB', distanceKm: 25.0, timeFromOriginMins: 22, status: 'clear', kavach: true, platform: 'PF 3' },
        { name: 'Aligarh Junction', code: 'ALJN', distanceKm: 131.0, timeFromOriginMins: 85, status: 'clear', kavach: true, platform: 'PF 2' },
        { name: 'Tundla Junction', code: 'TDL', distanceKm: 209.0, timeFromOriginMins: 130, status: 'clear', kavach: true, platform: 'PF 4' },
        { name: 'Kanpur Central', code: 'CNB', distanceKm: 440.0, timeFromOriginMins: 260, status: 'clear', kavach: true, platform: 'PF 1' }
      ];
    }
  };

  const stops = getRouteStops();
  const totalDistance = stops[stops.length - 1]?.distanceKm || 54;

  // Real-time simulated trains on this route
  const availableTrains: TrainOption[] = [
    {
      trainNumber: '22223',
      trainName: 'Vande Bharat Express',
      type: 'Vande Bharat',
      departureTime: '15:00',
      arrivalTime: '15:45',
      duration: '45m',
      distanceKm: totalDistance,
      platform: 'PF 4',
      status: 'on_time',
      kavachArmed: true,
      fareClasses: [
        { code: 'EC', price: 1140, available: true },
        { code: 'CC', price: 620, available: true }
      ]
    },
    {
      trainNumber: '12951',
      trainName: 'Tejas Rajdhani Superfast',
      type: 'Rajdhani / Shatabdi',
      departureTime: '16:35',
      arrivalTime: '17:28',
      duration: '53m',
      distanceKm: totalDistance,
      platform: 'PF 1',
      status: 'on_time',
      kavachArmed: true,
      fareClasses: [
        { code: '1A', price: 2150, available: true },
        { code: '2A', price: 1290, available: true },
        { code: '3A', price: 890, available: true }
      ]
    },
    {
      trainNumber: '95401',
      trainName: 'CSMT - Kalyan 15-Car Fast EMU',
      type: 'Suburban EMU',
      departureTime: '15:15',
      arrivalTime: '16:11',
      duration: '56m',
      distanceKm: totalDistance,
      platform: 'PF 5',
      status: 'delayed',
      delayMins: 8,
      kavachArmed: true,
      disruptionAdvisory: 'Diverted to Fast Line between Dadar & Thane to bypass scheduled track tamping.',
      fareClasses: [
        { code: 'FC', price: 105, available: true },
        { code: 'II', price: 15, available: true }
      ]
    },
    {
      trainNumber: '12137',
      trainName: 'Punjab Mail Superfast Express',
      type: 'Mail / Express',
      departureTime: '19:35',
      arrivalTime: '20:38',
      duration: '1h 03m',
      distanceKm: totalDistance,
      platform: 'PF 3',
      status: 'on_time',
      kavachArmed: true,
      fareClasses: [
        { code: '2A', price: 950, available: true },
        { code: '3A', price: 680, available: true },
        { code: 'SL', price: 210, available: true }
      ]
    }
  ];

  // Active disruption check on current route
  const activeBlockOnRoute = megaBlocks.find(b =>
    stops.some(st => b.sectionName?.includes(st.name) || b.publicAdvisory?.includes(st.name))
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10, 15, 29, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--rx-surface)',
        borderRadius: '24px',
        maxWidth: '960px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F1C3D 0%, #162B60 100%)',
          padding: '22px 28px',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px var(--rx-orange-glow)'
            }}>
              <Compass size={24} color="#FFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                  {language === 'mr' ? 'भारतीय रेल्वे AI प्रवास व मार्ग नियोजक' : 'Indian Railways AI Route & Journey Planner'}
                </h2>
                <span style={{
                  background: 'rgba(255, 107, 26, 0.2)', color: 'var(--rx-orange)',
                  fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '10px',
                  border: '1px solid rgba(255, 107, 26, 0.4)'
                }}>
                  CRIS • IRCTC Live
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '3px 0 0' }}>
                {language === 'mr'
                  ? 'थेट मेगा ब्लॉक, कवच २.० सुरक्षा स्थिती आणि इष्टतम पर्यायी मार्गांसह प्रवास नियोजन'
                  : 'Trip planner with real-time Mega Block diversions, Kavach ATP status, and route schematic'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTripPlannerModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)', border: 'none', borderRadius: '12px',
              color: '#FFF', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Station Selector Strip */}
          <div style={{
            background: 'var(--rx-surface-alt)',
            borderRadius: '18px', padding: '18px 20px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 140px', gap: '12px', alignItems: 'end' }}>
              {/* Origin */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>
                  📍 {language === 'mr' ? 'प्रस्थान स्टेशन (Origin)' : 'Origin Station'}
                </label>
                <select
                  value={origin}
                  onChange={e => { setOrigin(e.target.value); setTripOrigin(e.target.value); }}
                  className="input-control"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px' }}
                >
                  {POPULAR_STATIONS.map(st => (
                    <option key={st} value={st}>{localize(st)}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                title="Swap Stations"
                style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: 'var(--rx-surface)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--rx-orange)',
                  marginBottom: '2px', transition: 'all 0.15s ease'
                }}
              >
                <ArrowLeftRight size={18} />
              </button>

              {/* Destination */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>
                  🏁 {language === 'mr' ? 'गंतव्य स्टेशन (Destination)' : 'Destination Station'}
                </label>
                <select
                  value={destination}
                  onChange={e => { setDestination(e.target.value); setTripDest(e.target.value); }}
                  className="input-control"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px' }}
                >
                  {POPULAR_STATIONS.map(st => (
                    <option key={st} value={st}>{localize(st)}</option>
                  ))}
                </select>
              </div>

              {/* Journey Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>
                  📅 {language === 'mr' ? 'प्रवास तारीख' : 'Journey Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="input-control"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '12px' }}
                />
              </div>
            </div>

            {/* Quick Station Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {language === 'mr' ? 'लोकप्रिय मार्ग:' : 'Popular:'}
              </span>
              {[
                { o: 'CSMT Mumbai', d: 'Kalyan Junction', label: 'CSMT ➔ Kalyan' },
                { o: 'Churchgate', d: 'Virar', label: 'Churchgate ➔ Virar' },
                { o: 'CSMT Mumbai', d: 'Kasara', label: 'CSMT ➔ Kasara Ghat' },
                { o: 'New Delhi', d: 'Kanpur Central', label: 'Delhi ➔ Kanpur' }
              ].map((route, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setOrigin(route.o); setTripOrigin(route.o);
                    setDestination(route.d); setTripDest(route.d);
                  }}
                  style={{
                    background: 'var(--rx-surface)',
                    border: '1px solid var(--border-light)',
                    padding: '4px 10px', borderRadius: '14px',
                    fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--rx-orange)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>

          {/* Disruption Warning Banner if Mega Block or Incident */}
          {activeBlockOnRoute && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(255, 107, 26, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px', padding: '14px 18px',
              display: 'flex', alignItems: 'flex-start', gap: '12px'
            }}>
              <AlertTriangle size={20} color="var(--rx-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                    {language === 'mr' ? '⚠️ मार्गावर मेगा ब्लॉक सूचना' : '⚠️ Mega Block Active on Selected Corridor'}
                  </strong>
                  <span style={{ fontSize: '0.65rem', background: 'var(--rx-amber-light)', color: '#92400E', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
                    {activeBlockOnRoute.linesAffected}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {activeBlockOnRoute.publicAdvisory}
                </p>
                <div style={{ fontSize: '0.7rem', color: 'var(--rx-orange)', fontWeight: 700, marginTop: '6px' }}>
                  ✨ {language === 'mr' ? 'AI पर्यायी उपाय: फास्ट लाईन लोकल किंवा पर्यायी मेट्रो वापरा' : 'AI Recommendation: Board Fast Line EMU to bypass affected section.'}
                </div>
              </div>
            </div>
          )}

          {/* VISUAL SVG ROUTE MAP SCHEMATIC */}
          <div style={{
            background: 'var(--rx-surface-alt)',
            borderRadius: '18px', padding: '20px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={16} color="var(--rx-blue)" />
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {language === 'mr' ? 'थेट रेल्वे मार्ग नकाशा आणि स्टेशन हॉल्ट्स' : 'Interactive Indian Railways Route Schematic'}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rx-green)' }} />
                  {language === 'mr' ? 'मोकळा ट्रॅक (130 km/h)' : 'Clear (130 km/h)'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rx-amber)' }} />
                  {language === 'mr' ? 'मेगा ब्लॉक' : 'Mega Block'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="var(--rx-green)" />
                  Kavach SIL-4 Active
                </span>
              </div>
            </div>

            {/* SVG Track Line with Stations */}
            <div style={{ overflowX: 'auto', padding: '10px 0' }}>
              <svg viewBox={`0 0 ${Math.max(stops.length * 105, 600)} 120`} width="100%" style={{ minWidth: '550px' }}>
                {/* Main Double Track Rails */}
                <line x1="30" y1="52" x2={stops.length * 105 - 40} y2="52" stroke="var(--border-medium)" strokeWidth="6" strokeLinecap="round" />
                <line x1="30" y1="52" x2={stops.length * 105 - 40} y2="52" stroke="var(--rx-orange)" strokeWidth="3" strokeDasharray="6 4" />

                {/* Stations Nodes along the Line */}
                {stops.map((stop, idx) => {
                  const x = 40 + idx * 100;
                  const y = 52;
                  const isSelected = selectedStationIndex === idx;
                  const statusColor = stop.status === 'clear' ? 'var(--rx-green)' :
                                      stop.status === 'mega_block' ? 'var(--rx-amber)' : 'var(--rx-red)';

                  return (
                    <g key={stop.code}
                      onClick={() => setSelectedStationIndex(isSelected ? null : idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Outer pulse if selected */}
                      {isSelected && (
                        <circle cx={x} cy={y} r={18} fill="var(--rx-orange)" opacity={0.2} />
                      )}

                      {/* Station Hub Dot */}
                      <circle cx={x} cy={y} r={8} fill="var(--rx-surface)" stroke={statusColor} strokeWidth="3" />
                      <circle cx={x} cy={y} r={3.5} fill={statusColor} />

                      {/* Station Code */}
                      <text x={x} y={y - 14} textAnchor="middle" fill="var(--text-dark)" fontSize="9.5" fontWeight="800">
                        {stop.code}
                      </text>

                      {/* Station Name */}
                      <text x={x} y={y + 22} textAnchor="middle" fill="var(--text-body)" fontSize="8.5" fontWeight="600">
                        {localize(stop.name).length > 12 ? `${localize(stop.name).slice(0, 10)}...` : localize(stop.name)}
                      </text>

                      {/* KM Distance */}
                      <text x={x} y={y + 34} textAnchor="middle" fill="var(--text-muted)" fontSize="7">
                        {stop.distanceKm} km
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Station Inspector if clicked */}
            {selectedStationIndex !== null && stops[selectedStationIndex] && (
              <div style={{
                marginTop: '12px', background: 'var(--rx-surface)',
                borderRadius: '12px', padding: '12px 16px',
                border: '1px solid var(--rx-orange-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    📍 {localize(stops[selectedStationIndex].name)} [{stops[selectedStationIndex].code}]
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {stops[selectedStationIndex].platform} • {stops[selectedStationIndex].distanceKm} KM {language === 'mr' ? 'प्रस्थानापासून' : 'from Origin'} • {stops[selectedStationIndex].timeFromOriginMins} {language === 'mr' ? 'मिनिटे' : 'mins run'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                    background: 'var(--rx-green-light)', color: '#15803D'
                  }}>
                    🛡️ Kavach SIL-4 Link OK
                  </span>
                  <button
                    onClick={() => { setOrigin(stops[selectedStationIndex].name); setTripOrigin(stops[selectedStationIndex].name); }}
                    style={{
                      background: 'var(--rx-surface-alt)', border: '1px solid var(--border-light)',
                      padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {language === 'mr' ? 'येथून प्रारंभ करा' : 'Start Here'}
                  </button>
                  <button
                    onClick={() => { setDestination(stops[selectedStationIndex].name); setTripDest(stops[selectedStationIndex].name); }}
                    style={{
                      background: 'var(--rx-surface-alt)', border: '1px solid var(--border-light)',
                      padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {language === 'mr' ? 'येथे समाप्त करा' : 'End Here'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AVAILABLE TRAINS & ITINERARY */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Train size={16} color="var(--rx-orange)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {language === 'mr' ? `उपलब्ध थेट गाड्या (${availableTrains.length})` : `Available Trains on Route (${availableTrains.length})`}
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? `एकूण अंतर: ${totalDistance} किमी` : `Total Distance: ${totalDistance} km`}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableTrains.map((train) => (
                <div
                  key={train.trainNumber}
                  style={{
                    background: 'var(--rx-surface-alt)',
                    borderRadius: '16px', padding: '16px 20px',
                    border: '1px solid var(--border-light)',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Bar: Train Name, Number & Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
                        color: '#FFF', padding: '3px 8px', borderRadius: '8px',
                        fontSize: '0.72rem', fontWeight: 900
                      }}>
                        #{train.trainNumber}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                        {localize(train.trainName)}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ({train.type})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
                        background: train.status === 'on_time' ? 'var(--rx-green-light)' : 'var(--rx-amber-light)',
                        color: train.status === 'on_time' ? '#15803D' : '#92400E'
                      }}>
                        {train.status === 'on_time' ? (language === 'mr' ? '● वेळेवर' : '● On Time') : (language === 'mr' ? `● ${train.delayMins} मिनिटे उशीर` : `● Delayed ${train.delayMins}m`)}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--rx-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={13} /> Kavach Armed
                      </span>
                    </div>
                  </div>

                  {/* Schedule Strip */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr',
                    gap: '12px', alignItems: 'center',
                    background: 'var(--rx-surface)', padding: '12px 16px', borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-dark)' }}>{train.departureTime}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{localize(origin)} ({train.platform})</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rx-orange)', fontWeight: 700 }}>{train.duration}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                        <span style={{ width: '20px', height: '1px', background: '#CBD5E1' }} />
                        <Train size={12} />
                        <span style={{ width: '20px', height: '1px', background: '#CBD5E1' }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Direct Run</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-dark)' }}>{train.arrivalTime}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{localize(destination)}</div>
                    </div>

                    {/* Classes & Booking Simulation */}
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {train.fareClasses.map(cls => (
                        <div key={cls.code} style={{
                          background: 'var(--rx-surface-alt)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '8px', padding: '4px 8px', textAlign: 'center',
                          minWidth: '45px'
                        }}>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--rx-blue)' }}>{cls.code}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dark)' }}>₹{cls.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disruption note if any */}
                  {train.disruptionAdvisory && (
                    <div style={{ fontSize: '0.72rem', color: '#92400E', background: 'var(--rx-amber-light)', padding: '6px 10px', borderRadius: '8px' }}>
                      ℹ️ {train.disruptionAdvisory}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
