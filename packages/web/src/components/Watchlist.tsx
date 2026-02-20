import React, { useEffect, useState } from 'react';
import { Card, Table, Tabs, Tag, message, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { watchlistApi } from '../api';
import { clearWatchlist, addToWatchlist, addToGroup, WatchlistItem } from '../store/features/watchlistSlice';

const Watchlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: watchlistItems, groups } = useAppSelector(state => state.watchlist);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 加载自选股数据
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const response = await watchlistApi.getUserWatchlist();
      const data = response.data.data || [];
      
      // 先清空现有数据
      dispatch(clearWatchlist());
      
      // 更新 Redux store
      data.forEach((item: WatchlistItem) => {
        dispatch(addToWatchlist(item));
        // 根据 groupId 添加到对应分组
        if (item.groupId) {
          dispatch(addToGroup({ groupId: item.groupId, symbol: item.symbol }));
        }
      });
      
      setDataLoaded(true);
    } catch (error) {
      message.error('获取自选股失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '股票代码', dataIndex: 'symbol', key: 'symbol', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
    {
      title: '当前价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (text: number) => (text !== undefined ? text.toFixed(2) : '--'),
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 100,
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
      width: 100,
      render: (text: number) => {
        if (text === undefined) return '--';
        return (
          <span style={{ color: text >= 0 ? '#f5222d' : '#52c41a' }}>
            {text >= 0 ? '+' : ''}{text.toFixed(2)}%
          </span>
        );
      },
    },
    { title: '操作', key: 'action', render: () => <a>移除</a> },
  ];

  // 按分组显示自选股
  const groupedItems = groups.map(group => {
    const groupItems = watchlistItems.filter(item =>
      group.items.includes(item.symbol)
    );
    return {
      key: group.id,
      label: `${group.name} (${groupItems.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={groupItems}
          pagination={false}
          rowKey="symbol"
          loading={loading}
          size="small"
          locale={{ emptyText: '该分组暂无股票' }}
        />
      ),
    };
  });

  // 显示所有股票（不分组）
  const allItemsTab = {
    key: 'all',
    label: `全部 (${watchlistItems.length})`,
    children: (
      <Table
        columns={columns}
        dataSource={watchlistItems}
        pagination={false}
        rowKey="symbol"
        loading={loading}
        size="small"
        locale={{ emptyText: loading ? '加载中...' : '暂无自选股数据' }}
      />
    ),
  };

  // 合并所有分组
  const allTabs = [allItemsTab, ...groupedItems];

  return (
    <div>
      <Card title="我的自选股">
        <Tabs defaultActiveKey="all" items={allTabs} />
      </Card>
    </div>
  );
};

export default Watchlist;
