import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

class RealMLTrainer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        self.is_trained = False
        
    def generate_realistic_training_data(self, num_samples=1000):
        """Generate realistic agricultural training data"""
        np.random.seed(42)
        
        data = []
        
        # Indian districts with realistic coordinates
        districts = [
            {'name': 'Chennai', 'lat': 13.0827, 'lon': 80.2707, 'base_yield': 4200},
            {'name': 'Coimbatore', 'lat': 11.0168, 'lon': 76.9558, 'base_yield': 3800},
            {'name': 'Madurai', 'lat': 9.9252, 'lon': 78.1198, 'base_yield': 3600},
            {'name': 'Salem', 'lat': 11.6643, 'lon': 78.1460, 'base_yield': 3400},
            {'name': 'Tirunelveli', 'lat': 8.7139, 'lon': 77.7567, 'base_yield': 3200},
            {'name': 'Erode', 'lat': 11.3410, 'lon': 77.7172, 'base_yield': 3500},
            {'name': 'Tiruchirapalli', 'lat': 10.7905, 'lon': 78.7047, 'base_yield': 3300},
            {'name': 'Thanjavur', 'lat': 10.7869, 'lon': 79.1378, 'base_yield': 4000},
            {'name': 'Vellore', 'lat': 12.9202, 'lon': 79.1500, 'base_yield': 3100}
        ]
        
        seasons = ['Kharif', 'Rabi', 'Summer']
        soil_types = ['Clay', 'Sandy Clay', 'Loamy', 'Sandy Loam', 'Red Soil']
        
        for i in range(num_samples):
            district = np.random.choice(districts)
            season = np.random.choice(seasons)
            soil_type = np.random.choice(soil_types)
            
            # Generate realistic features
            # Weather features
            if season == 'Kharif':  # Monsoon
                rainfall = np.random.normal(800, 200)
                temp_avg = np.random.normal(28, 2)
                humidity = np.random.normal(75, 10)
            elif season == 'Rabi':  # Winter
                rainfall = np.random.normal(200, 100)
                temp_avg = np.random.normal(25, 3)
                humidity = np.random.normal(60, 15)
            else:  # Summer
                rainfall = np.random.normal(100, 50)
                temp_avg = np.random.normal(32, 2)
                humidity = np.random.normal(50, 10)
            
            # Temperature variations
            temp_max = temp_avg + np.random.normal(5, 2)
            temp_min = temp_avg - np.random.normal(5, 2)
            
            # Soil features based on type
            if 'Clay' in soil_type:
                ph = np.random.normal(6.8, 0.3)
                organic_carbon = np.random.normal(2.5, 0.5)
                nitrogen = np.random.normal(150, 30)
            elif 'Sandy' in soil_type:
                ph = np.random.normal(6.2, 0.4)
                organic_carbon = np.random.normal(1.2, 0.3)
                nitrogen = np.random.normal(100, 25)
            else:  # Loamy
                ph = np.random.normal(6.5, 0.3)
                organic_carbon = np.random.normal(1.8, 0.4)
                nitrogen = np.random.normal(125, 25)
            
            # Satellite features (NDVI/EVI)
            ndvi = np.random.normal(0.6, 0.15)
            evi = np.random.normal(0.4, 0.1)
            
            # Calculate realistic yield based on all factors
            base_yield = district['base_yield']
            
            # Weather impact
            rainfall_factor = min(1.2, max(0.6, rainfall / 600))  # Optimal around 600mm
            temp_factor = 1.0 - abs(temp_avg - 28) * 0.02  # Optimal around 28°C
            humidity_factor = 1.0 - abs(humidity - 70) * 0.005  # Optimal around 70%
            
            # Soil impact
            ph_factor = 1.0 - abs(ph - 6.5) * 0.1  # Optimal around 6.5
            organic_factor = min(1.2, organic_carbon / 2.0)  # More organic matter is better
            nitrogen_factor = min(1.3, nitrogen / 120)  # More nitrogen is better
            
            # Satellite impact
            ndvi_factor = min(1.2, ndvi / 0.6)  # Higher NDVI is better
            evi_factor = min(1.1, evi / 0.4)  # Higher EVI is better
            
            # Calculate final yield
            yield_multiplier = (rainfall_factor * temp_factor * humidity_factor * 
                             ph_factor * organic_factor * nitrogen_factor * 
                             ndvi_factor * evi_factor)
            
            final_yield = int(base_yield * yield_multiplier * np.random.normal(1.0, 0.1))
            final_yield = max(1000, min(6000, final_yield))  # Reasonable bounds
            
            # Create sample
            sample = {
                'district': district['name'],
                'latitude': district['lat'],
                'longitude': district['lon'],
                'season': season,
                'soil_type': soil_type,
                'rainfall_mm': round(rainfall, 1),
                'avg_temperature': round(temp_avg, 1),
                'max_temperature': round(temp_max, 1),
                'min_temperature': round(temp_min, 1),
                'humidity_percent': round(humidity, 1),
                'soil_ph': round(ph, 1),
                'organic_carbon_percent': round(organic_carbon, 1),
                'nitrogen_kg_per_ha': round(nitrogen, 1),
                'phosphorus_kg_per_ha': round(np.random.normal(25, 8), 1),
                'potassium_kg_per_ha': round(np.random.normal(180, 40), 1),
                'ndvi': round(ndvi, 3),
                'evi': round(evi, 3),
                'fertilizer_used_kg': round(np.random.normal(120, 30), 1),
                'irrigation_days': round(np.random.normal(60, 20), 1),
                'yield_kg_per_ha': final_yield
            }
            
            data.append(sample)
        
        return pd.DataFrame(data)
    
    def prepare_features(self, df):
        """Prepare features for ML model"""
        # Encode categorical variables
        categorical_cols = ['district', 'season', 'soil_type']
        
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col])
            else:
                df[f'{col}_encoded'] = self.label_encoders[col].transform(df[col])
        
        # Select features for training
        feature_cols = [
            'latitude', 'longitude', 'season_encoded', 'soil_type_encoded',
            'rainfall_mm', 'avg_temperature', 'max_temperature', 'min_temperature',
            'humidity_percent', 'soil_ph', 'organic_carbon_percent',
            'nitrogen_kg_per_ha', 'phosphorus_kg_per_ha', 'potassium_kg_per_ha',
            'ndvi', 'evi', 'fertilizer_used_kg', 'irrigation_days'
        ]
        
        self.feature_columns = feature_cols
        X = df[feature_cols].values
        y = df['yield_kg_per_ha'].values
        
        return X, y
    
    def train_model(self, df):
        """Train the Random Forest model"""
        print("🌱 Generating realistic training data...")
        
        # Prepare features
        X, y = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest
        print("🤖 Training Random Forest model...")
        self.model = RandomForestRegressor(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test_scaled)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mse)
        
        print(f"📊 Model Performance:")
        print(f"   R² Score: {r2:.3f}")
        print(f"   RMSE: {rmse:.1f} kg/ha")
        print(f"   MAE: {mae:.1f} kg/ha")
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5, scoring='r2')
        print(f"   Cross-validation R²: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        
        self.is_trained = True
        
        # Save model and scaler
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/real_yield_model.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        joblib.dump(self.label_encoders, 'models/label_encoders.pkl')
        joblib.dump(self.feature_columns, 'models/feature_columns.pkl')
        
        print("💾 Model saved successfully!")
        
        return {
            'r2_score': r2,
            'rmse': rmse,
            'mae': mae,
            'cv_scores': cv_scores.tolist(),
            'feature_importance': dict(zip(self.feature_columns, self.model.feature_importances_))
        }
    
    def predict_yield(self, district, season, soil_type, weather_data, soil_data, satellite_data):
        """Make yield prediction using trained model"""
        if not self.is_trained:
            self.load_model()
        
        # Prepare input features
        features = self._prepare_prediction_input(
            district, season, soil_type, weather_data, soil_data, satellite_data
        )
        
        # Scale features
        features_scaled = self.scaler.transform([features])
        
        # Make prediction
        prediction = self.model.predict(features_scaled)[0]
        
        # Calculate confidence based on feature values
        confidence = self._calculate_confidence(features)
        
        return {
            'predicted_yield': int(prediction),
            'confidence': confidence,
            'feature_importance': dict(zip(self.feature_columns, self.model.feature_importances_))
        }
    
    def _prepare_prediction_input(self, district, season, soil_type, weather_data, soil_data, satellite_data):
        """Prepare input features for prediction"""
        # Encode categorical variables
        district_encoded = self.label_encoders['district'].transform([district])[0]
        season_encoded = self.label_encoders['season'].transform([season])[0]
        soil_type_encoded = self.label_encoders['soil_type'].transform([soil_type])[0]
        
        # Get coordinates (simplified)
        lat, lon = 13.0827, 80.2707  # Default to Chennai
        
        features = [
            lat, lon, season_encoded, soil_type_encoded,
            weather_data.get('rainfall_mm', 0),
            weather_data.get('avg_temperature', 28),
            weather_data.get('max_temperature', 32),
            weather_data.get('min_temperature', 24),
            weather_data.get('humidity_percent', 70),
            soil_data.get('ph', 6.5),
            soil_data.get('organic_carbon_percent', 1.5),
            soil_data.get('nitrogen_kg_per_ha', 120),
            soil_data.get('phosphorus_kg_per_ha', 25),
            soil_data.get('potassium_kg_per_ha', 180),
            satellite_data.get('ndvi', 0.6),
            satellite_data.get('evi', 0.4),
            weather_data.get('fertilizer_used_kg', 120),
            weather_data.get('irrigation_days', 60)
        ]
        
        return features
    
    def _calculate_confidence(self, features):
        """Calculate prediction confidence"""
        # Simple confidence based on data completeness and reasonable ranges
        non_zero_features = sum(1 for f in features if f != 0)
        confidence = min(0.95, 0.6 + (non_zero_features / len(features)) * 0.35)
        return round(confidence, 2)
    
    def load_model(self):
        """Load pre-trained model"""
        try:
            self.model = joblib.load('models/real_yield_model.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            self.label_encoders = joblib.load('models/label_encoders.pkl')
            self.feature_columns = joblib.load('models/feature_columns.pkl')
            self.is_trained = True
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise

# Train the model
if __name__ == "__main__":
    trainer = RealMLTrainer()
    
    # Generate training data
    print("🚀 Starting ML model training...")
    training_data = trainer.generate_realistic_training_data(2000)  # 2000 samples
    
    # Train model
    results = trainer.train_model(training_data)
    
    print("\n🎉 Training completed successfully!")
    print(f"Model R² Score: {results['r2_score']:.3f}")
    print(f"RMSE: {results['rmse']:.1f} kg/ha")
