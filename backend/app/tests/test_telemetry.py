"""
Tests for telemetry endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.main import app
from app.models.user import User
from app.models.farm import Farm
from app.models.device import Device
from app.core.security import get_password_hash

client = TestClient(app)


@pytest.fixture
async def test_farm_with_device(db: AsyncSession):
    """Create a test farm with device"""
    user = User(
        name="Test Farmer",
        email="farmer@example.com",
        password_hash=get_password_hash("password"),
        role="farmer"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    farm = Farm(
        user_id=user.id,
        name="Test Farm",
        latitude=12.9716,
        longitude=77.5946,
        area_ha=5.0,
        crop_type="rice"
    )
    db.add(farm)
    await db.commit()
    await db.refresh(farm)
    
    device = Device(
        farm_id=farm.id,
        device_id="test-device-001",
        device_model="ESP32-S3",
        status="active"
    )
    db.add(device)
    await db.commit()
    await db.refresh(device)
    
    return user, farm, device


class TestTelemetry:
    """Test telemetry endpoints"""
    
    async def test_ingest_telemetry_success(self, db: AsyncSession, test_farm_with_device):
        """Test successful telemetry ingestion"""
        user, farm, device = test_farm_with_device
        
        telemetry_data = {
            "device_id": "test-device-001",
            "farm_id": str(farm.id),
            "timestamp": "2024-01-15T12:00:00Z",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "soil_moisture": 45.5,
            "soil_ph": 6.8,
            "npk": {"n": 50, "p": 25, "k": 150},
            "air_temp": 28.5,
            "air_humidity": 72.0,
            "soil_temp": 24.5,
            "battery": 3.8
        }
        
        response = client.post(
            "/api/v1/telemetry/",
            json=telemetry_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "id" in data
    
    async def test_ingest_telemetry_batch(self, db: AsyncSession, test_farm_with_device):
        """Test batch telemetry ingestion"""
        user, farm, device = test_farm_with_device
        
        telemetry_batch = [
            {
                "device_id": "test-device-001",
                "farm_id": str(farm.id),
                "timestamp": "2024-01-15T12:00:00Z",
                "soil_moisture": 45.5,
                "soil_ph": 6.8,
                "npk": {"n": 50, "p": 25, "k": 150},
                "air_temp": 28.5,
                "air_humidity": 72.0,
                "soil_temp": 24.5,
                "battery": 3.8
            },
            {
                "device_id": "test-device-001",
                "farm_id": str(farm.id),
                "timestamp": "2024-01-15T13:00:00Z",
                "soil_moisture": 44.2,
                "soil_ph": 6.9,
                "npk": {"n": 48, "p": 24, "k": 148},
                "air_temp": 29.1,
                "air_humidity": 70.5,
                "soil_temp": 25.1,
                "battery": 3.7
            }
        ]
        
        response = client.post(
            "/api/v1/telemetry/batch",
            json=telemetry_batch
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["count"] == 2
    
    async def test_get_farm_readings(self, db: AsyncSession, test_farm_with_device):
        """Test getting farm sensor readings"""
        user, farm, device = test_farm_with_device
        
        # First ingest some data
        telemetry_data = {
            "device_id": "test-device-001",
            "farm_id": str(farm.id),
            "timestamp": "2024-01-15T12:00:00Z",
            "soil_moisture": 45.5,
            "soil_ph": 6.8,
            "npk": {"n": 50, "p": 25, "k": 150},
            "air_temp": 28.5,
            "air_humidity": 72.0,
            "soil_temp": 24.5,
            "battery": 3.8
        }
        
        client.post("/api/v1/telemetry/", json=telemetry_data)
        
        # Get readings
        response = client.get(f"/api/v1/telemetry/farm/{farm.id}/readings")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "soil_moisture" in data[0]
        assert "soil_ph" in data[0]
    
    async def test_get_farm_stats(self, db: AsyncSession, test_farm_with_device):
        """Test getting farm statistics"""
        user, farm, device = test_farm_with_device
        
        # First ingest some data
        telemetry_data = {
            "device_id": "test-device-001",
            "farm_id": str(farm.id),
            "timestamp": "2024-01-15T12:00:00Z",
            "soil_moisture": 45.5,
            "soil_ph": 6.8,
            "npk": {"n": 50, "p": 25, "k": 150},
            "air_temp": 28.5,
            "air_humidity": 72.0,
            "soil_temp": 24.5,
            "battery": 3.8
        }
        
        client.post("/api/v1/telemetry/", json=telemetry_data)
        
        # Get stats
        response = client.get(f"/api/v1/telemetry/farm/{farm.id}/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert "total_readings" in data
        assert "average_soil_moisture" in data
        assert "average_soil_ph" in data
        assert data["total_readings"] > 0
