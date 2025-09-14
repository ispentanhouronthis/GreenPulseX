"""
Telemetry endpoints for IoT device data ingestion
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.sensor_reading import (
    TelemetryData,
    SensorReadingCreate,
    SensorReading,
    SensorReadingStats
)
from app.services.telemetry_service import TelemetryService

router = APIRouter()


@router.post("/", response_model=dict)
async def ingest_telemetry(
    telemetry_data: TelemetryData,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Ingest telemetry data from IoT devices"""
    telemetry_service = TelemetryService(db)
    
    try:
        # Convert telemetry data to sensor reading
        sensor_reading = SensorReadingCreate(
            device_id=telemetry_data.device_id,
            farm_id=telemetry_data.farm_id,
            timestamp=telemetry_data.timestamp,
            latitude=telemetry_data.latitude,
            longitude=telemetry_data.longitude,
            soil_moisture=telemetry_data.soil_moisture,
            soil_ph=telemetry_data.soil_ph,
            nitrogen=telemetry_data.npk.n if telemetry_data.npk else None,
            phosphorus=telemetry_data.npk.p if telemetry_data.npk else None,
            potassium=telemetry_data.npk.k if telemetry_data.npk else None,
            air_temperature=telemetry_data.air_temp,
            air_humidity=telemetry_data.air_humidity,
            soil_temperature=telemetry_data.soil_temp,
            battery=telemetry_data.battery
        )
        
        # Save sensor reading
        reading = await telemetry_service.create_sensor_reading(sensor_reading)
        
        return {
            "id": str(reading.id),
            "status": "success",
            "message": "Telemetry data ingested successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to ingest telemetry data: {str(e)}"
        )


@router.post("/batch", response_model=dict)
async def ingest_telemetry_batch(
    telemetry_data_list: List[TelemetryData],
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Ingest multiple telemetry data points"""
    telemetry_service = TelemetryService(db)
    
    try:
        sensor_readings = []
        for telemetry_data in telemetry_data_list:
            sensor_reading = SensorReadingCreate(
                device_id=telemetry_data.device_id,
                farm_id=telemetry_data.farm_id,
                timestamp=telemetry_data.timestamp,
                latitude=telemetry_data.latitude,
                longitude=telemetry_data.longitude,
                soil_moisture=telemetry_data.soil_moisture,
                soil_ph=telemetry_data.soil_ph,
                nitrogen=telemetry_data.npk.n if telemetry_data.npk else None,
                phosphorus=telemetry_data.npk.p if telemetry_data.npk else None,
                potassium=telemetry_data.npk.k if telemetry_data.npk else None,
                air_temperature=telemetry_data.air_temp,
                air_humidity=telemetry_data.air_humidity,
                soil_temperature=telemetry_data.soil_temp,
                battery=telemetry_data.battery
            )
            sensor_readings.append(sensor_reading)
        
        # Save batch of sensor readings
        readings = await telemetry_service.create_sensor_readings_batch(sensor_readings)
        
        return {
            "count": len(readings),
            "status": "success",
            "message": f"Successfully ingested {len(readings)} telemetry data points"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to ingest telemetry data batch: {str(e)}"
        )


@router.get("/farm/{farm_id}/readings", response_model=List[SensorReading])
async def get_farm_readings(
    farm_id: str,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get sensor readings for a specific farm"""
    telemetry_service = TelemetryService(db)
    
    readings = await telemetry_service.get_farm_readings(
        farm_id=farm_id,
        limit=limit,
        offset=offset
    )
    
    return readings


@router.get("/device/{device_id}/readings", response_model=List[SensorReading])
async def get_device_readings(
    device_id: str,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get sensor readings for a specific device"""
    telemetry_service = TelemetryService(db)
    
    readings = await telemetry_service.get_device_readings(
        device_id=device_id,
        limit=limit,
        offset=offset
    )
    
    return readings


@router.get("/farm/{farm_id}/stats", response_model=SensorReadingStats)
async def get_farm_stats(
    farm_id: str,
    days: int = 30,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get sensor reading statistics for a farm"""
    telemetry_service = TelemetryService(db)
    
    stats = await telemetry_service.get_farm_stats(
        farm_id=farm_id,
        days=days
    )
    
    return stats
