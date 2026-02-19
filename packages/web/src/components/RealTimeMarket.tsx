import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Space, Tabs, Statistic, Row, Col, Input, Button, message } from 'antd';
import { RiseOutlined, FallOutlined, StockOutlined, FireOutlined, ReloadOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { addToWatchlist, WatchlistItem } from '../store/features/watchlistSlice';
import { stockApi } from '../api';

const { TabPane } = Tabs;
const { Search } = Input;

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  category: string;
}

const RealTimeMarket: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchStocks = async () => {
    try {
      const category = activeTab === 'all' ? undefined : activeTab;
      const res = await stockApi.getStocks({ category, limit: 50 });
      setStockData(res.data.data || []);
    } catch (error) {
      console.error('获取股票失败:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStocks().finally(() => {
      setLoading(false);
      message.success('已刷新');
    });
  };

  const handleAddToWatchlist = (record: StockData) => {
    const item: WatchlistItem = {
      symbol: record.symbol,
      name: record.name,
      price: record.price,
      change: record.change,
      changePercent: record.changePercent,
      addedAt: new Date().toISOString().split('T')[0],
    };
    dispatch(addToWatchlist(item));
    message.success(`已添加 ${record.name}`);
  };

  const filteredData = stockData.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  const stats = {
    up: stockData.filter(s => s.changePercent > 0).length,
    down: stockData.filter(s => s.changePercent < 0).length,
    flat: stockData.filter(s => s.changePercent === 0).length,
  };

  const columns = [
    { title: '代码', dataIndex: 'symbol', render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span> },
    { title: '名称', dataIndex: 'name', render: (text: string, record: StockData) => (
      <Space><a onClick={() => navigate(`/stock/${record.symbol}`)}>{text}</a>{record.changePercent > 5 && <Tag color="red" icon={<FireOutlined />}>热门</Tag>}</Space>
    )},
    { title: '最新价', dataIndex: 'price', render: (price: number, record: StockData) => (
      <span style={{ color: record.changePercent > 0 ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}>{price?.toFixed(2)}</span>
    )},
    { title: '涨跌幅', dataIndex: 'changePercent', render: (percent: number) => (
      <span style={{ color: percent >= 0 ? '#cf1322' : '#3f8600' }}>
        {percent >= 0 ? <RiseOutlined /> : <FallOutlined />} {percent >= 0 ? '+' : ''}{percent?.toFixed(2)}%
      </span>
    )},
    { title: '成交量', dataIndex: 'volume', render: (vol: number) => (vol / 10000).toFixed(2) + '万' },
    { title: '操作', key: 'action', render: (_: any, record: StockData) => (
      <Space>
        <Button type="text" icon={<StarOutlined />} onClick={() => handleAddToWatchlist(record)} title="添加自选" />
        <Button type="primary" size="small" onClick={() => navigate(`/stock/${record.symbol}`)}>详情</Button>
      </Space>
    )},
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}><Card><Statistic title="上涨" value={stats.up} valueStyle={{ color: '#cf1322' }} prefix={<RiseOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="下跌" value={stats.down} valueStyle={{ color: '#3f8600' }} prefix={<FallOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="平盘" value={stats.flat} valueStyle={{ color: '#999' }} prefix={<StockOutlined />} /></Card></Col>
      </Row>
      <Card title="实时行情" style={{ marginTop: 16 }} extra={
        <Space>
          <Search placeholder="搜索股票" allowClear onSearch={setSearchText} style={{ width: 200 }} />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>刷新</Button>
        </Space>
      }>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {['all', 'A股', '港股', '美股'].map(cat => (
            <TabPane tab={cat === 'all' ? '全部' : cat} key={cat}>
              <Table columns={columns} dataSource={filteredData} rowKey="symbol" pagination={{ pageSize: 10 }} loading={loading} scroll={{ x: 800 }} />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default RealTimeMarket;
