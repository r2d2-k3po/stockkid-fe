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
    updateTokens: (state: AuthState, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
    updateRefreshToken: (
      state: AuthState,
      action: PayloadAction<string | null>
    ) => {
      state.refreshToken = action.payload;
    }
  }
});

export const {updateTokens, updateRefreshToken} = authSlice.actions;

export default authSlice.reducer;
