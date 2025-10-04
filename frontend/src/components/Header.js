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
        height: '70px',
        minHeight: '70px',
        maxHeight: '70px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title level={3} style={{ 
          margin: 0, 
          color: '#1890ff',
          fontSize: '20px',
          fontWeight: '600',
          lineHeight: '1.2'
        }}>
          E-Commerce Churn Analysis Dashboard
        </Title>
        <Text type="secondary" style={{ 
          fontSize: '14px',
          lineHeight: '1.2',
          marginTop: '2px'
        }}>
          Real-time customer churn prediction and management
        </Text>
      </div>
      
      <Space size="large" style={{ alignItems: 'center' }}>
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '20px', color: '#666' }} />
        </Badge>
        
        <Space size="middle" style={{ alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />} 
            size="large"
            style={{ backgroundColor: '#1890ff' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text strong style={{ 
              fontSize: '14px',
              lineHeight: '1.2',
              margin: 0
            }}>
              Admin User
            </Text>
            <Text type="secondary" style={{ 
              fontSize: '12px',
              lineHeight: '1.2',
              margin: 0
            }}>
              Group-04
            </Text>
          </div>
        </Space>
      </Space>
    </AntHeader>
  );
};

export default Header;
