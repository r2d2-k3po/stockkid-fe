import React, {createContext, FC, useContext, useState} from 'react';

export type LanguageContextType = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
};
export const LanguageProvider: FC<LanguageProviderProps> = ({children}) => {
  const [language, setLanguage] = useState<string>(
    localStorage.getItem('language') || 'ko'
  );

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const {language} = useContext(LanguageContext) as LanguageContextType;

  return language;
};
