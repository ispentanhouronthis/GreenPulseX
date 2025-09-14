#!/bin/bash

# GreenPulseX Deployment Test Script
# This script tests the complete deployment and functionality

set -e

echo "🚀 Starting GreenPulseX Deployment Test"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker Compose is available"
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    
    # Stop any existing containers
    docker-compose down --remove-orphans
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
            print_success "Database is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Database failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for backend
    print_status "Waiting for backend API..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            print_success "Backend API is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Backend API failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000 &> /dev/null; then
            print_success "Frontend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start within 60 seconds"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if docker-compose exec -T backend alembic upgrade head; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
}

# Seed demo data
seed_demo_data() {
    print_status "Seeding demo data..."
    
    if docker-compose exec -T backend python scripts/seed_demo_data.py; then
        print_success "Demo data seeded successfully"
    else
        print_error "Demo data seeding failed"
        exit 1
    fi
}

# Test API endpoints
test_api_endpoints() {
    print_status "Testing API endpoints..."
    
    # Test health endpoint
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Health endpoint is working"
    else
        print_error "Health endpoint failed"
        exit 1
    fi
    
    # Test API documentation
    if curl -f http://localhost:8000/docs &> /dev/null; then
        print_success "API documentation is accessible"
    else
        print_error "API documentation is not accessible"
        exit 1
    fi
    
    # Test authentication
    print_status "Testing authentication..."
    
    # Register a test user
    register_response=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword123",
            "role": "farmer"
        }')
    
    if echo "$register_response" | grep -q "test@example.com"; then
        print_success "User registration is working"
    else
        print_error "User registration failed"
        echo "Response: $register_response"
        exit 1
    fi
    
    # Login
    login_response=$(curl -s -X POST http://localhost:8000/api/v1/auth/login-email \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test@example.com",
            "password": "testpassword123"
        }')
    
    if echo "$login_response" | grep -q "access_token"; then
        print_success "User login is working"
        TOKEN=$(echo "$login_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    else
        print_error "User login failed"
        echo "Response: $login_response"
        exit 1
    fi
    
    # Test authenticated endpoint
    if curl -f -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/users/me &> /dev/null; then
        print_success "Authenticated endpoints are working"
    else
        print_error "Authenticated endpoints failed"
        exit 1
    fi
}

# Test telemetry ingestion
test_telemetry() {
    print_status "Testing telemetry ingestion..."
    
    # Get a farm ID from demo data
    farms_response=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/farms)
    farm_id=$(echo "$farms_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$farm_id" ]; then
        print_warning "No farms found, creating a test farm..."
        # Create a test farm
        farm_response=$(curl -s -X POST http://localhost:8000/api/v1/farms \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
                "name": "Test Farm",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "area_ha": 5.0,
                "crop_type": "rice"
            }')
        farm_id=$(echo "$farm_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    fi
    
    # Create a test device
    device_response=$(curl -s -X POST http://localhost:8000/api/v1/devices \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"farm_id\": \"$farm_id\",
            \"device_id\": \"test-device-001\",
            \"device_model\": \"ESP32-S3\"
        }")
    
    device_id=$(echo "$device_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    
    # Ingest telemetry data
    telemetry_response=$(curl -s -X POST http://localhost:8000/api/v1/telemetry \
        -H "Content-Type: application/json" \
        -d "{
            \"device_id\": \"test-device-001\",
            \"farm_id\": \"$farm_id\",
            \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
            \"soil_moisture\": 45.5,
            \"soil_ph\": 6.8,
            \"npk\": {\"n\": 50, \"p\": 25, \"k\": 150},
            \"air_temp\": 28.5,
            \"air_humidity\": 72.0,
            \"soil_temp\": 24.5,
            \"battery\": 3.8
        }")
    
    if echo "$telemetry_response" | grep -q "success"; then
        print_success "Telemetry ingestion is working"
    else
        print_error "Telemetry ingestion failed"
        echo "Response: $telemetry_response"
        exit 1
    fi
}

# Test ML predictions
test_predictions() {
    print_status "Testing ML predictions..."
    
    # Get a farm ID
    farms_response=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/farms)
    farm_id=$(echo "$farms_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    # Generate prediction
    prediction_response=$(curl -s -X POST http://localhost:8000/api/v1/predict \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"farm_id\": \"$farm_id\",
            \"crop\": \"rice\",
            \"start_date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
            \"end_date\": \"$(date -u -d '+2 months' +%Y-%m-%dT%H:%M:%SZ)\"
        }")
    
    if echo "$prediction_response" | grep -q "predicted_yield_kg_per_ha"; then
        print_success "ML predictions are working"
    else
        print_error "ML predictions failed"
        echo "Response: $prediction_response"
        exit 1
    fi
}

# Test frontend
test_frontend() {
    print_status "Testing frontend..."
    
    # Test main page
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend main page is accessible"
    else
        print_error "Frontend main page is not accessible"
        exit 1
    fi
    
    # Test login page
    if curl -f http://localhost:3000/login &> /dev/null; then
        print_success "Frontend login page is accessible"
    else
        print_error "Frontend login page is not accessible"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running test suite..."
    
    # Backend tests
    if docker-compose exec -T backend pytest app/tests/ -v; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    
    # Frontend tests
    if docker-compose exec -T frontend npm test -- --watchAll=false; then
        print_success "Frontend tests passed"
    else
        print_error "Frontend tests failed"
        exit 1
    fi
}

# Display service URLs
show_service_urls() {
    print_status "Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  API Documentation: http://localhost:8000/docs"
    echo "  Database Admin: http://localhost:5050"
    echo "  Prometheus: http://localhost:9090"
    echo "  Grafana: http://localhost:3001"
    echo ""
    print_status "Demo Credentials:"
    echo "  Farmer: demo@greenpulsex.com / demo123"
    echo "  Admin: admin@greenpulsex.com / demo123"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    docker-compose down --remove-orphans
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo ""
    print_status "Starting comprehensive deployment test..."
    echo ""
    
    # Run all test steps
    check_docker
    check_docker_compose
    start_services
    wait_for_services
    run_migrations
    seed_demo_data
    test_api_endpoints
    test_telemetry
    test_predictions
    test_frontend
    run_tests
    
    echo ""
    print_success "🎉 All tests passed! GreenPulseX is ready for use."
    echo ""
    show_service_urls
    echo ""
    print_status "You can now access the application at the URLs above."
    print_status "Press Ctrl+C to stop all services."
    
    # Keep services running
    trap cleanup EXIT
    docker-compose logs -f
}

# Handle script interruption
trap cleanup INT

# Run main function
main "$@"
