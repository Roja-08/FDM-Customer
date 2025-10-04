import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  WarningOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

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

  const COLORS = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff'];

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
    <div>
      <h1>Dashboard Overview</h1>
      
      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={summary?.total_customers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={summary?.total_revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={summary?.avg_order_value || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="High Risk Customers"
              value={summary?.churn_distribution?.['High Risk'] || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Customer Churn Distribution" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
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
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.churn?.labels?.map((label, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(label)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Revenue by Risk Level" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.revenue?.labels?.map((label, index) => ({
                risk: label,
                revenue: chartData.revenue.total_revenue[index],
                avgRevenue: chartData.revenue.avg_revenue[index]
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1890ff" name="Total Revenue" />
                <Bar dataKey="avgRevenue" fill="#52c41a" name="Avg Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Predictions */}
      {summary?.recent_predictions && summary.recent_predictions.length > 0 && (
        <Card title="Recent Predictions" style={{ marginTop: '24px' }}>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {summary.recent_predictions.map((prediction, index) => (
              <div key={index} style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Customer #{prediction.customer_id}</strong>
                  <span style={{ 
                    marginLeft: '10px',
                    color: getRiskColor(prediction.predicted_churn_risk),
                    fontWeight: 'bold'
                  }}>
                    {prediction.predicted_churn_risk}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                  <span style={{ marginLeft: '10px', color: '#999' }}>
                    {new Date(prediction.prediction_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
