import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

// ── Circular Metro-Style Route Map ──────────────────────────────────────────
const ZONE_COLORS: Record<string, string> = {
  'CR': '#FF6B1A',
  'WR': '#1A56DB',
  'NR': '#8B5CF6',
  'ER': '#22C55E',
  'NCR': '#F59E0B',
  'SR': '#EC4899',
  'SWR': '#14B8A6',
};

const STATUS_FILL: Record<string, string> = {
  clear: '#22C55E',
  mega_block: '#F59E0B',
  accident: '#EF4444',
  speed_restriction: '#3B82F6',
};

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  return {
    x: cx + r * Math.cos(toRad(angleDeg - 90)),
    y: cy + r * Math.sin(toRad(angleDeg - 90)),
  };
}
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

interface ArcSection {
  id: string;
  zone: string;
  code: string;
  name: string;
  fromStation: string;
  toStation: string;
  status: string;
  lengthKm: number;
  ring: number;
  startAngle: number;
  endAngle: number;
}

export const CircleRouteMap: React.FC = () => {
  const { trackSections, trains, openTripPlanner } = useRailway();
  const { t, localize, language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const cx = 280, cy = 280;
  const rings = [215, 168, 122, 82];

  const zoneOrder = ['CR', 'WR', 'NR', 'ER', 'NCR'];
  const zoneBaseAngles: Record<string, number> = {
    'CR': 0, 'WR': 98, 'NR': 196, 'ER': 290, 'NCR': 340
  };
  const zoneArcSpan: Record<string, number> = {
    'CR': 85, 'WR': 85, 'NR': 85, 'ER': 40, 'NCR': 32
  };

  const zoneGroups: Record<string, typeof trackSections> = {};
  trackSections.forEach(s => {
    if (!zoneGroups[s.zone]) zoneGroups[s.zone] = [];
    zoneGroups[s.zone].push(s);
  });

  const arcSections: ArcSection[] = [];
  zoneOrder.forEach((zone, ringIdx) => {
    const sections = zoneGroups[zone] || [];
    const baseAngle = zoneBaseAngles[zone] ?? ringIdx * 72;
    const totalLen = sections.reduce((sum, s) => sum + s.lengthKm, 0) || 1;
    const arcSpan = zoneArcSpan[zone] ?? 80;
    let currentAngle = baseAngle;

    sections.forEach(sec => {
      const span = (sec.lengthKm / totalLen) * arcSpan;
      arcSections.push({
        id: sec.id,
        zone: sec.zone,
        code: sec.code,
        name: sec.name,
        fromStation: sec.fromStation,
        toStation: sec.toStation,
        status: sec.status,
        lengthKm: sec.lengthKm,
        ring: ringIdx % rings.length,
        startAngle: currentAngle,
        endAngle: currentAngle + span,
      });
      currentAngle += span + 2.5;
    });
  });

  const hovered = arcSections.find(s => s.id === hoveredId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div className="bms-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="bms-section-title" style={{ fontSize: '1.15rem' }}>
              🗺 {language === 'mr' ? 'वर्तुळ मार्ग नकाशा — रेल्वे कॉरिडॉर' : 'Circle Route Map — Rail Corridors'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {language === 'mr'
                ? 'मेट्रो-शैली वर्तुळाकार आकृतीत भारतीय रेल्वे मार्ग — स्थिती, झोन आणि थेट गाड्या'
                : 'Indian Railways corridors as metro-style circular diagram — hover any arc for details'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            {Object.entries(ZONE_COLORS).slice(0, 5).map(([zone, color]) => (
              <span key={zone} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-body)',
                background: 'var(--rx-surface-alt)', padding: '4px 10px', borderRadius: '20px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                {zone}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '18px', alignItems: 'start' }}>
        {/* SVG Map */}
        <div className="bms-card" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 560 560" width="100%" style={{ maxWidth: '520px' }}>
            {/* Dashed guide rings */}
            {rings.map((r, i) => (
              <circle key={i} cx={cx} cy={cy} r={r}
                fill="none" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 6" />
            ))}

            {/* Zone label rings (outer) */}
            {zoneOrder.map(zone => {
              const baseAngle = zoneBaseAngles[zone];
              const midAngle = baseAngle + (zoneArcSpan[zone] ?? 80) / 2;
              const sections = zoneGroups[zone] || [];
              if (sections.length === 0) return null;
              const ringIdx = zoneOrder.indexOf(zone) % rings.length;
              const labelPt = polarToXY(cx, cy, rings[ringIdx] + 26, midAngle);
              return (
                <text key={zone}
                  x={labelPt.x} y={labelPt.y + 3}
                  textAnchor="middle"
                  fill={ZONE_COLORS[zone]}
                  fontSize="8.5" fontWeight="800" opacity="0.7"
                >
                  {zone}
                </text>
              );
            })}

            {/* Arc sections */}
            {arcSections.map(sec => {
              const r = rings[sec.ring];
              const color = ZONE_COLORS[sec.zone] ?? '#888';
              const statusColor = STATUS_FILL[sec.status] ?? '#888';
              const isHovered = hoveredId === sec.id;
              const sTrains = trains.filter(tr => tr.currentSectionId === sec.id);
              const midAngle = (sec.startAngle + sec.endAngle) / 2;
              const startPt = polarToXY(cx, cy, r, sec.startAngle);
              const endPt = polarToXY(cx, cy, r, sec.endAngle);

              return (
                <g key={sec.id}
                  onMouseEnter={() => setHoveredId(sec.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Hover glow */}
                  {isHovered && (
                    <path d={arcPath(cx, cy, r, sec.startAngle, sec.endAngle)}
                      fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.15" />
                  )}

                  {/* Main arc */}
                  <path d={arcPath(cx, cy, r, sec.startAngle, sec.endAngle)}
                    fill="none" stroke={color}
                    strokeWidth={isHovered ? 7 : 5}
                    strokeLinecap="round"
                    opacity={isHovered ? 1 : 0.8}
                  />

                  {/* Status dot if not clear */}
                  {sec.status !== 'clear' && (() => {
                    const mp = polarToXY(cx, cy, r, midAngle);
                    return (
                      <circle cx={mp.x} cy={mp.y} r={5.5}
                        fill={statusColor} stroke="#FFFFFF" strokeWidth="1.5" />
                    );
                  })()}

                  {/* Station dots */}
                  <circle cx={startPt.x} cy={startPt.y} r={3.5}
                    fill="#FFFFFF" stroke={color} strokeWidth="2.5" />
                  <circle cx={endPt.x} cy={endPt.y} r={3.5}
                    fill="#FFFFFF" stroke={color} strokeWidth="2.5" />

                  {/* Train count badge */}
                  {sTrains.length > 0 && (() => {
                    const tp = polarToXY(cx, cy, r - 11, midAngle);
                    return (
                      <>
                        <circle cx={tp.x} cy={tp.y} r={7} fill={color} opacity={0.92} />
                        <text x={tp.x} y={tp.y + 3} textAnchor="middle"
                          fill="#FFFFFF" fontSize="7" fontWeight="800">
                          {sTrains.length}
                        </text>
                      </>
                    );
                  })()}

                  {/* Code label on hover */}
                  {isHovered && (() => {
                    const lp = polarToXY(cx, cy, r + 14, midAngle);
                    return (
                      <text x={lp.x} y={lp.y + 3} textAnchor="middle"
                        fill={color} fontSize="7.5" fontWeight="800">
                        {sec.code}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {/* Centre hub */}
            <circle cx={cx} cy={cy} r={44} fill="var(--rx-header)" />
            <circle cx={cx} cy={cy} r={40} fill="none" stroke="var(--rx-orange)" strokeWidth="2" />
            <text x={cx} y={cy + 1} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" letterSpacing="-0.3">TrainX</text>
            <text x={cx} y={cy + 15} textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontWeight="700" letterSpacing="0.08em">
              {language === 'mr' ? 'रेल ग्रिड' : 'RAIL GRID'}
            </text>

            {/* Bottom status legend */}
            {[
              { color: '#22C55E', label: language === 'mr' ? 'मोकळा' : 'Clear', x: 80 },
              { color: '#F59E0B', label: language === 'mr' ? 'मेगा ब्लॉक' : 'Mega Block', x: 200 },
              { color: '#EF4444', label: language === 'mr' ? 'आपत्कालीन' : 'Emergency', x: 356 },
            ].map((item) => (
              <g key={item.label} transform={`translate(${item.x}, 535)`}>
                <circle r={5} fill={item.color} />
                <text x={9} y={4} fontSize="8.5" fill="var(--text-secondary)" fontWeight="600">
                  {item.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Right panel: hover info + summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hovered ? (
            <div className="bms-card" style={{
              padding: '16px',
              borderTop: `4px solid ${ZONE_COLORS[hovered.zone] ?? 'var(--rx-orange)'}`,
            }}>
              <div style={{ fontSize: '0.62rem', color: '#888', fontWeight: 700, marginBottom: '5px' }}>
                [{hovered.zone}] {hovered.code}
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px', lineHeight: 1.35 }}>
                {localize(hovered.name)}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                <div>📍 {localize(hovered.fromStation)} → {localize(hovered.toStation)}</div>
                <div>📏 {hovered.lengthKm} {t('map.unitKm')}</div>
                <div>🚆 {trains.filter(tr => tr.currentSectionId === hovered.id).length} {t('map.activeTrainsCount')}</div>
                <div style={{
                  background: hovered.status === 'clear' ? '#DCFCE7' : hovered.status === 'mega_block' ? '#FEF3C7' : '#FEE2E2',
                  color: hovered.status === 'clear' ? '#15803D' : hovered.status === 'mega_block' ? '#92400E' : '#991B1B',
                  padding: '5px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem', marginTop: '4px'
                }}>
                  {hovered.status === 'clear' ? (language === 'mr' ? '✓ मार्ग मोकळा' : '✓ Clear') :
                   hovered.status === 'mega_block' ? (language === 'mr' ? '⚠ मेगा ब्लॉक सक्रिय' : '⚠ Mega Block') :
                   (language === 'mr' ? '🚨 आपत्कालीन बंद' : '🚨 Cordoned Off')}
                </div>
                <button
                  onClick={() => openTripPlanner(hovered.fromStation, hovered.toStation)}
                  className="btn btn-primary"
                  style={{
                    marginTop: '8px', width: '100%', padding: '7px 12px',
                    fontSize: '0.74rem', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  🧭 {language === 'mr' ? 'प्रवास योजना तयार करा' : 'Plan Trip Route'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bms-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🗺</div>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {language === 'mr'
                  ? 'रंगीत मार्गावर माउस ठेवा तपशील पाहा'
                  : 'Hover any arc to see corridor details'}
              </p>
            </div>
          )}

          <div className="bms-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--rx-orange)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.06em' }}>
              {language === 'mr' ? 'थेट झोन सारांश' : 'Live Zone Summary'}
            </div>
            {['CR','WR','NR'].map(zone => {
              const zoneSections = trackSections.filter(s => s.zone === zone);
              const zoneTrains = trains.filter(tr => zoneSections.some(s => s.id === tr.currentSectionId));
              const blocked = zoneSections.filter(s => s.status !== 'clear').length;
              return (
                <div key={zone} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.74rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: ZONE_COLORS[zone], display: 'inline-block' }} />
                    {zone}
                    {blocked > 0 && (
                      <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                        {blocked} {language === 'mr' ? 'ब्लॉक' : 'blk'}
                      </span>
                    )}
                  </span>
                  <strong style={{ color: 'var(--text-dark)' }}>
                    {zoneTrains.length} {language === 'mr' ? 'गाड्या' : 'trains'}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
