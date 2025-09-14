"""
Prediction schemas for API serialization
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.prediction import PredictionStatus


class Recommendation(BaseModel):
    """Recommendation schema"""
    type: str  # irrigation, fertilizer, pesticide, harvest
    text: str
    priority: int  # 1-5, 1 being highest priority
    scheduled_date: Optional[datetime] = None
    estimated_impact: Optional[str] = None


class PredictionRequest(BaseModel):
    """Prediction request schema"""
    farm_id: str
    crop: str
    start_date: datetime
    end_date: datetime
    feature_snapshot: Optional[Dict[str, Any]] = None


class PredictionResponse(BaseModel):
    """Prediction response schema"""
    predicted_yield_kg_per_ha: Decimal
    confidence: Decimal
    expected_change_vs_hist: str
    recommendations: List[Recommendation]
    model_version: str
    timestamp: datetime


class PredictionBase(BaseModel):
    """Base prediction schema"""
    farm_id: str
    model_version: str
    features_json: Optional[Dict[str, Any]] = None
    predicted_yield_kg_per_ha: Optional[Decimal] = None
    confidence: Optional[Decimal] = None
    recommendations_json: Optional[Dict[str, Any]] = None
    status: PredictionStatus = PredictionStatus.PENDING


class PredictionCreate(PredictionBase):
    """Prediction creation schema"""
    pass


class PredictionUpdate(BaseModel):
    """Prediction update schema"""
    predicted_yield_kg_per_ha: Optional[Decimal] = None
    confidence: Optional[Decimal] = None
    recommendations_json: Optional[Dict[str, Any]] = None
    status: Optional[PredictionStatus] = None


class PredictionInDB(PredictionBase):
    """Prediction in database schema"""
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Prediction(PredictionInDB):
    """Prediction response schema"""
    pass


class PredictionWithRecommendations(Prediction):
    """Prediction with parsed recommendations"""
    recommendations: List[Recommendation] = []
