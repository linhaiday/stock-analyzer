import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import StockDetail from './components/StockDetail';
import Watchlist from './components/Watchlist';
import Analysis from './components/Analysis';
import News from './components/News';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;