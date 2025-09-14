"""
Seed script to populate database with demo data
"""

import asyncio
import random
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.farm import Farm
from app.models.device import Device, DeviceStatus
from app.models.sensor_reading import SensorReading
from app.models.prediction import Prediction, PredictionStatus
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_demo_users(db: AsyncSession) -> dict:
    """Create demo users"""
    logger.info("Creating demo users...")
    
    # Demo farmer user
    demo_farmer = User(
        name="Demo Farmer",
        email="demo@greenpulsex.com",
        phone="+1234567890",
        password_hash=get_password_hash("demo123"),
        role=UserRole.FARMER,
        region="India",
        language="en",
        is_active=True
    )
    
    # Demo agronomist user
    demo_agronomist = User(
        name="Demo Agronomist",
        email="agronomist@greenpulsex.com",
        phone="+1234567891",
        password_hash=get_password_hash("demo123"),
        role=UserRole.AGRONOMIST,
        region="India",
        language="en",
        is_active=True
    )
    
    # Demo admin user
    demo_admin = User(
        name="Demo Admin",
        email="admin@greenpulsex.com",
        phone="+1234567892",
        password_hash=get_password_hash("demo123"),
        role=UserRole.ADMIN,
        region="Global",
        language="en",
        is_active=True
    )
    
    db.add_all([demo_farmer, demo_agronomist, demo_admin])
    await db.commit()
    await db.refresh(demo_farmer)
    await db.refresh(demo_agronomist)
    await db.refresh(demo_admin)
    
    logger.info(f"Created users: {demo_farmer.email}, {demo_agronomist.email}, {demo_admin.email}")
    
    return {
        "farmer": demo_farmer,
        "agronomist": demo_agronomist,
        "admin": demo_admin
    }


async def create_demo_farms(db: AsyncSession, users: dict) -> list:
    """Create demo farms"""
    logger.info("Creating demo farms...")
    
    farms = []
    
    # Farm 1 - Rice farm
    farm1 = Farm(
        user_id=users["farmer"].id,
        name="Green Valley Rice Farm",
        latitude=Decimal("12.9716"),
        longitude=Decimal("77.5946"),
        area_ha=Decimal("5.2"),
        crop_type="rice",
        soil_type="clay_loam",
        planting_date=datetime.now().date() - timedelta(days=90),
        expected_harvest_date=datetime.now().date() + timedelta(days=90)
    )
    
    # Farm 2 - Wheat farm
    farm2 = Farm(
        user_id=users["farmer"].id,
        name="Sunrise Wheat Fields",
        latitude=Decimal("28.6139"),
        longitude=Decimal("77.2090"),
        area_ha=Decimal("3.8"),
        crop_type="wheat",
        soil_type="sandy_loam",
        planting_date=datetime.now().date() - timedelta(days=60),
        expected_harvest_date=datetime.now().date() + timedelta(days=120)
    )
    
    # Farm 3 - Corn farm
    farm3 = Farm(
        user_id=users["agronomist"].id,
        name="Golden Corn Acres",
        latitude=Decimal("19.0760"),
        longitude=Decimal("72.8777"),
        area_ha=Decimal("7.5"),
        crop_type="corn",
        soil_type="loam",
        planting_date=datetime.now().date() - timedelta(days=45),
        expected_harvest_date=datetime.now().date() + timedelta(days=135)
    )
    
    farms = [farm1, farm2, farm3]
    db.add_all(farms)
    await db.commit()
    
    for farm in farms:
        await db.refresh(farm)
    
    logger.info(f"Created {len(farms)} demo farms")
    
    return farms


async def create_demo_devices(db: AsyncSession, farms: list) -> list:
    """Create demo devices"""
    logger.info("Creating demo devices...")
    
    devices = []
    
    for i, farm in enumerate(farms):
        # Create 2-3 devices per farm
        num_devices = random.randint(2, 3)
        
        for j in range(num_devices):
            device = Device(
                farm_id=farm.id,
                device_id=f"esp32-{farm.id.hex[:8]}-{j+1:02d}",
                device_model="ESP32-S3",
                firmware_version="v1.2.3",
                last_seen=datetime.utcnow() - timedelta(hours=random.randint(1, 24)),
                status=DeviceStatus.ACTIVE,
                battery_level=f"{random.uniform(3.2, 4.2):.1f}V",
                location_description=f"Field {j+1} - {farm.name}"
            )
            devices.append(device)
    
    db.add_all(devices)
    await db.commit()
    
    for device in devices:
        await db.refresh(device)
    
    logger.info(f"Created {len(devices)} demo devices")
    
    return devices


