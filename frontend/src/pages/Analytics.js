import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button,
  Spin,
  Alert,
  Typography,
  Space
} from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChartOutlined, 
  PieChartOutlined,
  LineChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});
  const [selectedChart, setSelectedChart] = useState('churn_distribution');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedChart, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [churnRes, revenueRes] = await Promise.all([
        axios.get('/api/analytics/charts?type=churn_distribution'),
        axios.get('/api/analytics/charts?type=revenue_by_risk')
      ]);

      setChartData({
        churn: churnRes.data,
        revenue: revenueRes.data
      });
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
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


  const renderChurnDistributionChart = () => {
    const data = chartData.churn?.labels?.map((label, index) => ({
      name: label,
      value: chartData.churn.data[index],
      color: getRiskColor(label)
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRevenueChart = () => {
    const data = chartData.revenue?.labels?.map((label, index) => ({
      risk: label,
      totalRevenue: chartData.revenue.total_revenue[index],
      avgRevenue: chartData.revenue.avg_revenue[index]
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="risk" />
          <YAxis />
          <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]} />
          <Legend />
          <Bar dataKey="totalRevenue" fill="#1890ff" name="Total Revenue" />
          <Bar dataKey="avgRevenue" fill="#52c41a" name="Average Revenue" />
        </BarChart>
      </ResponsiveContainer>
    );
  };


  const renderTrendChart = () => {
    // Mock trend data - in real app, this would come from API
    const data = [
      { month: 'Jan', highRisk: 1200, mediumRisk: 800, lowRisk: 2000, stable: 600 },
      { month: 'Feb', highRisk: 1100, mediumRisk: 850, lowRisk: 2100, stable: 650 },
      { month: 'Mar', highRisk: 1000, mediumRisk: 900, lowRisk: 2200, stable: 700 },
      { month: 'Apr', highRisk: 950, mediumRisk: 950, lowRisk: 2300, stable: 750 },
      { month: 'May', highRisk: 900, mediumRisk: 1000, lowRisk: 2400, stable: 800 },
      { month: 'Jun', highRisk: 850, mediumRisk: 1050, lowRisk: 2500, stable: 850 }
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="highRisk" stackId="1" stroke="#ff4d4f" fill="#ff4d4f" name="High Risk" />
          <Area type="monotone" dataKey="mediumRisk" stackId="1" stroke="#faad14" fill="#faad14" name="Medium Risk" />
          <Area type="monotone" dataKey="lowRisk" stackId="1" stroke="#52c41a" fill="#52c41a" name="Low Risk" />
          <Area type="monotone" dataKey="stable" stackId="1" stroke="#1890ff" fill="#1890ff" name="Stable" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'churn_distribution':
        return renderChurnDistributionChart();
      case 'revenue_analysis':
        return renderRevenueChart();
      case 'trend_analysis':
        return renderTrendChart();
      default:
        return renderChurnDistributionChart();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading analytics...</p>
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
            <LineChartOutlined style={{ marginRight: '12px' }} />
            Analytics Dashboard
          </Title>
          <Text type="secondary">Advanced data visualization and insights</Text>
        </div>

        <Card
          title={
            <Space>
              <BarChartOutlined style={{ color: '#1890ff' }} />
              <span>Interactive Analytics</span>
            </Space>
          }
          extra={
            <Space wrap>
              <Select
                value={selectedChart}
                onChange={setSelectedChart}
                style={{ width: 220 }}
                size="large"
              >
                <Option value="churn_distribution">
                  <PieChartOutlined style={{ marginRight: '8px' }} />
                  Churn Distribution
                </Option>
                <Option value="revenue_analysis">
                  <BarChartOutlined style={{ marginRight: '8px' }} />
                  Revenue Analysis
                </Option>
                <Option value="trend_analysis">
                  <LineChartOutlined style={{ marginRight: '8px' }} />
                  Trend Analysis
                </Option>
              </Select>
              <RangePicker
                onChange={setDateRange}
                placeholder={['Start Date', 'End Date']}
                size="large"
                style={{ width: 280 }}
              />
              <Button 
                type="primary" 
                onClick={fetchAnalyticsData}
                icon={<ReloadOutlined />}
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
          <div style={{ minHeight: '400px' }}>
            {renderSelectedChart()}
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#52c41a' }} />
                  <span>Quick Stats</span>
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
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1890ff' }}>
                      {chartData.churn?.data?.reduce((sum, val) => sum + val, 0) || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: '500' }}>Total Customers</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#52c41a' }}>
                      ${chartData.revenue?.total_revenue?.reduce((sum, val) => sum + val, 0).toFixed(0) || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: '500' }}>Total Revenue</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PieChartOutlined style={{ color: '#faad14' }} />
                  <span>Risk Distribution</span>
                </Space>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                background: 'linear-gradient(90deg, #f0f2f5 0%, #fff7e6 100%)',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', padding: '20px 0' }}>
                {chartData.churn?.labels?.map((label, index) => (
                  <div key={label} style={{ 
                    textAlign: 'center',
                    padding: '24px 20px',
                    background: '#fff',
                    borderRadius: '16px',
                    border: `1px solid ${getRiskColor(label)}20`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: getRiskColor(label),
                      marginBottom: '8px'
                    }}>
                      {chartData.churn.data[index]}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#8c8c8c',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Analytics;
