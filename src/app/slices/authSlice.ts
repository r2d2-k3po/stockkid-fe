import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {User} from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = localStorage.getItem('authState')
  ? JSON.parse(localStorage.getItem('authState') as string)
  : {
      user: null,
      token: null
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  }
});

export const {setCredentials} = authSlice.actions;

export default authSlice.reducer;
