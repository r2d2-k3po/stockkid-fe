import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {PanelCode, panelState} from '../constants/panelInfo';
import {
  addScreenPanel,
  copyScreen,
  loadScreens,
  removeScreen,
  removeScreenPanel
} from './screensSlice';

type UpdatePanelStatePayload = {
  panelId: string;
  panelState: object;
};

export type Panel = {
  id: string;
  panelCode: PanelCode;
  panelState: object;
};

export const panelAdapter = createEntityAdapter<Panel>();

const initialState: EntityState<Panel> = localStorage.getItem('panels')
  ? JSON.parse(localStorage.getItem('panels') as string)
  : panelAdapter.getInitialState();

const panelsSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    updatePanelState: (
      state: EntityState<Panel>,
      action: PayloadAction<UpdatePanelStatePayload>
    ) => {
      const id = action.payload.panelId;
      const panelCode = state.entities[id]?.panelCode as PanelCode;
      const panelState = state.entities[id]?.panelState as object;

      const newPanelState = {...panelState, ...action.payload.panelState};
      panelAdapter.setOne(state, {
        id: id,
        panelCode: panelCode,
        panelState: newPanelState
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addScreenPanel, (state, action) => {
        panelAdapter.addOne(state, {
          id: action.payload.panelId,
          panelCode: action.payload.panelCode,
          panelState: panelState[action.payload.panelCode]
        });
      })
      .addCase(removeScreenPanel, (state, action) => {
        panelAdapter.removeOne(state, action.payload.panelId);
      })
      .addCase(removeScreen, (state, action) => {
        panelAdapter.removeMany(state, action.payload.panelIds);
      })
      .addCase(copyScreen, (state, action) => {
        for (let i = 0; i < action.payload.panelIds.length; i++) {
          const panelCode = state.entities[action.payload.panelIds[i]]
            ?.panelCode as PanelCode;
          panelAdapter.addOne(state, {
            id: action.payload.newPanelIds[i],
            panelCode: panelCode,
            panelState: panelState[panelCode]
          });
        }
      })
      .addCase(loadScreens, (_state, action) => {
        return action.payload.panels;
      });
  }
});

export const {updatePanelState} = panelsSlice.actions;

export default panelsSlice.reducer;
