import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WatchlistItem {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  addedAt: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  groups: Array<{
    id: string;
    name: string;
    items: string[]; // symbol array
  }>;
}

const initialState: WatchlistState = {
  items: [],
  groups: [
    { id: 'default', name: '默认自选', items: [] },
    { id: 'tech', name: '科技股', items: [] },
    { id: 'consumption', name: '消费股', items: [] },
  ],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      const exists = state.items.some(item => item.symbol === action.payload.symbol);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.symbol !== action.payload);
    },
    updateWatchlistItem: (state, action: PayloadAction<{ symbol: string; data: Partial<WatchlistItem> }>) => {
      const index = state.items.findIndex(item => item.symbol === action.payload.symbol);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    setGroups: (state, action: PayloadAction<WatchlistState['groups']>) => {
      state.groups = action.payload;
    },
    addToGroup: (state, action: PayloadAction<{ groupId: string; symbol: string }>) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group && !group.items.includes(action.payload.symbol)) {
        group.items.push(action.payload.symbol);
      }
    },
  },
});

export const { 
  addToWatchlist, 
  removeFromWatchlist, 
  updateWatchlistItem, 
  setGroups,
  addToGroup
} = watchlistSlice.actions;

export default watchlistSlice.reducer;