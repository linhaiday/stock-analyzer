import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Table, Tabs, Tag } from 'antd';
import { useAppSelector } from '../hooks';
import { WatchlistItem } from '../store/features/watchlistSlice';

const { TabPane } = Tabs;

const Watchlist: React.FC = () => {
  const { items: watchlistItems, groups } = useAppSelector(state => state.watchlist);

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前价',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => text ? text.toFixed(2) : '--',
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      render: (text: number) => {
        if (text === undefined) return '--';
        return (
          <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
            {text >= 0 ? '+' : ''}{text.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: '涨幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      render: (text: number) => {
        if (text === undefined) return '--';
        return (
          <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
            {text >= 0 ? '+' : ''}{text.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <a>移除</a>
      ),
    },
  ];

  // 按分组显示自选股
  const groupedItems = groups.map(group => {
    const groupItems = watchlistItems.filter(item => 
      group.items.includes(item.symbol)
    );
    
    return {
      key: group.id,
      label: group.name,
      children: (
        <Table 
          columns={columns} 
          dataSource={groupItems} 
          pagination={false}
          rowKey="symbol"
        />
      ),
    };
  });

  return (
    <div>
      <Card title="我的自选股">
        <Tabs defaultActiveKey="default" items={groupedItems} />
      </Card>
    </div>
  );
};

export default Watchlist;