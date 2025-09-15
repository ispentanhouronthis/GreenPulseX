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
  const satelliteData = dashboardData?.vegetation_health || {};

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
    <Box sx={{ p: 3 }}>
      {/* District Selector */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Select Location
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>State</InputLabel>
                <Select value={selectedState} onChange={handleStateChange} label="State">
                  {Object.keys(districts.states || {}).map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>District</InputLabel>
                <Select value={selectedDistrict.district} onChange={handleDistrictChange} label="District">
                  {districts.states?.[selectedState]?.map(district => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" onClick={loadDashboardData} fullWidth size="large" sx={{ height: '56px' }}>
                Refresh Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Current Status Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Current Weather
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                {weatherData.temperature || 28}°C
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Rainfall: {weatherData.rainfall || 50}mm
              </Typography>
              <Typography variant="body1">
                Humidity: {weatherData.humidity || 70}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Soil Health
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                pH {soilData.ph || 7.0}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                N: {soilData.nitrogen_kg_per_ha || 110} kg/ha
              </Typography>
              <Typography variant="body1">
                P: {soilData.phosphorus_kg_per_ha || 22} kg/ha
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Market Price
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                ₹{marketData.current_price || 2000}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Per Quintal
              </Typography>
              <Typography variant="body1">
                {marketData.market || 'Regional Market'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Vegetation Health & Satellite
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {satelliteData.vegetation_health || 'Good'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                NDVI: {satelliteData.ndvi || 0.6}
              </Typography>
              <Typography variant="body1">
                Coverage: {satelliteData.crop_coverage_percent || 80}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Historical Yield Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                Feature Importance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureImportanceData} layout="horizontal" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.3]} />
                  <YAxis dataKey="feature" type="category" width={100} />
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
