import {Layouts} from 'react-grid-layout';
import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {copyPanels, removePanels} from './panelsSlice';
import {v4 as uuidv4} from 'uuid';
import {keysOfBreakpoints} from '../constants/reactGridLayoutParemeters';

type moveScreenPayload = {
  currentIndex: number;
  targetIndex: number;
};

type Screen = {
  id: string;
  panelIds: string[];
  layouts: Layouts;
};

const screenAdapter = createEntityAdapter<Screen>();

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
      removePanels(state.entities[screenId]?.panelIds as string[]);
      screenAdapter.removeOne(state, screenId);
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

      const newScreen: Screen = {
        id: uuidv4(),
        panelIds: newPanelIds,
        layouts: newLayouts
      };
      screenAdapter.addOne(state, newScreen);
      copyPanels({panelIds: panelIds, newPanelIds: newPanelIds});
    }
  }
});

export const {addScreen, removeScreen, moveScreen, copyScreen} =
  screensSlice.actions;

export default screensSlice.reducer;

export const screensSelectors = screenAdapter.getSelectors<RootState>(
  (state) => state.screens
);
