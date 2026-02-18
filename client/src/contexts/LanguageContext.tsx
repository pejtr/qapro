import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'cz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Menu items
    'menu.dashboard': 'Dashboard',
    'menu.scriptBuilder': 'Script Builder',
    'menu.profiles': 'Profiles',
    'menu.codeGenerator': 'Code Generator',
    'menu.recorder': 'Recorder',
    'menu.dockerManager': 'Docker Manager',
    'menu.socialTemplates': 'Social Templates',
    'menu.bddIntegration': 'BDD Integration',
    'menu.liveMonitor': 'Live Monitor',
    'menu.macosIntegration': 'macOS Integration',
    'menu.collaboration': 'Collaboration',
    'menu.marketplace': 'Marketplace',
    'menu.documentation': 'Documentation',
    'menu.blog': 'Blog',
    'menu.aiGenerator': 'AI Generator',
    'menu.securityTesting': 'Security Testing',
    'menu.dataConverter': 'Data Converter',
    'menu.backlinkChecker': 'Backlink Checker',
    'menu.domainAuthority': 'Domain Authority',
    
    // Common
    'common.earnings': 'Earnings',
    'common.messages': 'Messages',
    'common.seeAllMessages': 'See all messages',
    'common.noMessages': 'No messages yet',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Your automation cockpit is ready. Here is your system overview.',
  },
  cz: {
    // Menu items
    'menu.dashboard': 'Dashboard',
    'menu.scriptBuilder': 'Tvůrce Skriptů',
    'menu.profiles': 'Profily',
    'menu.codeGenerator': 'Generátor Kódu',
    'menu.recorder': 'Nahrávač',
    'menu.dockerManager': 'Docker Manager',
    'menu.socialTemplates': 'Sociální Šablony',
    'menu.bddIntegration': 'BDD Integrace',
    'menu.liveMonitor': 'Živý Monitor',
    'menu.macosIntegration': 'macOS Integrace',
    'menu.collaboration': 'Spolupráce',
    'menu.marketplace': 'Tržiště',
    'menu.documentation': 'Dokumentace',
    'menu.blog': 'Blog',
    'menu.aiGenerator': 'AI Generátor',
    'menu.securityTesting': 'Bezpečnostní Testy',
    'menu.dataConverter': 'Konvertor Dat',
    'menu.backlinkChecker': 'Kontrola Zpětných Odkazů',
    'menu.domainAuthority': 'Autorita Domény',
    
    // Common
    'common.earnings': 'Výdělky',
    'common.messages': 'Zprávy',
    'common.seeAllMessages': 'Zobrazit všechny zprávy',
    'common.noMessages': 'Zatím žádné zprávy',
    
    // Dashboard
    'dashboard.welcome': 'Vítejte zpět',
    'dashboard.overview': 'Váš automatizační kokpit je připraven. Zde je přehled vašeho systému.',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
