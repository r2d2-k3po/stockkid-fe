import React from 'react';
import logo from './logo.svg';
import './App.css';
import SymbolTest from './tests/SymbolTest';
import ReactDaisyuiTest from './tests/ReactDaisyuiTest';
import LightDarkSwap from './components/LightDarkSwap';

function App() {
  return (
    <div>
      <LightDarkSwap />
      <SymbolTest />
      {/*<ReactDaisyuiTest />*/}
    </div>
  );
}

export default App;
