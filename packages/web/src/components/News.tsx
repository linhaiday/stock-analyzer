import React, { useEffect, useCallback } from 'react';
import { Card, Table, DatePicker, Select, Button, Space, Tag, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { newsApi } from '../api';
import { fetchNewsStart, fetchNewsSuccess } from '../store/features/newsSlice';

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  category: string;
  publishTime: string;
  isHot: boolean;
  viewCount: number;
  relatedStocks?: string[];
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const News: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: newsItems, loading } = useAppSelector(state => state.news);
  const [selectedCategory, setSelectedCategory] = React.useState('全部');

  // 加载资讯数据
  const fetchNews = useCallback(async () => {
    dispatch(fetchNewsStart());
    try {
      const params: any = {};
      if (selectedCategory !== '全部') {
        params.category = selectedCategory;
      }
      const response = await newsApi.getNewsList(params);
      dispatch(fetchNewsSuccess(response.data.data || []));
    } catch (error) {
      message.error('获取资讯失败');
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // 过滤显示的数据
  const filteredNews = newsItems.filter(item => {
    if (selectedCategory !== '全部' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = ['全部', '个股', '大盘', '行业', '政策', '国际', '公司'];

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: NewsItem) => (
        <Space>
          <a>{text}</a>
          {record.isHot && <Tag color="red">热门</Tag>}
        </Space>
      ),
    },
    { title: '摘要', dataIndex: 'summary', key: 'summary', ellipsis: true },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    { title: '来源', dataIndex: 'source', key: 'source', width: 100 },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 180 },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count: number) => count?.toLocaleString() || 0,
    },
    {
      title: '关联股票',
      dataIndex: 'relatedStocks',
      key: 'relatedStocks',
      width: 120,
      render: (symbols: string[]) => symbols?.join(', ') || '--',
    },
  ];

  return (
    <div>
      <Card
        title="股票资讯"
        extra={
          <Space>
            <Select
              value={selectedCategory}
              style={{ width: 120 }}
              onChange={setSelectedCategory}
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <RangePicker />
            <Button icon={<ReloadOutlined />} onClick={fetchNews}>
              刷新
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredNews}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default News;
