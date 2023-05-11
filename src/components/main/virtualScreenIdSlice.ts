import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

interface virtualScreenIdState {
  uuidList: string[];
}

type moveScreenPayload = {
  currentIndex: number;
  targetIndex: number;
};

const initialState: virtualScreenIdState = {
  uuidList: localStorage.getItem('virtualScreenUuidList')
    ? JSON.parse(localStorage.getItem('virtualScreenUuidList') as string)
    : [uuidv4()]
};

const virtualScreenIdSlice = createSlice({
  name: 'virtualScreenId',
  initialState,
  reducers: {
    moveScreen: (
      state: virtualScreenIdState,
      action: PayloadAction<moveScreenPayload>
    ) => {
      const uuid = state.uuidList.splice(action.payload.currentIndex, 1);
      state.uuidList.splice(action.payload.targetIndex, 0, ...uuid);
    },
    addScreen: (state: virtualScreenIdState, action: PayloadAction<string>) => {
      state.uuidList.push(action.payload);
    },
    removeScreen: (
      state: virtualScreenIdState,
      action: PayloadAction<string>
    ) => {
      state.uuidList = state.uuidList.filter((uuid) => uuid !== action.payload);
    }
  }
});

export const {moveScreen, addScreen, removeScreen} =
  virtualScreenIdSlice.actions;

export default virtualScreenIdSlice.reducer;
