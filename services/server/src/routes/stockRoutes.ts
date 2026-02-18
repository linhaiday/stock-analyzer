import { Router, Request, Response } from 'express';
import Stock from '../models/Stock';
import { generateMockStockData } from '../services/stockService';

const router = Router();

// GET /api/stocks - 获取股票列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = category ? { category } : {};
    
    const stocks = await Stock.find(query)
      .sort({ updatedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Stock.countDocuments(query);
    
    res.json({
      success: true,
      data: stocks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取股票列表失败', error });
  }
});

// GET /api/stocks/:symbol - 获取单只股票详情
router.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol });
    
    if (!stock) {
      return res.status(404).json({ success: false, message: '股票不存在' });
    }
    
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取股票详情失败', error });
  }
});

// GET /api/stocks/:symbol/kline - 获取K线数据
router.get('/:symbol/kline', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { period = 'day', limit = 100 } = req.query;
    
    // 生成模拟K线数据
    const klineData = generateMockKlineData(symbol, period as string, Number(limit));
    
    res.json({ success: true, data: klineData });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取K线数据失败', error });
  }
});

// GET /api/stocks/market/overview - 获取大盘概览
router.get('/market/overview', async (req: Request, res: Response) => {
  try {
    // 获取主要指数
    const indices = await Stock.find({ category: '指数' }).limit(5);
    
    // 统计数据
    const totalStocks = await Stock.countDocuments();
    const upStocks = await Stock.countDocuments({ change: { $gt: 0 } });
    const downStocks = await Stock.countDocuments({ change: { $lt: 0 } });
    
    res.json({
      success: true,
      data: {
        indices,
        stats: {
          total: totalStocks,
          up: upStocks,
          down: downStocks,
          flat: totalStocks - upStocks - downStocks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取大盘概览失败', error });
  }
});

// 生成模拟K线数据
function generateMockKlineData(symbol: string, period: string, limit: number) {
  const data = [];
  const basePrice = Math.random() * 100 + 10;
  let currentPrice = basePrice;
  
  const now = new Date();
  for (let i = limit; i > 0; i--) {
    const date = new Date(now.getTime() - i * (period === 'day' ? 86400000 : 3600000));
    const change = (Math.random() - 0.5) * 0.1;
    const open = currentPrice;
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000);
    
    data.push({
      date: date.toISOString(),
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
}

export default router;
