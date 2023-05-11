import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

interface virtualScreenIdState {
  uuidList: string[];
}

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
      action: PayloadAction<virtualScreenIdState>
    ) => {
      return action.payload;
    },
    addScreen: (state: virtualScreenIdState, action: PayloadAction<string>) => {
      state.uuidList.push(action.payload);
    },
    removeScreen: (
      state: virtualScreenIdState,
      action: PayloadAction<string>
    ) => {
      const newUuidList = state.uuidList.filter(
        (uuid) => uuid !== action.payload
      );
      state.uuidList = newUuidList;
    }
  }
});

export const {moveScreen, addScreen, removeScreen} =
  virtualScreenIdSlice.actions;

export default virtualScreenIdSlice.reducer;
