# 🚀 Deployment Guide

## Ethiopian Tech Salary ML - Full Stack Deployment

This guide covers deploying the complete full-stack application with Next.js 16 frontend and FastAPI backend.

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0+ 
- **Python**: 3.8+
- **Docker**: 20.10+ (for containerized deployment)
- **Docker Compose**: 2.0+

### Required Files
- `ethiopia_salary_data.csv` - Dataset file
- `best_ethiopian_salary_model.pkl` - Trained ML model (auto-generated if missing)

---

## 🏗️ Project Structure

```
ethiopian-tech-salary-ml/
├── 📁 backend/                 # FastAPI backend
│   ├── app.py                  # Main API application
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile             # Backend container config
├── 📁 frontend/               # Next.js 16 frontend
│   ├── src/                   # Source code
│   ├── package.json           # Node.js dependencies
│   └── Dockerfile            # Frontend container config
├── docker-compose.yml         # Multi-container orchestration
├── nginx.conf                 # Reverse proxy configuration
├── deploy.sh                  # Automated deployment script
└── DEPLOYMENT.md             # This file
```

---

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
# Make deployment script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

**Windows Users:**
```powershell
# Run with PowerShell
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

### Option 2: Docker Compose

```bash
# Start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 3: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Or start development server
npm run dev
```

---

## 🌐 Service URLs

After successful deployment:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web application |
| **Backend API** | http://localhost:8000 | REST API endpoints |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/health | Service health status |
| **Nginx Proxy** | http://localhost:80 | Load balancer (Docker only) |

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# API Configuration
PYTHONPATH=/app
ENVIRONMENT=production
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Model Configuration
MODEL_PATH=best_ethiopian_salary_model.pkl
DATA_PATH=ethiopia_salary_data.csv
```

#### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=Ethiopian Salary Predictor
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Docker Compose Override

Create `docker-compose.override.yml` for custom configurations:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - DEBUG=true
    ports:
      - "8001:8000"  # Custom port
  
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 📊 Health Monitoring

### Health Check Endpoints

```bash
# Backend health
curl http://localhost:8000/health

# Frontend health (Docker)
curl http://localhost:3000

# Full system status
curl http://localhost:8000/stats
```

### Expected Responses

**Backend Health:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "data_loaded": true,
  "timestamp": "2024-03-16T10:30:00Z"
}
```

**API Stats:**
```json
{
  "total_records": 200,
  "salary_range_etb": {
    "min": 340000,
    "max": 1490000,
    "mean": 750000
  },
  "departments": ["Engineering", "IT", "Software", "Data Science"],
  "locations": ["Addis Ababa", "Bahir Dar", "Mekelle", ...]
}
```

---

## 🔒 Security Configuration

### Production Security Headers

The Nginx configuration includes:
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-XSS-Protection**: XSS protection
- **Referrer-Policy**: Controls referrer information

### Rate Limiting

- **API Endpoints**: 10 requests/second
- **General Routes**: 30 requests/second
- **Burst Capacity**: 5-20 requests

### CORS Configuration

Backend allows requests from:
- `http://localhost:3000` (development)
- Your production domain (configure in environment)

---

## 📈 Performance Optimization

### Frontend Optimizations
- **Static Generation**: Pre-built pages for better performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle splitting
- **Compression**: Gzip compression via Nginx

### Backend Optimizations
- **Async Processing**: FastAPI async endpoints
- **Response Caching**: Model predictions cached
- **Connection Pooling**: Efficient database connections
- **Health Checks**: Automatic service monitoring

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Model File Not Found
```bash
# Error: Model file not found
# Solution: Train the model first
python ethiopia_salary_prediction.py
```

#### 2. Port Already in Use
```bash
# Error: Port 3000/8000 already in use
# Solution: Kill existing processes
# Linux/Mac:
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 3. Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Frontend Build Errors
```bash
# Clear Next.js cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Log Analysis

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100 backend
```

---

## 🌍 Production Deployment

### Cloud Deployment Options

#### 1. **Vercel + Railway**
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: Use managed PostgreSQL

#### 2. **AWS ECS**
- **Frontend**: CloudFront + S3
- **Backend**: ECS Fargate
- **Load Balancer**: Application Load Balancer

#### 3. **Google Cloud Run**
- **Frontend**: Cloud Run
- **Backend**: Cloud Run
- **Database**: Cloud SQL

#### 4. **DigitalOcean App Platform**
- **Full Stack**: Single platform deployment
- **Database**: Managed PostgreSQL
- **CDN**: Built-in CDN

### Environment-Specific Configurations

#### Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
    restart: always
  
  frontend:
    environment:
      - NODE_ENV=production
    restart: always
```

#### Staging
```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  backend:
    environment:
      - ENVIRONMENT=staging
      - DEBUG=true
```

---

## 📝 Maintenance

### Regular Tasks

#### 1. **Update Dependencies**
```bash
# Backend
cd backend
pip list --outdated
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
npm outdated
npm update
```

#### 2. **Model Retraining**
```bash
# Retrain with new data
python ethiopia_salary_prediction.py

# Restart services to load new model
docker-compose restart backend
```

#### 3. **Database Backup** (if using database)
```bash
# Backup data
docker-compose exec postgres pg_dump -U user database > backup.sql

# Restore data
docker-compose exec postgres psql -U user database < backup.sql
```

### Monitoring

#### 1. **Application Metrics**
- Response times
- Error rates
- Request volumes
- Model prediction accuracy

#### 2. **Infrastructure Metrics**
- CPU usage
- Memory consumption
- Disk space
- Network traffic

---

## 🆘 Support

### Getting Help

1. **Documentation**: Check this deployment guide
2. **Issues**: Open GitHub issues for bugs
3. **Discussions**: Use GitHub discussions for questions
4. **API Docs**: Visit `/docs` endpoint for API reference

### Useful Commands

```bash
# Quick health check
curl -f http://localhost:8000/health && echo "Backend OK"
curl -f http://localhost:3000 && echo "Frontend OK"

# View resource usage
docker stats

# Clean up Docker resources
docker system prune -a

# Restart specific service
docker-compose restart backend
```

---

## ✅ Deployment Checklist

- [ ] Prerequisites installed (Node.js, Python, Docker)
- [ ] Required files present (dataset, model)
- [ ] Environment variables configured
- [ ] Services start successfully
- [ ] Health checks pass
- [ ] API endpoints respond correctly
- [ ] Frontend loads and functions
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

**🎉 Congratulations! Your Ethiopian Salary ML application is now deployed and ready to use!**

For additional support, please refer to the main [README.md](README.md) or open an issue on GitHub.