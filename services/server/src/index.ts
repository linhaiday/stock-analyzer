import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { setupStockRoutes } from './routes/stockRoutes';
import { setupNewsRoutes } from './routes/newsRoutes';
import { setupWatchlistRoutes } from './routes/watchlistRoutes';
import { setupWebSocket } from './websocket';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/stocks', setupStockRoutes());
app.use('/api/news', setupNewsRoutes());
app.use('/api/watchlist', setupWatchlistRoutes());

// WebSocket
setupWebSocket(io);

// 错误处理
app.use(errorHandler);

// 数据库连接
connectDB();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});