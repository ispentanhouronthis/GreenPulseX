"""
ML model training script
"""

import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import AsyncSessionLocal
from app.models.sensor_reading import SensorReading
from app.models.farm import Farm
from app.models.prediction import Prediction
from app.models.model_version import ModelVersion
from app.ml.model import CropYieldPredictor
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def load_training_data(db: AsyncSession) -> tuple[pd.DataFrame, pd.Series]:
    """Load training data from database"""
    logger.info("Loading training data from database...")
    
    # Get sensor readings with farm information
    result = await db.execute(
        select(
            SensorReading.soil_moisture,
            SensorReading.soil_ph,
            SensorReading.nitrogen,
            SensorReading.phosphorus,
            SensorReading.potassium,
            SensorReading.air_temperature,
            SensorReading.air_humidity,
            SensorReading.soil_temperature,
            SensorReading.timestamp,
            Farm.planting_date,
            Farm.crop_type,
            Farm.area_ha
        )
        .join(Farm, SensorReading.farm_id == Farm.id)
        .where(
            SensorReading.soil_moisture.isnot(None),
            SensorReading.soil_ph.isnot(None),
            SensorReading.nitrogen.isnot(None),
            SensorReading.phosphorus.isnot(None),
            SensorReading.potassium.isnot(None)
        )
    )
    
    data = result.fetchall()
    
    if not data:
        logger.warning("No training data found. Using synthetic data...")
        return generate_synthetic_data()
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Generate synthetic yield data based on features
    # In a real scenario, this would come from historical yield records
    df['yield_kg_per_ha'] = generate_synthetic_yield(df)
    
    # Separate features and target
    feature_columns = [
        'soil_moisture', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium',
        'air_temperature', 'air_humidity', 'soil_temperature', 'timestamp', 'planting_date'
    ]
    
    X = df[feature_columns]
    y = df['yield_kg_per_ha']
    
    logger.info(f"Loaded {len(X)} training samples")
    
    return X, y


def generate_synthetic_data() -> tuple[pd.DataFrame, pd.Series]:
    """Generate synthetic training data for demonstration"""
    logger.info("Generating synthetic training data...")
    
    np.random.seed(42)
    n_samples = 1000
    
    # Generate synthetic features
    data = {
        'soil_moisture': np.random.normal(45, 15, n_samples),
        'soil_ph': np.random.normal(6.5, 0.8, n_samples),
        'nitrogen': np.random.normal(50, 20, n_samples),
        'phosphorus': np.random.normal(25, 10, n_samples),
        'potassium': np.random.normal(150, 50, n_samples),
        'air_temperature': np.random.normal(28, 5, n_samples),
        'air_humidity': np.random.normal(70, 15, n_samples),
        'soil_temperature': np.random.normal(25, 3, n_samples),
        'timestamp': pd.date_range('2023-01-01', periods=n_samples, freq='D'),
        'planting_date': pd.date_range('2023-01-01', periods=n_samples, freq='D') - timedelta(days=90)
    }
    
    df = pd.DataFrame(data)
    
    # Generate synthetic yield based on features
    yield_base = 3000  # Base yield in kg/ha
    
    # Soil moisture effect (optimal around 40-60%)
    moisture_effect = np.where(
        (df['soil_moisture'] >= 40) & (df['soil_moisture'] <= 60),
        1.0,
        1.0 - 0.01 * np.abs(df['soil_moisture'] - 50)
    )
    
    # Soil pH effect (optimal around 6.5-7.0)
    ph_effect = np.where(
        (df['soil_ph'] >= 6.5) & (df['soil_ph'] <= 7.0),
        1.0,
        1.0 - 0.05 * np.abs(df['soil_ph'] - 6.75)
    )
    
    # NPK effects
    npk_effect = (
        1.0 + 0.001 * df['nitrogen'] +
        0.002 * df['phosphorus'] +
        0.0005 * df['potassium']
    )
    
    # Temperature effect (optimal around 25-30°C)
    temp_effect = np.where(
        (df['air_temperature'] >= 25) & (df['air_temperature'] <= 30),
        1.0,
        1.0 - 0.02 * np.abs(df['air_temperature'] - 27.5)
    )
    
    # Calculate final yield
    df['yield_kg_per_ha'] = (
        yield_base * moisture_effect * ph_effect * npk_effect * temp_effect +
        np.random.normal(0, 200, n_samples)  # Add noise
    )
    
    # Ensure positive yields
    df['yield_kg_per_ha'] = np.maximum(df['yield_kg_per_ha'], 1000)
    
    feature_columns = [
        'soil_moisture', 'soil_ph', 'nitrogen', 'phosphorus', 'potassium',
        'air_temperature', 'air_humidity', 'soil_temperature', 'timestamp', 'planting_date'
    ]
    
    X = df[feature_columns]
    y = df['yield_kg_per_ha']
    
    return X, y


