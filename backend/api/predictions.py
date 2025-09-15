from flask_restful import Resource
import logging

logger = logging.getLogger(__name__)

class PredictionsAPI(Resource):
    def __init__(self, yield_predictor):
        self.yield_predictor = yield_predictor
    
    def post(self):
        """Get yield prediction for given parameters"""
        try:
            from flask import request
            data = request.get_json()
            
            # Extract parameters
            district = data.get('district', 'Chennai')
            state = data.get('state', 'Tamil Nadu')
            year = data.get('year', 2024)
            season = data.get('season', 'Kharif')
            lat = data.get('latitude', 13.0827)
            lon = data.get('longitude', 80.2707)
            
            # Get live data
            from data.data_processor import DataProcessor
            data_processor = DataProcessor()
            
            weather_data = data_processor.get_weather_data(lat, lon)
            soil_data = data_processor.get_soil_data(lat, lon)
            satellite_data = data_processor.get_satellite_data(lat, lon, year)
            
            # Get district average yield (simulated)
            district_avg_yield = self._get_district_average_yield(district, state)
            
            # Make prediction
            prediction = self.yield_predictor.predict_yield(
                district, year, season, weather_data, soil_data, satellite_data
            )
            
            # Add additional information
            prediction.update({
                'weather_data': weather_data,
                'soil_data': soil_data,
                'satellite_data': satellite_data,
                'district_average_yield': district_avg_yield,
                'yield_vs_average': round((prediction['predicted_yield'] / district_avg_yield - 1) * 100, 1)
            })
            
            return prediction, 200
            
        except Exception as e:
            logger.error(f"Error in prediction API: {str(e)}")
            return {'error': 'Failed to generate prediction'}, 500
    
    def _get_district_average_yield(self, district, state):
        """Get district average yield (simulated data)"""
        # Simulated average yields by state
        state_averages = {
            'Tamil Nadu': 3500,
            'Karnataka': 3200,
            'Maharashtra': 2800,
            'Punjab': 4200,
            'Haryana': 4000,
            'Gujarat': 3000,
            'Rajasthan': 2500,
            'West Bengal': 3800,
            'Bihar': 3600,
            'Uttar Pradesh': 3200
        }
        
        base_yield = state_averages.get(state, 3000)
        
        # Add some district-level variation
        import random
        variation = random.uniform(0.8, 1.2)
        
        return int(base_yield * variation)
