import {configureStore} from '@reduxjs/toolkit';
import virtualScreenIdReducer from './slices/virtualScreenIdSlice';
import screenPanelMapReducer from './slices/screenPanelMapSlice';
import screenLayoutsMapReducer from './slices/screenLayoutsMapSlice';
import logger from 'redux-logger';
import {api} from './api';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    virtualScreenId: virtualScreenIdReducer,
    screenPanelMap: screenPanelMapReducer,
    screenLayoutsMap: screenLayoutsMapReducer,
    [api.reducerPath]: api.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'screenPanelMap.uuidPanelMap',
          'screenLayoutsMap.uuidLayoutsMap'
        ]
      }
    }).concat([logger, api.middleware])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
