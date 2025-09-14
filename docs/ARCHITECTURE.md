# GreenPulseX Architecture

## System Overview

GreenPulseX is a full-stack agricultural technology platform that combines IoT sensors, machine learning, and web technologies to provide AI-powered yield predictions and farming recommendations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    GreenPulseX Platform                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   IoT Sensors   │───▶│  Telemetry API  │───▶│   PostgreSQL    │            │
│  │  (ESP32/LoRa)   │    │   (FastAPI)     │    │  (TimescaleDB)  │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                        │                        │                 │
│           │                        ▼                        ▼                 │
│           │               ┌─────────────────┐    ┌─────────────────┐            │
│           │               │  ML Pipeline    │    │   Frontend      │            │
│           │               │  (scikit-learn) │    │   (Next.js)     │            │
│           │               └─────────────────┘    └─────────────────┘            │
│           │                        │                        │                 │
│           │                        ▼                        ▼                 │
│           │               ┌─────────────────┐    ┌─────────────────┐            │
│           └──────────────▶│  Predictions    │◀───│   Dashboard     │            │
│                           │   & Alerts      │    │   & Analytics   │            │
│                           └─────────────────┘    └─────────────────┘            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Maps:** React Leaflet
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion

### Backend
- **Framework:** FastAPI (Python)
- **Language:** Python 3.11
- **Database ORM:** SQLAlchemy (async)
- **Migrations:** Alembic
- **Authentication:** JWT
- **Validation:** Pydantic
- **Background Tasks:** Celery
- **Caching:** Redis
- **Message Queue:** MQTT (Mosquitto)

### Database
- **Primary Database:** PostgreSQL 15
- **Time-series Extension:** TimescaleDB
- **Cache:** Redis
- **Connection Pooling:** SQLAlchemy QueuePool

### Machine Learning
- **Framework:** scikit-learn
- **Model:** RandomForestRegressor
- **Hyperparameter Tuning:** Optuna
- **Model Serialization:** joblib
- **Data Processing:** pandas, numpy

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Docker Swarm / Kubernetes
- **Monitoring:** Prometheus + Grafana
- **Logging:** Structured logging with Sentry
- **CI/CD:** GitHub Actions

## Data Flow

### 1. Data Ingestion
```
IoT Sensors → MQTT Broker → Telemetry API → Database
```

1. **IoT sensors** collect soil and environmental data
2. **MQTT broker** receives sensor telemetry
3. **Telemetry API** processes and validates data
4. **PostgreSQL/TimescaleDB** stores time-series data

### 2. Machine Learning Pipeline
```
Historical Data → Feature Engineering → Model Training → Prediction API
```

1. **Historical data** from sensors and yield records
2. **Feature engineering** creates predictive features
3. **Model training** using scikit-learn
4. **Prediction API** serves real-time predictions

### 3. User Interface
```
User Request → Frontend → API Gateway → Backend Services → Database
```

1. **User** interacts with Next.js frontend
2. **Frontend** makes API calls to FastAPI backend
3. **Backend** processes requests and queries database
4. **Response** sent back through the chain

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    region VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Farms
```sql
CREATE TABLE farms (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    area_ha DECIMAL(10, 2) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sensor Readings (TimescaleDB Hypertable)
```sql
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY,
    device_id UUID REFERENCES devices(id),
    farm_id UUID REFERENCES farms(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    soil_moisture DECIMAL(5, 2),
    soil_ph DECIMAL(4, 2),
    nitrogen DECIMAL(8, 2),
    phosphorus DECIMAL(8, 2),
    potassium DECIMAL(8, 2),
    air_temperature DECIMAL(5, 2),
    air_humidity DECIMAL(5, 2),
    soil_temperature DECIMAL(5, 2),
    battery DECIMAL(5, 2)
);

