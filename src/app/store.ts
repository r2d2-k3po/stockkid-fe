import {configureStore} from '@reduxjs/toolkit';
import virtualScreenIdReducer from './virtualScreenIdSlice';
import screenPanelMapReducer from './screenPanelMapSlice';
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    virtualScreenId: virtualScreenIdReducer,
    screenPanelMap: screenPanelMapReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
