import {createEntityAdapter, createSlice, EntityState} from '@reduxjs/toolkit';
import {
  addScreenPanel,
  copyScreen,
  removeScreen,
  removeScreenPanel
} from './screensSlice';

export type PanelCode =
  | 'panel0000'
  | 'panel0001'
  | 'panel0002'
  | 'panel0003'
  | 'panel0004'
  | 'panel0005'
  | 'panel0006'
  | 'panel0007';

type Panel = {
  id: string;
  panelCode: PanelCode;
};

export const panelAdapter = createEntityAdapter<Panel>();

const initialState: EntityState<Panel> = localStorage.getItem('panels')
  ? JSON.parse(localStorage.getItem('panels') as string)
  : panelAdapter.getInitialState();

const panelsSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addScreenPanel, (state, action) => {
        panelAdapter.addOne(state, {
          id: action.payload.panelId,
          panelCode: action.payload.panelCode
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
          panelAdapter.addOne(state, {
            id: action.payload.newPanelIds[i],
            panelCode: state.entities[action.payload.panelIds[i]]
              ?.panelCode as PanelCode
          });
        }
      });
  }
});

export default panelsSlice.reducer;
