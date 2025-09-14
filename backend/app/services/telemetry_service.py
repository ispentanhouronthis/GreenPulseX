"""
Telemetry service for sensor data management
"""

from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload

from app.models.sensor_reading import SensorReading
from app.models.device import Device
from app.schemas.sensor_reading import SensorReadingCreate, SensorReadingStats


class TelemetryService:
    """Telemetry service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_sensor_reading(self, reading_in: SensorReadingCreate) -> SensorReading:
        """Create new sensor reading"""
        reading = SensorReading(
            device_id=reading_in.device_id,
            farm_id=reading_in.farm_id,
            timestamp=reading_in.timestamp,
            latitude=reading_in.latitude,
            longitude=reading_in.longitude,
            soil_moisture=reading_in.soil_moisture,
            soil_ph=reading_in.soil_ph,
            nitrogen=reading_in.nitrogen,
            phosphorus=reading_in.phosphorus,
            potassium=reading_in.potassium,
            air_temperature=reading_in.air_temperature,
            air_humidity=reading_in.air_humidity,
            soil_temperature=reading_in.soil_temperature,
            battery=reading_in.battery
        )
        
        self.db.add(reading)
        await self.db.commit()
        await self.db.refresh(reading)
        
        # Update device last seen
        from app.services.device_service import DeviceService
        device_service = DeviceService(self.db)
        await device_service.update_device_last_seen(reading_in.device_id)
        
        return reading
    
    async def create_sensor_readings_batch(self, readings_in: List[SensorReadingCreate]) -> List[SensorReading]:
        """Create multiple sensor readings"""
        readings = []
        for reading_in in readings_in:
            reading = SensorReading(
                device_id=reading_in.device_id,
                farm_id=reading_in.farm_id,
                timestamp=reading_in.timestamp,
                latitude=reading_in.latitude,
                longitude=reading_in.longitude,
                soil_moisture=reading_in.soil_moisture,
                soil_ph=reading_in.soil_ph,
                nitrogen=reading_in.nitrogen,
                phosphorus=reading_in.phosphorus,
                potassium=reading_in.potassium,
                air_temperature=reading_in.air_temperature,
                air_humidity=reading_in.air_humidity,
                soil_temperature=reading_in.soil_temperature,
                battery=reading_in.battery
            )
            readings.append(reading)
            self.db.add(reading)
        
        await self.db.commit()
        
        # Update device last seen for unique devices
        unique_device_ids = list(set(reading.device_id for reading in readings))
        from app.services.device_service import DeviceService
        device_service = DeviceService(self.db)
        for device_id in unique_device_ids:
            await device_service.update_device_last_seen(device_id)
        
        return readings
    
    async def get_farm_readings(
        self, 
        farm_id: str, 
        limit: int = 100, 
        offset: int = 0
    ) -> List[SensorReading]:
        """Get sensor readings for a farm"""
        result = await self.db.execute(
            select(SensorReading)
            .options(selectinload(SensorReading.device))
            .where(SensorReading.farm_id == farm_id)
            .order_by(desc(SensorReading.timestamp))
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_device_readings(
        self, 
        device_id: str, 
        limit: int = 100, 
        offset: int = 0
    ) -> List[SensorReading]:
        """Get sensor readings for a device"""
        result = await self.db.execute(
            select(SensorReading)
            .where(SensorReading.device_id == device_id)
            .order_by(desc(SensorReading.timestamp))
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_farm_stats(self, farm_id: str, days: int = 30) -> SensorReadingStats:
        """Get sensor reading statistics for a farm"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get total readings count
        total_readings_result = await self.db.execute(
            select(func.count(SensorReading.id))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date
            )
        )
        total_readings = total_readings_result.scalar()
        
        # Get average soil moisture
        avg_moisture_result = await self.db.execute(
            select(func.avg(SensorReading.soil_moisture))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_moisture.isnot(None)
            )
        )
        avg_soil_moisture = avg_moisture_result.scalar()
        
        # Get average soil pH
        avg_ph_result = await self.db.execute(
            select(func.avg(SensorReading.soil_ph))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_ph.isnot(None)
            )
        )
        avg_soil_ph = avg_ph_result.scalar()
        
        # Get average air temperature
        avg_temp_result = await self.db.execute(
            select(func.avg(SensorReading.air_temperature))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.air_temperature.isnot(None)
            )
        )
        avg_air_temperature = avg_temp_result.scalar()
        
        # Get average air humidity
        avg_humidity_result = await self.db.execute(
            select(func.avg(SensorReading.air_humidity))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.air_humidity.isnot(None)
            )
        )
        avg_air_humidity = avg_humidity_result.scalar()
        
        # Get min/max soil moisture
        min_moisture_result = await self.db.execute(
            select(func.min(SensorReading.soil_moisture))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_moisture.isnot(None)
            )
        )
        min_soil_moisture = min_moisture_result.scalar()
        
        max_moisture_result = await self.db.execute(
            select(func.max(SensorReading.soil_moisture))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_moisture.isnot(None)
            )
        )
        max_soil_moisture = max_moisture_result.scalar()
        
        # Get min/max soil pH
        min_ph_result = await self.db.execute(
            select(func.min(SensorReading.soil_ph))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_ph.isnot(None)
            )
        )
        min_soil_ph = min_ph_result.scalar()
        
        max_ph_result = await self.db.execute(
            select(func.max(SensorReading.soil_ph))
            .where(
                SensorReading.farm_id == farm_id,
                SensorReading.timestamp >= start_date,
                SensorReading.timestamp <= end_date,
                SensorReading.soil_ph.isnot(None)
            )
        )
        max_soil_ph = max_ph_result.scalar()
        
        return SensorReadingStats(
            farm_id=farm_id,
            start_date=start_date,
            end_date=end_date,
            total_readings=total_readings or 0,
            average_soil_moisture=avg_soil_moisture,
            average_soil_ph=avg_soil_ph,
            average_air_temperature=avg_air_temperature,
            average_air_humidity=avg_air_humidity,
            min_soil_moisture=min_soil_moisture,
            max_soil_moisture=max_soil_moisture,
            min_soil_ph=min_soil_ph,
            max_soil_ph=max_soil_ph
        )
