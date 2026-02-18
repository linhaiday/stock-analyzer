import { Router, Request, Response } from 'express';
import Watchlist from '../models/Watchlist';
import Stock from '../models/Stock';

const router = Router();

// GET /api/watchlist - 获取用户自选股
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { groupId } = req.query;
    
    const query: any = { userId };
    if (groupId) query.groupId = groupId;
    
    const watchlist = await Watchlist.find(query).sort({ addedAt: -1 });
    
    // 获取最新的股票价格
    const watchlistWithPrices = await Promise.all(
      watchlist.map(async (item) => {
        const stock = await Stock.findOne({ symbol: item.symbol });
        return {
          ...item.toObject(),
          price: stock?.price || 0,
          change: stock?.change || 0,
          changePercent: stock?.changePercent || 0,
        };
      })
    );
    
    res.json({ success: true, data: watchlistWithPrices });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取自选股失败', error });
  }
});

// POST /api/watchlist - 添加自选股
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { symbol, name, groupId = 'default', notes = '' } = req.body;
    
    if (!symbol || !name) {
      return res.status(400).json({ success: false, message: '股票代码和名称不能为空' });
    }
    
    // 检查是否已存在
    const existing = await Watchlist.findOne({ userId, symbol });
    if (existing) {
      return res.status(400).json({ success: false, message: '该股票已在自选股中' });
    }
    
    const watchlistItem = new Watchlist({
      userId,
      symbol,
      name,
      groupId,
      notes,
    });
    
    await watchlistItem.save();
    
    res.json({ success: true, message: '添加成功', data: watchlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: '添加自选股失败', error });
  }
});

// DELETE /api/watchlist/:symbol - 删除自选股
router.delete('/:symbol', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { symbol } = req.params;
    
    const result = await Watchlist.findOneAndDelete({ userId, symbol });
    
    if (!result) {
      return res.status(404).json({ success: false, message: '自选股不存在' });
    }
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除自选股失败', error });
  }
});

// PUT /api/watchlist/:symbol/notes - 更新自选股备注
router.put('/:symbol/notes', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { symbol } = req.params;
    const { notes } = req.body;
    
    const result = await Watchlist.findOneAndUpdate(
      { userId, symbol },
      { notes },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ success: false, message: '自选股不存在' });
    }
    
    res.json({ success: true, message: '更新成功', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新备注失败', error });
  }
});

export default router;
