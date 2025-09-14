"""
Prediction endpoints for ML model inference
"""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    Prediction,
    PredictionWithRecommendations
)
from app.services.prediction_service import PredictionService

router = APIRouter()


@router.post("/", response_model=PredictionResponse)
async def predict_yield(
    prediction_request: PredictionRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Generate yield prediction and recommendations"""
    prediction_service = PredictionService(db)
    
    try:
        # Generate prediction
        prediction_response = await prediction_service.predict_yield(prediction_request)
        
        return prediction_response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate prediction: {str(e)}"
        )


@router.get("/farm/{farm_id}/latest", response_model=PredictionWithRecommendations)
async def get_latest_prediction(
    farm_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get the latest prediction for a farm"""
    prediction_service = PredictionService(db)
    
    prediction = await prediction_service.get_latest_prediction(farm_id)
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No predictions found for this farm"
        )
    
    return prediction


@router.get("/farm/{farm_id}/history", response_model=list[Prediction])
async def get_prediction_history(
    farm_id: str,
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get prediction history for a farm"""
    prediction_service = PredictionService(db)
    
    predictions = await prediction_service.get_prediction_history(
        farm_id=farm_id,
        limit=limit,
        offset=offset
    )
    
    return predictions


@router.get("/model/version")
async def get_model_version() -> Any:
    """Get current active model version"""
    from app.core.config import settings
    
    return {
        "model_version": settings.ML_MODEL_VERSION,
        "status": "active"
    }
