'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  timezone: string;
  setTimezone: (timezone: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'flow-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezoneState] = useState<string>(() => {
    // Initialize from localStorage or use system timezone
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          return settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
      }
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  const setTimezone = (newTimezone: string) => {
    setTimezoneState(newTimezone);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const settings = { timezone: newTimezone };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  };

  return (
    <SettingsContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
