# 🌾 Agri-Siddhi - AI-Powered Agricultural Optimization Platform

Agri-Siddhi is an intelligent agricultural platform that provides real-time yield predictions and optimization recommendations for farmers across India. Built with cutting-edge AI/ML technologies, it integrates live weather data, soil information, satellite imagery, and market prices to deliver actionable insights.

## 🚀 Features

### Core Capabilities
- **Real-time Yield Prediction**: AI-powered forecasting using Random Forest and advanced ML models
- **Smart Fertilizer Recommendations**: Optimized NPK recommendations based on soil health and predicted yield
- **Intelligent Irrigation Scheduling**: Water balance modeling for efficient water management
- **Live Market Analysis**: Real-time price tracking and revenue estimation
- **Interactive Map Interface**: Visual representation of agricultural data across India

### Data Sources
- **Weather Data**: OpenWeatherMap API for real-time meteorological information
- **Soil Data**: Simulated soil health data based on agro-climatic zones
- **Satellite Data**: NDVI/EVI vegetation indices for crop health monitoring
- **Market Prices**: AGMARKNET integration for live commodity prices

## 🛠️ Technology Stack

### Backend
- **Python Flask**: RESTful API framework
- **Scikit-learn**: Machine learning models
- **TensorFlow/Keras**: Deep learning capabilities
- **MongoDB**: NoSQL database for flexible data storage
- **Pandas/NumPy**: Data processing and analysis

### Frontend
- **React.js**: Modern UI framework
- **Material-UI**: Component library
- **Leaflet**: Interactive maps
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-service orchestration

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GreenPulsex
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📊 API Endpoints

### Predictions
- `POST /api/predictions` - Generate yield predictions
- `GET /api/districts` - Get list of districts and states

### Recommendations
- `POST /api/recommendations` - Get optimization recommendations

### System
- `GET /api/health` - Health check
- `GET /api/data/status` - Data source status

## 🎯 Usage

### 1. Dashboard
- View real-time weather and soil conditions
- Monitor market prices and vegetation health
- Access historical yield trends

### 2. Yield Prediction
- Select district and season
- Generate AI-powered yield forecasts
- View feature importance analysis

### 3. Recommendations
- Get personalized fertilizer recommendations
- Receive irrigation scheduling advice
- Access economic analysis and profit estimates

### 4. Map View
- Interactive map of India with district markers
- Click markers to select districts
- Visual representation of yield potential

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/agri_siddhi
FLASK_ENV=development
WEATHER_API_KEY=your_openweathermap_key
```

### API Keys
- **OpenWeatherMap**: Get free API key from https://openweathermap.org/api
- **AGMARKNET**: Public API, no key required

## 📈 Model Performance

### Random Forest Model
- **R² Score**: 0.85+ (target)
- **RMSE**: <200 kg/ha
- **Features**: 20+ engineered features from weather, soil, and satellite data

### Feature Importance
1. Rainfall patterns (25%)
2. Temperature conditions (20%)
3. Soil nitrogen levels (15%)
4. Vegetation indices (12%)
5. Soil phosphorus (10%)
6. Soil potassium (8%)
7. Humidity (5%)
8. Atmospheric pressure (5%)

## 🌍 Coverage

### Supported States
- Tamil Nadu
- Karnataka
- Maharashtra
- Punjab
- Haryana
- Gujarat
- Rajasthan
- West Bengal
- Bihar
- Uttar Pradesh

### Crops
- Primary: Rice (Paddy)
- Expandable to other crops

## 🔮 Future Enhancements

### Phase 2 Features
- **CNN-LSTM Model**: Advanced deep learning for spatiotemporal analysis
- **Multi-crop Support**: Expand beyond rice to wheat, maize, etc.
- **Mobile App**: Native mobile application
- **IoT Integration**: Sensor data integration
- **Blockchain**: Supply chain transparency

### Advanced Analytics
- **Climate Change Impact**: Long-term climate modeling
- **Pest & Disease Prediction**: Early warning systems
- **Supply Chain Optimization**: Market linkage improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data
- **AGMARKNET** for market price data
- **Indian Meteorological Department** for climate data
- **Tamil Nadu Agricultural University** for agronomic guidelines

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@domain.com]

---

**Agri-Siddhi** - Empowering Indian Agriculture with AI 🚀
