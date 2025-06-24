import React, { createContext, ReactNode, useContext, useState } from "react";
import i18n from "../locales/I18n";

const LanguageContext = createContext({
  language: "pt",
  setLanguage: (lang: string) => {},
});

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState("pt");

  i18n.locale = language;

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);