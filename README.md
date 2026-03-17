<div align="center">

# 🇪🇹 Ethiopian Tech Salary Prediction

### ML-powered salary prediction for Ethiopian technology professionals

[![Python](https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.0%2B-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

**Production-ready regression models · FastAPI backend · Next.js frontend · Docker deployment**

</div>

---

## 📋 Overview

A full-stack machine learning project that predicts salaries for technology professionals in Ethiopia. Built on 200 verified records from universities, industry surveys, and government statistics.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **ML** | Scikit-learn, Pandas, NumPy | Model training & evaluation |
| **API** | FastAPI + Uvicorn | REST API serving predictions |
| **UI** | Next.js 14 + TypeScript | Interactive web frontend |
| **Deploy** | Docker Compose + Nginx | Container orchestration |

---

## 📁 Project Structure

```
Salaray-Prediction/
│
├── 📂 data/
│   ├── raw/
│   │   └── ethiopia_salary_data.csv   # 200-record dataset
│   └── README.md                       # Dataset documentation
│
├── 📂 models/
│   └── best_ethiopian_salary_model.pkl # Trained model artifact
│
├── 📂 src/                             # ML source code
│   ├── __init__.py
│   ├── train.py                        # Training pipeline (run this first)
│   ├── validate.py                     # Dataset quality checks
│   └── pipeline.py                     # Advanced multi-model pipeline
│
├── 📂 notebooks/                       # Research & learning notebooks
│   ├── 01_data_exploration_analysis.ipynb
│   ├── 02_advanced_feature_engineering.ipynb
│   ├── 03_model_comparison_evaluation.ipynb
│   ├── 04_hyperparameter_optimization.ipynb
│   ├── 05_model_interpretation_explainability.ipynb
│   ├── 06_time_series_salary_trends.ipynb
│   ├── 07_deep_learning_neural_networks.ipynb
│   ├── 08_ensemble_methods_stacking.ipynb
│   ├── 09_automated_ml_pipeline.ipynb
│   └── 10_production_deployment_monitoring.ipynb
│
├── 📂 backend/                         # FastAPI REST API
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📂 frontend/                        # Next.js web app
│   ├── src/
│   │   ├── app/                        # Next.js App Router
│   │   ├── components/                 # UI components
│   │   ├── services/                   # API clients
│   │   └── types/                      # TypeScript types
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                  # Full-stack Docker setup
├── nginx.conf                          # Reverse proxy config
├── Makefile                            # Common task shortcuts
├── .env.example                        # Environment variable template
├── .gitignore
└── LICENSE
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Docker & Docker Compose (for full-stack deployment)

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/Salaray-Prediction.git
cd Salaray-Prediction

# Copy environment variables
cp .env.example .env

# Install all dependencies
make install
```

### 2. Train the Model
```bash
make train
# → Saves model to models/best_ethiopian_salary_model.pkl
```

### 3. Run Locally (two terminals)
```bash
make api        # FastAPI on http://localhost:8000
make frontend   # Next.js on http://localhost:3000
```

### 4. Or run with Docker (one command)
```bash
make docker-up
# → App available at http://localhost
```

---

## 🤖 Model Performance

| Model | R² Score | RMSE (ETB) | Features |
|-------|----------|------------|---------|
| Simple Linear Regression | 0.72 | ~78,000 | Experience only |
| **Multiple Linear Regression** ✅ | **0.86** | **~58,000** | All features |

### Key salary drivers
- **+60,000 ETB** per year of experience
- **+25–30%** premium for Addis Ababa vs other cities
- **2–3× higher** salary for PhD vs Bachelor's degree
- **Top departments**: Data Science › Software › Engineering › IT

---

## ⚙️ API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/predict` | **Predict salary** |
| `GET` | `/stats` | Dataset statistics |
| `GET` | `/salary-insights` | Analytics by dept/location/education |
| `GET` | `/departments` | Available departments |
| `GET` | `/education-levels` | Available education levels |
| `GET` | `/locations` | Available Ethiopian cities |

#### Example: Predict Salary
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

Response:
```json
{
  "predicted_salary_etb": 752000,
  "predicted_salary_usd": 13672,
  "confidence_interval": { "lower": 654080, "upper": 849920 },
  "model_info": { "model_type": "Multiple Linear Regression", "accuracy": "R² = 0.86" },
  "timestamp": "2026-03-17T10:00:00"
}
```

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📓 Notebooks

Open the `notebooks/` directory in Jupyter to follow the full ML curriculum:

```bash
jupyter notebook notebooks/
```

The 10 notebooks progress from beginner EDA to production deployment monitoring — each
building on the previous one.

---

## 🛠️ All Make Commands

```bash
make help        # Show all available commands
make install     # Install Python + Node dependencies
make train       # Train the ML model
make validate    # Validate dataset quality
make pipeline    # Run advanced multi-model pipeline
make api         # Start FastAPI backend (dev mode)
make frontend    # Start Next.js frontend (dev mode)
make docker-up   # Start everything with Docker
make docker-down # Stop Docker services
make lint        # Run Python linting
```

---

## 📜 License

MIT — see [LICENSE](LICENSE) for details.
