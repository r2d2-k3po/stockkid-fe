import React from 'react';
import logo from './logo.svg';
import './App.css';
import SymbolTest from './tests/SymbolTest';
import ReactDaisyuiTest from './tests/ReactDaisyuiTest';
import LightDarkSwap from './components/LightDarkSwap';
import LanguageSelect from './components/LanguageSelect';
import LanguageI18nTest from './tests/LanguageI18nTest';

function App() {
  return (
    <div>
      <LanguageSelect />
      <LanguageI18nTest />
      <LightDarkSwap />
      <SymbolTest />
      {/*<ReactDaisyuiTest />*/}
    </div>
  );
}

export default App;
