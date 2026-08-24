import React, { useState, useMemo } from 'react';
import { 
  Train as TrainIcon, 
  Gauge, 
  MapPin, 
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Radio,
  Search,
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Eye,
  Activity,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { TrackSection, Train } from '../../types/railway';
import { CorridorInspectorModal } from './CorridorInspectorModal';
import { MumbaiSuburbanNetworkMap } from './MumbaiSuburbanNetworkMap';

// Authentic Indian Railways Station Data & Elevations (MSL)
const IR_STATION_META: Record<string, { code: string; hiMr: string; msl: string; zone: string; div: string; platforms: number; type: string }> = {
  'CSMT Mumbai': { code: 'CSMT', hiMr: 'छत्रपती शिवाजी महाराज टर्मिनस', msl: '14.2m', zone: 'CR', div: 'BB (Mumbai)', platforms: 18, type: 'Terminus & World Heritage Yard' },
  'Byculla': { code: 'BY', hiMr: 'भायखळा', msl: '11.5m', zone: 'CR', div: 'BB (Mumbai)', platforms: 4, type: 'Quad Suburban Station' },
  'Dadar CR': { code: 'DR', hiMr: 'दादर मध्य', msl: '12.8m', zone: 'CR', div: 'BB (Mumbai)', platforms: 8, type: 'Major Inter-Zonal Junction' },
  'Thane': { code: 'TNA', hiMr: 'ठाणे', msl: '16.0m', zone: 'CR', div: 'BB (Mumbai)', platforms: 10, type: '6-Line Suburban & Mail Junction' },
  'Kalyan Junction': { code: 'KYN', hiMr: 'कल्याण जंक्शन', msl: '19.4m', zone: 'CR', div: 'BB (Mumbai)', platforms: 8, type: 'CR Bifurcation Junction (NE/SE)' },
  'Kasara': { code: 'KSRA', hiMr: 'कसारा', msl: '280.0m', zone: 'CR', div: 'BB (Mumbai)', platforms: 4, type: 'Thull Ghat Banker Loco Base' },
  'Churchgate': { code: 'CCG', hiMr: 'चर्चगेट', msl: '10.2m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 4, type: 'WR Suburban Terminus' },
  'Mumbai Central': { code: 'MMCT', hiMr: 'मुंबई सेंट्रल', msl: '12.0m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 9, type: 'WR Divisional Terminus' },
  'Dadar WR': { code: 'DDR', hiMr: 'दादर पश्चिम', msl: '12.8m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 7, type: 'WR Suburban & Express Hub' },
  'Borivali': { code: 'BVI', hiMr: 'बोरिवली', msl: '14.5m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 10, type: 'WR 6th Line Express Hub' },
  'Virar': { code: 'VR', hiMr: 'विरार', msl: '18.2m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 8, type: 'WR EMU Car Shed Junction' },
  'Dahanu Road': { code: 'DRD', hiMr: 'डहाणू रोड', msl: '22.0m', zone: 'WR', div: 'BCT (Mumbai Central)', platforms: 4, type: 'WR Broad Gauge Mainline' },
  'New Delhi': { code: 'NDLS', hiMr: 'नई दिल्ली', msl: '216.0m', zone: 'NR', div: 'DLI (Delhi)', platforms: 16, type: 'High Density Trunk Terminus' },
  'New Delhi (NDLS)': { code: 'NDLS', hiMr: 'नई दिल्ली', msl: '216.0m', zone: 'NR', div: 'DLI (Delhi)', platforms: 16, type: 'High Density Trunk Terminus' },
  'Ghaziabad Junction': { code: 'GZB', hiMr: 'गाजियाबाद जंक्शन', msl: '217.0m', zone: 'NR', div: 'DLI (Delhi)', platforms: 6, type: 'Quad Mainline Tri-Junction' },
  'Aligarh Junction': { code: 'ALJN', hiMr: 'अलीगढ़ जंक्शन', msl: '186.0m', zone: 'NCR', div: 'PRYJ (Prayagraj)', platforms: 7, type: 'Semi-High Speed Trunk Hub' },
  'Kanpur Central': { code: 'CNB', hiMr: 'कानपुर सेंट्रल', msl: '132.0m', zone: 'NCR', div: 'PRYJ (Prayagraj)', platforms: 10, type: 'NCR Golden Quadrilateral Yard' },
  'Howrah Junction': { code: 'HWH', hiMr: 'हावड़ा जंक्शन', msl: '12.0m', zone: 'ER', div: 'HWH (Howrah)', platforms: 23, type: 'ER Terminus Mega Terminal' },
  'Bardhaman Junction': { code: 'BWN', hiMr: 'बर्धमान जंक्शन', msl: '36.0m', zone: 'ER', div: 'HWH (Howrah)', platforms: 8, type: 'ER Main/Chord Bifurcation' },
};

type ViewMode = 'ir_suburban' | 'ir_cards' | 'ir_schematic' | 'ir_network';

export const InteractiveTrackMap: React.FC = () => {
  const { 
    trackSections, 
    trains, 
    selectedDivision, 
    selectedSectionId, 
    setSelectedSectionId,
    openTripPlanner,
    megaBlocks,
    accidents
  } = useRailway();
  const { t, localize, language } = useLanguage();

  const [viewMode, setViewMode] = useState<ViewMode>('ir_suburban');
  const [filterStatus, setFilterStatus] = useState<'all' | 'clear' | 'mega_block' | 'accident' | 'speed_restriction'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalSection, setInspectModalSection] = useState<TrackSection | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<Train | null>(null);

  // Filter sections
  const filteredSections = useMemo(() => {
    return trackSections.filter(sec => {
      const matchesDiv = selectedDivision === 'All' || sec.division === selectedDivision;
      const matchesStatus = filterStatus === 'all' || sec.status === filterStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        sec.name.toLowerCase().includes(query) ||
        sec.code.toLowerCase().includes(query) ||
        sec.fromStation.toLowerCase().includes(query) ||
        sec.toStation.toLowerCase().includes(query) ||
        sec.division.toLowerCase().includes(query) ||
        sec.zone.toLowerCase().includes(query);
      return matchesDiv && matchesStatus && matchesSearch;
    });
  }, [trackSections, selectedDivision, filterStatus, searchQuery]);

  const activeSection = trackSections.find(s => s.id === selectedSectionId);
  const trainsInSelectedSection = trains.filter(t => t.currentSectionId === selectedSectionId);

  // Indian Railways official badge helper
  const getSectionBadge = (status: TrackSection['status'], sec?: TrackSection) => {
    switch (status) {
      case 'clear': 
        return (
          <span style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#15803D',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.02em'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            ★ 98% {language === 'mr' ? 'उपलब्ध' : 'AVAILABLE'}
          </span>
        );
      case 'mega_block': 
        return (
          <span style={{
            background: 'rgba(245, 158, 11, 0.18)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            color: '#B45309',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.02em'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            {language === 'mr' ? 'मेगा ब्लॉक सक्रिय' : 'MEGA BLOCK ACTIVE'}
          </span>
        );
      case 'accident': 
        return (
          <span style={{
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#DC2626',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.02em'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            {language === 'mr' ? 'सुरक्षेसाठी बंद' : 'CORDONED OFF'}
          </span>
        );
      case 'speed_restriction': 
        return (
          <span style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#1D4ED8',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} />
            {language === 'mr' ? 'TSR वेग मर्यादा' : 'TSR SPEED LIMIT'}
          </span>
        );
      default: 
        return <span className="badge badge-clear">{t('map.statusAvailable')}</span>;
    }
  };

  // Get Station Metadata
  const getStationMeta = (stationName: string) => {
    return IR_STATION_META[stationName] || {
      code: stationName.substring(0, 3).toUpperCase(),
      hiMr: stationName,
      msl: '15.0m',
      zone: 'IR',
      div: 'Operating Div',
      platforms: 4,
      type: 'Broad Gauge Section'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Corridor Inspector Modal */}
      <CorridorInspectorModal
        section={inspectModalSection}
        onClose={() => setInspectModalSection(null)}
      />

      {/* ── Official Indian Railways System Header Banner ────────────────── */}
      <div className="bms-card" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Indian Railways Emblem / Watermark */}
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.06,
          pointerEvents: 'none',
          fontSize: '120px',
          fontWeight: 900
        }}>
          IR
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                background: '#FFCC00',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}>
                INDIAN RAILWAYS • भारतीय रेल
              </span>
              <span style={{
                background: 'rgba(255, 107, 26, 0.25)',
                border: '1px solid rgba(255, 107, 26, 0.5)',
                color: '#FF8F45',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                KAVACH SIL-4 ATP ARMED
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ADE80',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                25kV AC 50Hz OHE
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.01em', margin: 0, color: '#FFFFFF' }}>
              {language === 'mr' ? 'भारतीय रेल्वे ट्रॅक व कॉरिडॉर मॅनेजमेंट सिस्टीम' : 'Indian Railways Track & Corridor Master Control'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '4px 0 0' }}>
              {language === 'mr'
                ? 'मध्य (CR), पश्चिम (WR) आणि उत्तर (NR) रेल्वेचे थेट इंटरलॉकिंग, सिग्नलिंग, ब्लॉक ताबा व वेग मर्यादा तपशील'
                : 'Live Control Office Track Interlocking, Automatic Block Signalling (ABS), Mega Blocks & Kavach Telemetry'}
            </p>
          </div>

          {/* View Mode Switcher for Top Visualizer */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            gap: '4px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setViewMode('ir_suburban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'ir_suburban' ? 'var(--rx-green)' : 'transparent',
                color: viewMode === 'ir_suburban' ? '#FFFFFF' : '#CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: viewMode === 'ir_suburban' ? '0 2px 10px var(--rx-green-glow)' : 'none'
              }}
            >
              🗺️ {language === 'mr' ? 'उपनगरीय नेटवर्क नकाशा' : 'Suburban Network Map'}
            </button>
            <button
              onClick={() => setViewMode('ir_schematic')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'ir_schematic' ? 'var(--rx-orange)' : 'transparent',
                color: viewMode === 'ir_schematic' ? '#FFFFFF' : '#CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🚦 {language === 'mr' ? 'IR ट्रॅक स्कीमेटिक (TMS)' : 'IR Track Schematic (TMS)'}
            </button>
            <button
              onClick={() => setViewMode('ir_network')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'ir_network' ? 'var(--rx-orange)' : 'transparent',
                color: viewMode === 'ir_network' ? '#FFFFFF' : '#CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🌐 {language === 'mr' ? 'IR उपनगरीय ग्रिड' : 'IR Suburban Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Strip ────────────────────────────────────────── */}
      <div className="bms-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Station Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--rx-surface-alt)',
          border: '1px solid var(--border-medium)',
          borderRadius: '10px',
          padding: '6px 12px',
          minWidth: '260px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={language === 'mr' ? 'स्थानक, कोड शोधा (उदा. CSMT, BY, DR, TNA)...' : 'Search station or code (e.g. CSMT, BY, DR, TNA)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.78rem',
              color: 'var(--text-dark)',
              width: '100%'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'all' ? 'var(--rx-orange)' : 'var(--rx-surface-alt)',
              color: filterStatus === 'all' ? '#FFFFFF' : 'var(--text-body)',
              transition: 'all 0.15s ease'
            }}
          >
            {t('map.filterAll')} ({trackSections.length})
          </button>
          <button
            onClick={() => setFilterStatus('clear')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'clear' ? '#22C55E' : 'var(--rx-surface-alt)',
              color: filterStatus === 'clear' ? '#FFFFFF' : '#15803D',
              transition: 'all 0.15s ease'
            }}
          >
            🟢 {language === 'mr' ? 'लाईन क्लिअर (Line Clear)' : 'Line Clear'} ({trackSections.filter(s => s.status === 'clear').length})
          </button>
          <button
            onClick={() => setFilterStatus('mega_block')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'mega_block' ? '#F59E0B' : 'var(--rx-surface-alt)',
              color: filterStatus === 'mega_block' ? '#FFFFFF' : '#92400E',
              transition: 'all 0.15s ease'
            }}
          >
            🟡 {language === 'mr' ? 'मेगा ब्लॉक (Traffic Block)' : 'Mega Block'} ({trackSections.filter(s => s.status === 'mega_block').length})
          </button>
          <button
            onClick={() => setFilterStatus('accident')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: filterStatus === 'accident' ? '#EF4444' : 'var(--rx-surface-alt)',
              color: filterStatus === 'accident' ? '#FFFFFF' : '#DC2626',
              transition: 'all 0.15s ease'
            }}
          >
            🔴 {language === 'mr' ? 'आपत्कालीन (Cordoned)' : 'Emergency'} ({trackSections.filter(s => s.status === 'accident').length})
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 1: TOP VISUALIZER (SUBURBAN NETWORK MAP / SCHEMATIC / GRID)
          ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'ir_suburban' && (
        <MumbaiSuburbanNetworkMap />
      )}

      {viewMode === 'ir_schematic' && (
        <div className="bms-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Schematic Controls & Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#FFCC00', color: '#000', fontWeight: 900, fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px' }}>
                  SIP / TMS VIEW
                </span>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {language === 'mr' ? 'मध्य व पश्चिम रेल्वे मुख्य लाईन ट्रॅक इंटरलॉकिंग डायग्राम' : 'CR & WR Mainline Track Interlocking & Signal Schematic'}
                </h3>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Broad Gauge (1.676m) • 4-Aspect Colour Light Automatic Signalling (ABS) • Axle Counter Occupancy
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} /> Line Clear (Green)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#92400E' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Caution / Block (Amber)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Danger / Train on Block (Red)
              </span>
            </div>
          </div>

          {/* Interactive Multi-Track SVG Schematic */}
          <div style={{
            background: 'linear-gradient(180deg, #090E17 0%, #10192A 100%)',
            borderRadius: '16px',
            padding: '24px 16px',
            overflowX: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.6)'
          }}>
            <div style={{ minWidth: '920px' }}>
              {/* Station Yard Board Markers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { name: 'CSMT Mumbai', code: 'CSMT', hi: 'छत्रपती शिवाजी महाराज टर्मिनस', km: '0.0 KM', msl: '+14m' },
                  { name: 'Byculla', code: 'BY', hi: 'भायखळा', km: '4.8 KM', msl: '+11m' },
                  { name: 'Dadar CR', code: 'DR', hi: 'दादर', km: '9.0 KM', msl: '+12m' },
                  { name: 'Thane', code: 'TNA', hi: 'ठाणे', km: '33.2 KM', msl: '+16m' },
                  { name: 'Kalyan Jn', code: 'KYN', hi: 'कल्याण', km: '53.0 KM', msl: '+19m' }
                ].map((stn, idx) => (
                  <div
                    key={stn.code}
                    onClick={() => openTripPlanner(stn.name, 'Kalyan Junction')}
                    style={{
                      background: '#FFCC00',
                      border: '2px solid #000000',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    title={`Click to plan trip from ${stn.name}`}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000', fontFamily: 'serif' }}>
                      {stn.hi}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#000000', letterSpacing: '0.08em' }}>
                      {stn.code} • {stn.name.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#333333', marginTop: '2px' }}>
                      {stn.km} • MSL: {stn.msl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi-Track Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative', padding: '10px 0' }}>
                {[
                  { id: 'up_slow', name: 'UP SLOW (UP S)', type: 'Suburban EMU Local (Towards CSMT)', color: '#38BDF8', defaultAspect: 'green' },
                  { id: 'dn_slow', name: 'DN SLOW (DN S)', type: 'Suburban EMU Local (Towards Kalyan)', color: '#38BDF8', defaultAspect: 'yellow' },
                  { id: 'up_fast', name: 'UP FAST (UP F)', type: 'Fast Corridor & Mail Express', color: '#F97316', defaultAspect: 'green' },
                  { id: 'dn_fast', name: 'DN FAST (DN F)', type: 'Fast Corridor & Mail Express', color: '#F97316', defaultAspect: 'green' },
                  { id: '5th_line', name: '5TH LINE (5L)', type: 'Bi-directional Freight / Mail', color: '#A855F7', defaultAspect: 'green' },
                  { id: '6th_line', name: '6TH LINE (6L)', type: 'Outstation Express Dedicated', color: '#EC4899', defaultAspect: 'yellow' },
                ].map((line, lineIdx) => {
                  return (
                    <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                      <div style={{ width: '130px', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: line.color, letterSpacing: '0.02em' }}>
                          {line.name}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#64748B' }}>
                          {line.type}
                        </div>
                      </div>

                      <div style={{
                        flex: 1,
                        height: '14px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'repeating-linear-gradient(90deg, #1E293B 0px, #1E293B 4px, transparent 4px, transparent 12px)'
                      }}>
                        <div style={{ position: 'absolute', top: '2px', left: 0, right: 0, height: '2px', background: '#94A3B8', opacity: 0.8 }} />
                        <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, height: '2px', background: '#94A3B8', opacity: 0.8 }} />

                        {filteredSections.slice(0, 4).map((sec, secIdx) => {
                          const isBlocked = sec.status === 'mega_block' && (line.id.includes('slow') || lineIdx % 2 === 0);
                          const isAccident = sec.status === 'accident';
                          const trackColor = isAccident ? '#EF4444' : isBlocked ? '#F59E0B' : '#22C55E';
                          const widthPct = 25;
                          const leftPct = secIdx * 25;
                          const secTrains = trains.filter(t => t.currentSectionId === sec.id);
                          const trainOnLine = secTrains[lineIdx % (secTrains.length || 1)];

                          return (
                            <div
                              key={sec.id}
                              onClick={() => {
                                setSelectedSectionId(sec.id);
                                setInspectModalSection(sec);
                              }}
                              style={{
                                position: 'absolute',
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                height: '8px',
                                top: '3px',
                                background: isBlocked ? 'rgba(245, 158, 11, 0.45)' : isAccident ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.25)',
                                borderTop: `2px solid ${trackColor}`,
                                borderBottom: `2px solid ${trackColor}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title={`${sec.name} - ${sec.status.toUpperCase()}`}
                            >
                              <div style={{
                                position: 'absolute',
                                left: '8px',
                                top: '-24px',
                                background: '#0F172A',
                                border: '1px solid #475569',
                                borderRadius: '4px',
                                padding: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                zIndex: 5
                              }}>
                                <div style={{
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '50%',
                                  background: isAccident ? '#EF4444' : isBlocked ? '#F59E0B' : '#22C55E',
                                  boxShadow: isAccident ? '0 0 8px #EF4444' : isBlocked ? '0 0 8px #F59E0B' : '0 0 8px #22C55E'
                                }} />
                                <span style={{ fontSize: '0.55rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                                  S-{secIdx * 10 + lineIdx + 1}
                                </span>
                              </div>

                              {trainOnLine && secIdx % 2 === lineIdx % 2 && (
                                <div
                                  onMouseEnter={() => setHoveredTrain(trainOnLine)}
                                  onMouseLeave={() => setHoveredTrain(null)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSectionId(sec.id);
                                    setInspectModalSection(sec);
                                  }}
                                  style={{
                                    position: 'absolute',
                                    left: '40%',
                                    top: '-16px',
                                    background: 'linear-gradient(135deg, #FF6B1A 0%, #E55A0A 100%)',
                                    color: '#FFFFFF',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: '0 2px 10px rgba(255, 107, 26, 0.6)',
                                    zIndex: 10,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <TrainIcon size={11} />
                                  <span>#{trainOnLine.number}</span>
                                  <span style={{ opacity: 0.8, fontSize: '0.58rem' }}>{trainOnLine.speedKmph} km/h</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Schematic Bottom Telemetry Strip */}
              <div style={{
                marginTop: '24px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#94A3B8',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>🚦 <strong>Interlocking:</strong> Solid State Electronic Interlocking (EI)</span>
                  <span>⚡ <strong>Traction:</strong> 25kV AC SCADA Active</span>
                  <span>🛡️ <strong>Kavach Coverage:</strong> 100% Trackside RFID Verified</span>
                </div>
                <div style={{ color: '#E2E8F0', fontWeight: 600 }}>
                  Click any track block to inspect technical specifications
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 2: LIVE TRACK CORRIDOR OPERATIONS CARDS GRID
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section 2 Header & Corridor Counts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1.5px solid var(--border-medium)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.68rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px var(--rx-green-glow)'
              }}>
                LIVE TELEMETRY
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0, fontFamily: 'var(--font-display)' }}>
                {language === 'mr' ? 'थेट रेल्वे कॉरिडॉर व वेग कार्ड्स ग्रिड' : 'Live Track Corridor & Operations Cards'}
              </h3>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '3px 0 0' }}>
              {language === 'mr'
                ? 'सर्व उपनगरीय व मुख्य कॉरिडॉरचे थेट ट्रॅक स्टेट्स, वेग मर्यादा व ब्लॉक तपशील'
                : 'Real-time track occupancy, MPS speed limits, Kavach interlocks, and maintenance block restrictions across all divisions'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              padding: '5px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#065F46'
            }}>
              ★ {filteredSections.length} {language === 'mr' ? 'कॉरिडॉर सक्रिय' : 'Active Corridors'}
            </span>
          </div>
        </div>

        {/* Live Corridor Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredSections.map(sec => {
            const isSelected = selectedSectionId === sec.id;
            const secTrains = trains.filter(t => t.currentSectionId === sec.id);
            const fromMeta = getStationMeta(sec.fromStation);
            const toMeta = getStationMeta(sec.toStation);
            const isBlock = sec.status === 'mega_block';
            const isAccident = sec.status === 'accident';

            return (
              <div
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setInspectModalSection(sec);
                }}
                className="bms-card"
                style={{
                  padding: 0,
                  cursor: 'pointer',
                  border: isSelected 
                    ? '2px solid var(--rx-orange)' 
                    : isBlock 
                      ? '1.5px solid rgba(245, 158, 11, 0.4)'
                      : isAccident 
                        ? '1.5px solid rgba(239, 68, 68, 0.4)'
                        : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 10px 30px var(--rx-orange-glow)' : 'var(--shadow-card)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.18s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Authentic IR Station Signboard Nameplate */}
                <div 
                  className={isAccident ? "ir-nameboard ir-nameboard-accident" : (isBlock ? "ir-nameboard ir-nameboard-blocked" : (isSelected ? "ir-nameboard ir-nameboard-active" : "ir-nameboard"))}
                  style={{
                    padding: '12px 16px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E293B', letterSpacing: '0.04em' }}>
                      {fromMeta.hiMr} ➔ {toMeta.hiMr}
                    </span>
                    <span className={`ir-zone-badge ${sec.zone === 'CR' ? 'ir-zone-cr' : (sec.zone === 'WR' ? 'ir-zone-wr' : 'ir-zone-nr')}`}>
                      {sec.zone} • {sec.division}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', letterSpacing: '0.04em', fontFamily: 'var(--font-sans)' }}>
                      {fromMeta.code} ➔ {toMeta.code}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>
                      {sec.name.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Status Strip & Telemetry Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    {getSectionBadge(sec.status, sec)}
                    <span style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#64748B'
                    }}>
                      ⚡ 25kV OHE Active
                    </span>
                  </div>

                  {/* Operational Telemetry Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    background: '#F8FAFC',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Distance</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{sec.lengthKm} KM</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Max Speed</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16A34A' }}>{sec.maxSpeedKmph} km/h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Tracks</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{sec.lines} Lines</div>
                    </div>
                  </div>

                  {/* Active Trains Count & Live Dispatch status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        background: secTrains.length > 0 ? 'rgba(37, 99, 235, 0.15)' : '#F1F5F9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <TrainIcon size={14} color={secTrains.length > 0 ? '#2563EB' : '#94A3B8'} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                          {secTrains.length} {language === 'mr' ? 'गाड्या ट्रॅकवर' : 'Active Trains'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748B' }}>
                          {sec.signalsCount} ABS 4-Aspect Signals
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSectionId(sec.id);
                        setInspectModalSection(sec);
                      }}
                      style={{
                        background: 'rgba(5, 150, 105, 0.12)',
                        border: '1px solid rgba(5, 150, 105, 0.3)',
                        color: '#065F46',
                        fontWeight: 800,
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {language === 'mr' ? 'तपशील' : 'Inspect'} <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          MODE 3: INDIAN RAILWAYS SUBURBAN & TRUNK NETWORK GEO-GRID
          ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'ir_network' && (
        <div className="bms-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                🗺️ {language === 'mr' ? 'भारतीय रेल्वे मुंबई उपनगरीय व ट्रंक नेटवर्क ग्रिड' : 'Indian Railways Mumbai Suburban & Trunk Network Grid'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Central Railway Mainline, Western Railway Mainline, and Northern Corridor Inter-Junction Network
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#FFF3EC', color: '#EA580C', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px' }}>
                ● Central Line (CSMT - KYN - KSRA)
              </span>
              <span style={{ background: '#EBF2FF', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px' }}>
                ● Western Line (CCG - BVI - VR)
              </span>
              <span style={{ background: '#F3E8FF', color: '#7E22CE', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px' }}>
                ● Northern Trunk (NDLS - CNB)
              </span>
            </div>
          </div>

          {/* Network Visual Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Central Railway Section */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '18px', borderRadius: '12px', borderLeft: '4px solid #FF6B1A' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.88rem', color: '#FF6B1A' }}>CENTRAL RAILWAY (CR) SUBURBAN TRUNK</strong>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#FF6B1A', color: '#FFF', padding: '2px 8px', borderRadius: '4px' }}>
                  CSMT ➔ KASARA
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trackSections.filter(s => s.zone === 'CR').map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => { setSelectedSectionId(sec.id); setInspectModalSection(sec); }}
                    style={{
                      background: 'var(--rx-surface)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        {sec.fromStation} ➔ {sec.toStation}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {sec.lengthKm} KM • {sec.lines} Tracks • MPS {sec.maxSpeedKmph} km/h
                      </div>
                    </div>
                    <div>{getSectionBadge(sec.status)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Western Railway Section */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '18px', borderRadius: '12px', borderLeft: '4px solid #1A56DB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.88rem', color: '#1A56DB' }}>WESTERN RAILWAY (WR) SUBURBAN TRUNK</strong>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#1A56DB', color: '#FFF', padding: '2px 8px', borderRadius: '4px' }}>
                  CHURCHGATE ➔ VIRAR
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trackSections.filter(s => s.zone === 'WR').map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => { setSelectedSectionId(sec.id); setInspectModalSection(sec); }}
                    style={{
                      background: 'var(--rx-surface)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        {sec.fromStation} ➔ {sec.toStation}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {sec.lengthKm} KM • {sec.lines} Tracks • MPS {sec.maxSpeedKmph} km/h
                      </div>
                    </div>
                    <div>{getSectionBadge(sec.status)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Corridor Telemetry Inspector Drawer ────────────────────── */}
      {activeSection && (
        <div className="bms-card" style={{ padding: '22px', borderTop: '4px solid var(--rx-orange)', background: 'var(--rx-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#FFCC00',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.82rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                IR
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {t('map.selectedSection')}: {localize(activeSection.name)} ({activeSection.code})
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                  Division: {localize(activeSection.division)} • Traction: {activeSection.electrification} • Track Standard: 1676mm Broad Gauge • {t('map.length')}: {activeSection.lengthKm} {t('map.unitKm')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSectionId(null)}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Real-Time Trains on this section */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--rx-orange)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrainIcon size={16} />
                {t('map.trainsOnSection')} ({trainsInSelectedSection.length})
              </h4>
              {trainsInSelectedSection.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('map.noTrains')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trainsInSelectedSection.map(tItem => (
                    <div key={tItem.id} style={{ background: 'var(--rx-surface)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', boxShadow: 'var(--shadow-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-dark)' }}>#{tItem.number} {localize(tItem.name)}</span>
                        <span style={{ color: tItem.status === 'on_time' ? '#15803D' : 'var(--rx-red)' }}>
                          {tItem.status.toUpperCase()} ({tItem.delayMinutes}m)
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '3px', fontSize: '0.7rem' }}>
                        Speed: {tItem.speedKmph} {t('map.unitKmph')} • Loco: {tItem.locomotiveId} (WAP-7 3-Phase) • Crew: {tItem.crewId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Indian Railways Technical & Safety Specifications */}
            <div style={{ background: 'var(--rx-surface-alt)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--rx-blue)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={16} />
                Indian Railways Track & Signalling Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('map.speedLimit')} (MPS):</span>
                  <div style={{ fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.maxSpeedKmph} {t('map.unitKmph')}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>TSR Caution Order:</span>
                  <div style={{ fontWeight: 800, color: activeSection.currentTsrKmph ? '#92400E' : '#15803D', marginTop: '2px' }}>
                    {activeSection.currentTsrKmph ? `${activeSection.currentTsrKmph} ${t('map.unitKmph')}` : 'No Restriction'}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Signalling:</span>
                  <div style={{ fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>{activeSection.signalsCount} ABS 4-Aspect Signals</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Kavach Protection:</span>
                  <div style={{ fontWeight: 800, color: '#15803D', marginTop: '2px' }}>SIL-4 Armed (UHF Radio)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action to launch full Route & Trip Planner */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setInspectModalSection(activeSection)}
              className="btn btn-secondary"
              style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.8rem' }}
            >
              🔎 Open Deep Corridor Inspector
            </button>
            <button
              onClick={() => openTripPlanner(activeSection.fromStation, activeSection.toStation)}
              className="btn btn-primary"
              style={{
                padding: '8px 20px', borderRadius: '10px', fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px var(--rx-orange-glow)'
              }}
            >
              🧭 {language === 'mr' ? 'या मार्गावर प्रवास व ट्रेन योजना तयार करा' : 'Plan Full Journey & Route Schematic'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
