from flask_restful import Resource
import logging
from backend.data.real_agricultural_data import RealAgriculturalData # Added import

logger = logging.getLogger(__name__)

class RecommendationsAPI(Resource):
    def __init__(self, optimization_engine):
        self.optimization_engine = optimization_engine
        self.agricultural_data = RealAgriculturalData() # Added instantiation
    
    def post(self):
        """Get optimization recommendations"""
        try:
            from flask import request
            data = request.get_json()
            
            # Extract parameters
            predicted_yield = data.get('predicted_yield', 3000)
            district_avg_yield = data.get('district_average_yield', 3000)
            crop_stage = data.get('crop_stage', 'mid_season')

            # Extract latitude and longitude from request
            lat = data.get('latitude')
            lon = data.get('longitude')

            if lat is None or lon is None:
                return {'error': 'Latitude and Longitude are required for real-time data fetching'}, 400

            # Fetch real-time weather and soil data
            weather_data = self.agricultural_data.get_real_weather_data(lat, lon)
            soil_data = self.agricultural_data.get_soil_data(lat, lon)
            
            # Generate fertilizer recommendations
            fertilizer_recs = self.optimization_engine.generate_fertilizer_recommendations(
                predicted_yield, soil_data, district_avg_yield
            )
            
            # Generate irrigation recommendations
            irrigation_recs = self.optimization_engine.generate_irrigation_schedule(
                weather_data, crop_stage, soil_data
            )
            
            # Get market prices
            from data.data_processor import DataProcessor
            data_processor = DataProcessor()
            market_prices = data_processor.get_market_prices()
            
            # Calculate potential revenue
            potential_revenue = predicted_yield * (market_prices['current_price'] / 100)  # Convert to per hectare
            
            recommendations = {
                'fertilizer_recommendations': fertilizer_recs,
                'irrigation_recommendations': irrigation_recs,
                'market_analysis': {
                    'current_price': market_prices['current_price'],
                    'price_unit': market_prices['price_unit'],
                    'market': market_prices['market'],
                    'last_updated': market_prices['last_updated']
                },
                'economic_analysis': {
                    'predicted_yield_kg_per_ha': predicted_yield,
                    'potential_revenue_per_ha': round(potential_revenue, 0),
                    'total_fertilizer_cost': fertilizer_recs['total_cost_estimate'],
                    'net_profit_estimate': round(potential_revenue - fertilizer_recs['total_cost_estimate'], 0)
                },
                'crop_management_tips': self._get_crop_management_tips(predicted_yield, district_avg_yield)
            }
            
            return recommendations, 200
            
        except Exception as e:
            logger.error(f"Error in recommendations API: {str(e)}")
            return {'error': 'Failed to generate recommendations'}, 500
    
    def _get_crop_management_tips(self, predicted_yield, district_avg_yield):
        """Get crop management tips based on prediction"""
        yield_ratio = predicted_yield / district_avg_yield if district_avg_yield > 0 else 1.0
        
        tips = []
        
        if yield_ratio > 1.1:
            tips.extend([
                "High yield potential detected - ensure adequate water supply during critical growth stages",
                "Consider increasing plant density for maximum yield realization",
                "Monitor for pest and disease pressure due to dense canopy"
            ])
        elif yield_ratio < 0.9:
            tips.extend([
                "Lower yield expected - focus on cost optimization",
                "Consider drought-resistant varieties for future seasons",
                "Implement water conservation techniques"
            ])
        else:
            tips.extend([
                "Normal yield potential - maintain standard management practices",
                "Monitor weather conditions closely",
                "Ensure timely application of inputs"
            ])
        
        # Add general tips
        tips.extend([
            "Regular soil testing helps optimize fertilizer use",
            "Use weather forecasts for irrigation planning",
            "Consider crop insurance for risk mitigation"
        ])
        
        return tips
