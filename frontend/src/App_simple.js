import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
  },
});

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const testPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: 'Chennai',
          state: 'Tamil Nadu',
          season: 'Kharif'
        })
      });
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error:', error);
      setPrediction({ error: 'Failed to connect to backend' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              🌾 Agri-Siddhi - AI Agricultural Platform
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Test AI Prediction
              </Typography>
              <Typography variant="body1" paragraph>
                Click the button below to test the AI yield prediction system.
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={testPrediction}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Testing...' : 'Test AI Prediction'}
              </Button>

              {prediction && (
                <Box sx={{ mt: 2 }}>
                  {prediction.error ? (
                    <Typography color="error">
                      Error: {prediction.error}
                    </Typography>
                  ) : (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        AI Prediction Results:
                      </Typography>
                      <Typography>
                        <strong>District:</strong> {prediction.district}
                      </Typography>
                      <Typography>
                        <strong>Predicted Yield:</strong> {prediction.predicted_yield} kg/ha
                      </Typography>
                      <Typography>
                        <strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%
                      </Typography>
                      <Typography>
                        <strong>Temperature:</strong> {prediction.weather_data?.temperature}°C
                      </Typography>
                      <Typography>
                        <strong>Rainfall:</strong> {prediction.weather_data?.rainfall} mm
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;

