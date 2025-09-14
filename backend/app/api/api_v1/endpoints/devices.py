"""
Device management endpoints
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import User
from app.schemas.device import Device, DeviceCreate, DeviceUpdate, DeviceWithStats
from app.schemas.farm import Farm
from app.services.device_service import DeviceService
from app.services.farm_service import FarmService

router = APIRouter()


@router.post("/", response_model=Device)
async def create_device(
    device_in: DeviceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new device"""
    device_service = DeviceService(db)
    
    # Check if user owns the farm
    farm_service = FarmService(db)
    farm = await farm_service.get_farm(device_in.farm_id)
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
    
    device = await device_service.create_device(device_in)
    
    return device


@router.get("/farm/{farm_id}", response_model=List[DeviceWithStats])
async def get_farm_devices(
    farm_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get devices for a specific farm"""
    device_service = DeviceService(db)
    farm_service = FarmService(db)
    
    # Check if user owns the farm
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
    
    devices = await device_service.get_farm_devices(farm_id)
    
    return devices


@router.get("/{device_id}", response_model=DeviceWithStats)
async def get_device(
    device_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get device by ID"""
    device_service = DeviceService(db)
    
    device = await device_service.get_device(device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    # Check if user owns the farm
    farm_service = FarmService(db)
    farm = await farm_service.get_farm(device.farm_id)
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
    
    return device


@router.put("/{device_id}", response_model=Device)
async def update_device(
    device_id: str,
    device_update: DeviceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update device information"""
    device_service = DeviceService(db)
    
    # Check if device exists and user has permission
    device = await device_service.get_device(device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    farm_service = FarmService(db)
    farm = await farm_service.get_farm(device.farm_id)
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
    
    updated_device = await device_service.update_device(
        device_id=device_id,
        device_update=device_update
    )
    
    return updated_device


@router.delete("/{device_id}")
async def delete_device(
    device_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete a device"""
    device_service = DeviceService(db)
    
    # Check if device exists and user has permission
    device = await device_service.get_device(device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    farm_service = FarmService(db)
    farm = await farm_service.get_farm(device.farm_id)
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
    
    await device_service.delete_device(device_id)
    
    return {"message": "Device deleted successfully"}
