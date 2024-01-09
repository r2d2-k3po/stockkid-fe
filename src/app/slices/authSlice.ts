import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken') || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateTokens: (_state: AuthState, action: PayloadAction<AuthState>) => {
      return action.payload;
    }
  }
});

export const {updateTokens} = authSlice.actions;

export default authSlice.reducer;
