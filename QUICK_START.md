# GreenPulseX Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- 4GB+ RAM available

### 1. Clone and Start
```bash
git clone <repository-url>
cd GreenPulseX
docker-compose up --build
```

### 2. Seed Demo Data
```bash
docker-compose exec backend python scripts/seed_demo_data.py
```

### 3. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Database Admin:** http://localhost:5050

### 4. Login with Demo Credentials
- **Farmer:** demo@greenpulsex.com / demo123
- **Admin:** admin@greenpulsex.com / demo123

## 🧪 Test Everything Works

Run the comprehensive test script:
```bash
./scripts/test-deployment.sh
```

This will:
- ✅ Start all services
- ✅ Run database migrations
- ✅ Seed demo data
- ✅ Test API endpoints
- ✅ Test telemetry ingestion
- ✅ Test ML predictions
- ✅ Run test suites
- ✅ Verify frontend functionality

## 📊 What You'll See

### Dashboard Features
- **Real-time sensor data** from 3 demo farms
- **AI yield predictions** with confidence scores
- **Actionable recommendations** for irrigation and fertilization
- **Interactive charts** showing soil moisture, pH, temperature
- **Farm map** with device locations
- **Notification system** for alerts

### Demo Data Includes
- 3 farms with different crops (rice, wheat, corn)
- 8 IoT devices with realistic sensor readings
- 30 days of historical data
- AI predictions and recommendations
- Sample notifications

## 🔧 Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# Create migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker-compose exec backend alembic upgrade head
```

## 📡 API Testing

### Test Telemetry Ingestion
```bash
curl -X POST http://localhost:8000/api/v1/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "esp32-001",
    "farm_id": "your-farm-id",
    "timestamp": "2024-01-15T12:00:00Z",
    "soil_moisture": 45.5,
    "soil_ph": 6.8,
    "npk": {"n": 50, "p": 25, "k": 150},
    "air_temp": 28.5,
    "air_humidity": 72.0,
    "soil_temp": 24.5,
    "battery": 3.8
  }'
```

### Test Yield Prediction
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "your-farm-id",
    "crop": "rice",
    "start_date": "2024-10-01T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z"
  }'
```

## 🎯 Key Features Demonstrated

### 1. IoT Data Ingestion
- Real-time sensor data processing
- Batch data ingestion
- Data validation and storage
- Device status monitoring

### 2. AI-Powered Predictions
- Machine learning model for yield prediction
- Confidence scoring
- Historical comparison
- Model versioning

### 3. Smart Recommendations
- Irrigation scheduling
- Fertilizer application
- Pest control alerts
- Priority-based suggestions

### 4. Modern Web Interface
- Responsive design
- Real-time updates
- Interactive charts
- Mobile-friendly

### 5. Production-Ready Architecture
- Docker containerization
- Database migrations
- API documentation
- Monitoring and logging
- CI/CD pipeline

## 🚀 Next Steps

### For Farmers
1. **Register** your farm and devices
2. **Deploy sensors** in your fields
3. **Monitor** real-time data
4. **Follow recommendations** for better yields

### For Developers
1. **Explore the codebase** structure
2. **Run tests** to understand functionality
3. **Customize** for your use case
4. **Deploy** to your preferred cloud platform

### For Deployment
1. **Configure** environment variables
2. **Set up** production database
3. **Deploy** using Docker or cloud services
4. **Monitor** with Prometheus and Grafana

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and components
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[README](README.md)** - Project overview and setup

## 🆘 Support

- **Issues:** GitHub Issues
- **Documentation:** [docs/](docs/)
- **Email:** support@greenpulsex.com

## 🎉 Success!

You now have a fully functional agricultural technology platform running locally. The system demonstrates:

- ✅ **Real-time IoT data processing**
- ✅ **AI-powered yield predictions**
- ✅ **Smart farming recommendations**
- ✅ **Modern web interface**
- ✅ **Production-ready architecture**

**Happy farming with AI! 🌱🤖**
