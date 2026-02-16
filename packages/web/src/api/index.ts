import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// 股票相关API
export const stockApi = {
  // 获取实时行情
  getRealtimeData: (symbols: string[]) => {
    return axios.post(`${API_BASE_URL}/stocks/realtime`, { symbols });
  },

  // 获取K线数据
  getKlineData: (symbol: string, period: string, limit: number = 100) => {
    return axios.get(`${API_BASE_URL}/stocks/${symbol}/kline`, {
      params: { period, limit }
    });
  },

  // 获取技术指标
  getIndicators: (symbol: string, indicators: string[]) => {
    return axios.get(`${API_BASE_URL}/stocks/${symbol}/indicators`, {
      params: { indicators: indicators.join(',') }
    });
  },

  // 搜索股票
  searchStocks: (keyword: string) => {
    return axios.get(`${API_BASE_URL}/stocks/search`, {
      params: { keyword }
    });
  }
};

// 自选股相关API
export const watchlistApi = {
  // 获取用户自选股
  getUserWatchlist: (userId: string) => {
    return axios.get(`${API_BASE_URL}/watchlist/${userId}`);
  },

  // 添加自选股
  addToWatchlist: (userId: string, symbol: string) => {
    return axios.post(`${API_BASE_URL}/watchlist/${userId}`, { symbol });
  },

  // 删除自选股
  removeFromWatchlist: (userId: string, symbol: string) => {
    return axios.delete(`${API_BASE_URL}/watchlist/${userId}/${symbol}`);
  }
};

// 资讯相关API
export const newsApi = {
  // 获取资讯列表
  getNewsList: (params: { category?: string; symbols?: string[]; limit?: number; offset?: number }) => {
    return axios.get(`${API_BASE_URL}/news`, { params });
  },

  // 获取个股资讯
  getStockNews: (symbol: string, limit: number = 10) => {
    return axios.get(`${API_BASE_URL}/news/stock/${symbol}`, { params: { limit } });
  },

  // 获取重要公告
  getAnnouncements: (symbol: string) => {
    return axios.get(`${API_BASE_URL}/news/announcements/${symbol}`);
  }
};