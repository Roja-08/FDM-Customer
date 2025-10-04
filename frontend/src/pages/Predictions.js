import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Row, 
  Col, 
  Alert, 
  Result,
  Spin,
  Divider,
  Statistic,
  Progress
} from 'antd';
import { ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const Predictions = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/predict', values);
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
    <div>
      <Card title="Customer Churn Prediction" style={{ marginBottom: '24px' }}>
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
        <Card title="Prediction Results">
          <Result
            icon={<CheckCircleOutlined style={{ color: getRiskColor(prediction.predicted_churn_risk) }} />}
            title={
              <div style={{ fontSize: '24px', color: getRiskColor(prediction.predicted_churn_risk) }}>
                {getRiskIcon(prediction.predicted_churn_risk)} {prediction.predicted_churn_risk}
              </div>
            }
            subTitle={`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`}
          />

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Confidence Level" size="small">
                <Progress
                  type="circle"
                  percent={Math.round(prediction.confidence * 100)}
                  strokeColor={getRiskColor(prediction.predicted_churn_risk)}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Class Probabilities" size="small">
                {Object.entries(prediction.class_probabilities).map(([className, probability]) => (
                  <div key={className} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{className}:</span>
                      <span style={{ color: getRiskColor(className) }}>
                        {(probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      percent={Math.round(probability * 100)}
                      strokeColor={getRiskColor(className)}
                      size="small"
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card title="Recommended Actions" size="small">
            <ul>
              {getRecommendations(prediction.predicted_churn_risk).map((action, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {action}
                </li>
              ))}
            </ul>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default Predictions;
