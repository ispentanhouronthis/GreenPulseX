import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { green, orange } from '@mui/material/colors';
import Dashboard from './components/Dashboard';
import Predictions from './components/Predictions';
import Recommendations from './components/Recommendations';
import MapView from './components/RealMapView';
import Analytics from './components/Analytics';
import SplashScreen from './components/SplashScreen';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: orange[600],
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [districts, setDistricts] = useState({});
  const [showSplash, setShowSplash] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState({
    district: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707
  });

  useEffect(() => {
    // Load districts data
    fetch('http://localhost:5000/api/districts')
      .then(response => response.json())
      .then(data => setDistricts(data))
      .catch(error => console.error('Error loading districts:', error));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              🌾 Agri-Siddhi
            </Typography>
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              AI-Powered Crop Yield Prediction & Optimization
            </Typography>
            <Typography variant="caption" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
              Smart India Hackathon 2024
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="main tabs">
              <Tab label="🏠 Dashboard" />
              <Tab label="🔮 AI Prediction" />
              <Tab label="💡 Optimization" />
              <Tab label="🗺️ Map View" />
              <Tab label="📊 Analytics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Dashboard 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
              districts={districts}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Predictions 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
              districts={districts}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Recommendations 
              selectedDistrict={selectedDistrict}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <MapView 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
              districts={districts}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Analytics 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
              districts={districts}
            />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
