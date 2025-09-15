import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip,
  Grid, Container, Fade, Zoom
} from '@mui/material';
import { green, orange } from '@mui/material/colors';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "🌱 Initializing AI Models...",
    "📊 Loading Agricultural Data...",
    "🗺️ Mapping Districts...",
    "🤖 Training Prediction Engine...",
    "💡 Optimizing Recommendations...",
    "✅ System Ready!"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 100);

    const stepTimer = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep >= steps.length - 1) {
          clearInterval(stepTimer);
          return steps.length - 1;
        }
        return prevStep + 1;
      });
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        color: 'white'
      }}
    >
      <Fade in timeout={1000}>
        <Card sx={{ 
          maxWidth: 600, 
          width: '90%', 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Zoom in timeout={1500}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                🌾 Agri-Siddhi
              </Typography>
            </Zoom>
            
            <Typography variant="h5" gutterBottom sx={{ mb: 2, opacity: 0.9 }}>
              AI-Powered Crop Yield Prediction & Optimization
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
              Smart India Hackathon 2024
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {steps[currentStep]}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {progress}% Complete
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <Chip 
                  label="🔮 AI Prediction" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label="💡 Smart Optimization" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label="🗺️ Real-time Data" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label="📊 Analytics" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default SplashScreen;
