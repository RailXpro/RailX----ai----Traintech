import React from 'react';
import {
  X, Moon, Sun, Map, LayoutGrid, Train, Zap, Bell, Globe, Gauge, ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const {
    darkMode,
    toggleDarkMode,
    mapStyle,
    setMapStyle,
    megaBlockAlerts,
    emergencySosAlerts,
    kavachAlerts,
    toggleNotification,
    setNotificationsDrawerOpen
  } = useSettings();
  const { language, setLanguage } = useLanguage();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)', zIndex: 9998,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '360px',
        background: 'var(--rx-surface)',
        boxShadow: '-8px 0 48px rgba(15,28,61,0.22)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '20px 0 0 20px',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--rx-header) 0%, #162248 100%)',
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--rx-orange) 0%, #FF8F45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Gauge size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {language === 'mr' ? 'सेटिंग्ज' : 'Settings'}
              </h2>
              <p style={{ fontSize: '0.7rem', color: '#8899BB', margin: 0 }}>
                {language === 'mr' ? 'प्राधान्ये आणि दृश्य पर्याय' : 'Preferences & display options'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '10px',
              color: '#FFFFFF', width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Appearance Section ─────────────────────────── */}
          <section>
            <h3 style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--rx-orange)', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Sun size={12} /> {language === 'mr' ? 'दिसण्याचे पर्याय' : 'Appearance'}
            </h3>

            {/* Dark Mode Toggle */}
            <div style={{
              background: 'var(--rx-surface-alt)',
              borderRadius: '14px', padding: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: darkMode ? '#1A1F35' : 'var(--rx-blue-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {darkMode ? <Moon size={18} color="var(--rx-blue)" /> : <Sun size={18} color="var(--rx-orange)" />}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {language === 'mr' ? 'डार्क मोड' : 'Dark Mode'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {darkMode
                      ? (language === 'mr' ? 'गडद पार्श्वभूमी सक्रिय' : 'Dark background enabled')
                      : (language === 'mr' ? 'उजळ पार्श्वभूमी सक्रिय' : 'Light background enabled')}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={toggleDarkMode}
                style={{
                  width: '48px', height: '26px',
                  borderRadius: '13px',
                  background: darkMode ? 'var(--rx-blue)' : 'var(--border-medium)',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.25s ease',
                  flexShrink: 0
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  left: darkMode ? '25px' : '3px',
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)'
                }} />
              </button>
            </div>
          </section>

          {/* ── Language Section ───────────────────────────── */}
          <section>
            <h3 style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--rx-orange)', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Globe size={12} /> {language === 'mr' ? 'भाषा' : 'Language'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(['en', 'mr'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: language === lang ? '2px solid var(--rx-orange)' : '2px solid transparent',
                    background: language === lang ? 'var(--rx-orange-light)' : 'var(--rx-surface-alt)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{lang === 'en' ? '🇬🇧' : '🇮🇳'}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {lang === 'en' ? 'English' : 'मराठी'}
                  </div>
                  {language === lang && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--rx-orange)', fontWeight: 600, marginTop: '2px' }}>
                      {lang === 'en' ? 'Active' : 'सक्रिय'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Map View Section ────────────────────────────── */}
          <section>
            <h3 style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--rx-orange)', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Map size={12} /> {language === 'mr' ? 'नकाशा दृश्य शैली' : 'Map View Style'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Grid View */}
              <button
                onClick={() => setMapStyle('grid')}
                style={{
                  padding: '16px 12px',
                  borderRadius: '14px',
                  border: mapStyle === 'grid' ? '2px solid var(--rx-blue)' : '2px solid transparent',
                  background: mapStyle === 'grid' ? 'var(--rx-blue-light)' : 'var(--rx-surface-alt)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  <LayoutGrid size={28} color={mapStyle === 'grid' ? 'var(--rx-blue)' : 'var(--text-secondary)'} />
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {language === 'mr' ? 'ग्रिड कार्ड्स' : 'Grid Cards'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {language === 'mr' ? 'तपशीलवार माहिती' : 'Detailed info'}
                </div>
                {mapStyle === 'grid' && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--rx-blue)', fontWeight: 600, marginTop: '4px' }}>
                    {language === 'mr' ? '✓ सक्रिय' : '✓ Active'}
                  </div>
                )}
              </button>

              {/* Circle Metro Map View */}
              <button
                onClick={() => setMapStyle('circle')}
                style={{
                  padding: '16px 12px',
                  borderRadius: '14px',
                  border: mapStyle === 'circle' ? '2px solid var(--rx-orange)' : '2px solid transparent',
                  background: mapStyle === 'circle' ? 'var(--rx-orange-light)' : 'var(--rx-surface-alt)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="11" fill="none" stroke={mapStyle === 'circle' ? 'var(--rx-orange)' : '#94A3B8'} strokeWidth="2.5" />
                    <circle cx="14" cy="3" r="2.5" fill={mapStyle === 'circle' ? 'var(--rx-orange)' : '#94A3B8'} />
                    <circle cx="25" cy="14" r="2.5" fill={mapStyle === 'circle' ? '#1A56DB' : '#94A3B8'} />
                    <circle cx="14" cy="25" r="2.5" fill={mapStyle === 'circle' ? '#22C55E' : '#94A3B8'} />
                    <circle cx="3" cy="14" r="2.5" fill={mapStyle === 'circle' ? '#F59E0B' : '#94A3B8'} />
                  </svg>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {language === 'mr' ? 'वर्तुळ नकाशा' : 'Circle Map'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {language === 'mr' ? 'मेट्रो-शैली मार्ग' : 'Metro-style routes'}
                </div>
                {mapStyle === 'circle' && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--rx-orange)', fontWeight: 600, marginTop: '4px' }}>
                    {language === 'mr' ? '✓ सक्रिय' : '✓ Active'}
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* ── Notifications Section ───────────────────────── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{
                fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--rx-orange)',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Bell size={12} /> {language === 'mr' ? 'सूचना' : 'Notifications'}
              </h3>

              <button
                onClick={() => {
                  onClose();
                  setNotificationsDrawerOpen(true);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--rx-green-deep)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {language === 'mr' ? 'सूचना पहा →' : 'View Alerts →'}
              </button>
            </div>

            {[
              {
                key: 'megablock' as const,
                icon: <Train size={15} color="var(--rx-blue)" />,
                label: language === 'mr' ? 'मेगा ब्लॉक सूचना' : 'Mega Block Alerts',
                sub: language === 'mr' ? 'रविवार नियोजित ब्लॉक' : 'Sunday scheduled blocks',
                active: megaBlockAlerts
              },
              {
                key: 'sos' as const,
                icon: <Zap size={15} color="var(--rx-red)" />,
                label: language === 'mr' ? 'आपत्कालीन SOS' : 'Emergency SOS',
                sub: language === 'mr' ? 'तात्काळ घटना इशारे' : 'Real-time incident alerts',
                active: emergencySosAlerts
              },
              {
                key: 'kavach' as const,
                icon: <ShieldCheck size={15} color="var(--rx-green)" />,
                label: language === 'mr' ? 'कवच अपडेट्स' : 'Kavach Updates',
                sub: language === 'mr' ? 'सुरक्षा प्रणाली स्थिती' : 'Safety system status',
                active: kavachAlerts
              }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                style={{
                  background: 'var(--rx-surface-alt)',
                  borderRadius: '12px', padding: '13px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  border: item.active ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid var(--border-light)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'var(--rx-surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </div>
                </div>
                <div style={{
                  width: '38px', height: '22px', borderRadius: '11px',
                  background: item.active ? 'var(--rx-green)' : 'var(--border-medium)',
                  position: 'relative', cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s ease',
                  boxShadow: item.active ? '0 2px 8px var(--rx-green-glow)' : 'none'
                }}>
                  <span style={{
                    position: 'absolute', top: '3px',
                    left: item.active ? '19px' : '3px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            ))}
          </section>

          {/* ── About Section ────────────────────────────────── */}
          <section style={{
            background: 'linear-gradient(135deg, var(--rx-header) 0%, #162248 100%)',
            borderRadius: '14px', padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Train size={16} color="var(--rx-orange)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>TrainX</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#7A8499', lineHeight: 1.6, margin: 0 }}>
              {language === 'mr'
                ? 'भारतीय रेल्वे AI-चालित प्लॅटफॉर्म • CRIS द्वारे अधिकृत • आवृत्ती 2.4.1'
                : 'Indian Railways AI Platform • Powered by CRIS • Version 2.4.1'}
            </p>
          </section>

        </div>
      </div>
    </>
  );
};
