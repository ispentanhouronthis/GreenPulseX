import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ selectedDistrict, onDistrictSelect, districts }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample district coordinates for major districts
  const districtCoordinates = {
    'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
    'Coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
    'Madurai': { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
    'Tiruchirappalli': { lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
    'Salem': { lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
    'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    'Mysore': { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
    'Hubli': { lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
    'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
    'Nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
    'Delhi': { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
    'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
    'Chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Punjab' },
    'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    'Patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
    'Lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
    'Kanpur': { lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    setLoading(true);
    try {
      // Simulate loading data for all districts
      const data = Object.entries(districtCoordinates).map(([district, coords]) => ({
        district,
        state: coords.state,
        lat: coords.lat,
        lng: coords.lng,
        yield: Math.floor(Math.random() * 2000) + 2000, // Simulated yield
        status: Math.random() > 0.5 ? 'Good' : 'Fair'
      }));
      setMapData(data);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'success';
      case 'Good': return 'primary';
      case 'Fair': return 'warning';
      case 'Poor': return 'error';
      default: return 'default';
    }
  };

  const getYieldStatus = (yieldValue) => {
    if (yieldValue > 4000) return 'Excellent';
    if (yieldValue > 3500) return 'Good';
    if (yieldValue > 3000) return 'Fair';
    return 'Poor';
  };

  const MapCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedDistrict.latitude && selectedDistrict.longitude) {
        map.setView([selectedDistrict.latitude, selectedDistrict.longitude], 6);
      }
    }, [selectedDistrict, map]);
    return null;
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Agricultural Yield Map - India
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Click on markers to view district information and generate predictions
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: '500px', width: '100%' }}>
            <MapContainer
              center={[selectedDistrict.latitude || 20.5937, selectedDistrict.longitude || 78.9629]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <MapCenter />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {mapData.map((location) => {
                const status = getYieldStatus(location.yield);
                const color = getStatusColor(status);
                
                return (
                  <Marker
                    key={location.district}
                    position={[location.lat, location.lng]}
                    eventHandlers={{
                      click: () => {
                        onDistrictSelect({
                          district: location.district,
                          state: location.state,
                          latitude: location.lat,
                          longitude: location.lng
                        });
                      }
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="h6" gutterBottom>
                          {location.district}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {location.state}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2">Yield:</Typography>
                          <Typography variant="h6">{location.yield} kg/ha</Typography>
                        </Box>
                        <Chip 
                          label={status} 
                          color={color}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Click to select this district
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%' }} />
              <Typography variant="body2">Excellent (>4000 kg/ha)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'primary.main', borderRadius: '50%' }} />
              <Typography variant="body2">Good (3500-4000 kg/ha)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%' }} />
              <Typography variant="body2">Fair (3000-3500 kg/ha)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: '50%' }} />
              <Typography variant="body2">Poor (&lt;3000 kg/ha)</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MapView;
