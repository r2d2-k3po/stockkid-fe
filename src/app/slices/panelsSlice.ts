import {
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';

export type PanelCode =
  | 'panel0000'
  | 'panel0001'
  | 'panel0002'
  | 'panel0003'
  | 'panel0004'
  | 'panel0005'
  | 'panel0006'
  | 'panel0007';

type copyPanelsPayload = {
  panelIds: EntityId[];
  newPanelIds: EntityId[];
};

type Panel = {
  id: EntityId;
  panelCode: PanelCode;
};

export const panelAdapter = createEntityAdapter<Panel>();

const initialState: EntityState<Panel> = localStorage.getItem('panels')
  ? JSON.parse(localStorage.getItem('panels') as string)
  : panelAdapter.getInitialState();

const panelsSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    addPanel: panelAdapter.addOne,
    removePanel: panelAdapter.removeOne,
    removePanels: panelAdapter.removeMany,
    copyPanels: (
      state: EntityState<Panel>,
      action: PayloadAction<copyPanelsPayload>
    ) => {
      for (let i = 0; i < action.payload.panelIds.length; i++) {
        panelAdapter.addOne(state, {
          id: action.payload.newPanelIds[i],
          panelCode: state.entities[action.payload.panelIds[i]]
            ?.panelCode as PanelCode
        });
      }
    }
  }
});

export const {addPanel, removePanel, removePanels, copyPanels} =
  panelsSlice.actions;

export default panelsSlice.reducer;
