import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, InputNumber, message, Switch } from 'antd';
import { BellOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { alertApi } from '../api';

const { Option } = Select;

interface Alert {
  id: string;
  symbol: string;
  name?: string;
  type: 'price' | 'percent' | 'volume';
  operator: 'above' | 'below';
  threshold: number;
  active: boolean;
  createdAt?: string;
}

const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await alertApi.getAlerts();
      setAlerts(response.data || []);
    } catch (error: any) {
      message.error('获取预警列表失败');
      // 使用模拟数据
      setAlerts([
        {
          id: '1',
          symbol: '000001',
          name: '平安银行',
          type: 'price',
          operator: 'above',
          threshold: 15,
          active: true,
        },
        {
          id: '2',
          symbol: '000002',
          name: '万科A',
          type: 'percent',
          operator: 'below',
          threshold: -5,
          active: true,
        },
        {
          id: '3',
          symbol: '600036',
          name: '招商银行',
          type: 'volume',
          operator: 'above',
          threshold: 1000000,
          active: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      await alertApi.createAlert(values);
      message.success('预警创建成功');
      setModalVisible(false);
      form.resetFields();
      fetchAlerts();
    } catch (error: any) {
      message.error('创建预警失败');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个预警吗？',
      onOk: () => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        message.success('删除成功');
      },
    });
  };

  const toggleActive = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '预警类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (v: string) =>
        ({
          price: <Tag color="blue">价格</Tag>,
          percent: <Tag color="green">涨跌幅</Tag>,
          volume: <Tag color="orange">成交量</Tag>,
        }[v]),
    },
    {
      title: '条件',
      key: 'condition',
      render: (record: Alert) => (
        <span>
          {record.operator === 'above' ? '高于' : '低于'} {record.threshold}
          {record.type === 'price' ? ' 元' : record.type === 'percent' ? ' %' : ' 手'}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (v: boolean, record: Alert) => (
        <Switch
          checked={v}
          onChange={() => toggleActive(record.id)}
          checkedChildren="启用"
          unCheckedChildren="暂停"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Alert) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建预警
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={alerts}
        loading={loading}
        rowKey="id"
        size="small"
      />
      <Modal
        title="新建价格预警"
        open={modalVisible}
        onOk={() => {
          form
            .validateFields()
            .then(handleCreate)
            .catch(() => {});
        }}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="symbol"
            label="股票代码"
            rules={[{ required: true, message: '请输入股票代码' }]}
          >
            <Input placeholder="如: 000001" />
          </Form.Item>
          <Form.Item
            name="type"
            label="预警类型"
            rules={[{ required: true }]}
            initialValue="price"
          >
            <Select>
              <Option value="price">价格</Option>
              <Option value="percent">涨跌幅</Option>
              <Option value="volume">成交量</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="operator"
            label="操作符"
            rules={[{ required: true }]}
            initialValue="above"
          >
            <Select>
              <Option value="above">高于</Option>
              <Option value="below">低于</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="threshold"
            label="阈值"
            rules={[{ required: true, message: '请输入阈值' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PriceAlerts;
