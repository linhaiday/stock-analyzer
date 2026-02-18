import { Router, Request, Response } from 'express';
import Alert from '../models/Alert';
import Stock from '../models/Stock';

const router = Router();

// GET /api/alerts - 获取预警列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { status, page = 1, limit = 20 } = req.query;
    
    const query: any = { userId };
    if (status === 'active') query.isActive = true;
    if (status === 'triggered') query.isTriggered = true;
    
    const alerts = await Alert.find(query)
      .sort({ createTime: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Alert.countDocuments(query);
    
    // 获取当前股票价格
    const alertsWithPrices = await Promise.all(
      alerts.map(async (alert) => {
        const stock = await Stock.findOne({ symbol: alert.symbol });
        return {
          ...alert.toObject(),
          currentPrice: stock?.price || 0,
        };
      })
    );
    
    res.json({
      success: true,
      data: alertsWithPrices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取预警列表失败', error });
  }
});

// POST /api/alerts - 创建预警
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { symbol, name, type, condition, targetValue, notifyMethod = 'app' } = req.body;
    
    if (!symbol || !name || !type || !condition || targetValue === undefined) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    const alert = new Alert({
      userId,
      symbol,
      name,
      type,
      condition,
      targetValue,
      notifyMethod,
      isActive: true,
      isTriggered: false,
    });
    
    await alert.save();
    
    res.json({ success: true, message: '预警创建成功', data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建预警失败', error });
  }
});

// PUT /api/alerts/:id - 更新预警
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { id } = req.params;
    const updates = req.body;
    
    const alert = await Alert.findOneAndUpdate(
      { _id: id, userId },
      { ...updates, isTriggered: false, triggerTime: undefined },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({ success: false, message: '预警不存在' });
    }
    
    res.json({ success: true, message: '更新成功', data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新预警失败', error });
  }
});

// DELETE /api/alerts/:id - 删除预警
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { id } = req.params;
    
    const result = await Alert.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: '预警不存在' });
    }
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除预警失败', error });
  }
});

// POST /api/alerts/:id/toggle - 切换预警状态
router.post('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'guest';
    const { id } = req.params;
    
    const alert = await Alert.findOne({ _id: id, userId });
    if (!alert) {
      return res.status(404).json({ success: false, message: '预警不存在' });
    }
    
    alert.isActive = !alert.isActive;
    await alert.save();
    
    res.json({ success: true, message: '状态切换成功', data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: '切换状态失败', error });
  }
});

// 检查预警触发（内部使用）
export async function checkAlerts(symbol: string, currentPrice: number) {
  try {
    const alerts = await Alert.find({ symbol, isActive: true, isTriggered: false });
    
    for (const alert of alerts) {
      let shouldTrigger = false;
      
      if (alert.type === 'price') {
        if (alert.condition === 'above' && currentPrice >= alert.targetValue) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetValue) {
          shouldTrigger = true;
        }
      }
      
      if (shouldTrigger) {
        alert.isTriggered = true;
        alert.triggerTime = new Date();
        await alert.save();
        
        // TODO: 发送通知
        console.log(`Alert triggered: ${alert.name} at ${currentPrice}`);
      }
    }
  } catch (error) {
    console.error('Check alerts error:', error);
  }
}

export default router;
