import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  ThunderboltOutlined, 
  FundOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/predictions',
      icon: <ThunderboltOutlined />,
      label: 'Predictions',
    },
    {
      key: '/campaigns',
      icon: <TeamOutlined />,
      label: 'Campaigns',
    },
    {
      key: '/analytics',
      icon: <FundOutlined />,
      label: 'Analytics',
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#1890ff',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Churn Analysis
        </h2>
        <p style={{ 
          margin: '5px 0 0 0', 
          color: '#666',
          fontSize: '12px'
        }}>
          Group-04 SLIIT
        </p>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ border: 'none' }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
