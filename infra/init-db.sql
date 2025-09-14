-- Initialize TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create custom types
CREATE TYPE user_role AS ENUM ('farmer', 'agronomist', 'admin');
CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance', 'error');
CREATE TYPE prediction_status AS ENUM ('pending', 'completed', 'failed');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    region VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farms table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    area_ha DECIMAL(10, 2) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100),
    planting_date DATE,
    expected_harvest_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    device_model VARCHAR(100) NOT NULL,
    firmware_version VARCHAR(50),
    last_seen TIMESTAMP WITH TIME ZONE,
    status device_status DEFAULT 'active',
    battery_level DECIMAL(5, 2),
    location_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sensor_readings table (TimescaleDB hypertable)
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    soil_moisture DECIMAL(5, 2),
    soil_ph DECIMAL(4, 2),
    nitrogen DECIMAL(8, 2),
    phosphorus DECIMAL(8, 2),
    potassium DECIMAL(8, 2),
    air_temperature DECIMAL(5, 2),
    air_humidity DECIMAL(5, 2),
    soil_temperature DECIMAL(5, 2),
    battery DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Convert sensor_readings to hypertable
SELECT create_hypertable('sensor_readings', 'timestamp');

-- Create predictions table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    features_json JSONB,
    predicted_yield_kg_per_ha DECIMAL(10, 2),
    confidence DECIMAL(5, 4),
    recommendations_json JSONB,
    status prediction_status DEFAULT 'pending'
);

-- Create model_versions table
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) UNIQUE NOT NULL,
    metrics_json JSONB,
    training_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    artifact_path VARCHAR(500),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sensor_readings_farm_timestamp ON sensor_readings(farm_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_device_timestamp ON sensor_readings(device_id, timestamp DESC);
CREATE INDEX idx_predictions_farm_created ON predictions(farm_id, created_at DESC);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_devices_farm_id ON devices(farm_id);
CREATE INDEX idx_farms_user_id ON farms(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (name, email, password_hash, role, region) VALUES 
('Admin User', 'admin@greenpulsex.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', 'admin', 'Global');

-- Insert demo farmer user
INSERT INTO users (name, email, password_hash, role, region, language) VALUES 
('Demo Farmer', 'demo@greenpulsex.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', 'farmer', 'India', 'en');

-- Insert default model version
INSERT INTO model_versions (version, metrics_json, is_active) VALUES 
('v0.1.0', '{"mae": 0.15, "rmse": 0.23, "r2": 0.78}', true);
