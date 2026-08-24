import React, { useState, useRef, useEffect } from 'react';
import {
  Search, X, Train, MapPin, Calendar, AlertTriangle, Cpu, ArrowRight
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

export interface SearchResultItem {
  id: string;
  category: 'corridor' | 'train' | 'megablock' | 'incident' | 'asset';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  tabTarget: string;
  sectionId?: string;
}

export const GlobalSearchBar: React.FC = () => {
  const {
    trackSections,
    trains,
    megaBlocks,
    accidents,
    assets,
    setPersona,
    setActiveTab,
    setSelectedSectionId
  } = useRailway();

  const { t, localize, language } = useLanguage();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  // Search logic across all datasets
  const results: SearchResultItem[] = [];

  if (trimmedQuery.length > 0) {
    // 1. Corridors / Track Sections
    trackSections.forEach(section => {
      const nameEn = section.name.toLowerCase();
      const nameMr = localize(section.name).toLowerCase();
      const code = section.code.toLowerCase();
      const fromStn = (section.fromStation + ' ' + localize(section.fromStation)).toLowerCase();
      const toStn = (section.toStation + ' ' + localize(section.toStation)).toLowerCase();
      const div = section.division.toLowerCase();

      if (
        nameEn.includes(trimmedQuery) ||
        nameMr.includes(trimmedQuery) ||
        code.includes(trimmedQuery) ||
        fromStn.includes(trimmedQuery) ||
        toStn.includes(trimmedQuery) ||
        div.includes(trimmedQuery)
      ) {
        results.push({
          id: `sec-${section.id}`,
          category: 'corridor',
          title: `[${section.code}] ${localize(section.name)}`,
          subtitle: `${localize(section.fromStation)} ➔ ${localize(section.toStation)} (${section.division} • ${section.lengthKm} km)`,
          badge: section.status === 'clear' ? (language === 'mr' ? 'मोकळा' : 'Clear') :
                 section.status === 'mega_block' ? (language === 'mr' ? 'मेगा ब्लॉक' : 'Mega Block') :
                 (language === 'mr' ? 'आपत्कालीन' : 'Incident'),
          badgeColor: section.status === 'clear' ? 'var(--rx-green)' :
                      section.status === 'mega_block' ? 'var(--rx-amber)' : 'var(--rx-red)',
          tabTarget: 'map',
          sectionId: section.id
        });
      }
    });

    // 2. Trains
    trains.forEach(train => {
      const num = train.number.toLowerCase();
      const nameEn = train.name.toLowerCase();
      const nameMr = localize(train.name).toLowerCase();
      const type = train.type.toLowerCase();
      const origin = (train.origin + ' ' + localize(train.origin)).toLowerCase();
      const dest = (train.destination + ' ' + localize(train.destination)).toLowerCase();

      if (
        num.includes(trimmedQuery) ||
        nameEn.includes(trimmedQuery) ||
        nameMr.includes(trimmedQuery) ||
        type.includes(trimmedQuery) ||
        origin.includes(trimmedQuery) ||
        dest.includes(trimmedQuery)
      ) {
        results.push({
          id: `train-${train.id}`,
          category: 'train',
          title: `#${train.number} ${localize(train.name)}`,
          subtitle: `${localize(train.origin)} ➔ ${localize(train.destination)} • ${train.type} (${train.speedKmph} km/h)`,
          badge: train.status === 'on_time' ? (language === 'mr' ? 'वेळेवर' : 'On Time') : (language === 'mr' ? 'उशीर' : 'Delayed'),
          badgeColor: train.status === 'on_time' ? 'var(--rx-green)' : 'var(--rx-amber)',
          tabTarget: 'map',
          sectionId: train.currentSectionId
        });
      }
    });

    // 3. Mega Blocks
    megaBlocks.forEach(block => {
      const secName = (block.sectionName + ' ' + localize(block.sectionName)).toLowerCase();
      const reason = (block.reason + ' ' + localize(block.reason)).toLowerCase();
      const lines = block.linesAffected.toLowerCase();
      const div = block.division.toLowerCase();

      if (secName.includes(trimmedQuery) || reason.includes(trimmedQuery) || lines.includes(trimmedQuery) || div.includes(trimmedQuery)) {
        results.push({
          id: `block-${block.id}`,
          category: 'megablock',
          title: `${localize(block.sectionName)} (${block.linesAffected})`,
          subtitle: `${localize(block.reason)} • ${block.date} (${block.startTime} - ${block.endTime})`,
          badge: block.status === 'active' ? (language === 'mr' ? 'सक्रिय ब्लॉक' : 'Active') : (language === 'mr' ? 'नियोजित' : 'Scheduled'),
          badgeColor: block.status === 'active' ? 'var(--rx-red)' : 'var(--rx-amber)',
          tabTarget: 'megablock',
          sectionId: block.sectionId
        });
      }
    });

    // 4. Incidents & Accidents
    accidents.forEach(incident => {
      const trainNum = incident.trainNumber.toLowerCase();
      const trainName = (incident.trainName + ' ' + localize(incident.trainName)).toLowerCase();
      const secName = (incident.sectionName + ' ' + localize(incident.sectionName)).toLowerCase();
      const nature = (incident.natureOfIncident + ' ' + localize(incident.natureOfIncident)).toLowerCase();
      const desc = (incident.description + ' ' + localize(incident.description)).toLowerCase();

      if (
        trainNum.includes(trimmedQuery) ||
        trainName.includes(trimmedQuery) ||
        secName.includes(trimmedQuery) ||
        nature.includes(trimmedQuery) ||
        desc.includes(trimmedQuery)
      ) {
        results.push({
          id: `inc-${incident.id}`,
          category: 'incident',
          title: `[SOS] #${incident.trainNumber} - ${localize(incident.natureOfIncident)}`,
          subtitle: `${localize(incident.trainName)} • ${localize(incident.sectionName)}`,
          badge: incident.severity.toUpperCase(),
          badgeColor: incident.severity === 'critical' ? 'var(--rx-red)' : 'var(--rx-amber)',
          tabTarget: 'accidents',
          sectionId: incident.sectionId
        });
      }
    });

    // 5. Assets & Signals
    assets.forEach(asset => {
      const name = (asset.name + ' ' + localize(asset.name)).toLowerCase();
      const type = asset.type.toLowerCase();
      const div = asset.division.toLowerCase();

      if (name.includes(trimmedQuery) || type.includes(trimmedQuery) || div.includes(trimmedQuery)) {
        results.push({
          id: `asset-${asset.id}`,
          category: 'asset',
          title: `${asset.name} (${asset.division})`,
          subtitle: `${asset.type} • ${language === 'mr' ? 'आरोग्य स्कोअर' : 'Health Score'}: ${asset.healthScore}%`,
          badge: `${asset.healthScore}%`,
          badgeColor: asset.healthScore > 80 ? 'var(--rx-green)' : 'var(--rx-amber)',
          tabTarget: 'analytics',
          sectionId: asset.locationSectionId
        });
      }
    });
  }

  const handleSelect = (item: SearchResultItem) => {
    setPersona('planner');
    setActiveTab(item.tabTarget);
    if (item.sectionId) {
      setSelectedSectionId(item.sectionId);
    }
    setIsOpen(false);
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'corridor': return <MapPin size={15} color="var(--rx-orange)" />;
      case 'train': return <Train size={15} color="var(--rx-blue)" />;
      case 'megablock': return <Calendar size={15} color="var(--rx-amber)" />;
      case 'incident': return <AlertTriangle size={15} color="var(--rx-red)" />;
      case 'asset': return <Cpu size={15} color="#A855F7" />;
    }
  };

  const getCategoryLabel = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'corridor': return language === 'mr' ? 'कॉरिडॉर' : 'Corridor';
      case 'train': return language === 'mr' ? 'गाडी' : 'Train';
      case 'megablock': return language === 'mr' ? 'मेगा ब्लॉक' : 'Mega Block';
      case 'incident': return language === 'mr' ? 'आपत्कालीन घटना' : 'Incident';
      case 'asset': return language === 'mr' ? 'मालमत्ता' : 'Asset';
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: '1 1 240px', maxWidth: '480px', minWidth: '180px' }}>
      {/* Search Input Box */}
      <div className="bms-search-box" style={{ width: '100%' }}>
        <Search size={15} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Enter' && results.length > 0) {
              handleSelect(results[0]);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className="bms-search-input"
          placeholder={t('nav.searchPlaceholder')}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Results Box */}
      {isOpen && query.trim().length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: 'var(--rx-surface)',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-medium)',
          maxHeight: '380px',
          overflowY: 'auto',
          zIndex: 500,
          animation: 'fadeIn 0.15s ease'
        }}>
          {results.length > 0 ? (
            <div style={{ padding: '8px' }}>
              <div style={{
                padding: '6px 12px', fontSize: '0.68rem', fontWeight: 800,
                color: 'var(--rx-orange)', textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>
                {language === 'mr' ? `शोध निकाल (${results.length})` : `Search Results (${results.length})`}
              </div>

              {results.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--rx-surface-alt)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--rx-surface-alt)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: '0.68rem', color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 800,
                      color: item.badgeColor || 'var(--text-muted)',
                      background: 'var(--rx-surface-alt)',
                      padding: '3px 8px', borderRadius: '8px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {item.badge || getCategoryLabel(item.category)}
                    </span>
                    <ArrowRight size={13} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔍</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {language === 'mr' ? 'कोणताही निकाल सापडला नाही' : 'No matching results found'}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                {language === 'mr'
                  ? 'गाडी क्रमांक (उदा. 12951), स्टेशन, कॉरिडॉर किंवा ब्लॉक शोधून पहा'
                  : 'Try searching by train number (e.g. 12951), station, corridor or block'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
