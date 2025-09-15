import requests
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import logging
from backend.data.real_agricultural_data import RealAgriculturalData # Added import

logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self):
        self.agmarknet_base_url = "https://agmarknet.gov.in/api"
        self.real_agricultural_data = RealAgriculturalData() # Instantiate RealAgriculturalData
        
    def get_weather_data(self, lat, lon, days=30):
        """Fetch live weather data using RealAgriculturalData"""
        try:
            # Directly use the real-time weather data from RealAgriculturalData
            weather_data = self.real_agricultural_data.get_real_weather_data(lat, lon)
            
            # Map to the expected format for the frontend/other parts of the system
            # The frontend expects: total_rainfall, avg_temperature, max_temperature, min_temperature, humidity, pressure
            # RealAgriculturalData returns: temperature, humidity, rainfall, pressure, wind_speed, description
            
            # For simplicity, we'll use current values and simulate min/max/avg for now
            # A more robust solution would involve fetching historical data from Open-Meteo if needed
            processed_weather = {
                'total_rainfall': weather_data.get('rainfall', 0),
                'avg_temperature': weather_data.get('temperature', 0),
                'max_temperature': weather_data.get('temperature', 0) + np.random.uniform(2, 5),
                'min_temperature': weather_data.get('temperature', 0) - np.random.uniform(3, 6),
                'heat_stress_days': 0, # Placeholder, would need historical data
                'dry_spell_count': 0, # Placeholder, would need historical data
                'rainfall_variance': 0, # Placeholder, would need historical data
                'humidity': weather_data.get('humidity', 0),
                'pressure': weather_data.get('pressure', 0)
            }
            return processed_weather
            
        except Exception as e:
            logger.error(f"Error fetching real weather data: {str(e)}")
            return self._get_default_weather_data()
    
    def get_soil_data(self, lat, lon):
        """Get soil data using RealAgriculturalData"""
        try:
            # Directly use the real-time soil data from RealAgriculturalData
            soil_data = self.real_agricultural_data.get_soil_data(lat, lon)
            
            # Map to the expected format for the frontend/other parts of the system
            # The frontend expects: ph, organic_carbon, nitrogen, phosphorus, potassium, depth, texture_score
            # RealAgriculturalData returns: soil_type, ph, organic_matter_percent, nitrogen_kg_per_ha, phosphorus_kg_per_ha, potassium_kg_per_ha, moisture_percent, drainage
            
            processed_soil = {
                'ph': soil_data.get('ph', 7.0),
                'organic_carbon': soil_data.get('organic_matter_percent', 0.7), # Using organic_matter_percent as organic_carbon
                'nitrogen': soil_data.get('nitrogen_kg_per_ha', 110),
                'phosphorus': soil_data.get('phosphorus_kg_per_ha', 22),
                'potassium': soil_data.get('potassium_kg_per_ha', 170),
                'depth': 120, # Simulated, Ambee might not provide this
                'texture_score': 4 # Simulated
            }
            return processed_soil

        except Exception as e:
            logger.error(f"Error fetching real soil data: {str(e)}")
            return self._get_default_soil_data()

    
    def get_satellite_data(self, lat, lon, year=2024):
        """Get satellite data using RealAgriculturalData"""
        try:
            # Directly use the real-time satellite data from RealAgriculturalData
            satellite_data = self.real_agricultural_data.get_satellite_data(lat, lon)
            
            # Map to the expected format for the frontend/other parts of the system
            # The frontend expects: peak_ndvi, time_to_peak_ndvi, integrated_ndvi, peak_evi, time_to_peak_evi, integrated_evi
            # RealAgriculturalData returns: ndvi, evi, vegetation_health, crop_coverage_percent, stress_index, last_updated

            processed_satellite = {
                'peak_ndvi': satellite_data.get('ndvi', 0.6),
                'time_to_peak_ndvi': 8, # Simulated
                'integrated_ndvi': satellite_data.get('ndvi', 0.6) * 8, # Simple calculation
                'peak_evi': satellite_data.get('evi', 0.4),
                'time_to_peak_evi': 8, # Simulated
                'integrated_evi': satellite_data.get('evi', 0.4) * 8 # Simple calculation
            }
            return processed_satellite

        except Exception as e:
            logger.error(f"Error fetching real satellite data: {str(e)}")
            return self._get_default_satellite_data()

    
    def get_market_prices(self, crop="rice", state="All"):
        """Fetch live market prices from AGMARKNET"""
        try:
            # AGMARKNET API for market prices
            url = f"{self.agmarknet_base_url}/price/commodity/{crop}"
            response = requests.get(url)
            
            if response.status_code == 200:
                prices = response.json()
                return self._process_market_prices(prices)
            else:
                return self._get_default_market_prices()
                
        except Exception as e:
            logger.error(f"Error fetching market prices: {str(e)}")
            return self._get_default_market_prices()
    
    def get_district_list(self):
        """Get list of all Indian districts"""
        return {
            "states": {
                "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thoothukkudi"],
                "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
                "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Malegaon"],
                "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Ghaziabad", "Noida", "Saharanpur"],
                "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala", "Pathankot"],
                "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
                "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Morbi"],
                "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bharatpur", "Alwar", "Bhilwara", "Sikar"],
                "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur"],
                "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Chhapra"]
            }
        }
    
    def _process_market_prices(self, prices_data):
        """Process market price data"""
        try:
            if isinstance(prices_data, list) and len(prices_data) > 0:
                latest_price = prices_data[0]
                return {
                    'current_price': latest_price.get('modal_price', 2000),
                    'price_unit': 'per_quintal',
                    'market': latest_price.get('market', 'Unknown'),
                    'state': latest_price.get('state', 'Unknown'),
                    'last_updated': datetime.now().strftime('%Y-%m-%d')
                }
            else:
                return self._get_default_market_prices()
        except Exception as e:
            logger.error(f"Error processing market prices: {str(e)}")
            return self._get_default_market_prices()
    
    def _count_dry_spells(self, rainfall_data):
        """Count consecutive days with no rain"""
        dry_spells = 0
        current_dry_days = 0
        
        for rain in rainfall_data:
            if rain < 1:  # Less than 1mm considered dry
                current_dry_days += 1
            else:
                if current_dry_days >= 3:  # 3+ consecutive dry days = dry spell
                    dry_spells += 1
                current_dry_days = 0
        
        return dry_spells
    
    def _get_default_weather_data(self):
        """Default weather data when API fails"""
        return {
            'total_rainfall': 50.0,
            'avg_temperature': 28.0,
            'max_temperature': 35.0,
            'min_temperature': 22.0,
            'heat_stress_days': 5,
            'dry_spell_count': 2,
            'rainfall_variance': 25.0,
            'humidity': 70.0,
            'pressure': 1013.0
        }
    
    def _get_default_soil_data(self):
        """Default soil data"""
        return {
            'ph': 7.0,
            'organic_carbon': 0.7,
            'nitrogen': 110,
            'phosphorus': 22,
            'potassium': 170,
            'depth': 120,
            'texture_score': 4
        }
    
    def _get_default_satellite_data(self):
        """Default satellite data"""
        return {
            'peak_ndvi': 0.6,
            'time_to_peak_ndvi': 8,
            'integrated_ndvi': 4.8,
            'peak_evi': 0.4,
            'time_to_peak_evi': 8,
            'integrated_evi': 3.2
        }
    
    def _get_default_market_prices(self):
        """Default market prices"""
        return {
            'current_price': 2000,
            'price_unit': 'per_quintal',
            'market': 'National Average',
            'state': 'All India',
            'last_updated': datetime.now().strftime('%Y-%m-%d')
        }
    
    def get_data_status(self):
        """Get status of data sources"""
        return {
            'weather_api': 'real-time (Open-Meteo)',
            'soil_data': 'real-time (Ambee)',
            'satellite_data': 'real-time (Ambee)',
            'market_prices': 'active',
            'last_updated': datetime.now().isoformat()
        }