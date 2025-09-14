"""
Device schemas for API serialization
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.device import DeviceStatus


class DeviceBase(BaseModel):
    """Base device schema"""
    device_id: str
    device_model: str
    firmware_version: Optional[str] = None
    location_description: Optional[str] = None


class DeviceCreate(DeviceBase):
    """Device creation schema"""
    farm_id: str


class DeviceUpdate(BaseModel):
    """Device update schema"""
    device_model: Optional[str] = None
    firmware_version: Optional[str] = None
    status: Optional[DeviceStatus] = None
    location_description: Optional[str] = None


class DeviceInDB(DeviceBase):
    """Device in database schema"""
    id: str
    farm_id: str
    last_seen: Optional[datetime] = None
    status: DeviceStatus
    battery_level: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Device(DeviceInDB):
    """Device response schema"""
    pass


class DeviceWithStats(Device):
    """Device with statistics schema"""
    total_readings: int = 0
    last_reading_date: Optional[datetime] = None
    battery_status: str = "unknown"  # low, medium, high, unknown
