import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {panelTypes} from '../../components/main/Panel';
import {RootState} from '../store';

type copyPanelsPayload = {
  panelIds: string[];
  newPanelIds: string[];
};

type Panel = {
  id: string;
  panelCode: keyof typeof panelTypes;
};

const panelAdapter = createEntityAdapter<Panel>();

const initialState: EntityState<Panel> = localStorage.getItem('panels')
  ? JSON.parse(localStorage.getItem('panels') as string)
  : panelAdapter.getInitialState();

const panelsSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    addPanel: panelAdapter.addOne,
    removePanels: panelAdapter.removeMany,
    copyPanels: (
      state: EntityState<Panel>,
      action: PayloadAction<copyPanelsPayload>
    ) => {
      for (let i = 0; i < action.payload.panelIds.length; i++) {
        panelAdapter.addOne(state, {
          id: action.payload.newPanelIds[i],
          panelCode: state.entities[action.payload.panelIds[i]]
            ?.panelCode as keyof typeof panelTypes
        });
      }
    }
  }
});

export const {addPanel, removePanels, copyPanels} = panelsSlice.actions;

export default panelsSlice.reducer;

export const panelsSelectors = panelAdapter.getSelectors<RootState>(
  (state) => state.panels
);
