import {Layout, Layouts} from 'react-grid-layout';
import {
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  addPanel,
  copyPanels,
  PanelCode,
  removePanel,
  removePanels
} from './panelsSlice';
import {v4 as uuidv4} from 'uuid';
import {
  breakpoints,
  keysOfBreakpoints
} from '../constants/reactGridLayoutParemeters';

type PanelGrids = Record<PanelCode, object>;

const panelGrids: PanelGrids = {
  panel0000: {i: '', x: 0, y: 0, w: 1, h: 1},
  panel0001: {i: '', x: 0, y: 0, w: 1, h: 2},
  panel0002: {i: '', x: 0, y: 0, w: 1, h: 3},
  panel0003: {i: '', x: 0, y: 0, w: 2, h: 1},
  panel0004: {i: '', x: 0, y: 0, w: 2, h: 2},
  panel0005: {i: '', x: 0, y: 0, w: 2, h: 3},
  panel0006: {i: '', x: 0, y: 0, w: 3, h: 1},
  panel0007: {i: '', x: 0, y: 0, w: 3, h: 2}
};

type moveScreenPayload = {
  currentIndex: number;
  targetIndex: number;
};

type addScreenPanelPayload = {
  currentIndex: number;
  currentBreakpoint: keyof typeof breakpoints;
  panelCode: PanelCode;
};

type updateScreenLayoutsPayload = {
  currentIndex: number;
  layouts: Layouts;
};

type removeScreenPanelPayload = {
  screenId: EntityId;
  panelId: EntityId;
};

type Screen = {
  id: EntityId;
  panelIds: EntityId[];
  layouts: Layouts;
};

export const screenAdapter = createEntityAdapter<Screen>();

const initialState: EntityState<Screen> = localStorage.getItem('screens')
  ? JSON.parse(localStorage.getItem('screens') as string)
  : screenAdapter.getInitialState();

const screensSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {
    addScreen: (state: EntityState<Screen>, action: PayloadAction<string>) => {
      const newScreen: Screen = {
        id: action.payload,
        panelIds: [],
        layouts: {}
      };
      screenAdapter.addOne(state, newScreen);
    },
    removeScreen: (
      state: EntityState<Screen>,
      action: PayloadAction<number>
    ) => {
      const screenId = state.ids[action.payload];
      screenAdapter.removeOne(state, screenId);
      removePanels(state.entities[screenId]?.panelIds as string[]);
    },
    moveScreen: (
      state: EntityState<Screen>,
      action: PayloadAction<moveScreenPayload>
    ) => {
      const screenId = state.ids.splice(action.payload.currentIndex, 1);
      state.ids.splice(action.payload.targetIndex, 0, ...screenId);
    },
    copyScreen: (state: EntityState<Screen>, action: PayloadAction<number>) => {
      const screenId = state.ids[action.payload];
      const panelIds = state.entities[screenId]?.panelIds as string[];
      const layouts = state.entities[screenId]?.layouts as Layouts;

      const newPanelIds: string[] = [];
      const newLayouts: Layouts = {};

      panelIds.forEach((id) => {
        const newPanelId = uuidv4();
        newPanelIds.push(newPanelId);
        keysOfBreakpoints.forEach((breakpoint) => {
          let layout = layouts[breakpoint]?.find((item) => item.i === id);
          if (layout) {
            layout = {...layout, i: newPanelId};
            if (!newLayouts[breakpoint]) {
              newLayouts[breakpoint] = [];
            }
            newLayouts[breakpoint].push(layout);
          }
        });
      });

      screenAdapter.addOne(state, {
        id: uuidv4(),
        panelIds: newPanelIds,
        layouts: newLayouts
      });
      copyPanels({panelIds: panelIds, newPanelIds: newPanelIds});
    },
    addScreenPanel: (
      state: EntityState<Screen>,
      action: PayloadAction<addScreenPanelPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex];
      const panelIds = state.entities[screenId]?.panelIds as string[];
      const layouts = state.entities[screenId]?.layouts as Layouts;

      const newPanelId = uuidv4();
      addPanel({id: newPanelId, panelCode: action.payload.panelCode});

      panelIds.push(newPanelId);
      const layout = {
        ...panelGrids[action.payload.panelCode],
        i: newPanelId
      } as Layout;
      if (!layouts[action.payload.currentBreakpoint]) {
        layouts[action.payload.currentBreakpoint] = [];
      }
      layouts[action.payload.currentBreakpoint].push(layout);

      screenAdapter.setOne(state, {
        id: screenId as string,
        panelIds: panelIds,
        layouts: layouts
      });
    },
    updateScreenLayouts: (
      state: EntityState<Screen>,
      action: PayloadAction<updateScreenLayoutsPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex];
      const panelIds = state.entities[screenId]?.panelIds as string[];

      screenAdapter.setOne(state, {
        id: screenId,
        panelIds: panelIds,
        layouts: action.payload.layouts
      });
    },
    removeScreenPanel: (
      state: EntityState<Screen>,
      action: PayloadAction<removeScreenPanelPayload>
    ) => {
      const screenId = action.payload.screenId;
      const panelId = action.payload.panelId as string;

      const panelIds = state.entities[screenId]?.panelIds as string[];
      const layouts = state.entities[screenId]?.layouts as Layouts;

      const newPanelIds = panelIds.filter((id) => id !== panelId);
      const newLayouts: Layouts = {};

      keysOfBreakpoints.forEach((breakpoint) => {
        if (layouts[breakpoint]) {
          newLayouts[breakpoint] = layouts[breakpoint].filter(
            (layout) => layout.i !== panelId
          );
        }
      });

      screenAdapter.setOne(state, {
        id: screenId,
        panelIds: newPanelIds,
        layouts: newLayouts
      });
      removePanel(panelId);
    }
  }
});

export const {
  addScreen,
  removeScreen,
  moveScreen,
  copyScreen,
  addScreenPanel,
  updateScreenLayouts,
  removeScreenPanel
} = screensSlice.actions;

export default screensSlice.reducer;
