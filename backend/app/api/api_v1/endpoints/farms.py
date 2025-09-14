"""
Farm management endpoints
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import User
from app.schemas.farm import Farm, FarmCreate, FarmUpdate, FarmWithStats
from app.services.farm_service import FarmService

router = APIRouter()


@router.post("/", response_model=Farm)
async def create_farm(
    farm_in: FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new farm"""
    farm_service = FarmService(db)
    
    farm = await farm_service.create_farm(
        farm_in=farm_in,
        user_id=str(current_user.id)
    )
    
    return farm


@router.get("/", response_model=List[FarmWithStats])
async def get_user_farms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get farms for current user"""
    farm_service = FarmService(db)
    
    farms = await farm_service.get_user_farms(str(current_user.id))
    
    return farms


@router.get("/{farm_id}", response_model=FarmWithStats)
async def get_farm(
    farm_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get farm by ID"""
    farm_service = FarmService(db)
    
    farm = await farm_service.get_farm(farm_id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    # Check if user owns the farm or is admin
    if farm.user_id != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return farm


@router.put("/{farm_id}", response_model=Farm)
async def update_farm(
    farm_id: str,
    farm_update: FarmUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update farm information"""
    farm_service = FarmService(db)
    
    # Check if farm exists and user has permission
    farm = await farm_service.get_farm(farm_id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    if farm.user_id != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    updated_farm = await farm_service.update_farm(
        farm_id=farm_id,
        farm_update=farm_update
    )
    
    return updated_farm


@router.delete("/{farm_id}")
async def delete_farm(
    farm_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete a farm"""
    farm_service = FarmService(db)
    
    # Check if farm exists and user has permission
    farm = await farm_service.get_farm(farm_id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    if farm.user_id != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    await farm_service.delete_farm(farm_id)
    
    return {"message": "Farm deleted successfully"}
