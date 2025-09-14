"""
Farm schemas for API serialization
"""

from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel
from app.schemas.device import Device
from app.schemas.sensor_reading import SensorReading


class FarmBase(BaseModel):
    """Base farm schema"""
    name: str
    latitude: Decimal
    longitude: Decimal
    area_ha: Decimal
    crop_type: str
    soil_type: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None


class FarmCreate(FarmBase):
    """Farm creation schema"""
    pass


class FarmUpdate(BaseModel):
    """Farm update schema"""
    name: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    area_ha: Optional[Decimal] = None
    crop_type: Optional[str] = None
    soil_type: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None


class FarmInDB(FarmBase):
    """Farm in database schema"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Farm(FarmInDB):
    """Farm response schema"""
    devices: Optional[List[Device]] = []
    latest_sensor_readings: Optional[List[SensorReading]] = []


class FarmWithStats(Farm):
    """Farm with statistics schema"""
    total_devices: int = 0
    active_devices: int = 0
    last_reading_date: Optional[datetime] = None
    average_soil_moisture: Optional[Decimal] = None
    average_soil_ph: Optional[Decimal] = None
