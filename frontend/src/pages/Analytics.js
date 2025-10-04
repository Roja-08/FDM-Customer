import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button,
  Spin,
  Alert
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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { FundOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';

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

      const [churnRes, revenueRes, geoRes] = await Promise.all([
        axios.get('/api/analytics/charts?type=churn_distribution'),
        axios.get('/api/analytics/charts?type=revenue_by_risk'),
        axios.get('/api/analytics/charts?type=geographic_distribution')
      ]);

      setChartData({
        churn: churnRes.data,
        revenue: revenueRes.data,
        geographic: geoRes.data
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

  const COLORS = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff'];

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

  const renderGeographicChart = () => {
    const data = chartData.geographic?.labels?.map((label, index) => ({
      state: label,
      customers: chartData.geographic.data[index]
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="state" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="customers" fill="#1890ff" />
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
      case 'geographic_distribution':
        return renderGeographicChart();
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
    <div>
      <Card
        title="Analytics Dashboard"
        extra={
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Select
              value={selectedChart}
              onChange={setSelectedChart}
              style={{ width: 200 }}
            >
              <Option value="churn_distribution">
                <PieChartOutlined /> Churn Distribution
              </Option>
              <Option value="revenue_analysis">
                <BarChartOutlined /> Revenue Analysis
              </Option>
              <Option value="geographic_distribution">
                <FundOutlined /> Geographic Distribution
              </Option>
              <Option value="trend_analysis">
                <BarChartOutlined /> Trend Analysis
              </Option>
            </Select>
            <RangePicker
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />
            <Button type="primary" onClick={fetchAnalyticsData}>
              Refresh
            </Button>
          </div>
        }
      >
        {renderSelectedChart()}
      </Card>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Quick Stats" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                    {chartData.churn?.data?.reduce((sum, val) => sum + val, 0) || 0}
                  </div>
                  <div style={{ color: '#666' }}>Total Customers</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                    {chartData.revenue?.total_revenue?.reduce((sum, val) => sum + val, 0).toFixed(0) || 0}
                  </div>
                  <div style={{ color: '#666' }}>Total Revenue ($)</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Risk Distribution" size="small">
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {chartData.churn?.labels?.map((label, index) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: getRiskColor(label) 
                  }}>
                    {chartData.churn.data[index]}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{label}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
