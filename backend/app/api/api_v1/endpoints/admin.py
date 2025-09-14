"""
Admin endpoints for system management
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import User
from app.schemas.farm import Farm
from app.schemas.device import Device
from app.schemas.prediction import Prediction
from app.services.admin_service import AdminService

router = APIRouter()


@router.get("/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get system statistics (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    stats = await admin_service.get_system_stats()
    
    return stats


@router.get("/users", response_model=List[User])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get all users (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    users = await admin_service.get_all_users(skip=skip, limit=limit)
    
    return users


@router.get("/farms", response_model=List[Farm])
async def get_all_farms(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get all farms (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    farms = await admin_service.get_all_farms(skip=skip, limit=limit)
    
    return farms


@router.get("/devices", response_model=List[Device])
async def get_all_devices(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get all devices (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    devices = await admin_service.get_all_devices(skip=skip, limit=limit)
    
    return devices


@router.get("/predictions", response_model=List[Prediction])
async def get_all_predictions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get all predictions (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    predictions = await admin_service.get_all_predictions(skip=skip, limit=limit)
    
    return predictions


@router.post("/retrain-model")
async def retrain_model(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Trigger model retraining (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    result = await admin_service.retrain_model()
    
    return result


@router.get("/model-versions")
async def get_model_versions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get model version history (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    admin_service = AdminService(db)
    versions = await admin_service.get_model_versions()
    
    return versions
