"""
Admin service for system management
"""

from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.user import User
from app.models.farm import Farm
from app.models.device import Device
from app.models.prediction import Prediction
from app.models.model_version import ModelVersion
from app.ml.train import train_model


class AdminService:
    """Admin service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        # User statistics
        total_users_result = await self.db.execute(
            select(func.count(User.id))
        )
        total_users = total_users_result.scalar()
        
        active_users_result = await self.db.execute(
            select(func.count(User.id))
            .where(User.is_active == True)
        )
        active_users = active_users_result.scalar()
        
        # Farm statistics
        total_farms_result = await self.db.execute(
            select(func.count(Farm.id))
        )
        total_farms = total_farms_result.scalar()
        
        # Device statistics
        total_devices_result = await self.db.execute(
            select(func.count(Device.id))
        )
        total_devices = total_devices_result.scalar()
        
        active_devices_result = await self.db.execute(
            select(func.count(Device.id))
            .where(Device.status == "active")
        )
        active_devices = active_devices_result.scalar()
        
        # Prediction statistics
        total_predictions_result = await self.db.execute(
            select(func.count(Prediction.id))
        )
        total_predictions = total_predictions_result.scalar()
        
        return {
            "users": {
                "total": total_users or 0,
                "active": active_users or 0
            },
            "farms": {
                "total": total_farms or 0
            },
            "devices": {
                "total": total_devices or 0,
                "active": active_devices or 0
            },
            "predictions": {
                "total": total_predictions or 0
            }
        }
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users"""
        result = await self.db.execute(
            select(User)
            .offset(skip)
            .limit(limit)
            .order_by(User.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_all_farms(self, skip: int = 0, limit: int = 100) -> List[Farm]:
        """Get all farms"""
        result = await self.db.execute(
            select(Farm)
            .offset(skip)
            .limit(limit)
            .order_by(Farm.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_all_devices(self, skip: int = 0, limit: int = 100) -> List[Device]:
        """Get all devices"""
        result = await self.db.execute(
            select(Device)
            .offset(skip)
            .limit(limit)
            .order_by(Device.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_all_predictions(self, skip: int = 0, limit: int = 100) -> List[Prediction]:
        """Get all predictions"""
        result = await self.db.execute(
            select(Prediction)
            .offset(skip)
            .limit(limit)
            .order_by(Prediction.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_model_versions(self) -> List[ModelVersion]:
        """Get model version history"""
        result = await self.db.execute(
            select(ModelVersion)
            .order_by(ModelVersion.created_at.desc())
        )
        return result.scalars().all()
    
    async def retrain_model(self) -> Dict[str, Any]:
        """Trigger model retraining"""
        try:
            result = await train_model()
            return {
                "status": "success",
                "message": "Model retraining completed successfully",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Model retraining failed: {str(e)}"
            }
