import Stock from '../models/Stock';

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