def generate_synthetic_yield(df: pd.DataFrame) -> pd.Series:
    """Generate synthetic yield based on features"""
    yield_base = 3000  # Base yield in kg/ha
    
    # Soil moisture effect (optimal around 40-60%)
    moisture_effect = np.where(
        (df['soil_moisture'] >= 40) & (df['soil_moisture'] <= 60),
        1.0,
        1.0 - 0.01 * np.abs(df['soil_moisture'] - 50)
    )
    
    # Soil pH effect (optimal around 6.5-7.0)
    ph_effect = np.where(
        (df['soil_ph'] >= 6.5) & (df['soil_ph'] <= 7.0),
        1.0,
        1.0 - 0.05 * np.abs(df['soil_ph'] - 6.75)
    )
    
    # NPK effects
    npk_effect = (
        1.0 + 0.001 * df['nitrogen'] +
        0.002 * df['phosphorus'] +
        0.0005 * df['potassium']
    )
    
    # Temperature effect (optimal around 25-30°C)
    temp_effect = np.where(
        (df['air_temperature'] >= 25) & (df['air_temperature'] <= 30),
        1.0,
        1.0 - 0.02 * np.abs(df['air_temperature'] - 27.5)
    )
    
    # Calculate final yield
    yield_values = (
        yield_base * moisture_effect * ph_effect * npk_effect * temp_effect +
        np.random.normal(0, 200, len(df))  # Add noise
    )
    
    # Ensure positive yields
    yield_values = np.maximum(yield_values, 1000)
    
    return pd.Series(yield_values, index=df.index)


async def save_model_version(db: AsyncSession, metrics: dict, model_path: str) -> str:
    """Save model version to database"""
    # Generate new version
    result = await db.execute(
        select(func.max(ModelVersion.version))
    )
    latest_version = result.scalar()
    
    if latest_version:
        version_parts = latest_version.split('.')
        new_version = f"{version_parts[0]}.{int(version_parts[1]) + 1}.0"
    else:
        new_version = "v1.0.0"
    
    # Deactivate current active model
    await db.execute(
        ModelVersion.__table__.update().where(
            ModelVersion.is_active == True
        ).values(is_active=False)
    )
    
    # Create new model version
    model_version = ModelVersion(
        version=new_version,
        metrics_json=metrics,
        artifact_path=model_path,
        is_active=True
    )
    
    db.add(model_version)
    await db.commit()
    
    logger.info(f"Saved model version {new_version}")
    
    return new_version


async def train_model():
    """Main training function"""
    logger.info("Starting model training...")
    
    async with AsyncSessionLocal() as db:
        try:
            # Load training data
            X, y = await load_training_data(db)
            
            # Initialize model
            model = CropYieldPredictor()
            
            # Train model
            metrics = model.train(X, y)
            
            # Save model
            model_path = Path(settings.ML_MODEL_PATH) / f"model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.joblib"
            model_path.parent.mkdir(parents=True, exist_ok=True)
            model.save_model(str(model_path))
            
            # Save model version to database
            version = await save_model_version(db, metrics, str(model_path))
            
            logger.info(f"Model training completed successfully. Version: {version}")
            logger.info(f"Metrics: {metrics}")
            
            return {
                "status": "success",
                "version": version,
                "metrics": metrics,
                "model_path": str(model_path)
            }
            
        except Exception as e:
            logger.error(f"Model training failed: {str(e)}")
            raise


if __name__ == "__main__":
    asyncio.run(train_model())
