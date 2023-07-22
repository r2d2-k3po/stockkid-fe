import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface User {
  username: string;
}

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  }
});

export const {updateToken} = authSlice.actions;

export default authSlice.reducer;
