import { Router, Request, Response } from 'express';
import News from '../models/News';

const router = Router();

// GET /api/news - 获取新闻列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, isHot, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    if (category) query.category = category;
    if (isHot === 'true') query.isHot = true;
    
    const news = await News.find(query)
      .sort({ publishTime: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await News.countDocuments(query);
    
    res.json({
      success: true,
      data: news,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取新闻失败', error });
  }
});

// GET /api/news/:id - 获取单条新闻
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '新闻不存在' });
    }
    
    // 增加浏览量
    news.viewCount = (news.viewCount || 0) + 1;
    await news.save();
    
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取新闻详情失败', error });
  }
});

// GET /api/news/suggest - 获取热门新闻
router.get('/suggest/hot', async (req: Request, res: Response) => {
  try {
    const hotNews = await News.find({ isHot: true })
      .sort({ viewCount: -1 })
      .limit(5);
    
    res.json({ success: true, data: hotNews });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取热门新闻失败', error });
  }
});

export default router;
