import React, { useEffect } from 'react';
import { Card, Row, Col, Tabs, Typography, Divider } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentSymbol } from '../store/features/stockSlice';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const StockDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSymbol, realtimeData, klineData } = useAppSelector(state => state.stock);

  // 模拟K线数据
  const mockKlineData = [
    { date: '09:30', open: 10.00, high: 10.20, low: 9.95, close: 10.15, volume: 10000 },
    { date: '10:00', open: 10.15, high: 10.30, low: 10.10, close: 10.25, volume: 12000 },
    { date: '10:30', open: 10.25, high: 10.40, low: 10.20, close: 10.35, volume: 11000 },
    { date: '11:00', open: 10.35, high: 10.50, low: 10.30, close: 10.45, volume: 13000 },
    { date: '14:00', open: 10.45, high: 10.60, low: 10.40, close: 10.55, volume: 14000 },
    { date: '14:30', open: 10.55, high: 10.70, low: 10.50, close: 10.65, volume: 15000 },
    { date: '15:00', open: 10.65, high: 10.75, low: 10.60, close: 10.70, volume: 12000 },
  ];

  // 模拟分时数据
  const mockTimeData = [
    { time: '09:30', price: 10.00 },
    { time: '09:45', price: 10.05 },
    { time: '10:00', price: 10.10 },
    { time: '10:15', price: 10.15 },
    { time: '10:30', price: 10.20 },
    { time: '10:45', price: 10.25 },
    { time: '11:00', price: 10.30 },
    { time: '11:15', price: 10.28 },
    { time: '11:30', price: 10.32 },
    { time: '14:00', price: 10.35 },
    { time: '14:15', price: 10.40 },
    { time: '14:30', price: 10.45 },
    { time: '14:45', price: 10.50 },
    { time: '15:00', price: 10.55 },
  ];

  // 模拟技术指标
  const mockIndicators = {
    RSI: 65.4,
    MACD: { DIF: 0.23, DEA: 0.18, BAR: 0.05 },
    KDJ: { K: 75.2, D: 68.5, J: 82.1 },
  };

  return (
    <div>
      <Card title={`${currentSymbol || '股票代码'} - 个股详情`} extra={<Text type="secondary">实时更新</Text>}>
        <Row gutter={16}>
          <Col span={16}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="分时图" key="1">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#1890ff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab="日K线" key="2">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockKlineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#1890ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabPane>
              <TabPane tab="周K线" key="3">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockKlineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#1890ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={8}>
            <Card size="small" title="实时行情">
              <div style={{ marginBottom: 16 }}>
                <Text strong>当前价格:</Text>
                <Text style={{ marginLeft: 8, fontSize: 20, color: '#f5222d' }}>10.70</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>涨跌额:</Text>
                <Text style={{ marginLeft: 8, color: '#f5222d' }}>+0.70 (+7.00%)</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>昨收:</Text>
                <Text style={{ marginLeft: 8 }}>10.00</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>今开:</Text>
                <Text style={{ marginLeft: 8, color: '#f5222d' }}>10.05</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>最高:</Text>
                <Text style={{ marginLeft: 8, color: '#f5222d' }}>10.75</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>最低:</Text>
                <Text style={{ marginLeft: 8, color: '#52c41a' }}>10.00</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>成交量:</Text>
                <Text style={{ marginLeft: 8 }}>1,234,567</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>成交额:</Text>
                <Text style={{ marginLeft: 8 }}>¥1.23亿</Text>
              </div>
            </Card>

            <Divider />

            <Card size="small" title="技术指标">
              <div style={{ marginBottom: 8 }}>
                <Text>RSI(14):</Text>
                <Text style={{ marginLeft: 8 }}>{mockIndicators.RSI}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>MACD:</Text>
                <Text style={{ marginLeft: 8 }}>
                  DIF: {mockIndicators.MACD.DIF} DEA: {mockIndicators.MACD.DEA} BAR: {mockIndicators.MACD.BAR}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>KDJ:</Text>
                <Text style={{ marginLeft: 8 }}>
                  K: {mockIndicators.KDJ.K} D: {mockIndicators.KDJ.D} J: {mockIndicators.KDJ.J}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StockDetail;