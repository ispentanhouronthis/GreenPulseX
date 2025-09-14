"""
Farm service for business logic
"""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.farm import Farm
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.schemas.farm import FarmCreate, FarmUpdate


class FarmService:
    """Farm service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_farm(self, farm_id: str) -> Optional[Farm]:
        """Get farm by ID"""
        result = await self.db.execute(
            select(Farm)
            .options(selectinload(Farm.devices))
            .where(Farm.id == farm_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_farms(self, user_id: str) -> List[Farm]:
        """Get farms for a user"""
        result = await self.db.execute(
            select(Farm)
            .options(selectinload(Farm.devices))
            .where(Farm.user_id == user_id)
            .order_by(Farm.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_all_farms(self, skip: int = 0, limit: int = 100) -> List[Farm]:
        """Get all farms"""
        result = await self.db.execute(
            select(Farm)
            .options(selectinload(Farm.devices))
            .offset(skip)
            .limit(limit)
            .order_by(Farm.created_at.desc())
        )
        return result.scalars().all()
    
    async def create_farm(self, farm_in: FarmCreate, user_id: str) -> Farm:
        """Create new farm"""
        farm = Farm(
            user_id=user_id,
            name=farm_in.name,
            latitude=farm_in.latitude,
            longitude=farm_in.longitude,
            area_ha=farm_in.area_ha,
            crop_type=farm_in.crop_type,
            soil_type=farm_in.soil_type,
            planting_date=farm_in.planting_date,
            expected_harvest_date=farm_in.expected_harvest_date
        )
        
        self.db.add(farm)
        await self.db.commit()
        await self.db.refresh(farm)
        
        return farm
    
    async def update_farm(self, farm_id: str, farm_update: FarmUpdate) -> Optional[Farm]:
        """Update farm"""
        farm = await self.get_farm(farm_id)
        if not farm:
            return None
        
        update_data = farm_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(farm, field, value)
        
        await self.db.commit()
        await self.db.refresh(farm)
        
        return farm
    
    async def delete_farm(self, farm_id: str) -> bool:
        """Delete farm"""
        farm = await self.get_farm(farm_id)
        if not farm:
            return False
        
        await self.db.delete(farm)
        await self.db.commit()
        
        return True
    
    async def get_farm_stats(self, farm_id: str) -> dict:
        """Get farm statistics"""
        # Get device count
        device_count_result = await self.db.execute(
            select(func.count(Device.id))
            .where(Device.farm_id == farm_id)
        )
        device_count = device_count_result.scalar()
        
        # Get active device count
        active_device_count_result = await self.db.execute(
            select(func.count(Device.id))
            .where(Device.farm_id == farm_id, Device.status == "active")
        )
        active_device_count = active_device_count_result.scalar()
        
        # Get latest reading date
        latest_reading_result = await self.db.execute(
            select(func.max(SensorReading.timestamp))
            .where(SensorReading.farm_id == farm_id)
        )
        latest_reading_date = latest_reading_result.scalar()
        
        # Get average soil moisture
        avg_moisture_result = await self.db.execute(
            select(func.avg(SensorReading.soil_moisture))
            .where(SensorReading.farm_id == farm_id)
        )
        avg_soil_moisture = avg_moisture_result.scalar()
        
        # Get average soil pH
        avg_ph_result = await self.db.execute(
            select(func.avg(SensorReading.soil_ph))
            .where(SensorReading.farm_id == farm_id)
        )
        avg_soil_ph = avg_ph_result.scalar()
        
        return {
            "total_devices": device_count or 0,
            "active_devices": active_device_count or 0,
            "last_reading_date": latest_reading_date,
            "average_soil_moisture": avg_soil_moisture,
            "average_soil_ph": avg_soil_ph
        }
