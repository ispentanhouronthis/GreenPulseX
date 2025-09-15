import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';

const Dashboard = ({ selectedDistrict, onDistrictSelect, districts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    const coordinates = getCoordinates(district, selectedState);
    onDistrictSelect({
      district,
      state: selectedState,
      ...coordinates
    });
  };

  const getCoordinates = (district, state) => {
    const coordinates = {
      'Chennai': { latitude: 13.0827, longitude: 80.2707 },
      'Coimbatore': { latitude: 11.0168, longitude: 76.9558 },
      'Madurai': { latitude: 9.9252, longitude: 78.1198 },
      'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
      'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
      'Delhi': { latitude: 28.7041, longitude: 77.1025 },
      'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
      'Hyderabad': { latitude: 17.3850, longitude: 78.4867 }
    };
    return coordinates[district] || { latitude: 13.0827, longitude: 80.2707 };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/districts', {
        district: selectedDistrict.district,
        state: selectedDistrict.state,
        latitude: selectedDistrict.latitude,
        longitude: selectedDistrict.longitude
      });
      
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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

  const weatherData = dashboardData?.current_weather || {};
  const soilData = dashboardData?.soil_characteristics || {};
  const marketData = dashboardData?.market_prices || {};

  // Sample historical data for charts
  const historicalData = [
    { month: 'Jan', yield: 3200, rainfall: 15 },
    { month: 'Feb', yield: 3300, rainfall: 20 },
    { month: 'Mar', yield: 3400, rainfall: 25 },
    { month: 'Apr', yield: 3500, rainfall: 30 },
    { month: 'May', yield: 3600, rainfall: 35 },
    { month: 'Jun', yield: 3700, rainfall: 40 },
    { month: 'Jul', yield: 3800, rainfall: 45 },
    { month: 'Aug', yield: 3900, rainfall: 50 },
    { month: 'Sep', yield: 4000, rainfall: 45 },
    { month: 'Oct', yield: 3900, rainfall: 40 },
    { month: 'Nov', yield: 3800, rainfall: 35 },
    { month: 'Dec', yield: 3700, rainfall: 30 }
  ];

  const featureImportanceData = [
    { feature: 'Rainfall', importance: 0.25 },
    { feature: 'Temperature', importance: 0.20 },
    { feature: 'Soil N', importance: 0.15 },
    { feature: 'NDVI', importance: 0.12 },
    { feature: 'Soil P', importance: 0.10 },
    { feature: 'Soil K', importance: 0.08 },
    { feature: 'Humidity', importance: 0.05 },
    { feature: 'Pressure', importance: 0.05 }
  ];

  return (
    <Box>
      {/* District Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select District
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select value={selectedState} onChange={handleStateChange}>
                  {Object.keys(districts.states || {}).map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select value={selectedDistrict.district} onChange={handleDistrictChange}>
                  {districts.states?.[selectedState]?.map(district => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" onClick={loadDashboardData} fullWidth>
                Refresh Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Current Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card className="weather-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Weather
              </Typography>
              <Typography variant="h4">
                {weatherData.avg_temperature || 28}°C
              </Typography>
              <Typography variant="body2">
                Rainfall: {weatherData.total_rainfall || 50}mm
              </Typography>
              <Typography variant="body2">
                Humidity: {weatherData.humidity || 70}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="soil-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Soil Health
              </Typography>
              <Typography variant="h4">
                pH {soilData.ph || 7.0}
              </Typography>
              <Typography variant="body2">
                N: {soilData.nitrogen || 110} kg/ha
              </Typography>
              <Typography variant="body2">
                P: {soilData.phosphorus || 22} kg/ha
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="prediction-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Price
              </Typography>
              <Typography variant="h4">
                ₹{marketData.current_price || 2000}
              </Typography>
              <Typography variant="body2">
                Per Quintal
              </Typography>
              <Typography variant="body2">
                {marketData.market || 'Regional Market'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="recommendation-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vegetation Health
              </Typography>
              <Typography variant="h4">
                {((soilData.organic_carbon || 0.7) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                Organic Carbon
              </Typography>
              <Typography variant="body2">
                Depth: {soilData.depth || 120}cm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historical Yield Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="yield" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Importance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureImportanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.3]} />
                  <YAxis dataKey="feature" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="importance" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
