import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

interface virtualScreenIdState {
  uuidList: string[];
}

const initialState: virtualScreenIdState = {
  uuidList: [uuidv4()]
};

const virtualScreenIdSlice = createSlice({
  name: 'virtualScreenId',
  initialState,
  reducers: {
    set: (
      state: virtualScreenIdState,
      action: PayloadAction<virtualScreenIdState>
    ) => {
      return action.payload;
    },
    add: (state: virtualScreenIdState, action: PayloadAction<string>) => {
      state.uuidList.push(action.payload);
    },
    remove: (state: virtualScreenIdState, action: PayloadAction<string>) => {
      state.uuidList.filter((uuid) => uuid !== action.payload);
      return state;
    }
  }
});

export const {set, add, remove} = virtualScreenIdSlice.actions;

export default virtualScreenIdSlice.reducer;
