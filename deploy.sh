#!/bin/bash

# Ethiopian Salary ML Deployment Script
# This script sets up and deploys the full-stack application

set -e

echo "🇪🇹 Ethiopian Salary ML Deployment Script"
echo "=========================================="

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

# Check if required files exist
check_requirements() {
    print_status "Checking requirements..."
    
    local missing_files=()
    
    if [ ! -f "ethiopia_salary_data.csv" ]; then
        missing_files+=("ethiopia_salary_data.csv")
    fi
    
    if [ ! -f "best_ethiopian_salary_model.pkl" ]; then
        print_warning "Model file not found. Training model..."
        python ethiopia_salary_prediction.py
    fi
    
    if [ ${#missing_files[@]} -ne 0 ]; then
        print_error "Missing required files: ${missing_files[*]}"
        exit 1
    fi
    
    print_success "All required files found"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python -m venv venv
    fi
    
    print_status "Activating virtual environment and installing dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
    
    cd ..
    print_success "Backend setup complete"
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
    fi
    
    print_status "Building frontend..."
    npm run build
    
    cd ..
    print_success "Frontend setup complete"
}

# Start services with Docker Compose
deploy_with_docker() {
    print_status "Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check service health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
        docker-compose logs backend
        exit 1
    fi
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
        docker-compose logs frontend
        exit 1
    fi
    
    print_success "Deployment complete!"
}

# Start services locally (development)
start_local() {
    print_status "Starting services locally..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    source venv/bin/activate
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Services started!"
    print_status "Backend: http://localhost:8000"
    print_status "Frontend: http://localhost:3000"
    print_status "API Docs: http://localhost:8000/docs"
    
    # Wait for user input to stop
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Trap Ctrl+C and cleanup
    trap 'print_status "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
    
    # Wait indefinitely
    while true; do
        sleep 1
    done
}

# Main deployment logic
main() {
    echo ""
    print_status "Choose deployment method:"
    echo "1) Docker Compose (Production)"
    echo "2) Local Development"
    echo "3) Setup Only (No Start)"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            check_requirements
            deploy_with_docker
            echo ""
            print_success "🎉 Deployment successful!"
            print_status "Frontend: http://localhost:3000"
            print_status "Backend API: http://localhost:8000"
            print_status "API Documentation: http://localhost:8000/docs"
            print_status "Nginx Proxy: http://localhost:80"
            ;;
        2)
            check_requirements
            setup_backend
            setup_frontend
            start_local
            ;;
        3)
            check_requirements
            setup_backend
            setup_frontend
            print_success "Setup complete! You can now start services manually."
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Run main function
main