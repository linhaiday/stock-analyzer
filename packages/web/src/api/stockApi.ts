import { createAsyncThunk } from '@reduxjs/toolkit';
import { stockApi } from '../api';

// 获取实时数据
export const fetchRealtimeData = createAsyncThunk(
  'stock/fetchRealtimeData',
  async (symbols: string[], { rejectWithValue }) => {
    try {
      const response = await stockApi.getRealtimeData(symbols);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 获取K线数据
export const fetchKlineData = createAsyncThunk(
  'stock/fetchKlineData',
  async ({ symbol, period, limit }: { symbol: string; period: string; limit: number }, { rejectWithValue }) => {
    try {
      const response = await stockApi.getKlineData(symbol, period, limit);
      return { symbol, period, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 获取技术指标
export const fetchIndicators = createAsyncThunk(
  'stock/fetchIndicators',
  async ({ symbol, indicators }: { symbol: string; indicators: string[] }, { rejectWithValue }) => {
    try {
      const response = await stockApi.getIndicators(symbol, indicators);
      return { symbol, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);