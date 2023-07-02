import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {panels, PanelType} from '../../components/main/Panel';
import {mapReviver} from '../../utils/mapReviver';
import {enableMapSet} from 'immer';

enableMapSet();

export type PanelMap = Map<string, PanelType>;

interface ScreenPanelMapState {
  uuidPanelMap: Map<string, PanelMap>;
}

type addPanelPayload = {
  uuid: string;
  uuidP: string;
  panelCode: keyof typeof panels;
};

type removePanelPayload = {
  uuid: string;
  uuidP: string;
};

const initialState: ScreenPanelMapState = {
  uuidPanelMap: localStorage.getItem('screenUuidPanelMap')
    ? (JSON.parse(
        localStorage.getItem('screenUuidPanelMap') as string,
        mapReviver
      ) as Map<string, PanelMap>)
    : new Map<string, PanelMap>()
};

const screenPanelMapSlice = createSlice({
  name: 'screenPanelMap',
  initialState,
  reducers: {
    addScreenPanel: (
      state: ScreenPanelMapState,
      action: PayloadAction<string>
    ) => {
      state.uuidPanelMap.set(action.payload, new Map<string, PanelType>());
    },
    removeScreenPanel: (
      state: ScreenPanelMapState,
      action: PayloadAction<string>
    ) => {
      state.uuidPanelMap.delete(action.payload);
    },
    addPanel: (
      state: ScreenPanelMapState,
      action: PayloadAction<addPanelPayload>
    ) => {
      (state.uuidPanelMap.get(action.payload.uuid) as PanelMap).set(
        action.payload.uuidP,
        {panelCode: action.payload.panelCode}
      );
    },
    removePanel: (
      state: ScreenPanelMapState,
      action: PayloadAction<removePanelPayload>
    ) => {
      (state.uuidPanelMap.get(action.payload.uuid) as PanelMap).delete(
        action.payload.uuidP
      );
    }
  }
});

export const {addScreenPanel, removeScreenPanel, addPanel, removePanel} =
  screenPanelMapSlice.actions;

export default screenPanelMapSlice.reducer;