SELECT create_hypertable('sensor_readings', 'timestamp');
```

## API Architecture

### RESTful Design
- **Base URL:** `/api/v1`
- **Authentication:** JWT Bearer tokens
- **Response Format:** JSON
- **Error Handling:** HTTP status codes + error messages

### Key Endpoints
- `POST /api/v1/telemetry` - Ingest sensor data
- `POST /api/v1/predict` - Generate yield predictions
- `GET /api/v1/farms` - List user farms
- `GET /api/v1/devices` - List farm devices
- `GET /api/v1/notifications` - Get user notifications

### WebSocket Support
- **Real-time updates** for sensor data
- **Live notifications** for alerts
- **Dashboard updates** without page refresh

## Security Architecture

### Authentication & Authorization
- **JWT tokens** for stateless authentication
- **Role-based access control** (farmer, agronomist, admin)
- **Token expiration** and refresh mechanisms

### Data Protection
- **Password hashing** with bcrypt
- **HTTPS** for all communications
- **Input validation** with Pydantic
- **SQL injection prevention** with SQLAlchemy ORM

### Infrastructure Security
- **Container security** with non-root users
- **Network isolation** with Docker networks
- **Secrets management** with environment variables
- **Regular security updates** for dependencies

## Scalability Considerations

### Horizontal Scaling
- **Stateless backend** services
- **Database connection pooling**
- **Redis caching** for session management
- **Load balancer** for multiple instances

### Performance Optimization
- **Database indexing** on frequently queried columns
- **TimescaleDB compression** for historical data
- **CDN** for static assets
- **Image optimization** with Next.js

### Monitoring & Observability
- **Prometheus metrics** for system monitoring
- **Grafana dashboards** for visualization
- **Structured logging** with correlation IDs
- **Error tracking** with Sentry

## Deployment Architecture

### Development Environment
```
Docker Compose
├── Frontend (Next.js)
├── Backend (FastAPI)
├── Database (PostgreSQL + TimescaleDB)
├── Redis
├── MQTT Broker
└── Monitoring (Prometheus + Grafana)
```

### Production Environment
```
Cloud Infrastructure
├── Load Balancer
├── Frontend (Vercel/CloudFront)
├── Backend (ECS/Kubernetes)
├── Database (RDS/Aurora)
├── Cache (ElastiCache)
├── Message Queue (IoT Core)
└── Monitoring (CloudWatch/Prometheus)
```

## Data Processing Pipeline

### Real-time Processing
1. **Sensor data ingestion** via MQTT
2. **Data validation** and cleaning
3. **Time-series storage** in TimescaleDB
4. **Real-time alerts** for critical conditions

### Batch Processing
1. **Daily data aggregation** for analytics
2. **Model retraining** with new data
3. **Report generation** for farmers
4. **Data archival** for long-term storage

### Machine Learning Pipeline
1. **Data collection** from sensors and historical records
2. **Feature engineering** with temporal aggregations
3. **Model training** with cross-validation
4. **Model deployment** and versioning
5. **Prediction serving** via API endpoints

## Integration Points

### External APIs
- **Weather data** from OpenWeatherMap/NASA POWER
- **SMS notifications** via Twilio
- **Email services** via SendGrid
- **Payment processing** via Stripe

### IoT Integration
- **MQTT protocol** for sensor communication
- **LoRaWAN** for long-range connectivity
- **Device management** and firmware updates
- **Battery monitoring** and alerts

## Future Enhancements

### Planned Features
- **Computer vision** for crop disease detection
- **Satellite imagery** integration
- **Blockchain** for supply chain tracking
- **Mobile app** for field workers

### Technical Improvements
- **Microservices** architecture
- **Event-driven** processing with Apache Kafka
- **GraphQL** API for flexible queries
- **Edge computing** for real-time processing

## Performance Metrics

### Target Performance
- **API response time:** < 300ms (95th percentile)
- **Frontend load time:** < 2s on 3G
- **Database queries:** < 100ms average
- **Prediction accuracy:** > 85%

### Monitoring KPIs
- **System uptime:** 99.9%
- **Error rate:** < 0.1%
- **User satisfaction:** > 4.5/5
- **Data ingestion rate:** 1000+ readings/minute

## Conclusion

GreenPulseX is designed as a scalable, maintainable platform that can grow with the needs of farmers worldwide. The architecture supports both current requirements and future enhancements while maintaining high performance and reliability standards.