async def create_demo_sensor_readings(db: AsyncSession, devices: list) -> int:
    """Create demo sensor readings"""
    logger.info("Creating demo sensor readings...")
    
    readings = []
    
    for device in devices:
        # Create 30 days of readings (one per day)
        for day in range(30):
            timestamp = datetime.utcnow() - timedelta(days=day)
            
            # Generate realistic sensor values with some variation
            base_moisture = random.uniform(35, 55)
            base_ph = random.uniform(6.2, 7.2)
            base_nitrogen = random.uniform(40, 60)
            base_phosphorus = random.uniform(20, 30)
            base_potassium = random.uniform(120, 180)
            base_air_temp = random.uniform(25, 32)
            base_air_humidity = random.uniform(65, 80)
            base_soil_temp = random.uniform(22, 28)
            base_battery = random.uniform(3.5, 4.2)
            
            reading = SensorReading(
                device_id=device.id,
                farm_id=device.farm_id,
                timestamp=timestamp,
                latitude=Decimal(str(random.uniform(12.9, 13.0))),
                longitude=Decimal(str(random.uniform(77.5, 77.6))),
                soil_moisture=Decimal(str(round(base_moisture, 1))),
                soil_ph=Decimal(str(round(base_ph, 1))),
                nitrogen=Decimal(str(round(base_nitrogen, 1))),
                phosphorus=Decimal(str(round(base_phosphorus, 1))),
                potassium=Decimal(str(round(base_potassium, 1))),
                air_temperature=Decimal(str(round(base_air_temp, 1))),
                air_humidity=Decimal(str(round(base_air_humidity, 1))),
                soil_temperature=Decimal(str(round(base_soil_temp, 1))),
                battery=Decimal(str(round(base_battery, 2)))
            )
            readings.append(reading)
    
    # Batch insert readings
    batch_size = 100
    for i in range(0, len(readings), batch_size):
        batch = readings[i:i + batch_size]
        db.add_all(batch)
        await db.commit()
        logger.info(f"Inserted batch {i//batch_size + 1}/{(len(readings) + batch_size - 1)//batch_size}")
    
    logger.info(f"Created {len(readings)} demo sensor readings")
    
    return len(readings)


async def create_demo_predictions(db: AsyncSession, farms: list) -> int:
    """Create demo predictions"""
    logger.info("Creating demo predictions...")
    
    predictions = []
    
    for farm in farms:
        # Create 3-5 predictions per farm
        num_predictions = random.randint(3, 5)
        
        for i in range(num_predictions):
            predicted_yield = random.uniform(3000, 5000)
            confidence = random.uniform(0.7, 0.9)
            
            # Generate sample recommendations
            recommendations = [
                {
                    "type": "irrigation",
                    "text": "Irrigate with 25mm of water in the next 3 days",
                    "priority": 1,
                    "estimated_impact": "Increase yield by 8-12%"
                },
                {
                    "type": "fertilizer",
                    "text": "Apply 15kg N per hectare next week",
                    "priority": 2,
                    "estimated_impact": "Increase yield by 5-8%"
                }
            ]
            
            prediction = Prediction(
                farm_id=farm.id,
                model_version="v0.1.0",
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                features_json={
                    "soil_moisture": random.uniform(35, 55),
                    "soil_ph": random.uniform(6.2, 7.2),
                    "nitrogen": random.uniform(40, 60),
                    "phosphorus": random.uniform(20, 30),
                    "potassium": random.uniform(120, 180)
                },
                predicted_yield_kg_per_ha=Decimal(str(round(predicted_yield, 1))),
                confidence=Decimal(str(round(confidence, 3))),
                recommendations_json=recommendations,
                status=PredictionStatus.COMPLETED
            )
            predictions.append(prediction)
    
    db.add_all(predictions)
    await db.commit()
    
    logger.info(f"Created {len(predictions)} demo predictions")
    
    return len(predictions)


async def seed_demo_data():
    """Main function to seed demo data"""
    logger.info("Starting demo data seeding...")
    
    async with AsyncSessionLocal() as db:
        try:
            # Create demo users
            users = await create_demo_users(db)
            
            # Create demo farms
            farms = await create_demo_farms(db, users)
            
            # Create demo devices
            devices = await create_demo_devices(db, farms)
            
            # Create demo sensor readings
            readings_count = await create_demo_sensor_readings(db, devices)
            
            # Create demo predictions
            predictions_count = await create_demo_predictions(db, farms)
            
            logger.info("Demo data seeding completed successfully!")
            logger.info(f"Summary:")
            logger.info(f"  - Users: {len(users)}")
            logger.info(f"  - Farms: {len(farms)}")
            logger.info(f"  - Devices: {len(devices)}")
            logger.info(f"  - Sensor readings: {readings_count}")
            logger.info(f"  - Predictions: {predictions_count}")
            
            logger.info("\nDemo accounts created:")
            logger.info("  - demo@greenpulsex.com (password: demo123) - Farmer")
            logger.info("  - agronomist@greenpulsex.com (password: demo123) - Agronomist")
            logger.info("  - admin@greenpulsex.com (password: demo123) - Admin")
            
        except Exception as e:
            logger.error(f"Demo data seeding failed: {str(e)}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
