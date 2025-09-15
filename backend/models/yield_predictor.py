import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
import logging

logger = logging.getLogger(__name__)

class YieldPredictor:
    def __init__(self):
        self.model = None
        self.feature_importance = None
        self.is_trained = False
        self.model_path = 'models/yield_model.pkl'
        
    def prepare_features(self, data):
        """
        Prepare features for the yield prediction model
        """
        try:
            # Weather features
            weather_features = [
                'total_rainfall', 'avg_temperature', 'max_temperature', 'min_temperature',
                'heat_stress_days', 'dry_spell_count', 'rainfall_variance'
            ]
            
            # Soil features
            soil_features = [
                'soil_ph', 'organic_carbon', 'nitrogen', 'phosphorus', 'potassium',
                'soil_depth', 'soil_texture_score'
            ]
            
            # Satellite features
            satellite_features = [
                'peak_ndvi', 'time_to_peak_ndvi', 'integrated_ndvi',
                'peak_evi', 'time_to_peak_evi', 'integrated_evi'
            ]
            
            # Combine all features
            feature_columns = weather_features + soil_features + satellite_features
            
            # Create feature matrix
            X = data[feature_columns].fillna(0)
            
            # Target variable
            y = data['yield_kg_per_ha']
            
            return X, y, feature_columns
            
        except Exception as e:
            logger.error(f"Error preparing features: {str(e)}")
            raise
    
    def train_model(self, data):
        """
        Train the Random Forest model for yield prediction
        """
        try:
            logger.info("Starting model training...")
            
            # Prepare features
            X, y, feature_columns = self.prepare_features(data)
            
            # Split data chronologically (last 20% for testing)
            split_index = int(len(X) * 0.8)
            X_train, X_test = X[:split_index], X[split_index:]
            y_train, y_test = y[:split_index], y[split_index:]
            
            # Initialize Random Forest
            rf = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            )
            
            # Hyperparameter tuning
            param_dist = {
                'n_estimators': [50, 100, 200, 300],
                'max_depth': [5, 10, 15, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            }
            
            random_search = RandomizedSearchCV(
                rf, param_dist, n_iter=20, cv=3, 
                scoring='neg_mean_squared_error', random_state=42
            )
            
            # Train model
            random_search.fit(X_train, y_train)
            self.model = random_search.best_estimator_
            
            # Evaluate model
            y_pred = self.model.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            rmse = np.sqrt(mse)
            
            logger.info(f"Model training completed. R²: {r2:.3f}, RMSE: {rmse:.3f}")
            
            # Store feature importance
            self.feature_importance = dict(zip(feature_columns, self.model.feature_importances_))
            self.is_trained = True
            
            # Save model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            
            return {
                'r2_score': r2,
                'rmse': rmse,
                'feature_importance': self.feature_importance
            }
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise
    
    def predict_yield(self, district, year, season, weather_data, soil_data, satellite_data):
        """
        Predict yield for given inputs
        """
        try:
            if not self.is_trained:
                self.load_model()
            
            if self.model is None:
                raise ValueError("Model not trained or loaded")
            
            # Prepare input features
            features = self._prepare_prediction_features(
                weather_data, soil_data, satellite_data
            )
            
            # Make prediction
            prediction = self.model.predict([features])[0]
            
            # Calculate confidence interval (simplified)
            confidence = self._calculate_confidence(features)
            
            return {
                'district': district,
                'year': year,
                'season': season,
                'predicted_yield': round(prediction, 2),
                'confidence': confidence,
                'feature_importance': self.feature_importance
            }
            
        except Exception as e:
            logger.error(f"Error predicting yield: {str(e)}")
            raise
    
    def _prepare_prediction_features(self, weather_data, soil_data, satellite_data):
        """
        Prepare features for prediction from input data
        """
        features = []
        
        # Weather features
        features.extend([
            weather_data.get('total_rainfall', 0),
            weather_data.get('avg_temperature', 0),
            weather_data.get('max_temperature', 0),
            weather_data.get('min_temperature', 0),
            weather_data.get('heat_stress_days', 0),
            weather_data.get('dry_spell_count', 0),
            weather_data.get('rainfall_variance', 0)
        ])
        
        # Soil features
        features.extend([
            soil_data.get('ph', 7.0),
            soil_data.get('organic_carbon', 0.5),
            soil_data.get('nitrogen', 100),
            soil_data.get('phosphorus', 20),
            soil_data.get('potassium', 150),
            soil_data.get('depth', 100),
            soil_data.get('texture_score', 3)
        ])
        
        # Satellite features
        features.extend([
            satellite_data.get('peak_ndvi', 0.5),
            satellite_data.get('time_to_peak_ndvi', 8),
            satellite_data.get('integrated_ndvi', 4.0),
            satellite_data.get('peak_evi', 0.3),
            satellite_data.get('time_to_peak_evi', 8),
            satellite_data.get('integrated_evi', 2.4)
        ])
        
        return features
    
    def _calculate_confidence(self, features):
        """
        Calculate prediction confidence based on feature values
        """
        # Simple confidence calculation based on data completeness
        non_zero_features = sum(1 for f in features if f != 0)
        total_features = len(features)
        confidence = min(0.95, 0.5 + (non_zero_features / total_features) * 0.4)
        return round(confidence, 2)
    
    def load_model(self):
        """
        Load pre-trained model
        """
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.is_trained = True
                logger.info("Model loaded successfully")
            else:
                logger.warning("No pre-trained model found")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def get_feature_importance(self):
        """
        Get feature importance scores
        """
        return self.feature_importance or {}
