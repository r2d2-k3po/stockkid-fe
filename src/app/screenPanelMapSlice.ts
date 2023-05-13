import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import {panels} from '../components/main/Panel';
import {mapReviver} from '../utils/mapReviver';
import {enableMapSet} from 'immer';

enableMapSet();

export type PanelType = {
  panelCode: keyof typeof panels;
};

export type PanelMap = Map<string, PanelType>;

interface ScreenPanelMapState {
  uuidPanelMap: Map<string, PanelMap>;
}

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
    }
  }
});

export const {addScreenPanel, removeScreenPanel} = screenPanelMapSlice.actions;

export default screenPanelMapSlice.reducer;
