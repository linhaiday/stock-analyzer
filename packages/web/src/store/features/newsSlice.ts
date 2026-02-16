import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishTime: string;
  importance: 'high' | 'medium' | 'low';
  relatedSymbols: string[];
}

interface NewsState {
  items: NewsItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  categories: ['全部', '个股', '大盘', '行业', '政策'],
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchNewsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNewsSuccess: (state, action: PayloadAction<NewsItem[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchNewsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNewsItem: (state, action: PayloadAction<NewsItem>) => {
      state.items.unshift(action.payload);
    },
    updateNewsCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    clearNews: (state) => {
      state.items = [];
    },
  },
});

export const { 
  fetchNewsStart, 
  fetchNewsSuccess, 
  fetchNewsFailure, 
  addNewsItem, 
  updateNewsCategories,
  clearNews
} = newsSlice.actions;

export default newsSlice.reducer;