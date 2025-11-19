"""
ML model evaluation script
"""
import asyncio
import pandas as pd
import numpy as np
from pathlib import Path
import logging
import argparse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.model_version import ModelVersion
from app.ml.model import CropYieldPredictor
from app.ml.train import load_training_data
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def evaluate_model(version: str = None):
    """Evaluate a trained model"""
    logger.info(f"Evaluating model version: {version or 'latest'}")
    
    async with AsyncSessionLocal() as db:
        try:
            # Load model version
            if version:
                result = await db.execute(
                    select(ModelVersion).where(ModelVersion.version == version)
                )
            else:
                result = await db.execute(
                    select(ModelVersion).where(ModelVersion.is_active == True)
                )
            
            model_version = result.scalar_one_or_none()
            
            if not model_version:
                logger.error(f"Model version {version} not found")
                return None
            
            # Load model
            model = CropYieldPredictor()
            model.load_model(model_version.artifact_path)
            
            # Load test data
            X, y = await load_training_data(db)
            
            # Prepare features
            X_processed = model.prepare_features(X)
            X_scaled = model.scaler.transform(X_processed)
            
            # Make predictions
            predictions = model.model.predict(X_scaled)
            
            # Calculate metrics
            mae = mean_absolute_error(y, predictions)
            rmse = np.sqrt(mean_squared_error(y, predictions))
            r2 = r2_score(y, predictions)
            
            # Feature importance
            importance = model.get_feature_importance()
            
            metrics = {
                'version': model_version.version,
                'mae': mae,
                'rmse': rmse,
                'r2': r2,
                'feature_importance': importance,
                'n_samples': len(X),
                'model_path': model_version.artifact_path
            }
            
            logger.info(f"Evaluation completed:")
            logger.info(f"  MAE: {mae:.3f}")
            logger.info(f"  RMSE: {rmse:.3f}")
            logger.info(f"  R²: {r2:.3f}")
            
            return metrics
            
        except Exception as e:
            logger.error(f"Model evaluation failed: {str(e)}")
            raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Evaluate ML model')
    parser.add_argument('--model-version', type=str, default=None,
                       help='Model version to evaluate (default: latest active)')
    
    args = parser.parse_args()
    asyncio.run(evaluate_model(args.model_version))

