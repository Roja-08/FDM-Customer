import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  message,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Progress
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      message.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    form.setFieldsValue(campaign);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCampaign) {
        // Update campaign
        await axios.put(`/api/campaigns/${editingCampaign.id}`, values);
        message.success('Campaign updated successfully');
      } else {
        // Create campaign
        await axios.post('/api/campaigns', values);
        message.success('Campaign created successfully');
      }
      setModalVisible(false);
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to save campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`/api/campaigns/${campaignId}`);
      message.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to delete campaign');
    }
  };

  const getStatusTag = (status) => {
    const colors = {
      'Active': 'green',
      'Paused': 'orange',
      'Completed': 'blue',
      'Draft': 'gray'
    };
    return <Tag color={colors[status] || 'default'}>{status}</Tag>;
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
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Target Risk Level',
      dataIndex: 'target_risk_level',
      key: 'target_risk_level',
      render: (risk) => getRiskTag(risk),
    },
    {
      title: 'Campaign Type',
      dataIndex: 'campaign_type',
      key: 'campaign_type',
    },
    {
      title: 'Discount %',
      dataIndex: 'discount_percentage',
      key: 'discount_percentage',
      render: (value) => `${value}%`,
    },
    {
      title: 'Target Customers',
      dataIndex: 'target_customers',
      key: 'target_customers',
    },
    {
      title: 'Engaged',
      dataIndex: 'engaged_customers',
      key: 'engaged_customers',
    },
    {
      title: 'Engagement Rate',
      key: 'engagement_rate',
      render: (_, record) => {
        const rate = record.target_customers > 0 
          ? (record.engaged_customers / record.target_customers * 100).toFixed(1)
          : 0;
        return (
          <div>
            <Progress 
              percent={parseFloat(rate)} 
              size="small" 
              style={{ width: 100 }}
            />
            <span style={{ marginLeft: 8 }}>{rate}%</span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCampaign(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCampaign(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate campaign statistics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalTargetCustomers = campaigns.reduce((sum, c) => sum + c.target_customers, 0);
  const totalEngagedCustomers = campaigns.reduce((sum, c) => sum + c.engaged_customers, 0);
  const overallEngagementRate = totalTargetCustomers > 0 
    ? (totalEngagedCustomers / totalTargetCustomers * 100).toFixed(1)
    : 0;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Campaigns"
              value={totalCampaigns}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Campaigns"
              value={activeCampaigns}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Target Customers"
              value={totalTargetCustomers}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Engagement Rate"
              value={overallEngagementRate}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Campaign Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateCampaign}
          >
            Create Campaign
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={campaigns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} campaigns`,
          }}
        />
      </Card>

      <Modal
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true, message: 'Please input campaign name' }]}
          >
            <Input placeholder="e.g., High Risk Win-Back Campaign" />
          </Form.Item>

          <Form.Item
            name="target_risk_level"
            label="Target Risk Level"
            rules={[{ required: true, message: 'Please select target risk level' }]}
          >
            <Select placeholder="Select risk level">
              <Option value="High Risk">High Risk</Option>
              <Option value="Medium Risk">Medium Risk</Option>
              <Option value="Low Risk">Low Risk</Option>
              <Option value="Stable">Stable</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="campaign_type"
            label="Campaign Type"
            rules={[{ required: true, message: 'Please select campaign type' }]}
          >
            <Select placeholder="Select campaign type">
              <Option value="Email">Email Campaign</Option>
              <Option value="SMS">SMS Campaign</Option>
              <Option value="Push">Push Notification</Option>
              <Option value="Retargeting">Retargeting</Option>
              <Option value="Loyalty">Loyalty Program</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_percentage"
            label="Discount Percentage"
            rules={[{ required: true, message: 'Please input discount percentage' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="e.g., 20"
              min={0}
              max={100}
              suffix="%"
            />
          </Form.Item>

          <Form.Item
            name="target_customers"
            label="Target Customers Count"
            rules={[{ required: true, message: 'Please input target customers count' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="e.g., 1000"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Campaign Message"
            rules={[{ required: true, message: 'Please input campaign message' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter your campaign message..."
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="Draft"
          >
            <Select>
              <Option value="Draft">Draft</Option>
              <Option value="Active">Active</Option>
              <Option value="Paused">Paused</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Campaigns;
