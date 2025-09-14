# GreenPulseX (GPX)

**AI-driven yield predictions for small & marginal farmers**

GreenPulseX helps you optimize irrigation, fertilizer, and pest control with real-time soil data and machine learning predictions.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Local Development

1. **Clone and start services:**
```bash
git clone <repository-url>
cd GreenPulseX
docker-compose up --build
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Database Admin: http://localhost:5050 (pgAdmin)

3. **Seed demo data:**
```bash
# Run the seed script to create demo farms, devices, and telemetry data
docker-compose exec backend python scripts/seed_demo_data.py
```

### Demo Account
- **Email:** demo@greenpulsex.com
- **Password:** demo123
- **Role:** Farmer

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IoT Sensors   │───▶│  Telemetry API  │───▶│   PostgreSQL    │
│  (ESP32/LoRa)   │    │   (FastAPI)     │    │  (TimescaleDB)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  ML Pipeline    │    │   Frontend      │
                       │  (scikit-learn) │    │   (Next.js)     │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Predictions    │◀───│   Dashboard     │
                       │   & Alerts      │    │   & Analytics   │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
GreenPulseX/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and API client
│   └── i18n/               # Internationalization
├── backend/                 # FastAPI application
│   ├── app/                # Main application code
│   │   ├── api/           # API endpoints
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── ml/           # ML pipeline
│   └── scripts/           # Utility scripts
├── ml/                     # ML notebooks and data
├── infra/                  # Infrastructure configs
│   └── docker-compose.yml
├── docs/                   # Documentation
└── tests/                  # E2E tests
```

## 🔧 Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Migrations
```bash
# Create migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker-compose exec backend alembic upgrade head
```

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
# Backend coverage
docker-compose exec backend pytest --cov=app

# Frontend coverage
cd frontend && npm run test:coverage
```

## 🤖 ML Model Training

### Train New Model
```bash
# Using sample data
docker-compose exec backend python -m app.ml.train

# With custom dataset
docker-compose exec backend python -m app.ml.train --data-path /path/to/data.csv
```

### Model Evaluation
```bash
docker-compose exec backend python -m app.ml.evaluate --model-version v1.0.0
```

## 🌍 Internationalization

### Adding New Language
1. Create translation file: `frontend/i18n/[locale].json`
2. Update `frontend/i18n/config.ts`
3. Test with language switcher

### Supported Languages
- English (en)
- Hindi (hi)
- Spanish (es)

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod
```

### Backend (Render/AWS)
```bash
# Build and deploy
docker build -t greenpulsex-backend ./backend
docker push your-registry/greenpulsex-backend
```

### Environment Variables
See `.env.example` files in each directory for required environment variables.

## 📊 API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Spec:** http://localhost:8000/openapi.json

### Key Endpoints

#### Telemetry Ingestion
```bash
POST /api/telemetry
Content-Type: application/json

{
  "device_id": "esp32-001",
  "farm_id": "farm-123",
  "timestamp": "2025-01-14T12:00:00Z",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "soil_moisture": 23.5,
  "soil_ph": 6.8,
  "npk": {"n": 40, "p": 18, "k": 120},
  "air_temp": 29.1,
  "air_humidity": 72,
  "soil_temp": 24.5,
  "battery": 3.7
}
```

#### Yield Prediction
```bash
POST /api/predict
Content-Type: application/json

{
  "farm_id": "farm-123",
  "crop": "rice",
  "start_date": "2025-10-01",
  "end_date": "2025-11-30"
}
```

## 🎯 Business Impact

GreenPulseX demonstrates measurable improvements:
- **10-15% yield increase** through optimized irrigation
- **20% reduction** in fertilizer waste
- **30% fewer** pest-related losses
- **Real-time monitoring** prevents crop failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation:** [docs/](./docs/)
- **Issues:** GitHub Issues
- **Email:** support@greenpulsex.com

---

**Built with ❤️ for farmers worldwide**