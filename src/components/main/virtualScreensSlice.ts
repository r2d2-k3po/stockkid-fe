import {createSlice} from '@reduxjs/toolkit';
import VirtualScreen from './VirtualScreen';

export type virtualScreenType = ReturnType<typeof VirtualScreen>;
export type virtualScreensState = virtualScreenType[];

export const virtualScreensSlice = createSlice({
  name: 'virtualScreens',
  initialState: [],
  reducers: {}
});
