import React, { useState } from 'react';
import { Card, Table, DatePicker, Select, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppSelector } from '../hooks';
import { NewsItem } from '../store/features/newsSlice';

const { RangePicker } = DatePicker;
const { Option } = Select;

const News: React.FC = () => {
  const { items: newsItems, categories, loading } = useAppSelector(state => state.news);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [dateRange, setDateRange] = useState<any>(null);

  // 模拟新闻数据
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: '央行降准释放流动性，股市有望迎来上涨',
      summary: '央行宣布下调存款准备金率0.25个百分点，释放长期资金约5000亿元...',
      content: '',
      source: '财经日报',
      publishTime: '2024-01-15 09:30:00',
      importance: 'high',
      relatedSymbols: ['000001', '600036'],
    },
    {
      id: '2',
      title: '新能源汽车销量持续增长，相关股票受关注',
      summary: '根据最新数据显示，新能源汽车销量同比增长35%，产业链相关企业业绩向好...',
      content: '',
      source: '证券时报',
      publishTime: '2024-01-15 10:15:00',
      importance: 'medium',
      relatedSymbols: ['002594', '002120'],
    },
    {
      id: '3',
      title: '平安银行发布年报，净利润稳步增长',
      summary: '平安银行2023年度财报显示，净利润同比增长12.3%，资产质量保持稳定...',
      content: '',
      source: '公司公告',
      publishTime: '2024-01-15 11:00:00',
      importance: 'high',
      relatedSymbols: ['000001'],
    },
  ];

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: NewsItem) => (
        <Space>
          <a>{text}</a>
          {record.importance === 'high' && <Tag color="red">重要</Tag>}
          {record.importance === 'medium' && <Tag color="orange">一般</Tag>}
        </Space>
      ),
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
    },
    {
      title: '关联股票',
      dataIndex: 'relatedSymbols',
      key: 'relatedSymbols',
      render: (symbols: string[]) => symbols.join(', '),
    },
  ];

  return (
    <div>
      <Card 
        title="股票资讯"
        extra={
          <Space>
            <Select 
              defaultValue="全部" 
              style={{ width: 120 }} 
              onChange={setSelectedCategory}
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <RangePicker onChange={setDateRange} />
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={mockNews} 
          pagination={{ pageSize: 10 }}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default News;