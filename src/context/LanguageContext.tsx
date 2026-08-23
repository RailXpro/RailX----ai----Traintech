import React, { createContext, useContext, useState } from 'react';
import { Lang, t as translate } from '../i18n/translations';

interface LanguageContextType {
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('railx_lang');
      return (saved === 'mr' ? 'mr' : 'en') as Lang;
    } catch {
      return 'en';
    }
  });

  const setLanguage = (l: Lang) => {
    setLanguageState(l);
    try { localStorage.setItem('railx_lang', l); } catch {}
    // Update html lang attribute for screen-reader / font hints
    document.documentElement.lang = l === 'mr' ? 'mr' : 'en';
  };

  const t = (key: string, fallback?: string) => translate(language, key, fallback);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
