import React, { createContext, useContext, useState, useEffect } from 'react';

export type MapStyle = 'grid' | 'circle';

interface SettingsContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  mapStyle: MapStyle;
  setMapStyle: (s: MapStyle) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('railx_dark') === 'true'; } catch { return false; }
  });
  const [mapStyle, setMapStyleState] = useState<MapStyle>(() => {
    try { return (localStorage.getItem('railx_map') as MapStyle) || 'grid'; } catch { return 'grid'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    try { localStorage.setItem('railx_dark', String(darkMode)); } catch {}
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const setMapStyle = (s: MapStyle) => {
    setMapStyleState(s);
    try { localStorage.setItem('railx_map', s); } catch {}
  };

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDarkMode, mapStyle, setMapStyle }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
