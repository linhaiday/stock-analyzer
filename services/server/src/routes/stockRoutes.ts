import express, { Router, Request, Response } from 'express';
import { StockController } from '../controllers/StockController';

export const setupStockRoutes = (): Router => {
  const router = express.Router();
  
  router.get('/search', StockController.searchStocks);
  router.post('/realtime', StockController.getRealtimeData);
  router.get('/:symbol/kline', StockController.getKlineData);
  router.get('/:symbol/indicators', StockController.getIndicators);
  router.get('/:symbol/profile', StockController.getCompanyProfile);
  router.get('/:symbol/financials', StockController.getFinancialData);

  return router;
};