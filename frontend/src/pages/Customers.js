import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Descriptions, 
  message,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  UserOutlined,
  DollarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const { Option } = Select;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    risk_level: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        per_page: pagination.pageSize,
        ...filters
      };
      
      const response = await axios.get('/api/customers', { params });
      setCustomers(response.data.customers);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      message.error('Failed to fetch customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination, filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRiskFilter = (value) => {
    setFilters(prev => ({ ...prev, risk_level: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const viewCustomer = async (customerId) => {
    try {
      const response = await axios.get(`/api/customers/${customerId}`);
      setSelectedCustomer(response.data);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch customer details');
    }
  };

  const getRiskTag = (risk) => {
    const colors = {
      'High Risk': 'red',
      'Medium Risk': 'orange',
      'Low Risk': 'green',
      'Stable': 'blue'
    };
    return <Tag color={colors[risk] || 'default'}>{risk}</Tag>;
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customer_unique_id',
      key: 'customer_unique_id',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => `${record.customer_city}, ${record.customer_state}`,
      width: 150,
    },
    {
      title: 'Orders',
      dataIndex: 'total_orders',
      key: 'total_orders',
      width: 80,
      sorter: (a, b) => a.total_orders - b.total_orders,
    },
    {
      title: 'Total Payment',
      dataIndex: 'total_payment',
      key: 'total_payment',
      width: 120,
      render: (value) => `$${value.toFixed(2)}`,
      sorter: (a, b) => a.total_payment - b.total_payment,
    },
    {
      title: 'Avg Order Value',
      dataIndex: 'avg_order_value',
      key: 'avg_order_value',
      width: 120,
      render: (value) => `$${value.toFixed(2)}`,
      sorter: (a, b) => a.avg_order_value - b.avg_order_value,
    },
    {
      title: 'Recency (Days)',
      dataIndex: 'recency_days',
      key: 'recency_days',
      width: 120,
      sorter: (a, b) => a.recency_days - b.recency_days,
    },
    {
      title: 'Churn Risk',
      dataIndex: 'churn_risk',
      key: 'churn_risk',
      width: 120,
      render: (risk) => getRiskTag(risk),
      filters: [
        { text: 'High Risk', value: 'High Risk' },
        { text: 'Medium Risk', value: 'Medium Risk' },
        { text: 'Low Risk', value: 'Low Risk' },
        { text: 'Stable', value: 'Stable' },
      ],
      onFilter: (value, record) => record.churn_risk === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewCustomer(record.id)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <UserOutlined style={{ marginRight: '12px' }} />
            Customer Management
          </Title>
          <Text type="secondary">Comprehensive customer data and churn risk analysis</Text>
        </div>

        {/* Summary Stats */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Statistic
                title={<Text style={{ color: '#000', fontSize: '16px' }}>Total Customers</Text>}
                value={pagination.total}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Statistic
                title={<Text style={{ color: '#000', fontSize: '16px' }}>High Risk</Text>}
                value={customers.filter(c => c.churn_risk === 'High Risk').length}
                prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Statistic
                title={<Text style={{ color: '#000', fontSize: '16px' }}>Stable</Text>}
                value={customers.filter(c => c.churn_risk === 'Stable').length}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Statistic
                title={<Text style={{ color: '#000', fontSize: '16px' }}>Avg Order Value</Text>}
                value={customers.reduce((sum, c) => sum + c.avg_order_value, 0) / customers.length || 0}
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                precision={2}
                valueStyle={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <Space>
              <UserOutlined style={{ color: '#1890ff' }} />
              <span>Customer Database</span>
            </Space>
          }
          extra={
            <Space wrap>
              <Input.Search
                placeholder="Search customers..."
                style={{ width: 300 }}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                size="large"
              />
              <Select
                placeholder="Filter by risk level"
                style={{ width: 200 }}
                allowClear
                onChange={handleRiskFilter}
                size="large"
              >
                <Option value="High Risk">High Risk</Option>
                <Option value="Medium Risk">Medium Risk</Option>
                <Option value="Low Risk">Low Risk</Option>
                <Option value="Stable">Stable</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCustomers}
                size="large"
              >
                Refresh
              </Button>
            </Space>
          }
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          headStyle={{ 
            background: 'linear-gradient(90deg, #f0f2f5 0%, #e6f7ff 100%)',
            borderRadius: '12px 12px 0 0'
          }}
        >

          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} customers`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            size="middle"
          />
        </Card>

        <Modal
          title={
            <Space>
              <UserOutlined style={{ color: '#1890ff' }} />
              <span>Customer Details</span>
            </Space>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={900}
          style={{ top: 20 }}
        >
          {selectedCustomer && (
            <div>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                color: 'white'
              }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {selectedCustomer.customer_unique_id}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {selectedCustomer.customer_city}, {selectedCustomer.customer_state}
                </Text>
                <div style={{ marginTop: '12px' }}>
                  {getRiskTag(selectedCustomer.churn_risk)}
                </div>
              </div>
              
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Location" span={2}>
                  {selectedCustomer.customer_city}, {selectedCustomer.customer_state} {selectedCustomer.customer_zip_code_prefix}
                </Descriptions.Item>
                <Descriptions.Item label="Total Orders">
                  {selectedCustomer.total_orders}
                </Descriptions.Item>
                <Descriptions.Item label="Total Payment">
                  ${selectedCustomer.total_payment.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Avg Order Value">
                  ${selectedCustomer.avg_order_value.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Unique Products">
                  {selectedCustomer.unique_products}
                </Descriptions.Item>
                <Descriptions.Item label="Unique Categories">
                  {selectedCustomer.unique_categories}
                </Descriptions.Item>
                <Descriptions.Item label="Avg Review Score">
                  {selectedCustomer.avg_review_score.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Recency (Days)">
                  {selectedCustomer.recency_days}
                </Descriptions.Item>
                <Descriptions.Item label="Frequency">
                  {selectedCustomer.frequency}
                </Descriptions.Item>
                <Descriptions.Item label="Monetary Value">
                  ${selectedCustomer.monetary.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Cluster">
                  {selectedCustomer.cluster}
                </Descriptions.Item>
                <Descriptions.Item label="Last Order Date">
                  {selectedCustomer.last_order_date ? 
                    new Date(selectedCustomer.last_order_date).toLocaleDateString() : 
                    'N/A'
                  }
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>
      </Space>
    </div>
  );
};

export default Customers;
