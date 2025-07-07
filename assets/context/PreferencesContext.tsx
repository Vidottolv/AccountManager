import React, { createContext, useContext, useState } from "react";

type Preferences = {
  commission: number;
  language: string;
  id?: string;
};

type PreferencesContextType = {
  preferences: Preferences | null;
  setPreferences: (prefs: Preferences) => void;
};

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: null,
  setPreferences: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}