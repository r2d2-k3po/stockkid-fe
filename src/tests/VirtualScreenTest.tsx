import React from 'react';
import {MaterialSymbol} from 'react-material-symbols';

export default function VirtualScreenTest() {
  const uuid = '1234';
  const currentScreen = '1';

  return (
    <div
      key={uuid}
      data-grid={{x: 0, y: 0, w: 3, h: 1}}
      className="border-2 border-info rounded-md hover:border-accent"
    >
      <MaterialSymbol
        icon="drag_pan"
        className="drag_pan btn btn-xs btn-outline btn-warning"
        size={22}
        grade={-25}
        weight={200}
      />
      <p>screen: {currentScreen}</p>
      <p>uuid: {uuid}</p>
    </div>
  );
}
