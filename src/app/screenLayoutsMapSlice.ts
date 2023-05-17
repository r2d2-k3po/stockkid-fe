import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {mapReviver} from '../utils/mapReviver';
import {enableMapSet} from 'immer';
import {Layout, Layouts} from 'react-grid-layout';
import {panels, panelGrids} from '../components/main/Panel';

enableMapSet();

export const breakpoints = {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0};
export const cols = {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2};

interface ScreenLayoutsMapState {
  uuidLayoutsMap: Map<string, Layouts>;
}

type addPanelLayoutsPayload = {
  uuid: string;
  uuidP: string;
  panelCode: keyof typeof panels;
};

type removePanelLayoutsPayload = {
  uuid: string;
  uuidP: string;
};

const emptyLayouts: Layouts = {};
for (const breakpoint of Object.keys(breakpoints)) {
  emptyLayouts[breakpoint] = [];
}

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
    addScreenLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<string>
    ) => {
      state.uuidLayoutsMap.set(action.payload, emptyLayouts);
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
      const layoutItem: Layout = panelGrids[action.payload.panelCode];
      layoutItem.i = action.payload.uuidP;
      const layouts = state.uuidLayoutsMap.get(action.payload.uuid) as Layouts;
      for (const breakpoint of Object.keys(breakpoints)) {
        layouts[breakpoint].push(layoutItem);
      }
      state.uuidLayoutsMap.set(action.payload.uuid, layouts);
    },
    removePanelLayouts: (
      state: ScreenLayoutsMapState,
      action: PayloadAction<removePanelLayoutsPayload>
    ) => {
      const layouts = state.uuidLayoutsMap.get(action.payload.uuid) as Layouts;
      for (const breakpoint of Object.keys(breakpoints)) {
        layouts[breakpoint] = layouts[breakpoint].filter(
          (layoutItem) => layoutItem.i !== action.payload.uuidP
        );
      }
      state.uuidLayoutsMap.set(action.payload.uuid, layouts);
    }
  }
});

export const {
  addScreenLayouts,
  removeScreenLayouts,
  addPanelLayouts,
  removePanelLayouts
} = screenLayoutsMapSlice.actions;

export default screenLayoutsMapSlice.reducer;
