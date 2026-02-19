import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined } from '@ant-design/icons';
import { stockApi } from '../api';

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketOverview();
  }, []);

  const fetchMarketOverview = async () => {
    setLoading(true);
    try {
      const response = await stockApi.getMarketOverview();
      setMarketData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const marketIndices = marketData?.indices || [
    { name: '上证指数', value: 3012.34, change: 15.23, changePercent: 0.51 },
    { name: '深证成指', value: 9567.89, change: -23.45, changePercent: -0.24 },
    { name: '创业板指', value: 2156.78, change: 8.67, changePercent: 0.40 },
    { name: '科创50', value: 876.54, change: -5.43, changePercent: -0.62 },
  ];

  const topGainers = marketData?.topGainers || [
    { symbol: '000001', name: '平安银行', price: 12.34, changePercent: 9.98 },
    { symbol: '600036', name: '招商银行', price: 34.56, changePercent: 8.76 },
    { symbol: '000002', name: '万科A', price: 23.45, changePercent: 7.54 },
  ];

  const topLosers = marketData?.topLosers || [
    { symbol: '601318', name: '中国平安', price: 45.67, changePercent: -5.43 },
    { symbol: '000858', name: '五粮液', price: 167.89, changePercent: -4.21 },
    { symbol: '000568', name: '泸州老窖', price: 123.45, changePercent: -3.87 },
  ];

  const columns = [
    { title: '股票代码', dataIndex: 'symbol', key: 'symbol', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (v: number) => v?.toFixed(2) },
    {
      title: '涨幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (v: number) => (
        <span style={{ color: v >= 0 ? '#f5222d' : '#52c41a' }}>
          {v >= 0 ? '+' : ''}{v?.toFixed(2)}%
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2><LineChartOutlined /> 市场分析</h2>
      
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      
      <Row gutter={16}>
        {marketIndices.map((index: any, i: number) => (
          <Col span={6} key={i}>
            <Card>
              <Statistic
                title={index.name}
                value={index.value}
                precision={2}
                valueStyle={{ color: index.change >= 0 ? '#f5222d' : '#52c41a' }}
                prefix={index.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="%"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                {index.change >= 0 ? '+' : ''}{index.change?.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent?.toFixed(2)}%)
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="涨幅榜" headStyle={{ color: '#f5222d' }}>
            <Table
              columns={columns}
              dataSource={topGainers}
              pagination={false}
              rowKey="symbol"
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="跌幅榜" headStyle={{ color: '#52c41a' }}>
            <Table
              columns={columns}
              dataSource={topLosers}
              pagination={false}
              rowKey="symbol"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analysis;
