import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, CircularProgress, 
  Alert, Chip, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Recommendations = ({ selectedDistrict }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First get prediction
      const predictionResponse = await axios.post('http://localhost:5000/api/predictions', {
        district: selectedDistrict.district,
        state: selectedDistrict.state,
        latitude: selectedDistrict.latitude,
        longitude: selectedDistrict.longitude,
        year: 2024,
        season: 'Kharif'
      });
      
      setPrediction(predictionResponse.data);
      
      // Then get recommendations
      const recResponse = await axios.post('http://localhost:5000/api/recommendations', {
        predicted_yield: predictionResponse.data.predicted_yield,
        soil_data: predictionResponse.data.soil_data,
        district_average_yield: predictionResponse.data.district_average_yield,
        weather_data: predictionResponse.data.weather_data,
        crop_stage: 'mid_season'
      });
      
      setRecommendations(recResponse.data);
    } catch (err) {
      setError('Failed to generate recommendations');
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
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

  if (!recommendations) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No recommendations available. Please generate a prediction first.
        </Typography>
        <Button variant="contained" onClick={generateRecommendations} sx={{ mt: 2 }}>
          Generate Recommendations
        </Button>
      </Box>
    );
  }

  const fertilizerData = [
    { nutrient: 'Nitrogen', amount: recommendations.fertilizer_recommendations.nitrogen.amount_kg_per_ha, cost: 25 },
    { nutrient: 'Phosphorus', amount: recommendations.fertilizer_recommendations.phosphorus.amount_kg_per_ha, cost: 35 },
    { nutrient: 'Potassium', amount: recommendations.fertilizer_recommendations.potassium.amount_kg_per_ha, cost: 30 }
  ];

  return (
    <Box>
      {/* Economic Analysis */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Economic Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">Predicted Yield</Typography>
              <Typography variant="h4">{recommendations.economic_analysis.predicted_yield_kg_per_ha} kg/ha</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">Potential Revenue</Typography>
              <Typography variant="h4">₹{recommendations.economic_analysis.potential_revenue_per_ha.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">Fertilizer Cost</Typography>
              <Typography variant="h4">₹{recommendations.economic_analysis.total_fertilizer_cost}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">Net Profit</Typography>
              <Typography variant="h4" color="lightgreen">
                ₹{recommendations.economic_analysis.net_profit_estimate.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Fertilizer Recommendations */}
        <Grid item xs={12} md={6}>
          <Card className="recommendation-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fertilizer Recommendations
              </Typography>
              
              {/* Nitrogen */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Nitrogen (N)
                </Typography>
                <Typography variant="h5">
                  {recommendations.fertilizer_recommendations.nitrogen.amount_kg_per_ha} kg/ha
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {recommendations.fertilizer_recommendations.nitrogen.reasoning}
                </Typography>
                <Chip 
                  label={`${recommendations.fertilizer_recommendations.nitrogen.adjustment_factor}x`} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Phosphorus */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Phosphorus (P)
                </Typography>
                <Typography variant="h5">
                  {recommendations.fertilizer_recommendations.phosphorus.amount_kg_per_ha} kg/ha
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {recommendations.fertilizer_recommendations.phosphorus.reasoning}
                </Typography>
                <Chip 
                  label={`${recommendations.fertilizer_recommendations.phosphorus.adjustment_factor}x`} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Potassium */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Potassium (K)
                </Typography>
                <Typography variant="h5">
                  {recommendations.fertilizer_recommendations.potassium.amount_kg_per_ha} kg/ha
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {recommendations.fertilizer_recommendations.potassium.reasoning}
                </Typography>
                <Chip 
                  label={`${recommendations.fertilizer_recommendations.potassium.adjustment_factor}x`} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Cost: ₹{recommendations.fertilizer_recommendations.total_cost_estimate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Irrigation Recommendations */}
        <Grid item xs={12} md={6}>
          <Card className="weather-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Irrigation Schedule
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Current Soil Moisture</Typography>
                <Typography variant="h4">
                  {(recommendations.irrigation_recommendations.current_moisture_level * 100).toFixed(0)}%
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Irrigation Status</Typography>
                <Chip 
                  label={recommendations.irrigation_recommendations.irrigation_needed ? 'Needed' : 'Not Needed'}
                  color={recommendations.irrigation_recommendations.irrigation_needed ? 'error' : 'success'}
                  sx={{ mb: 1 }}
                />
                {recommendations.irrigation_recommendations.irrigation_needed && (
                  <Box>
                    <Typography variant="body2">
                      Amount: {recommendations.irrigation_recommendations.recommended_amount} mm
                    </Typography>
                    <Typography variant="body2">
                      Date: {recommendations.irrigation_recommendations.next_irrigation_date}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Critical Irrigation Periods
              </Typography>
              <List dense>
                {recommendations.irrigation_recommendations.critical_periods.map((period, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={period} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Fertilizer Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fertilizer Requirements
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fertilizerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nutrient" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Analysis */}
        <Grid item xs={12} md={6}>
          <Card className="soil-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Analysis
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Current Rice Price</Typography>
                <Typography variant="h4">
                  ₹{recommendations.market_analysis.current_price} per quintal
                </Typography>
                <Typography variant="body2">
                  Market: {recommendations.market_analysis.market}
                </Typography>
                <Typography variant="body2">
                  Last Updated: {recommendations.market_analysis.last_updated}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Timing */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fertilizer Application Timing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Nitrogen Application
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Basal (25%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.nitrogen.basal}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Top Dress 1 (35%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.nitrogen.top_dress_1}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Top Dress 2 (40%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.nitrogen.top_dress_2}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Phosphorus Application
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Basal (100%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.phosphorus.basal}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Potassium Application
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Basal (50%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.potassium.basal}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Top Dress (50%)" 
                        secondary={recommendations.fertilizer_recommendations.application_timing.potassium.top_dress}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Crop Management Tips */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Crop Management Tips
              </Typography>
              <Grid container spacing={2}>
                {recommendations.crop_management_tips.map((tip, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, height: '100%' }}>
                      <Typography variant="body2">{tip}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommendations;