# GreenPulseX API Documentation

## Overview

The GreenPulseX API provides endpoints for managing farms, devices, sensor data, and AI-powered yield predictions. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://api.greenpulsex.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "farmer",
  "region": "India",
  "language": "en"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "farmer",
  "region": "India",
  "language": "en",
  "is_active": true,
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

#### Login
```http
POST /api/v1/auth/login-email
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Farms

#### List Farms
```http
GET /api/v1/farms
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Green Valley Farm",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "area_ha": 5.2,
    "crop_type": "rice",
    "soil_type": "clay_loam",
    "planting_date": "2024-01-01",
    "expected_harvest_date": "2024-04-01",
    "created_at": "2024-01-15T12:00:00Z"
  }
]
```

#### Create Farm
```http
POST /api/v1/farms
```

**Request Body:**
```json
{
  "name": "New Farm",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "area_ha": 3.5,
  "crop_type": "wheat",
  "soil_type": "sandy_loam",
  "planting_date": "2024-01-01",
  "expected_harvest_date": "2024-05-01"
}
```

### Devices

#### List Devices
```http
GET /api/v1/devices
```

**Query Parameters:**
- `farm_id` (optional): Filter by farm ID

#### Create Device
```http
POST /api/v1/devices
```

**Request Body:**
```json
{
  "farm_id": "uuid",
  "device_id": "esp32-001",
  "device_model": "ESP32-S3",
  "firmware_version": "v1.2.3",
  "location_description": "Field A - North corner"
}
```

### Telemetry

#### Ingest Sensor Data
```http
POST /api/v1/telemetry
```

**Request Body:**
```json
{
  "device_id": "esp32-001",
  "farm_id": "uuid",
  "timestamp": "2024-01-15T12:00:00Z",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "soil_moisture": 45.5,
  "soil_ph": 6.8,
  "npk": {
    "n": 50,
    "p": 25,
    "k": 150
  },
  "air_temp": 28.5,
  "air_humidity": 72.0,
  "soil_temp": 24.5,
  "battery": 3.8
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "success",
  "message": "Telemetry data ingested successfully"
}
```

#### Batch Ingest
```http
POST /api/v1/telemetry/batch
```

**Request Body:**
```json
[
  {
    "device_id": "esp32-001",
    "farm_id": "uuid",
    "timestamp": "2024-01-15T12:00:00Z",
    "soil_moisture": 45.5,
    "soil_ph": 6.8,
    "npk": {"n": 50, "p": 25, "k": 150},
    "air_temp": 28.5,
    "air_humidity": 72.0,
    "soil_temp": 24.5,
    "battery": 3.8
  }
]
```

#### Get Farm Readings
```http
GET /api/v1/telemetry/farm/{farm_id}/readings
```

**Query Parameters:**
- `limit` (optional): Number of readings to return (default: 100)
- `offset` (optional): Number of readings to skip (default: 0)

#### Get Farm Statistics
```http
GET /api/v1/telemetry/farm/{farm_id}/stats
```

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Response:**
```json
{
  "farm_id": "uuid",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "total_readings": 150,
  "average_soil_moisture": 45.2,
  "average_soil_ph": 6.8,
  "average_air_temperature": 28.5,
  "average_air_humidity": 72.0,
  "min_soil_moisture": 35.0,
  "max_soil_moisture": 55.0,
  "min_soil_ph": 6.5,
  "max_soil_ph": 7.0
}
```

### Predictions

#### Generate Prediction
```http
POST /api/v1/predict
```

**Request Body:**
```json
{
  "farm_id": "uuid",
  "crop": "rice",
  "start_date": "2024-10-01T00:00:00Z",
  "end_date": "2024-11-30T23:59:59Z",
  "feature_snapshot": {
    "soil_moisture": 45.5,
    "soil_ph": 6.8,
    "nitrogen": 50,
    "phosphorus": 25,
    "potassium": 150
  }
}
```

**Response:**
```json
{
  "predicted_yield_kg_per_ha": 4200,
  "confidence": 0.78,
  "expected_change_vs_hist": "+12%",
  "recommendations": [
    {
      "type": "irrigation",
      "text": "Irrigate 20mm on 2024-10-05",
      "priority": 1,
      "scheduled_date": "2024-10-05T00:00:00Z",
      "estimated_impact": "Increase yield by 8-12%"
    },
    {
      "type": "fertilizer",
      "text": "Apply 15kg N per hectare next week",
      "priority": 2,
      "scheduled_date": "2024-10-10T00:00:00Z",
      "estimated_impact": "Increase yield by 5-8%"
    }
  ],
  "model_version": "v0.1.0",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

#### Get Latest Prediction
```http
GET /api/v1/predict/farm/{farm_id}/latest
```

#### Get Prediction History
```http
GET /api/v1/predict/farm/{farm_id}/history
```

**Query Parameters:**
- `limit` (optional): Number of predictions to return (default: 10)
- `offset` (optional): Number of predictions to skip (default: 0)

### Notifications

#### List Notifications
```http
GET /api/v1/notifications
```

**Query Parameters:**
- `skip` (optional): Number of notifications to skip (default: 0)
- `limit` (optional): Number of notifications to return (default: 50)
- `unread_only` (optional): Return only unread notifications (default: false)

#### Get Notification Statistics
```http
GET /api/v1/notifications/stats
```

**Response:**
```json
{
  "total_notifications": 25,
  "unread_notifications": 5,
  "notifications_by_type": {
    "alert": 10,
    "recommendation": 12,
    "system": 3
  }
}
```

#### Mark All Notifications as Read
```http
PUT /api/v1/notifications/mark-all-read
```

### Admin (Admin users only)

#### Get System Statistics
```http
GET /api/v1/admin/stats
```

**Response:**
```json
{
  "users": {
    "total": 150,
    "active": 145
  },
  "farms": {
    "total": 75
  },
  "devices": {
    "total": 200,
    "active": 195
  },
  "predictions": {
    "total": 500
  }
}
```

#### Retrain Model
```http
POST /api/v1/admin/retrain-model
```

**Response:**
```json
{
  "status": "success",
  "message": "Model retraining completed successfully",
  "result": {
    "version": "v1.1.0",
    "metrics": {
      "mae": 0.15,
      "rmse": 0.23,
      "r2": 0.78
    }
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "detail": "Error message description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to prevent abuse:
- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## WebSocket Support

Real-time updates are available via WebSocket connection:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

## SDKs and Libraries

Official SDKs are available for:
- **Python:** `pip install greenpulsex-sdk`
- **JavaScript/Node.js:** `npm install greenpulsex-sdk`
- **React:** `npm install @greenpulsex/react-sdk`

## Support

For API support and questions:
- **Email:** api-support@greenpulsex.com
- **Documentation:** https://docs.greenpulsex.com
- **Status Page:** https://status.greenpulsex.com
