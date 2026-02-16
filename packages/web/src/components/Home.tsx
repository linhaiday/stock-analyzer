import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchRealtimeData } from '../api/stockApi';
import { setCurrentSymbol } from '../store/features/stockSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { realtimeData } = useAppSelector(state => state.stock);

  // 模拟一些热门股票数据
  const hotStocks = [
    { symbol: '000001', name: '平安银行', price: 12.34, change: 0.12, changePercent: 0.98, volume: '1.2亿' },
    { symbol: '600036', name: '招商银行', price: 34.56, change: -0.23, changePercent: -0.66, volume: '0.8亿' },
    { symbol: '000002', name: '万科A', price: 23.45, change: 0.45, changePercent: 1.96, volume: '0.6亿' },
    { symbol: '601318', name: '中国平安', price: 45.67, change: -0.34, changePercent: -0.74, volume: '1.5亿' },
    { symbol: '000858', name: '五粮液', price: 167.89, change: 2.34, changePercent: 1.41, volume: '0.4亿' },
  ];

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <a onClick={() => dispatch(setCurrentSymbol(text))}>{text}</a>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => <span>{text.toFixed(2)}</span>,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      render: (text: number) => (
        <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
          {text >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {text.toFixed(2)}
        </span>
      ),
    },
    {
      title: '涨幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (text: number) => (
        <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
          {text >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {text.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="上证指数"
              value={3012.34}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="深证成指"
              value={9567.89}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="创业板指"
              value={2156.78}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="沪深总市值"
              value={89.45}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
              suffix="万亿"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="热门股票">
            <Table 
              columns={columns} 
              dataSource={hotStocks} 
              pagination={false}
              rowKey="symbol"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;