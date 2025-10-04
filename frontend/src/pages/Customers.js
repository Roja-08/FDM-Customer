import React, { useState, useEffect } from 'react';
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
  Spin,
  Pagination,
  message
} from 'antd';
import { SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';

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

  useEffect(() => {
    fetchCustomers();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchCustomers = async () => {
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
  };

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
    <div>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Input.Search
            placeholder="Search customers..."
            style={{ width: 300 }}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
          />
          <Select
            placeholder="Filter by risk level"
            style={{ width: 200 }}
            allowClear
            onChange={handleRiskFilter}
          >
            <Option value="High Risk">High Risk</Option>
            <Option value="Medium Risk">Medium Risk</Option>
            <Option value="Low Risk">Low Risk</Option>
            <Option value="Stable">Stable</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={fetchCustomers}
          >
            Refresh
          </Button>
        </div>

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
        />
      </Card>

      <Modal
        title="Customer Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCustomer && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Customer ID" span={2}>
              {selectedCustomer.customer_unique_id}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedCustomer.customer_city}, {selectedCustomer.customer_state}
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code">
              {selectedCustomer.customer_zip_code_prefix}
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
            <Descriptions.Item label="Churn Risk" span={2}>
              {getRiskTag(selectedCustomer.churn_risk)}
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
        )}
      </Modal>
    </div>
  );
};

export default Customers;
