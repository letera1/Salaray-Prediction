# 🇪🇹 Ethiopian Tech Salary Prediction

> **ML-powered salary prediction for Ethiopian technology professionals**

[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![ML](https://img.shields.io/badge/ML-Scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## 📖 What is This?

A **production-ready full-stack application** that predicts salaries for tech professionals in Ethiopia using machine learning. Built on **200 verified data points** from universities, industry surveys, and government statistics.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **ML Model** | Multiple Linear Regression with **R² = 0.86** accuracy |
| ⚡ **FastAPI Backend** | RESTful API with auto-generated OpenAPI/Swagger docs |
| 🎨 **Next.js Frontend** | Modern, responsive UI built with TypeScript |
| 🐳 **Docker Ready** | Full container orchestration with docker-compose |
| 📊 **Research Notebooks** | 10 Jupyter notebooks from EDA to production |

---

## 🖼️ Available Images

| Tag | Description | Port | Size |
|-----|-------------|------|------|
| `backend` | FastAPI REST API serving ML predictions | 8000 | ~1.2GB |
| `frontend` | Next.js 14 web application | 3000 | ~1.1GB |

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Nginx Proxy | http://localhost |

### Option 2: Run Backend Only

```bash
docker run -d -p 8000:8000 \
  -v ./models:/app/models:ro \
  -v ./data:/app/data:ro \
  tuta699/ethiopian-tech-salary-prediction:backend
```

### Option 3: Run Frontend Only

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  tuta699/ethiopian-tech-salary-prediction:frontend
```

---

## ⚙️ API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/predict` | **Predict salary** (send JSON) |
| `GET` | `/stats` | Dataset statistics |
| `GET` | `/salary-insights` | Analytics by dept/location |
| `GET` | `/departments` | List available departments |
| `GET` | `/education-levels` | List education levels |
| `GET` | `/locations` | List Ethiopian cities |

### Example: Predict Salary

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "experience": 5,
    "test_score": 85,
    "department": "Software",
    "education_level": "Master",
    "location": "Addis Ababa"
  }'
```

**Response:**
```json
{
  "predicted_salary_etb": 752000,
  "predicted_salary_usd": 13672,
  "confidence_interval": {
    "lower": 654080,
    "upper": 849920
  },
  "model_info": {
    "model_type": "Multiple Linear Regression",
    "accuracy": "R² = 0.86"
  }
}
```

---

## 🏗️ Architecture

```
┌──────────────────┐
│     Nginx        │  Port 80/443
│  (Reverse Proxy) │
└─────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐  ┌─▼────────┐
│Next.js │  │ FastAPI  │  Port 8000
│Port 3K │  │  + ML    │
└────────┘  └──────────
```

---

##  Model Performance

| Model | R² Score | RMSE |
|-------|----------|------|
| Simple Linear Regression | 0.72 | ~78,000 ETB |
| **Multiple Linear Regression** | **0.86** | **~58,000 ETB** |

### 💰 Key Salary Drivers

- **+60,000 ETB** per year of experience
- **+25–30%** premium for Addis Ababa vs other cities
- **2–3× higher** salary for PhD vs Bachelor's degree
- **Top departments**: Data Science › Software › Engineering › IT

---

## ⚙️ Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONPATH` | `/app` | Python module path |
| `ENVIRONMENT` | `production` | App environment |
| `MODEL_PATH` | `/app/models/...` | Path to ML model |
| `DATA_PATH` | `/app/data/...` | Path to dataset |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `/api` | Backend API URL |
| `BACKEND_URL` | `http://backend:8000` | Internal backend URL |

---

## 📚 Resources

| Resource | Link |
|----------|------|
| GitHub Repository | [Salaray-Prediction](https://github.com/your-username/Salaray-Prediction) |
| Full Documentation | See README.md |
| Interactive API Docs | http://localhost:8000/docs |

---

## 📜 License

**MIT License** — Feel free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ for the Ethiopian Tech Community**

[Report Issue](https://github.com/your-username/Salaray-Prediction/issues) · [Request Feature](https://github.com/your-username/Salaray-Prediction/issues)

</div>
