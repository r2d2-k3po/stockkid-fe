import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {mapReviver} from '../utils/mapReviver';
import {enableMapSet} from 'immer';
import {Layout, Layouts} from 'react-grid-layout';
import {panels, panelGrids} from '../components/main/Panel';
import {breakpoints} from './reactGridLayoutParemeters';

enableMapSet();

export type LayoutItemType = Layout;

interface ScreenLayoutsMapState {
  uuidLayoutsMap: Map<string, Layouts>;
}

type updateLayoutsPayload = {
  uuid: string;
  layouts: Layouts;
};

type addPanelLayoutsPayload = {
  uuid: string;
  uuidP: string;
  currentBreakpoint: keyof typeof breakpoints;
  panelCode: keyof typeof panels;
  layoutItem?: LayoutItemType;
};

const initialState: ScreenLayoutsMapState = {
  uuidLayoutsMap: localStorage.getItem('screenUuidLayoutsMap')
    ? (JSON.parse(
        localStorage.getItem('screenUuidLayoutsMap') as string,
        mapReviver
      ) as Map<string, Layouts>)
    : new Map<string, Layouts>()
};

const screenLayoutsMapSlice = createSlice({
  name: 'screenLayoutsMap',
  initialState,
  reducers: {
    updateLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<updateLayoutsPayload>
    ) => {
      state.uuidLayoutsMap.set(action.payload.uuid, action.payload.layouts);
    },
    addScreenLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<string>
    ) => {
      state.uuidLayoutsMap.set(action.payload, {});
    },
    removeScreenLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<string>
    ) => {
      state.uuidLayoutsMap.delete(action.payload);
    },
    addPanelLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<addPanelLayoutsPayload>
    ) => {
      let layoutItem: LayoutItemType =
        action.payload.layoutItem ?? panelGrids[action.payload.panelCode];
      layoutItem = {...layoutItem, i: action.payload.uuidP};
      const layouts = state.uuidLayoutsMap.get(action.payload.uuid) as Layouts;
      if (!layouts[action.payload.currentBreakpoint]) {
        layouts[action.payload.currentBreakpoint] = [];
      }
      layouts[action.payload.currentBreakpoint].push(layoutItem);
      state.uuidLayoutsMap.set(action.payload.uuid, layouts);
    }
  }
});

export const {
  updateLayouts,
  addScreenLayouts,
  removeScreenLayouts,
  addPanelLayouts
} = screenLayoutsMapSlice.actions;

export default screenLayoutsMapSlice.reducer;
