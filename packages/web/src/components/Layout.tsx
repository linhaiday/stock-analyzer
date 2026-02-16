import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { 
  HomeOutlined, 
  StockOutlined, 
  HeartOutlined, 
  FundOutlined, 
  ReadOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    { key: '/', label: <Link to="/">首页</Link>, icon: <HomeOutlined /> },
    { key: '/watchlist', label: <Link to="/watchlist">自选股</Link>, icon: <HeartOutlined /> },
    { key: '/analysis', label: <Link to="/analysis">分析</Link>, icon: <FundOutlined /> },
    { key: '/news', label: <Link to="/news">资讯</Link>, icon: <ReadOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          股票分析软件
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layout;