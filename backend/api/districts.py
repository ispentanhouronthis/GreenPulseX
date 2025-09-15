from flask_restful import Resource
import logging

logger = logging.getLogger(__name__)

class DistrictsAPI(Resource):
    def __init__(self, data_processor):
        self.data_processor = data_processor
    
    def get(self):
        """Get list of all Indian districts and states"""
        try:
            districts = self.data_processor.get_district_list()
            return districts, 200
        except Exception as e:
            logger.error(f"Error fetching districts: {str(e)}")
            return {'error': 'Failed to fetch district list'}, 500
    
    def post(self):
        """Get specific district information"""
        try:
            from flask import request
            data = request.get_json()
            
            district = data.get('district', 'Chennai')
            state = data.get('state', 'Tamil Nadu')
            lat = data.get('latitude', 13.0827)
            lon = data.get('longitude', 80.2707)
            
            # Get district-specific data
            weather_data = self.data_processor.get_weather_data(lat, lon)
            soil_data = self.data_processor.get_soil_data(state, district)
            satellite_data = self.data_processor.get_satellite_data(lat, lon)
            market_prices = self.data_processor.get_market_prices()
            
            district_info = {
                'district': district,
                'state': state,
                'coordinates': {'latitude': lat, 'longitude': lon},
                'current_weather': weather_data,
                'soil_characteristics': soil_data,
                'vegetation_health': satellite_data,
                'market_prices': market_prices,
                'data_status': self.data_processor.get_data_status()
            }
            
            return district_info, 200
            
        except Exception as e:
            logger.error(f"Error fetching district info: {str(e)}")
            return {'error': 'Failed to fetch district information'}, 500
