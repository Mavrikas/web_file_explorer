import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { filesSlice } from './filesSlice';

const rootReducer = combineReducers({
    files: filesSlice.reducer,
});

export const makeStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof makeStore.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof makeStore.dispatch;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
