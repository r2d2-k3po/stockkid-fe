import React from 'react';
import logo from './logo.svg';
import './App.css';
import SymbolTest from './tests/SymbolTest';
import ReactDaisyuiTest from './tests/ReactDaisyuiTest';
import LightDarkSwap from './components/LightDarkSwap';
import LanguageSelect from './components/LanguageSelect';
import {LanguageProvider} from './contexts/LanguageContext';
import LanguageContextTest from './tests/LanguageContextTest';

function App() {
  return (
    <LanguageProvider>
      <LanguageSelect />
      <LanguageContextTest />
      <LightDarkSwap />
      <SymbolTest />
      {/*<ReactDaisyuiTest />*/}
    </LanguageProvider>
  );
}

export default App;
