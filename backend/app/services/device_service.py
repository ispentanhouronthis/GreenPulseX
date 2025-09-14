"""
Device service for business logic
"""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.schemas.device import DeviceCreate, DeviceUpdate


class DeviceService:
    """Device service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_device(self, device_id: str) -> Optional[Device]:
        """Get device by ID"""
        result = await self.db.execute(
            select(Device).where(Device.id == device_id)
        )
        return result.scalar_one_or_none()
    
    async def get_device_by_device_id(self, device_id: str) -> Optional[Device]:
        """Get device by device_id field"""
        result = await self.db.execute(
            select(Device).where(Device.device_id == device_id)
        )
        return result.scalar_one_or_none()
    
    async def get_farm_devices(self, farm_id: str) -> List[Device]:
        """Get devices for a farm"""
        result = await self.db.execute(
            select(Device)
            .where(Device.farm_id == farm_id)
            .order_by(Device.created_at.desc())
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
    
    async def create_device(self, device_in: DeviceCreate) -> Device:
        """Create new device"""
        device = Device(
            farm_id=device_in.farm_id,
            device_id=device_in.device_id,
            device_model=device_in.device_model,
            firmware_version=device_in.firmware_version,
            location_description=device_in.location_description
        )
        
        self.db.add(device)
        await self.db.commit()
        await self.db.refresh(device)
        
        return device
    
    async def update_device(self, device_id: str, device_update: DeviceUpdate) -> Optional[Device]:
        """Update device"""
        device = await self.get_device(device_id)
        if not device:
            return None
        
        update_data = device_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(device, field, value)
        
        await self.db.commit()
        await self.db.refresh(device)
        
        return device
    
    async def delete_device(self, device_id: str) -> bool:
        """Delete device"""
        device = await self.get_device(device_id)
        if not device:
            return False
        
        await self.db.delete(device)
        await self.db.commit()
        
        return True
    
    async def update_device_last_seen(self, device_id: str) -> bool:
        """Update device last seen timestamp"""
        device = await self.get_device_by_device_id(device_id)
        if not device:
            return False
        
        from datetime import datetime
        device.last_seen = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(device)
        
        return True
    
    async def get_device_stats(self, device_id: str) -> dict:
        """Get device statistics"""
        # Get total readings count
        total_readings_result = await self.db.execute(
            select(func.count(SensorReading.id))
            .where(SensorReading.device_id == device_id)
        )
        total_readings = total_readings_result.scalar()
        
        # Get latest reading date
        latest_reading_result = await self.db.execute(
            select(func.max(SensorReading.timestamp))
            .where(SensorReading.device_id == device_id)
        )
        latest_reading_date = latest_reading_result.scalar()
        
        # Get latest battery level
        latest_battery_result = await self.db.execute(
            select(SensorReading.battery)
            .where(SensorReading.device_id == device_id)
            .order_by(SensorReading.timestamp.desc())
            .limit(1)
        )
        latest_battery = latest_battery_result.scalar()
        
        # Determine battery status
        battery_status = "unknown"
        if latest_battery is not None:
            if latest_battery < 3.0:
                battery_status = "low"
            elif latest_battery < 3.5:
                battery_status = "medium"
            else:
                battery_status = "high"
        
        return {
            "total_readings": total_readings or 0,
            "last_reading_date": latest_reading_date,
            "battery_status": battery_status
        }
