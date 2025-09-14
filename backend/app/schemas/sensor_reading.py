"""
Sensor reading schemas for API serialization
"""

from typing import Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class NPKData(BaseModel):
    """NPK data schema"""
    n: Optional[Decimal] = None
    p: Optional[Decimal] = None
    k: Optional[Decimal] = None


class SensorReadingBase(BaseModel):
    """Base sensor reading schema"""
    device_id: str
    farm_id: str
    timestamp: datetime
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    soil_moisture: Optional[Decimal] = None
    soil_ph: Optional[Decimal] = None
    nitrogen: Optional[Decimal] = None
    phosphorus: Optional[Decimal] = None
    potassium: Optional[Decimal] = None
    air_temperature: Optional[Decimal] = None
    air_humidity: Optional[Decimal] = None
    soil_temperature: Optional[Decimal] = None
    battery: Optional[Decimal] = None


class SensorReadingCreate(SensorReadingBase):
    """Sensor reading creation schema"""
    pass


class TelemetryData(BaseModel):
    """Telemetry data schema for IoT devices"""
    device_id: str
    farm_id: str
    timestamp: datetime
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    soil_moisture: Optional[Decimal] = None
    soil_ph: Optional[Decimal] = None
    npk: Optional[NPKData] = None
    air_temp: Optional[Decimal] = None
    air_humidity: Optional[Decimal] = None
    soil_temp: Optional[Decimal] = None
    battery: Optional[Decimal] = None


class SensorReadingInDB(SensorReadingBase):
    """Sensor reading in database schema"""
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class SensorReading(SensorReadingInDB):
    """Sensor reading response schema"""
    pass


class SensorReadingBatch(BaseModel):
    """Batch sensor reading schema"""
    readings: list[SensorReadingCreate]


class SensorReadingStats(BaseModel):
    """Sensor reading statistics schema"""
    farm_id: str
    device_id: Optional[str] = None
    start_date: datetime
    end_date: datetime
    total_readings: int
    average_soil_moisture: Optional[Decimal] = None
    average_soil_ph: Optional[Decimal] = None
    average_air_temperature: Optional[Decimal] = None
    average_air_humidity: Optional[Decimal] = None
    min_soil_moisture: Optional[Decimal] = None
    max_soil_moisture: Optional[Decimal] = None
    min_soil_ph: Optional[Decimal] = None
    max_soil_ph: Optional[Decimal] = None
