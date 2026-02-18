import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import stockRoutes from './routes/stockRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import alertRoutes from './routes/alertRoutes';
import newsRoutes from './routes/newsRoutes';
import { updateStockPrices, generateMockStockData } from './services/stockService';
import { checkAlerts } from './routes/alertRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Express 中间件
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/news', newsRoutes);

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// WebSocket 连接处理
wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // 发送初始欢迎消息
  ws.send(JSON.stringify({ type: 'connection', message: 'WebSocket connected' }));
});

// 广播股票价格更新
const broadcastStockPrices = async () => {
  try {
    const Stock = require('./models/Stock').default;
    const stocks = await Stock.find({}, 'symbol name price change changePercent').
limit(50);
    
    const message = JSON.stringify({
      type: 'stockUpdate',
      data: stocks,
      timestamp: new Date().toISOString(),
    });

    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // 检查预警
    for (const stock of stocks) {
      checkAlerts(stock.symbol, stock.price);
    }
  } catch (error) {
    console.error('Broadcast stock prices error:', error);
  }
};

// 连接数据库并启动服务
const startServer = async () => {
  try {
    await connectDB();

    // 生成初始模拟数据
    await generateMockStockData();

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket is available at ws://localhost:${PORT}/ws`);
    });

    // 定时更新股票价格（每3秒）
    setInterval(async () => {
      await updateStockPrices();
      await broadcastStockPrices();
    }, 3000);

    // 定时重新生成模拟数据（每5分钟）
    setInterval(async () => {
      await generateMockStockData();
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
