import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppLayout from './components/Layout';
import Home from './components/Home';
import StockDetail from './components/StockDetail';
import Watchlist from './components/Watchlist';
import Analysis from './components/Analysis';
import PriceAlerts from './components/PriceAlerts';
import News from './components/News';
import RealTimeMarket from './components/RealTimeMarket';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/market" element={<AppLayout><RealTimeMarket /></AppLayout>} />
          <Route path="/analysis" element={<AppLayout><Analysis /></AppLayout>} />
          <Route path="/watchlist" element={<AppLayout><Watchlist /></AppLayout>} />
          <Route path="/alerts" element={<AppLayout><PriceAlerts /></AppLayout>} />
          <Route path="/news" element={<AppLayout><News /></AppLayout>} />
          <Route path="/stock/:symbol" element={<AppLayout><StockDetail /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
