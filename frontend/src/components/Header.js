import React from 'react';
import { Layout, Typography, Space, Badge, Avatar } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          E-Commerce Churn Analysis Dashboard
        </Title>
        <Text type="secondary">
          Real-time customer churn prediction and management
        </Text>
      </div>
      
      <Space size="large">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '18px', color: '#666' }} />
        </Badge>
        
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>Admin User</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Group-04
            </Text>
          </div>
        </Space>
      </Space>
    </AntHeader>
  );
};

export default Header;
