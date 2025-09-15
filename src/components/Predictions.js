import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert, Chip
} from '@mui/material';
import axios from 'axios';

const Predictions = ({ selectedDistrict, onDistrictSelect, districts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [season, setSeason] = useState('Kharif');

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

  const generatePrediction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/predictions', {
        district: selectedDistrict.district,
        state: selectedDistrict.state,
        latitude: selectedDistrict.latitude,
        longitude: selectedDistrict.longitude,
        year: 2024,
        season: season
      });
      
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to generate prediction');
      console.error('Error generating prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getYieldStatus = (yieldValue, avgYield) => {
    const ratio = yieldValue / avgYield;
    if (ratio > 1.1) return { status: 'Excellent', color: 'success' };
    if (ratio > 0.9) return { status: 'Good', color: 'primary' };
    if (ratio > 0.7) return { status: 'Fair', color: 'warning' };
    return { status: 'Poor', color: 'error' };
  };

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

  const yieldStatus = prediction ? getYieldStatus(prediction.predicted_yield, prediction.district_average_yield) : null;

  return (
    <Box>
      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Yield Prediction Parameters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select value={selectedState} onChange={handleStateChange}>
                  {Object.keys(districts.states || {}).map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select value={selectedDistrict.district} onChange={handleDistrictChange}>
                  {districts.states?.[selectedState]?.map(district => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select value={season} onChange={(e) => setSeason(e.target.value)}>
                  <MenuItem value="Kharif">Kharif</MenuItem>
                  <MenuItem value="Rabi">Rabi</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button 
                variant="contained" 
                onClick={generatePrediction} 
                fullWidth
                size="large"
              >
                Predict Yield
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {prediction && (
        <Grid container spacing={3}>
          {/* Main Prediction Card */}
          <Grid item xs={12} md={6}>
            <Card className="prediction-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Yield Prediction
                </Typography>
                <Box className="gauge-container">
                  <Typography variant="h2" component="div">
                    {prediction.predicted_yield}
                  </Typography>
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    kg/ha
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={yieldStatus.status} 
                    color={yieldStatus.color}
                    size="large"
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  vs District Average: {prediction.yield_vs_average > 0 ? '+' : ''}{prediction.yield_vs_average}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Weather Data */}
          <Grid item xs={12} md={6}>
            <Card className="weather-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weather Conditions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Temperature</Typography>
                    <Typography variant="h6">{prediction.weather_data.avg_temperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Rainfall</Typography>
                    <Typography variant="h6">{prediction.weather_data.total_rainfall}mm</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Heat Stress Days</Typography>
                    <Typography variant="h6">{prediction.weather_data.heat_stress_days}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Dry Spells</Typography>
                    <Typography variant="h6">{prediction.weather_data.dry_spell_count}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Soil Data */}
          <Grid item xs={12} md={6}>
            <Card className="soil-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Soil Characteristics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">pH Level</Typography>
                    <Typography variant="h6">{prediction.soil_data.ph}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Organic Carbon</Typography>
                    <Typography variant="h6">{(prediction.soil_data.organic_carbon * 100).toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Nitrogen</Typography>
                    <Typography variant="h6">{prediction.soil_data.nitrogen}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Phosphorus</Typography>
                    <Typography variant="h6">{prediction.soil_data.phosphorus}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Potassium</Typography>
                    <Typography variant="h6">{prediction.soil_data.potassium}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Satellite Data */}
          <Grid item xs={12} md={6}>
            <Card className="recommendation-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vegetation Health
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Peak NDVI</Typography>
                    <Typography variant="h6">{prediction.satellite_data.peak_ndvi}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Peak EVI</Typography>
                    <Typography variant="h6">{prediction.satellite_data.peak_evi}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Time to Peak</Typography>
                    <Typography variant="h6">{prediction.satellite_data.time_to_peak_ndvi} weeks</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Integrated NDVI</Typography>
                    <Typography variant="h6">{prediction.satellite_data.integrated_ndvi}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature Importance */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Factors Affecting Yield
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(prediction.feature_importance || {})
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([feature, importance]) => (
                      <Grid item xs={12} sm={6} md={3} key={feature}>
                        <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            {feature.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {(importance * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Predictions;
