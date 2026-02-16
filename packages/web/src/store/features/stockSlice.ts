import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StockState {
  currentSymbol: string | null;
  realtimeData: Record<string, any>;
  klineData: Record<string, any[]>;
  indicators: Record<string, any>;
}

const initialState: StockState = {
  currentSymbol: null,
  realtimeData: {},
  klineData: {},
  indicators: {},
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setCurrentSymbol: (state, action: PayloadAction<string>) => {
      state.currentSymbol = action.payload;
    },
    updateRealtimeData: (state, action: PayloadAction<{ symbol: string; data: any }>) => {
      state.realtimeData[action.payload.symbol] = {
        ...state.realtimeData[action.payload.symbol],
        ...action.payload.data,
      };
    },
    setKlineData: (state, action: PayloadAction<{ symbol: string; period: string; data: any[] }>) => {
      const key = `${action.payload.symbol}_${action.payload.period}`;
      state.klineData[key] = action.payload.data;
    },
    setIndicators: (state, action: PayloadAction<{ symbol: string; indicators: any }>) => {
      state.indicators[action.payload.symbol] = action.payload.indicators;
    },
  },
});

export const { setCurrentSymbol, updateRealtimeData, setKlineData, setIndicators } = stockSlice.actions;
export default stockSlice.reducer;