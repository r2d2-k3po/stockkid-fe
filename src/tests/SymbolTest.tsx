import {MaterialSymbol} from 'react-material-symbols';
import React from 'react';

export default function SymbolTest() {
  return (
    <div>
      <h2>SymbolTest</h2>
      <MaterialSymbol icon="folder" size={24} fill grade={-25} color="red" />
      <MaterialSymbol icon="check_box" />
      <MaterialSymbol icon="folder" />
    </div>
  );
}
