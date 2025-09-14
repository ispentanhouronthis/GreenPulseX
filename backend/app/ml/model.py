"""
ML model for crop yield prediction
"""

import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)


class CropYieldPredictor:
    """Crop yield prediction model"""
    
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
        self.feature_columns = [
            'soil_moisture', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium',
            'air_temperature', 'air_humidity', 'soil_temperature',
            'days_since_planting', 'season_encoded'
        ]
        self.is_trained = False
        self.model_version = "v0.1.0"
        self.metrics = {}
    
    def prepare_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for training/prediction"""
        df = data.copy()
        
        # Handle missing values
        numeric_columns = [
            'soil_moisture', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium',
            'air_temperature', 'air_humidity', 'soil_temperature'
        ]
        
        for col in numeric_columns:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].median())
        
        # Add derived features
        if 'planting_date' in df.columns and 'timestamp' in df.columns:
            df['planting_date'] = pd.to_datetime(df['planting_date'])
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['days_since_planting'] = (df['timestamp'] - df['planting_date']).dt.days
        else:
            df['days_since_planting'] = 90  # Default value
        
        # Season encoding
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['month'] = df['timestamp'].dt.month
            df['season_encoded'] = df['month'].map({
                12: 0, 1: 0, 2: 0,  # Winter
                3: 1, 4: 1, 5: 1,   # Spring
                6: 2, 7: 2, 8: 2,   # Summer
                9: 3, 10: 3, 11: 3  # Fall
            })
        else:
            df['season_encoded'] = 1  # Default to spring
        
        # Ensure all required features are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0  # Default value
        
        return df[self.feature_columns]
    
    def train(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, float]:
        """Train the model"""
        logger.info(f"Training model with {len(X)} samples and {len(X.columns)} features")
        
        # Prepare features
        X_processed = self.prepare_features(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_processed, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test_scaled)
        
        # Calculate metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(
            self.model, X_train_scaled, y_train, cv=5, scoring='neg_mean_absolute_error'
        )
        cv_mae = -cv_scores.mean()
        
        self.metrics = {
            'mae': mae,
            'rmse': rmse,
            'r2': r2,
            'cv_mae': cv_mae,
            'n_samples': len(X),
            'n_features': len(X_processed.columns)
        }
        
        self.is_trained = True
        
        logger.info(f"Model training completed. MAE: {mae:.3f}, RMSE: {rmse:.3f}, R²: {r2:.3f}")
        
        return self.metrics
    
    def predict(self, X: pd.DataFrame) -> Dict[str, Any]:
        """Make predictions"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare features
        X_processed = self.prepare_features(X)
        
        # Scale features
        X_scaled = self.scaler.transform(X_processed)
        
        # Make predictions
        predictions = self.model.predict(X_scaled)
        
        # Calculate confidence (based on prediction variance)
        if hasattr(self.model, 'estimators_'):
            # For ensemble models, calculate prediction variance
            individual_predictions = np.array([
                estimator.predict(X_scaled) for estimator in self.model.estimators_
            ])
            prediction_std = np.std(individual_predictions, axis=0)
            confidence = 1.0 / (1.0 + prediction_std)  # Higher std = lower confidence
        else:
            confidence = np.ones(len(predictions)) * 0.8  # Default confidence
        
        return {
            'predictions': predictions.tolist(),
            'confidence': confidence.tolist(),
            'model_version': self.model_version
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance"""
        if not self.is_trained:
            return {}
        
        importance = dict(zip(self.feature_columns, self.model.feature_importances_))
        return dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
    
    def save_model(self, filepath: str) -> None:
        """Save model to file"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns,
            'is_trained': self.is_trained,
            'model_version': self.model_version,
            'metrics': self.metrics
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str) -> None:
        """Load model from file"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = model_data['is_trained']
        self.model_version = model_data['model_version']
        self.metrics = model_data['metrics']
        logger.info(f"Model loaded from {filepath}")
    
    def generate_recommendations(
        self, 
        features: Dict[str, float], 
        predicted_yield: float
    ) -> List[Dict[str, Any]]:
        """Generate actionable recommendations based on features and prediction"""
        recommendations = []
        
        # Soil moisture recommendations
        soil_moisture = features.get('soil_moisture', 0)
        if soil_moisture < 20:
            recommendations.append({
                'type': 'irrigation',
                'text': 'Soil moisture is low. Irrigate with 20-30mm of water.',
                'priority': 1,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 5-10%'
            })
        elif soil_moisture > 80:
            recommendations.append({
                'type': 'irrigation',
                'text': 'Soil moisture is high. Reduce irrigation to prevent waterlogging.',
                'priority': 2,
                'scheduled_date': None,
                'estimated_impact': 'Prevent yield loss of 3-5%'
            })
        
        # Soil pH recommendations
        soil_ph = features.get('soil_ph', 0)
        if soil_ph < 6.0:
            recommendations.append({
                'type': 'fertilizer',
                'text': 'Soil pH is acidic. Apply lime to raise pH to 6.5-7.0.',
                'priority': 2,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 8-12%'
            })
        elif soil_ph > 8.0:
            recommendations.append({
                'type': 'fertilizer',
                'text': 'Soil pH is alkaline. Apply sulfur to lower pH.',
                'priority': 2,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 5-8%'
            })
        
        # NPK recommendations
        nitrogen = features.get('nitrogen', 0)
        phosphorus = features.get('phosphorus', 0)
        potassium = features.get('potassium', 0)
        
        if nitrogen < 30:
            recommendations.append({
                'type': 'fertilizer',
                'text': 'Nitrogen levels are low. Apply 15-20kg N per hectare.',
                'priority': 1,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 10-15%'
            })
        
        if phosphorus < 15:
            recommendations.append({
                'type': 'fertilizer',
                'text': 'Phosphorus levels are low. Apply 10-15kg P per hectare.',
                'priority': 2,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 5-8%'
            })
        
        if potassium < 100:
            recommendations.append({
                'type': 'fertilizer',
                'text': 'Potassium levels are low. Apply 20-25kg K per hectare.',
                'priority': 2,
                'scheduled_date': None,
                'estimated_impact': 'Increase yield by 3-5%'
            })
        
        # Temperature recommendations
        air_temp = features.get('air_temperature', 0)
        if air_temp > 35:
            recommendations.append({
                'type': 'irrigation',
                'text': 'High temperature detected. Increase irrigation frequency.',
                'priority': 1,
                'scheduled_date': None,
                'estimated_impact': 'Prevent heat stress and yield loss'
            })
        
        # Sort by priority
        recommendations.sort(key=lambda x: x['priority'])
        
        return recommendations
