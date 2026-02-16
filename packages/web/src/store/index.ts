import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './features/stockSlice';
import watchlistReducer from './features/watchlistSlice';
import newsReducer from './features/newsSlice';

export const store = configureStore({
  reducer: {
    stock: stockReducer,
    watchlist: watchlistReducer,
    news: newsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;