import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spin, Alert, Typography, Space, Tag } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  RiseOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, churnRes, revenueRes] = await Promise.all([
        axios.get('/api/analytics/summary'),
        axios.get('/api/analytics/charts?type=churn_distribution'),
        axios.get('/api/analytics/charts?type=revenue_by_risk')
      ]);

      setSummary(summaryRes.data);
      setChartData({
        churn: churnRes.data,
        revenue: revenueRes.data
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <BarChartOutlined style={{ marginRight: '12px' }} />
            E-Commerce Churn Analysis Dashboard
          </Title>
          <Text type="secondary">Real-time customer churn prediction and management</Text>
        </div>
        
        {/* Summary Statistics */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                height: '160px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              bodyStyle={{ 
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <UserOutlined style={{ color: '#1890ff', fontSize: '24px', marginRight: '12px' }} />
                <Text style={{ color: '#000', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  Total Customers
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                <Text style={{ color: '#000', fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                  {summary?.total_customers?.toLocaleString() || 0}
                </Text>
                <Text style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>
                  customers
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                height: '160px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              bodyStyle={{ 
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <DollarOutlined style={{ color: '#52c41a', fontSize: '24px', marginRight: '12px' }} />
                <Text style={{ color: '#000', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  Total Revenue
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                <Text style={{ color: '#000', fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                  ${summary?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}
                </Text>
                <Text style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>
                  USD
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                height: '160px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              bodyStyle={{ 
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RiseOutlined style={{ color: '#faad14', fontSize: '24px', marginRight: '12px' }} />
                <Text style={{ color: '#000', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  Avg Order Value
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                <Text style={{ color: '#000', fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                  ${summary?.avg_order_value?.toFixed(2) || 0}
                </Text>
                <Text style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>
                  USD
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Card 
              hoverable
              style={{ 
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                height: '160px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              bodyStyle={{ 
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <WarningOutlined style={{ color: '#ff4d4f', fontSize: '24px', marginRight: '12px' }} />
                <Text style={{ color: '#000', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  High Risk Customers
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                <Text style={{ color: '#000', fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                  {summary?.churn_distribution?.['High Risk']?.toLocaleString() || 0}
                </Text>
                <Text style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>
                  customers
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PieChartOutlined style={{ color: '#1890ff' }} />
                  <span>Customer Churn Distribution</span>
                </Space>
              }
              style={{ 
                height: '450px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(90deg, #f0f2f5 0%, #e6f7ff 100%)',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={chartData?.churn?.labels?.map((label, index) => ({
                      name: label,
                      value: chartData.churn.data[index],
                      color: getRiskColor(label)
                    })) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData?.churn?.labels?.map((label, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskColor(label)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#52c41a' }} />
                  <span>Revenue by Risk Level</span>
                </Space>
              }
              style={{ 
                height: '450px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(90deg, #f0f2f5 0%, #f6ffed 100%)',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData?.revenue?.labels?.map((label, index) => ({
                  risk: label,
                  revenue: chartData.revenue.total_revenue[index],
                  avgRevenue: chartData.revenue.avg_revenue[index]
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="risk" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#d9d9d9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#d9d9d9' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#revenueGradient)" 
                    name="Total Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="avgRevenue" 
                    fill="url(#avgRevenueGradient)" 
                    name="Avg Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1890ff" />
                      <stop offset="100%" stopColor="#40a9ff" />
                    </linearGradient>
                    <linearGradient id="avgRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52c41a" />
                      <stop offset="100%" stopColor="#73d13d" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Recent Predictions */}
        {summary?.recent_predictions && summary.recent_predictions.length > 0 && (
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Recent Predictions</span>
              </Space>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            headStyle={{ 
              background: 'linear-gradient(90deg, #f0f2f5 0%, #f6ffed 100%)',
              borderRadius: '12px 12px 0 0'
            }}
          >
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {summary.recent_predictions.map((prediction, index) => (
                <div key={index} style={{ 
                  padding: '16px', 
                  margin: '8px 0',
                  background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>
                      Customer #{prediction.customer_id}
                    </Text>
                    <Tag 
                      color={getRiskColor(prediction.predicted_churn_risk)}
                      style={{ 
                        marginLeft: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '4px'
                      }}
                    >
                      {prediction.predicted_churn_risk}
                    </Tag>
                  </div>
                  <Space>
                    <Text type="secondary">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </Text>
                    <Text type="secondary">
                      {new Date(prediction.prediction_date).toLocaleDateString()}
                    </Text>
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Dashboard;
