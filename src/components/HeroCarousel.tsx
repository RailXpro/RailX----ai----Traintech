import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRailway } from '../context/RailwayContext';
import { useLanguage } from '../context/LanguageContext';

export const HeroCarousel: React.FC<{ onActionClick: (action: string) => void }> = ({ onActionClick }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const { runAiOptimizer } = useRailway();
  const { t } = useLanguage();

  const BANNERS = [
    {
      id: 1,
      tag: t('hero.slide1.tag'),
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      bg: 'linear-gradient(135deg, #162447 0%, #0F1C3D 100%)',
      ctaText: t('hero.slide1.cta'),
      action: 'optimizer'
    },
    {
      id: 2,
      tag: t('hero.slide2.tag'),
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      bg: 'linear-gradient(135deg, #3A2312 0%, #22140A 100%)',
      ctaText: t('hero.slide2.cta'),
      action: 'megablock'
    },
    {
      id: 3,
      tag: t('hero.slide3.tag'),
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      bg: 'linear-gradient(135deg, #38121A 0%, #20080E 100%)',
      ctaText: t('hero.slide3.cta'),
      action: 'accidents'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [BANNERS.length]);

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
          borderRadius: '16px',
          padding: '28px 36px',
          color: '#FFFFFF',
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-card)',
          transition: 'background 0.5s ease',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '750px' }}>
          <span
            style={{
              background: 'var(--rx-orange)',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.04em',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {banner.tag}
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
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
            style={{ padding: '10px 22px', fontSize: '0.88rem', fontWeight: 700 }}
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
            background: 'var(--rx-white)',
            border: '1px solid var(--border-medium)',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
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
                width: idx === currentIdx ? '22px' : '6px',
                height: '6px',
                borderRadius: '4px',
                background: idx === currentIdx ? 'var(--rx-orange)' : '#CCCCCC',
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
            background: 'var(--rx-white)',
            border: '1px solid var(--border-medium)',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
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
