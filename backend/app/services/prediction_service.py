"""
Prediction service for ML model inference
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
import pandas as pd
import numpy as np

from app.models.prediction import Prediction, PredictionStatus
from app.models.sensor_reading import SensorReading
from app.models.farm import Farm
from app.models.model_version import ModelVersion
from app.schemas.prediction import PredictionRequest, PredictionResponse, Recommendation
from app.ml.model import CropYieldPredictor
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class PredictionService:
    """Prediction service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained model"""
        try:
            from pathlib import Path
            import joblib
            
            # Get active model version
            model_path = Path(settings.ML_MODEL_PATH)
            model_files = list(model_path.glob("*.joblib"))
            
            if not model_files:
                logger.warning("No trained model found. Using default model.")
                self.model = CropYieldPredictor()
                return
            
            # Load the most recent model
            latest_model = max(model_files, key=lambda x: x.stat().st_mtime)
            
            self.model = CropYieldPredictor()
            self.model.load_model(str(latest_model))
            
            logger.info(f"Model loaded from {latest_model}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            self.model = CropYieldPredictor()
    
    async def predict_yield(self, prediction_request: PredictionRequest) -> PredictionResponse:
        """Generate yield prediction and recommendations"""
        try:
            # Get farm information
            farm_result = await self.db.execute(
                select(Farm).where(Farm.id == prediction_request.farm_id)
            )
            farm = farm_result.scalar_one_or_none()
            
            if not farm:
                raise ValueError("Farm not found")
            
            # Get recent sensor readings
            recent_readings = await self._get_recent_sensor_readings(
                prediction_request.farm_id, days=30
            )
            
            if not recent_readings:
                raise ValueError("No recent sensor readings found")
            
            # Prepare features for prediction
            features_df = self._prepare_features_for_prediction(
                recent_readings, farm, prediction_request
            )
            
            # Make prediction
            if not self.model.is_trained:
                # Use default prediction if model is not trained
                predicted_yield = 3500.0  # Default yield in kg/ha
                confidence = 0.5
            else:
                prediction_result = self.model.predict(features_df)
                predicted_yield = prediction_result['predictions'][0]
                confidence = prediction_result['confidence'][0]
            
            # Calculate expected change vs historical
            historical_yield = await self._get_historical_yield(prediction_request.farm_id)
            if historical_yield:
                change_percent = ((predicted_yield - historical_yield) / historical_yield) * 100
                expected_change = f"{change_percent:+.1f}%"
            else:
                expected_change = "N/A"
            
            # Generate recommendations
            latest_features = self._get_latest_features(recent_readings)
            recommendations = self.model.generate_recommendations(
                latest_features, predicted_yield
            )
            
            # Save prediction to database
            prediction = await self._save_prediction(
                prediction_request.farm_id,
                features_df.to_dict('records')[0],
                predicted_yield,
                confidence,
                recommendations
            )
            
            return PredictionResponse(
                predicted_yield_kg_per_ha=predicted_yield,
                confidence=confidence,
                expected_change_vs_hist=expected_change,
                recommendations=recommendations,
                model_version=self.model.model_version,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    async def _get_recent_sensor_readings(self, farm_id: str, days: int = 30) -> List[SensorReading]:
        """Get recent sensor readings for a farm"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        result = await self.db.execute(
            select(SensorReading)
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date
            )
            .order_by(desc(SensorReading.timestamp))
        )
        
        return result.scalars().all()
    
    def _prepare_features_for_prediction(
        self, 
        readings: List[SensorReading], 
        farm: Farm, 
        request: PredictionRequest
    ) -> pd.DataFrame:
        """Prepare features for prediction"""
        if not readings:
            # Return default features if no readings
            return pd.DataFrame([{
                'soil_moisture': 45.0,
                'soil_ph': 6.5,
                'nitrogen': 50.0,
                'phosphorus': 25.0,
                'potassium': 150.0,
                'air_temperature': 28.0,
                'air_humidity': 70.0,
                'soil_temperature': 25.0,
                'timestamp': request.start_date,
                'planting_date': farm.planting_date or (request.start_date - timedelta(days=90))
            }])
        
        # Use the most recent reading
        latest_reading = readings[0]
        
        features = {
            'soil_moisture': float(latest_reading.soil_moisture or 45.0),
            'soil_ph': float(latest_reading.soil_ph or 6.5),
            'nitrogen': float(latest_reading.nitrogen or 50.0),
            'phosphorus': float(latest_reading.phosphorus or 25.0),
            'potassium': float(latest_reading.potassium or 150.0),
            'air_temperature': float(latest_reading.air_temperature or 28.0),
            'air_humidity': float(latest_reading.air_humidity or 70.0),
            'soil_temperature': float(latest_reading.soil_temperature or 25.0),
            'timestamp': request.start_date,
            'planting_date': farm.planting_date or (request.start_date - timedelta(days=90))
        }
        
        return pd.DataFrame([features])
    
    def _get_latest_features(self, readings: List[SensorReading]) -> Dict[str, float]:
        """Get latest feature values for recommendations"""
        if not readings:
            return {}
        
        latest = readings[0]
        return {
            'soil_moisture': float(latest.soil_moisture or 45.0),
            'soil_ph': float(latest.soil_ph or 6.5),
            'nitrogen': float(latest.nitrogen or 50.0),
            'phosphorus': float(latest.phosphorus or 25.0),
            'potassium': float(latest.potassium or 150.0),
            'air_temperature': float(latest.air_temperature or 28.0),
            'air_humidity': float(latest.air_humidity or 70.0),
            'soil_temperature': float(latest.soil_temperature or 25.0)
        }
    
    async def _get_historical_yield(self, farm_id: str) -> Optional[float]:
        """Get historical yield for comparison"""
        # In a real scenario, this would come from historical yield records
        # For now, return a default value
        return 3200.0  # Default historical yield in kg/ha
    
    async def _save_prediction(
        self,
        farm_id: str,
        features: Dict[str, Any],
        predicted_yield: float,
        confidence: float,
        recommendations: List[Dict[str, Any]]
    ) -> Prediction:
        """Save prediction to database"""
        prediction = Prediction(
            farm_id=farm_id,
            model_version=self.model.model_version,
            features_json=features,
            predicted_yield_kg_per_ha=predicted_yield,
            confidence=confidence,
            recommendations_json=recommendations,
            status=PredictionStatus.COMPLETED
        )
        
        self.db.add(prediction)
        await self.db.commit()
        await self.db.refresh(prediction)
        
        return prediction
    
    async def get_latest_prediction(self, farm_id: str) -> Optional[Prediction]:
        """Get the latest prediction for a farm"""
        result = await self.db.execute(
            select(Prediction)
            .where(Prediction.farm_id == farm_id)
            .order_by(desc(Prediction.created_at))
            .limit(1)
        )
        
        return result.scalar_one_or_none()
    
    async def get_prediction_history(
        self, 
        farm_id: str, 
        limit: int = 10, 
        offset: int = 0
    ) -> List[Prediction]:
        """Get prediction history for a farm"""
        result = await self.db.execute(
            select(Prediction)
            .where(Prediction.farm_id == farm_id)
            .order_by(desc(Prediction.created_at))
            .offset(offset)
            .limit(limit)
        )
        
        return result.scalars().all()
