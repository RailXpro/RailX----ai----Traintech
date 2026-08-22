import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';

const BANNERS = [
  {
    id: 1,
    tag: 'AI BLOCK SOLVER 2.4',
    title: 'Automated Track Possession & Constraint Solver',
    subtitle: 'Boost rolling stock availability by 95.8% with zero headway conflicts across 14 major rail divisions.',
    bg: 'linear-gradient(135deg, #2b354f 0%, #1f2538 100%)',
    ctaText: 'Run AI Solver',
    action: 'optimizer'
  },
  {
    id: 2,
    tag: 'SUNDAY MEGA BLOCK',
    title: 'Central & Western Railway Corridor Maintenance',
    subtitle: 'Track relaying on Dadar-Thane & OHE maintenance between Borivali-Virar. Live diversion bulletins active.',
    bg: 'linear-gradient(135deg, #442a1d 0%, #2e1d15 100%)',
    ctaText: 'View Schedules',
    action: 'megablock'
  },
  {
    id: 3,
    tag: 'SAFETY PROTOCOL',
    title: 'Kavach Anti-Collision & Emergency Interlocks',
    subtitle: 'Instant section cordon-off and automatic signal danger tripping with real-time SP-ARME relief dispatch.',
    bg: 'linear-gradient(135deg, #3d1c24 0%, #281218 100%)',
    ctaText: 'Incident Command',
    action: 'accidents'
  }
];

export const HeroCarousel: React.FC<{ onActionClick: (action: string) => void }> = ({ onActionClick }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const { runAiOptimizer } = useRailway();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentIdx];

  const handleCtaClick = () => {
    if (banner.action === 'optimizer') {
      runAiOptimizer();
    }
    onActionClick(banner.action);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      <div
        style={{
          background: banner.bg,
          borderRadius: '12px',
          padding: '28px 36px',
          color: '#FFFFFF',
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transition: 'background 0.5s ease',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '750px' }}>
          <span
            style={{
              background: 'var(--bms-red)',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              letterSpacing: '0.04em',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {banner.tag}
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {banner.title}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#D0D5DD', lineHeight: '1.5' }}>
            {banner.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCtaClick}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '8px' }}
          >
            {banner.ctaText}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Navigation arrows and slide dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
        <button
          onClick={handlePrev}
          title="Previous slide"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDDDDD',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-dark)'
          }}
        >
          <ChevronLeft size={14} />
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          {BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIdx(idx)}
              title={`Slide ${idx + 1}`}
              style={{
                width: idx === currentIdx ? '20px' : '6px',
                height: '6px',
                borderRadius: '4px',
                background: idx === currentIdx ? 'var(--bms-red)' : '#CCCCCC',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          title="Next slide"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDDDDD',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-dark)'
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
