import Stock from '../models/Stock';
import Watchlist from '../models/Watchlist';
import News from '../models/News';
import Alert from '../models/Alert';

export async function generateMockStockData() {
  const stocks = [
    { symbol: '000001', name: '平安银行', category: 'A股', basePrice: 12 },
    { symbol: '000002', name: '万科A', category: 'A股', basePrice: 23 },
    { symbol: '600036', name: '招商银行', category: 'A股', basePrice: 34 },
    { symbol: '601318', name: '中国平安', category: 'A股', basePrice: 45 },
    { symbol: '600519', name: '贵州茅台', category: 'A股', basePrice: 168 },
    { symbol: '00700', name: '腾讯控股', category: '港股', basePrice: 320 },
    { symbol: '09988', name: '阿里巴巴', category: '港股', basePrice: 85 },
    { symbol: 'AAPL', name: 'Apple', category: '美股', basePrice: 180 },
    { symbol: 'TSLA', name: 'Tesla', category: '美股', basePrice: 240 },
    { symbol: 'NVDA', name: 'NVIDIA', category: '美股', basePrice: 460 },
  ];

  const now = new Date();
  for (const stock of stocks) {
    const changePercent = (Math.random() - 0.5) * 5;
    const price = stock.basePrice * (1 + changePercent / 100);
    const prevClose = stock.basePrice;
    const change = price - prevClose;

    await Stock.findOneAndUpdate(
      { symbol: stock.symbol },
      {
        name: stock.name,
        category: stock.category,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        prevClose: parseFloat(prevClose.toFixed(2)),
        open: parseFloat((prevClose * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
        high: parseFloat((price * (1 + Math.random() * 0.03)).toFixed(2)),
        low: parseFloat((price * (1 - Math.random() * 0.03)).toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 500000,
        turnover: Math.floor(Math.random() * 500000000),
        pe: parseFloat((Math.random() * 30 + 8).toFixed(2)),
        pb: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        marketCap: Math.floor(Math.random() * 1000000000000) + 50000000000,
        updatedAt: now,
      },
      { upsert: true, new: true }
    );
  }
}

export async function updateStockPrices() {
  const stocks = await Stock.find({});
  for (const stock of stocks) {
    const fluctuation = (Math.random() - 0.5) * 0.005;
    const newPrice = stock.price * (1 + fluctuation);
    const change = newPrice - stock.prevClose;
    const changePercent = (change / stock.prevClose) * 100;
    stock.price = parseFloat(newPrice.toFixed(2));
    stock.change = parseFloat(change.toFixed(2));
    stock.changePercent = parseFloat(changePercent.toFixed(2));
    stock.updatedAt = new Date();
    await stock.save();
  }
}

// 生成模拟自选股数据
export async function generateMockWatchlistData() {
  const count = await Watchlist.countDocuments();
  if (count > 0) return;

  const mockWatchlist = [
    { symbol: '000001', name: '平安银行', groupId: 'default' },
    { symbol: '000002', name: '万科A', groupId: 'default' },
    { symbol: '600036', name: '招商银行', groupId: 'default' },
    { symbol: '601318', name: '中国平安', groupId: 'tech' },
    { symbol: '600519', name: '贵州茅台', groupId: 'consumption' },
  ];

  for (const item of mockWatchlist) {
    await Watchlist.findOneAndUpdate(
      { symbol: item.symbol },
      { userId: 'guest', ...item, addedAt: new Date() },
      { upsert: true }
    );
  }
}

// 生成模拟新闻数据
export async function generateMockNewsData() {
  const count = await News.countDocuments();
  if (count > 0) return;

  const mockNews = [
    {
      title: '央行降准释放流动性，股市有望迎来上涨',
      summary: '央行宣布下调存款准备金率0.25个百分点，释放长期资金约5000亿元，利好金融板块',
      content: '详细报道内容...',
      source: '财经日报',
      category: '政策',
      importance: 'high',
      viewCount: 1250,
      publishTime: new Date(),
      relatedSymbols: ['000001', '600036'],
    },
    {
      title: '新能源汽车销量持续增长，相关股票受关注',
      summary: '新能源汽车销量同比增长35%，产业链相关企业业绩向好',
      content: '详细报道内容...',
      source: '证券时报',
      category: '行业',
      importance: 'medium',
      viewCount: 850,
      publishTime: new Date(Date.now() - 3600000),
      relatedSymbols: ['TSLA', 'AAPL'],
    },
    {
      title: '平安银行发布年报，净利润稳步增长',
      summary: '平安银行2023年度财报显示，净利润同比增长12.3%',
      content: '详细报道内容...',
      source: '公司公告',
      category: '个股',
      importance: 'high',
      viewCount: 5600,
      publishTime: new Date(Date.now() - 7200000),
      relatedSymbols: ['000001'],
    },
    {
      title: '大盘震荡调整，投资者关注持股策略',
      summary: '今日A股市场震荡调整，个股分化明显',
      content: '详细报道内容...',
      source: '新浪财经',
      category: '大盘',
      importance: 'medium',
      viewCount: 320,
      publishTime: new Date(Date.now() - 10800000),
      relatedSymbols: ['00700', '09988'],
    },
  ];

  for (const news of mockNews) {
    await News.create(news);
  }
}

// 生成模拟预警数据
export async function generateMockAlertsData() {
  const count = await Alert.countDocuments();
  if (count > 0) return;

  const mockAlerts = [
    {
      userId: 'guest',
      symbol: '000001',
      name: '平安银行',
      type: 'price',
      condition: 'above',
      targetValue: 15,
      isActive: true,
      isTriggered: false,
      notifyMethod: 'app',
    },
    {
      userId: 'guest',
      symbol: '000002',
      name: '万科A',
      type: 'percent',
      condition: 'below',
      targetValue: -5,
      isActive: true,
      isTriggered: false,
      notifyMethod: 'app',
    },
    {
      userId: 'guest',
      symbol: '600036',
      name: '招商银行',
      type: 'price',
      condition: 'above',
      targetValue: 40,
      isActive: false,
      isTriggered: false,
      notifyMethod: 'app',
    },
  ];

  for (const alert of mockAlerts) {
    await Alert.create(alert);
  }
}
