import { configureStore } from '@reduxjs/toolkit';
import fullTextsReducer from './fullTextsSlice';
import summariesReducer from './summariesSlice';

export const store = configureStore({
  reducer: {
    summaries: summariesReducer,
    fullTexts: fullTextsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
