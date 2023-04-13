import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import SymbolTest from './tests/SymbolTest';
import ReactDaisyuiTest from './tests/ReactDaisyuiTest';
import LightDarkSwap from './components/LightDarkSwap';
import LanguageSelect from './components/LanguageSelect';
import {LanguageContext} from './contexts/LanguageContext';
import LanguageContextTest from './tests/LanguageContextTest';

function App() {
  const [language, setLanguage] = useState<string>(
    localStorage.getItem('language') || 'ko'
  );

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      <LanguageSelect />
      <LanguageContextTest />
      <LightDarkSwap />
      <SymbolTest />
      {/*<ReactDaisyuiTest />*/}
    </LanguageContext.Provider>
  );
}

export default App;
