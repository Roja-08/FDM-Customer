import React, { useState } from 'react';
import config from '../config';
import { 
  Card, 
  Form, 
  InputNumber, 
  Button, 
  Row, 
  Col, 
  Alert, 
  Divider,
  Progress,
  Typography,
  Space,
  Tag
} from 'antd';
import { 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  RobotOutlined,
  BarChartOutlined,
  BulbOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const Predictions = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${config.getApiUrl()}/api/predict`, values);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High Risk': return '#ff4d4f';
      case 'Medium Risk': return '#faad14';
      case 'Low Risk': return '#52c41a';
      case 'Stable': return '#1890ff';
      default: return '#666';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'High Risk': return '🚨';
      case 'Medium Risk': return '⚠️';
      case 'Low Risk': return '✅';
      case 'Stable': return '🌟';
      default: return '❓';
    }
  };

  const getRecommendations = (risk) => {
    const recommendations = {
      'High Risk': [
        'Send personalized win-back campaigns with 20-30% discounts',
        'Offer free shipping on next order',
        'Conduct exit surveys to understand inactivity reasons',
        'Provide exclusive access to new products',
        'Implement urgent email/SMS re-engagement campaigns'
      ],
      'Medium Risk': [
        'Send targeted product recommendations',
        'Offer loyalty program enrollment with immediate benefits',
        'Provide moderate discounts (10-15%)',
        'Send educational content about products',
        'Implement retargeting campaigns'
      ],
      'Low Risk': [
        'Send regular newsletters with new arrivals',
        'Provide cross-selling recommendations',
        'Offer seasonal promotions',
        'Encourage product reviews and social sharing',
        'Maintain consistent communication'
      ],
      'Stable': [
        'Focus on upselling premium products',
        'Invite to VIP/premium loyalty tiers',
        'Request referrals with incentives',
        'Provide early access to new collections',
        'Gather feedback for product development'
      ]
    };
    return recommendations[risk] || [];
  };

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <RobotOutlined style={{ marginRight: '12px' }} />
            AI-Powered Churn Prediction
          </Title>
          <Text type="secondary">Predict customer churn risk using machine learning models</Text>
        </div>

        <Card 
          title={
            <Space>
              <BarChartOutlined style={{ color: '#1890ff' }} />
              <span>Customer Data Input</span>
            </Space>
          }
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          styles={{ 
            header: {
              background: 'linear-gradient(90deg, #f0f2f5 0%, #e6f7ff 100%)',
              borderRadius: '12px 12px 0 0'
            }
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="prediction-form"
          >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Recency (Days since last order)"
                name="recency_days"
                rules={[{ required: true, message: 'Please input recency days' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 45"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Frequency (Total orders)"
                name="frequency"
                rules={[{ required: true, message: 'Please input frequency' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 3"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Monetary Value ($)"
                name="monetary"
                rules={[{ required: true, message: 'Please input monetary value' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 250.00"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Average Order Value ($)"
                name="avg_order_value"
                rules={[{ required: true, message: 'Please input average order value' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 83.33"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Unique Products"
                name="unique_products"
                rules={[{ required: true, message: 'Please input unique products' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 5"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Unique Categories"
                name="unique_categories"
                rules={[{ required: true, message: 'Please input unique categories' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 3"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Product Diversity Ratio"
                name="product_diversity_ratio"
                rules={[{ required: true, message: 'Please input product diversity ratio' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 1.67"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Category Diversity Ratio"
                name="category_diversity_ratio"
                rules={[{ required: true, message: 'Please input category diversity ratio' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 1.0"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Customer Lifetime (Days)"
                name="customer_lifetime_days"
                rules={[{ required: true, message: 'Please input customer lifetime' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 120"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Avg Days Between Orders"
                name="avg_days_between_orders"
                rules={[{ required: true, message: 'Please input avg days between orders' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 60"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Average Review Score"
                name="avg_review_score"
                rules={[{ required: true, message: 'Please input average review score' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 4.2"
                  min={0}
                  max={5}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Total Review Comments"
                name="total_review_comments"
                rules={[{ required: true, message: 'Please input total review comments' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 2"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Avg Payment Methods"
                name="avg_payment_methods"
                rules={[{ required: true, message: 'Please input avg payment methods' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 1.0"
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Max Installments"
                name="max_installments"
                rules={[{ required: true, message: 'Please input max installments' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 1"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Total Freight ($)"
                name="total_freight"
                rules={[{ required: true, message: 'Please input total freight' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 25.0"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Avg Freight ($)"
                name="avg_freight"
                rules={[{ required: true, message: 'Please input avg freight' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 8.33"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Payment Std Dev"
                name="std_payment"
                rules={[{ required: true, message: 'Please input payment std dev' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 15.0"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Cluster"
                name="cluster"
                rules={[{ required: true, message: 'Please input cluster' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 2"
                  min={0}
                  max={4}
                />
              </Form.Item>
            </Col>
          </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<ThunderboltOutlined />}
                size="large"
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                Predict Churn Risk
              </Button>
            </Form.Item>
          </Form>
        </Card>

      {error && (
        <Alert
          message="Prediction Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

        {prediction && (
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Prediction Results</span>
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            styles={{ 
              header: {
                background: 'linear-gradient(90deg, #f0f2f5 0%, #f6ffed 100%)',
                borderRadius: '12px 12px 0 0'
              }
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {getRiskIcon(prediction.predicted_churn_risk)}
              </div>
              <Title level={1} style={{ 
                color: getRiskColor(prediction.predicted_churn_risk),
                margin: 0,
                fontSize: '36px'
              }}>
                {prediction.predicted_churn_risk}
              </Title>
              <Text style={{ fontSize: '18px', color: '#666' }}>
                Confidence: {(prediction.confidence * 100).toFixed(1)}%
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <BarChartOutlined style={{ color: '#1890ff' }} />
                      <span>Confidence Level</span>
                    </Space>
                  }
                  style={{ 
                    borderRadius: '8px',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={Math.round(prediction.confidence * 100)}
                      strokeColor={getRiskColor(prediction.predicted_churn_risk)}
                      size={120}
                      strokeWidth={8}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <BarChartOutlined style={{ color: '#52c41a' }} />
                      <span>Class Probabilities</span>
                    </Space>
                  }
                  style={{ 
                    borderRadius: '8px',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
                  }}
                >
                  {Object.entries(prediction.class_probabilities).map(([className, probability]) => (
                    <div key={className} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Tag color={getRiskColor(className)} style={{ fontSize: '12px' }}>
                          {className}
                        </Tag>
                        <Text strong style={{ color: getRiskColor(className) }}>
                          {(probability * 100).toFixed(1)}%
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round(probability * 100)}
                        strokeColor={getRiskColor(className)}
                        size="small"
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>

            <Divider />

            <Card 
              title={
                <Space>
                  <BulbOutlined style={{ color: '#faad14' }} />
                  <span>Recommended Actions</span>
                </Space>
              }
              style={{ 
                borderRadius: '8px',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
              }}
            >
              <Row gutter={[16, 16]}>
                {getRecommendations(prediction.predicted_churn_risk).map((action, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div style={{ 
                      padding: '12px 16px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: getRiskColor(prediction.predicted_churn_risk),
                        marginRight: '12px',
                        flexShrink: 0
                      }} />
                      <Text style={{ margin: 0 }}>{action}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Predictions;
