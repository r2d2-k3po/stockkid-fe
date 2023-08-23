import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {api} from './api';
import authReducer from './slices/authSlice';
import screensReducer from './slices/screensSlice';
import panelsReducer from './slices/panelsSlice';

const store = configureStore({
  reducer: {
    screens: screensReducer,
    panels: panelsReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([logger, api.middleware])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
