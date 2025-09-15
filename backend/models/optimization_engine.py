import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

class OptimizationEngine:
    def __init__(self):
        self.baseline_fertilizer_rates = {
            'nitrogen': 120,  # kg/ha
            'phosphorus': 60,  # kg/ha
            'potassium': 40   # kg/ha
        }
        
        self.crop_coefficients = {
            'rice': {
                'initial': 0.4,
                'development': 0.7,
                'mid_season': 1.0,
                'late_season': 0.8
            }
        }
    
    def generate_fertilizer_recommendations(self, predicted_yield, soil_data, district_avg_yield):
        """
        Generate fertilizer recommendations based on yield prediction and soil data
        """
        try:
            recommendations = {}
            
            # Calculate yield ratio
            yield_ratio = predicted_yield / district_avg_yield if district_avg_yield > 0 else 1.0
            
            # Nitrogen recommendations
            n_recommendation = self._calculate_nitrogen_recommendation(
                predicted_yield, soil_data, yield_ratio
            )
            
            # Phosphorus recommendations
            p_recommendation = self._calculate_phosphorus_recommendation(
                predicted_yield, soil_data, yield_ratio
            )
            
            # Potassium recommendations
            k_recommendation = self._calculate_potassium_recommendation(
                predicted_yield, soil_data, yield_ratio
            )
            
            recommendations = {
                'nitrogen': n_recommendation,
                'phosphorus': p_recommendation,
                'potassium': k_recommendation,
                'total_cost_estimate': self._calculate_cost_estimate(n_recommendation, p_recommendation, k_recommendation),
                'application_timing': self._get_application_timing(),
                'notes': self._generate_notes(predicted_yield, yield_ratio, soil_data)
            }
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating fertilizer recommendations: {str(e)}")
            raise
    
    def generate_irrigation_schedule(self, weather_data, crop_stage, soil_data):
        """
        Generate irrigation schedule based on water balance model
        """
        try:
            # Calculate current soil moisture
            current_moisture = self._calculate_soil_moisture(
                weather_data, crop_stage, soil_data
            )
            
            # Determine irrigation need
            irrigation_need = self._assess_irrigation_need(
                current_moisture, crop_stage, soil_data
            )
            
            # Generate schedule
            schedule = {
                'current_moisture_level': current_moisture,
                'irrigation_needed': irrigation_need['needed'],
                'recommended_amount': irrigation_need['amount'],
                'next_irrigation_date': irrigation_need['date'],
                'critical_periods': self._get_critical_periods(),
                'water_saving_tips': self._get_water_saving_tips()
            }
            
            return schedule
            
        except Exception as e:
            logger.error(f"Error generating irrigation schedule: {str(e)}")
            raise
    
    def _calculate_nitrogen_recommendation(self, predicted_yield, soil_data, yield_ratio):
        """
        Calculate nitrogen fertilizer recommendation
        """
        base_n = self.baseline_fertilizer_rates['nitrogen']
        soil_n = soil_data.get('nitrogen', 100)
        
        # Adjust based on soil nitrogen status
        if soil_n < 50:  # Low nitrogen
            n_factor = 1.2
        elif soil_n > 150:  # High nitrogen
            n_factor = 0.8
        else:  # Medium nitrogen
            n_factor = 1.0
        
        # Adjust based on predicted yield
        if yield_ratio > 1.1:  # High yield predicted
            n_factor *= 1.15
        elif yield_ratio < 0.9:  # Low yield predicted
            n_factor *= 0.9
        
        recommended_n = base_n * n_factor
        
        return {
            'amount_kg_per_ha': round(recommended_n, 1),
            'adjustment_factor': round(n_factor, 2),
            'reasoning': self._get_nitrogen_reasoning(soil_n, yield_ratio)
        }
    
    def _calculate_phosphorus_recommendation(self, predicted_yield, soil_data, yield_ratio):
        """
        Calculate phosphorus fertilizer recommendation
        """
        base_p = self.baseline_fertilizer_rates['phosphorus']
        soil_p = soil_data.get('phosphorus', 20)
        
        # Adjust based on soil phosphorus status
        if soil_p < 10:  # Low phosphorus
            p_factor = 1.3
        elif soil_p > 30:  # High phosphorus
            p_factor = 0.7
        else:  # Medium phosphorus
            p_factor = 1.0
        
        # Adjust based on predicted yield
        if yield_ratio > 1.1:
            p_factor *= 1.1
        elif yield_ratio < 0.9:
            p_factor *= 0.85
        
        recommended_p = base_p * p_factor
        
        return {
            'amount_kg_per_ha': round(recommended_p, 1),
            'adjustment_factor': round(p_factor, 2),
            'reasoning': self._get_phosphorus_reasoning(soil_p, yield_ratio)
        }
    
    def _calculate_potassium_recommendation(self, predicted_yield, soil_data, yield_ratio):
        """
        Calculate potassium fertilizer recommendation
        """
        base_k = self.baseline_fertilizer_rates['potassium']
        soil_k = soil_data.get('potassium', 150)
        
        # Adjust based on soil potassium status
        if soil_k < 100:  # Low potassium
            k_factor = 1.25
        elif soil_k > 200:  # High potassium
            k_factor = 0.8
        else:  # Medium potassium
            k_factor = 1.0
        
        # Adjust based on predicted yield
        if yield_ratio > 1.1:
            k_factor *= 1.1
        elif yield_ratio < 0.9:
            k_factor *= 0.9
        
        recommended_k = base_k * k_factor
        
        return {
            'amount_kg_per_ha': round(recommended_k, 1),
            'adjustment_factor': round(k_factor, 2),
            'reasoning': self._get_potassium_reasoning(soil_k, yield_ratio)
        }
    
    def _calculate_soil_moisture(self, weather_data, crop_stage, soil_data):
        """
        Calculate current soil moisture using water balance model
        """
        # Simplified water balance calculation
        rainfall = weather_data.get('recent_rainfall', 0)
        temperature = weather_data.get('avg_temperature', 25)
        
        # Reference evapotranspiration (simplified)
        et0 = 0.0023 * (temperature + 17.8) * np.sqrt(max(0, temperature - 5))
        
        # Crop coefficient based on stage
        kc = self.crop_coefficients['rice'].get(crop_stage, 0.7)
        etc = et0 * kc
        
        # Soil moisture change
        moisture_change = rainfall - etc
        
        # Current moisture level (0-1 scale)
        current_moisture = max(0, min(1, 0.5 + moisture_change / 100))
        
        return round(current_moisture, 2)
    
    def _assess_irrigation_need(self, current_moisture, crop_stage, soil_data):
        """
        Assess irrigation need based on moisture level and crop stage
        """
        # Critical moisture thresholds by crop stage
        thresholds = {
            'initial': 0.3,
            'development': 0.4,
            'mid_season': 0.5,
            'late_season': 0.3
        }
        
        threshold = thresholds.get(crop_stage, 0.4)
        
        if current_moisture < threshold:
            return {
                'needed': True,
                'amount': round((threshold - current_moisture) * 50, 1),  # mm
                'date': 'Immediate',
                'priority': 'High' if current_moisture < threshold * 0.7 else 'Medium'
            }
        else:
            return {
                'needed': False,
                'amount': 0,
                'date': 'Not needed',
                'priority': 'Low'
            }
    
    def _calculate_cost_estimate(self, n_rec, p_rec, k_rec):
        """
        Calculate estimated fertilizer cost
        """
        # Price per kg (approximate rates in INR)
        prices = {
            'nitrogen': 25,  # Urea
            'phosphorus': 35,  # DAP
            'potassium': 30   # MOP
        }
        
        total_cost = (
            n_rec['amount_kg_per_ha'] * prices['nitrogen'] +
            p_rec['amount_kg_per_ha'] * prices['phosphorus'] +
            k_rec['amount_kg_per_ha'] * prices['potassium']
        )
        
        return round(total_cost, 0)
    
    def _get_application_timing(self):
        """
        Get fertilizer application timing recommendations
        """
        return {
            'nitrogen': {
                'basal': '25% at transplanting',
                'top_dress_1': '35% at tillering (25-30 DAS)',
                'top_dress_2': '40% at panicle initiation (45-50 DAS)'
            },
            'phosphorus': {
                'basal': '100% at transplanting'
            },
            'potassium': {
                'basal': '50% at transplanting',
                'top_dress': '50% at panicle initiation'
            }
        }
    
    def _get_critical_periods(self):
        """
        Get critical irrigation periods for rice
        """
        return [
            'Transplanting to establishment (0-15 DAS)',
            'Panicle initiation (45-50 DAS)',
            'Flowering (70-80 DAS)',
            'Grain filling (80-100 DAS)'
        ]
    
    def _get_water_saving_tips(self):
        """
        Get water saving tips
        """
        return [
            'Use alternate wetting and drying (AWD) technique',
            'Maintain shallow water depth (2-3 cm)',
            'Avoid continuous flooding during vegetative stage',
            'Monitor soil moisture regularly',
            'Use mulching to reduce evaporation'
        ]
    
    def _generate_notes(self, predicted_yield, yield_ratio, soil_data):
        """
        Generate contextual notes for recommendations
        """
        notes = []
        
        if yield_ratio > 1.1:
            notes.append("High yield potential predicted - consider increasing fertilizer rates")
        elif yield_ratio < 0.9:
            notes.append("Lower yield expected - optimize fertilizer use to reduce costs")
        
        if soil_data.get('ph', 7) < 6.5:
            notes.append("Soil pH is low - consider lime application")
        elif soil_data.get('ph', 7) > 8.0:
            notes.append("Soil pH is high - consider sulfur application")
        
        if soil_data.get('organic_carbon', 0.5) < 0.5:
            notes.append("Low organic carbon - consider organic manure application")
        
        return notes
    
    def _get_nitrogen_reasoning(self, soil_n, yield_ratio):
        """
        Get reasoning for nitrogen recommendation
        """
        if soil_n < 50:
            return "Soil nitrogen is low - increased application recommended"
        elif soil_n > 150:
            return "Soil nitrogen is high - reduced application to avoid waste"
        else:
            return "Soil nitrogen is adequate - standard application rate"
    
    def _get_phosphorus_reasoning(self, soil_p, yield_ratio):
        """
        Get reasoning for phosphorus recommendation
        """
        if soil_p < 10:
            return "Soil phosphorus is low - increased application recommended"
        elif soil_p > 30:
            return "Soil phosphorus is high - reduced application to avoid waste"
        else:
            return "Soil phosphorus is adequate - standard application rate"
    
    def _get_potassium_reasoning(self, soil_k, yield_ratio):
        """
        Get reasoning for potassium recommendation
        """
        if soil_k < 100:
            return "Soil potassium is low - increased application recommended"
        elif soil_k > 200:
            return "Soil potassium is high - reduced application to avoid waste"
        else:
            return "Soil potassium is adequate - standard application rate"
