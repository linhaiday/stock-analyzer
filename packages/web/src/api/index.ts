import axios from 'axios';

// 自动获取当前服务器IP（使用相对路径或 window.location）
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:3001/api`;
};

const API_BASE_URL = getBaseUrl();

// Axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 股票相关API
export const stockApi = {
  // 获取股票列表
  getStocks: (params?: { category?: string; page?: number; limit?: number }) => {
    return apiClient.get('/stocks', { params });
  },
  // 获取单只股票详情
  getStockDetail: (symbol: string) => {
    return apiClient.get(`/stocks/${symbol}`);
  },
  // 获取K线数据
  getKlineData: (symbol: string, params?: { period?: string; limit?: number }) => {
    return apiClient.get(`/stocks/${symbol}/kline`, { params });
  },
  // 获取大盘概览
  getMarketOverview: () => {
    return apiClient.get('/stocks/market/overview');
  },
  // 搜索股票
  searchStocks: (keyword: string) => {
    return apiClient.get('/stocks/search', { params: { keyword } });
  },
};

// 自选股相关API
export const watchlistApi = {
  // 获取用户自选股
  getUserWatchlist: () => {
    return apiClient.get('/watchlist');
  },
  // 添加自选股
  addToWatchlist: (symbol: string, name: string, groupId?: string, notes?: string) => {
    return apiClient.post('/watchlist', { symbol, name, groupId, notes });
  },
  // 删除自选股
  removeFromWatchlist: (symbol: string) => {
    return apiClient.delete(`/watchlist/${symbol}`);
  },
  // 更新自选股备注
  updateWatchlistNotes: (symbol: string, notes: string) => {
    return apiClient.put(`/watchlist/${symbol}/notes`, { notes });
  },
};

// 预警相关API
export const alertApi = {
  // 获取预警列表
  getAlerts: () => {
    return apiClient.get('/alerts');
  },
  // 创建预警
  createAlert: (data: { symbol: string; name: string; type: 'price' | 'percent' | 'volume'; condition: 'above' | 'below'; targetValue: number; }) => {
    return apiClient.post('/alerts', data);
  },
  // 删除预警
  deleteAlert: (id: string) => {
    return apiClient.delete(`/alerts/${id}`);
  },
  // 切换预警状态
  toggleAlert: (id: string) => {
    return apiClient.post(`/alerts/${id}/toggle`);
  },
};

// 资讯相关API
export const newsApi = {
  // 获取资讯列表
  getNewsList: (params?: { category?: string; limit?: number; offset?: number }) => {
    return apiClient.get('/news', { params });
  },
  // 获取个股资讯
  getStockNews: (symbol: string, limit: number = 10) => {
    return apiClient.get('/news', { params: { symbols: [symbol], limit } });
  },
};

export default apiClient;
