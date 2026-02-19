import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentSymbol } from '../store/features/stockSlice';
import { stockApi } from '../api';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [marketData, setMarketData] = useState({
    shComposite: { value: 3012.34, change: 0.58 },
    szComponent: { value: 9567.89, change: -0.23 },
    gem: { value: 2156.78, change: 1.12 },
    totalMarket: { value: 89.45 },
  });
  const [hotStocks, setHotStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotStocks();
    const interval = setInterval(fetchHotStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHotStocks = async () => {
    try {
      setLoading(true);
      const res = await stockApi.getStocks({ limit: 10 });
      const stocks = res.data.data.map((s: any) => ({
        symbol: s.symbol,
        name: s.name,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent,
        volume: s.volume,
      }));
      setHotStocks(stocks);
    } catch (error) {
      console.error('获取热门股票失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (vol: number) => {
    if (vol > 100000000) return (vol / 100000000).toFixed(2) + '亿';
    if (vol > 10000) return (vol / 10000).toFixed(2) + '万';
    return vol.toString();
  };

  const columns = [
    { title: '股票代码', dataIndex: 'symbol', render: (text: string) => <a onClick={() => dispatch(setCurrentSymbol(text))}>{text}</a> },
    { title: '名称', dataIndex: 'name' },
    { title: '价格', dataIndex: 'price', render: (text: number) => text?.toFixed(2) },
    { title: '涨跌额', dataIndex: 'change', render: (text: number) => (
      <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
        {text >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {text?.toFixed(2)}
      </span>
    )},
    { title: '涨幅', dataIndex: 'changePercent', render: (text: number) => (
      <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
        {text >= 0 ? '+' : ''}{text?.toFixed(2)}%
      </span>
    )},
    { title: '成交量', dataIndex: 'volume', render: (text: number) => formatVolume(text) },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card><Statistic title="上证指数" value={marketData.shComposite.value} precision={2} valueStyle={{ color: marketData.shComposite.change >= 0 ? '#cf1322' : '#3f8600' }} prefix={marketData.shComposite.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} suffix="%" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="深证成指" value={marketData.szComponent.value} precision={2} valueStyle={{ color: marketData.szComponent.change >= 0 ? '#cf1322' : '#3f8600' }} prefix={marketData.szComponent.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} suffix="%" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="创业板指" value={marketData.gem.value} precision={2} valueStyle={{ color: marketData.gem.change >= 0 ? '#cf1322' : '#3f8600' }} prefix={marketData.gem.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} suffix="%" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="沪深总市值" value={marketData.totalMarket.value} precision={2} valueStyle={{ color: '#1890ff' }} prefix="¥" suffix="万亿" /></Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="热门股票">
            <Table columns={columns} dataSource={hotStocks} pagination={false} rowKey="symbol" loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
