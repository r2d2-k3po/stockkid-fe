import React from 'react';
import type {PanelType, PanelMap} from '../app/screenPanelMapSlice';
import {mapReviver} from '../utils/mapReviver';
import {mapReplacer} from '../utils/mapReplacer';

export default function MapJSONTest() {
  const panelValue1: PanelType = {
    panelCode: 'panel0001'
  };

  const panelValue2: PanelType = {
    panelCode: 'panel0002'
  };

  const panelMapValue: PanelMap = new Map<string, PanelType>([
    ['uuidP1', panelValue1],
    ['uuidP2', panelValue2]
  ]);

  const screenPanelMap1 = new Map<string, PanelMap>([
    ['screenPanelUuid1', panelMapValue]
  ]);

  const serializedScreenPanelMap1 = JSON.stringify(
    screenPanelMap1,
    mapReplacer
  );
  console.log('screenPanelMap1 : ', screenPanelMap1);

  const parsedScreenPanelMap1 = JSON.parse(
    serializedScreenPanelMap1,
    mapReviver
  ) as Map<string, PanelMap>;

  console.log('parsedScreenPanelMap1 : ', parsedScreenPanelMap1);

  return (
    <div>
      <p>serializedScreenPanelMap1 : {serializedScreenPanelMap1}</p>
    </div>
  );
}
