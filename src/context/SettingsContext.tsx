import React, { createContext, useContext, useState, useEffect } from 'react';

export type MapStyle = 'grid' | 'circle';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'emergency';
  category: 'megablock' | 'sos' | 'kavach' | 'system';
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface SettingsContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  mapStyle: MapStyle;
  setMapStyle: (s: MapStyle) => void;
  
  // Notification Preferences
  megaBlockAlerts: boolean;
  emergencySosAlerts: boolean;
  kavachAlerts: boolean;
  toggleNotification: (key: 'megablock' | 'sos' | 'kavach') => void;
  
  // In-app Notifications Drawer & Toast Center
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('railx_dark') === 'true'; } catch { return false; }
  });
  const [mapStyle, setMapStyleState] = useState<MapStyle>(() => {
    try { return (localStorage.getItem('railx_map') as MapStyle) || 'grid'; } catch { return 'grid'; }
  });

  // Notification Toggles
  const [megaBlockAlerts, setMegaBlockAlerts] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('railx_notify_megablock');
      return val === null ? true : val === 'true';
    } catch { return true; }
  });

  const [emergencySosAlerts, setEmergencySosAlerts] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('railx_notify_sos');
      return val === null ? true : val === 'true';
    } catch { return true; }
  });

  const [kavachAlerts, setKavachAlerts] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('railx_notify_kavach');
      return val === null ? true : val === 'true';
    } catch { return true; }
  });

  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    try { localStorage.setItem('railx_dark', String(darkMode)); } catch {}
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const setMapStyle = (s: MapStyle) => {
    setMapStyleState(s);
    try { localStorage.setItem('railx_map', s); } catch {}
  };

  const toggleNotification = (key: 'megablock' | 'sos' | 'kavach') => {
    if (key === 'megablock') {
      setMegaBlockAlerts(prev => {
        const next = !prev;
        try { localStorage.setItem('railx_notify_megablock', String(next)); } catch {}
        addToast({
          type: next ? 'success' : 'info',
          category: 'megablock',
          title: next ? 'Mega Block Alerts Enabled' : 'Mega Block Alerts Disabled',
          message: next ? 'You will receive notifications for Sunday mega blocks and maintenance.' : 'Mega block notifications muted.'
        });
        return next;
      });
    } else if (key === 'sos') {
      setEmergencySosAlerts(prev => {
        const next = !prev;
        try { localStorage.setItem('railx_notify_sos', String(next)); } catch {}
        addToast({
          type: next ? 'emergency' : 'info',
          category: 'sos',
          title: next ? 'Emergency SOS Alerts Enabled' : 'Emergency SOS Alerts Disabled',
          message: next ? 'Real-time high-priority accident & track obstruction alerts are active.' : 'Emergency SOS notifications muted.'
        });
        return next;
      });
    } else if (key === 'kavach') {
      setKavachAlerts(prev => {
        const next = !prev;
        try { localStorage.setItem('railx_notify_kavach', String(next)); } catch {}
        addToast({
          type: next ? 'success' : 'info',
          category: 'kavach',
          title: next ? 'Kavach Safety Updates Enabled' : 'Kavach Updates Disabled',
          message: next ? 'SIL-4 collision interlocks and signal speed warnings will be notified.' : 'Kavach safety updates muted.'
        });
        return next;
      });
    }
  };

  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newToast: ToastNotification = { ...toast, id, timestamp };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <SettingsContext.Provider value={{
      darkMode,
      toggleDarkMode,
      mapStyle,
      setMapStyle,
      megaBlockAlerts,
      emergencySosAlerts,
      kavachAlerts,
      toggleNotification,
      notificationsDrawerOpen,
      setNotificationsDrawerOpen,
      settingsModalOpen,
      setSettingsModalOpen,
      toasts,
      addToast,
      removeToast,
      clearAllToasts
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
