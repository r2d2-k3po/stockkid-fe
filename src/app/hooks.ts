import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from './store';
import {screenAdapter} from './slices/screensSlice';
import {panelAdapter} from './slices/panelsSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const screensSelectors = screenAdapter.getSelectors<RootState>(
  (state) => state.screens
);
export const panelsSelectors = panelAdapter.getSelectors<RootState>(
  (state) => state.panels
);
