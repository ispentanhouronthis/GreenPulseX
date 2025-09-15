import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert, Chip
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import axios from 'axios';

const Analytics = ({ selectedDistrict, onDistrictSelect, districts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate comprehensive analytics data
      const data = {
        yieldTrends: [
          { year: '2019', yield: 3200, rainfall: 850, temperature: 28.5, fertilizer: 120 },
          { year: '2020', yield: 3400, rainfall: 920, temperature: 29.1, fertilizer: 125 },
          { year: '2021', yield: 3100, rainfall: 780, temperature: 30.2, fertilizer: 118 },
          { year: '2022', yield: 3600, rainfall: 950, temperature: 28.8, fertilizer: 130 },
          { year: '2023', yield: 3800, rainfall: 880, temperature: 29.5, fertilizer: 135 },
          { year: '2024', yield: 4200, rainfall: 900, temperature: 29.0, fertilizer: 140 }
        ],
        seasonalAnalysis: [
          { season: 'Kharif', yield: 3800, rainfall: 650, temperature: 29.5, efficiency: 85 },
          { season: 'Rabi', yield: 3200, rainfall: 200, temperature: 25.0, efficiency: 78 },
          { season: 'Summer', yield: 2800, rainfall: 100, temperature: 32.0, efficiency: 72 }
        ],
        districtComparison: [
          { district: 'Chennai', yield: 4200, efficiency: 88, cost: 15000 },
          { district: 'Coimbatore', yield: 3800, efficiency: 82, cost: 14000 },
          { district: 'Madurai', yield: 3600, efficiency: 79, cost: 13500 },
          { district: 'Salem', yield: 3400, efficiency: 76, cost: 13000 },
          { district: 'Tirunelveli', yield: 3200, efficiency: 74, cost: 12500 }
        ],
        cropHealthMetrics: [
          { metric: 'NDVI', value: 0.75, status: 'Excellent' },
          { metric: 'EVI', value: 0.45, status: 'Good' },
          { metric: 'Soil Health', value: 8.2, status: 'Good' },
          { metric: 'Water Stress', value: 0.15, status: 'Low' },
          { metric: 'Nutrient Balance', value: 0.85, status: 'Excellent' }
        ],
        weatherImpact: [
          { factor: 'Rainfall', impact: 0.35, correlation: 0.78 },
          { factor: 'Temperature', impact: 0.28, correlation: -0.65 },
          { factor: 'Humidity', impact: 0.15, correlation: 0.42 },
          { factor: 'Wind Speed', impact: 0.08, correlation: -0.23 },
          { factor: 'Solar Radiation', impact: 0.14, correlation: 0.58 }
        ],
        costAnalysis: [
          { category: 'Fertilizers', cost: 8000, percentage: 40 },
          { category: 'Seeds', cost: 3000, percentage: 15 },
          { category: 'Pesticides', cost: 2500, percentage: 12.5 },
          { category: 'Labor', cost: 4000, percentage: 20 },
          { category: 'Irrigation', cost: 2500, percentage: 12.5 }
        ]
      };
      
      setAnalyticsData(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedDistrict]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analyticsData) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            📊 Advanced Analytics Dashboard
          </Typography>
          <Typography variant="body1">
            Comprehensive AI-driven insights for crop yield optimization and agricultural decision making
          </Typography>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="prediction-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg Yield (5 Years)
              </Typography>
              <Typography variant="h3">
                {Math.round(analyticsData.yieldTrends.reduce((sum, item) => sum + item.yield, 0) / analyticsData.yieldTrends.length)}
              </Typography>
              <Typography variant="body2">kg/ha</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="weather-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Efficiency Score
              </Typography>
              <Typography variant="h3">82%</Typography>
              <Typography variant="body2">Above Average</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="soil-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ROI Improvement
              </Typography>
              <Typography variant="h3">+24%</Typography>
              <Typography variant="body2">vs Traditional</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="recommendation-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Reduction
              </Typography>
              <Typography variant="h3">-18%</Typography>
              <Typography variant="body2">Input Costs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Yield Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historical Yield Trends & Weather Correlation
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.yieldTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#8884d8" strokeWidth={3} name="Yield (kg/ha)" />
                  <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#82ca9d" strokeWidth={2} name="Rainfall (mm)" />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ffc658" strokeWidth={2} name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seasonal Performance
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.seasonalAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="yield" fill="#8884d8" name="Yield (kg/ha)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* District Comparison & Cost Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                District Performance Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.districtComparison} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="district" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="yield" fill="#8884d8" name="Yield (kg/ha)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Breakdown Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.costAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cost"
                  >
                    {analyticsData.costAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weather Impact & Crop Health */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Impact Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={analyticsData.weatherImpact}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar name="Impact" dataKey="impact" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Crop Health Metrics
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analyticsData.cropHealthMetrics.map((metric, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {metric.metric}
                      </Typography>
                      <Chip 
                        label={metric.status} 
                        color={metric.status === 'Excellent' ? 'success' : metric.status === 'Good' ? 'primary' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" color="primary">
                      {metric.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🤖 AI-Generated Insights & Recommendations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  📈 Yield Optimization
                </Typography>
                <Typography variant="body2">
                  Based on historical data, implementing precision irrigation could increase yield by 15-20% during dry seasons.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="secondary" gutterBottom>
                  💰 Cost Efficiency
                </Typography>
                <Typography variant="body2">
                  Optimizing fertilizer application timing could reduce costs by ₹2,500 per hectare while maintaining yield.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="success.main" gutterBottom>
                  🌱 Sustainability
                </Typography>
                <Typography variant="body2">
                  Current practices show 85% sustainability score. Focus on organic matter improvement for better soil health.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
