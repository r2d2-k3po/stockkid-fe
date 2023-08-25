import {Layout, Layouts} from 'react-grid-layout';
import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {PanelCode} from './panelsSlice';
import {keysOfBreakpoints} from '../constants/reactGridLayoutParemeters';
import {v4 as uuidv4} from 'uuid';

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

type RemoveScreenPayload = {
  currentIndex: number;
  panelIds: string[];
};

type MoveScreenPayload = {
  currentIndex: number;
  targetIndex: number;
};

type CopyScreenPayload = {
  currentIndex: number;
  panelIds: string[];
  newPanelIds: string[];
};

type AddScreenPanelPayload = {
  currentIndex: number;
  panelId: string;
  panelCode: PanelCode;
};

type UpdateScreenLayoutsPayload = {
  currentIndex: number;
  layouts: Layouts;
};

type RemoveScreenPanelPayload = {
  screenId: string;
  panelId: string;
};

type Screen = {
  id: string;
  panelIds: string[];
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
      action: PayloadAction<RemoveScreenPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex];
      screenAdapter.removeOne(state, screenId);
    },
    moveScreen: (
      state: EntityState<Screen>,
      action: PayloadAction<MoveScreenPayload>
    ) => {
      const screenId = state.ids.splice(action.payload.currentIndex, 1);
      state.ids.splice(action.payload.targetIndex, 0, ...screenId);
    },
    copyScreen: (
      state: EntityState<Screen>,
      action: PayloadAction<CopyScreenPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex];
      const panelIds = action.payload.panelIds;
      const newPanelIds = action.payload.newPanelIds;
      const layouts = state.entities[screenId]?.layouts as Layouts;

      const newLayouts: Layouts = {};

      for (let i = 0; i < panelIds.length; i++) {
        keysOfBreakpoints.forEach((breakpoint) => {
          let layout = layouts[breakpoint]?.find(
            (item) => item.i === panelIds[i]
          );
          if (layout) {
            layout = {...layout, i: newPanelIds[i]};
            if (!newLayouts[breakpoint]) {
              newLayouts[breakpoint] = [];
            }
            newLayouts[breakpoint].push(layout);
          }
        });
      }

      screenAdapter.addOne(state, {
        id: uuidv4(),
        panelIds: newPanelIds,
        layouts: newLayouts
      });
    },
    addScreenPanel: (
      state: EntityState<Screen>,
      action: PayloadAction<AddScreenPanelPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex];
      const panelIds = state.entities[screenId]?.panelIds as string[];
      const layouts = state.entities[screenId]?.layouts as Layouts;

      panelIds.push(action.payload.panelId as string);
      const layout = {
        ...panelGrids[action.payload.panelCode],
        i: action.payload.panelId as string
      } as Layout;
      keysOfBreakpoints.forEach((breakpoint) => {
        if (!layouts[breakpoint]) {
          layouts[breakpoint] = [];
        }
        layouts[breakpoint].push(layout);
      });

      screenAdapter.setOne(state, {
        id: screenId as string,
        panelIds: panelIds,
        layouts: layouts
      });
    },
    updateScreenLayouts: (
      state: EntityState<Screen>,
      action: PayloadAction<UpdateScreenLayoutsPayload>
    ) => {
      const screenId = state.ids[action.payload.currentIndex] as string;
      const panelIds = state.entities[screenId]?.panelIds as string[];

      screenAdapter.setOne(state, {
        id: screenId,
        panelIds: panelIds,
        layouts: action.payload.layouts
      });
    },
    removeScreenPanel: (
      state: EntityState<Screen>,
      action: PayloadAction<RemoveScreenPanelPayload>
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
