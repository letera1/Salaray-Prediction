#!/usr/bin/env python3
"""
Ethiopian Salary Prediction API
FastAPI backend for salary prediction service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Ethiopian Salary Prediction API",
    description="ML-powered salary prediction for Ethiopian tech professionals",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and data
MODEL_PATH = os.getenv("MODEL_PATH", "/app/models/best_ethiopian_salary_model.pkl")
DATA_PATH = os.getenv("DATA_PATH", "/app/data/raw/ethiopia_salary_data.csv")

try:
    model = joblib.load(MODEL_PATH)
    df = pd.read_csv(DATA_PATH)
    logger.info("Model and data loaded successfully")
except Exception as e:
    logger.error(f"Error loading model or data: {e}")
    model = None
    df = None

# Pydantic models for request/response
class SalaryPredictionRequest(BaseModel):
    experience: float = Field(..., ge=0, le=20, description="Years of experience")
    test_score: int = Field(..., ge=0, le=100, description="Technical test score")
    department: str = Field(..., description="Department")
    education_level: str = Field(..., description="Education level")
    location: Optional[str] = Field("Addis Ababa", description="City location")

class SalaryPredictionResponse(BaseModel):
    predicted_salary_etb: int
    predicted_salary_usd: int
    confidence_interval: dict
    model_info: dict
    timestamp: str

class DataStatsResponse(BaseModel):
    total_records: int
    salary_range_etb: dict
    salary_range_usd: dict
    departments: List[str]
    education_levels: List[str]
    locations: List[str]
    average_experience: float

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    data_loaded: bool
    timestamp: str

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Ethiopian Salary Prediction API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "predict": "/predict",
            "stats": "/stats",
            "departments": "/departments",
            "education-levels": "/education-levels",
            "locations": "/locations"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if model and df is not None else "unhealthy",
        model_loaded=model is not None,
        data_loaded=df is not None,
        timestamp=datetime.now().isoformat()
    )

@app.post("/predict", response_model=SalaryPredictionResponse)
async def predict_salary(request: SalaryPredictionRequest):
    """Predict salary based on input features"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare input data
        input_data = pd.DataFrame({
            'experience': [request.experience],
            'test_score': [request.test_score],
            'department': [request.department],
            'education_level': [request.education_level]
        })
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        # Calculate confidence interval (simple approximation)
        std_error = 50000  # Approximate standard error
        confidence_interval = {
            "lower": max(0, int(prediction - 1.96 * std_error)),
            "upper": int(prediction + 1.96 * std_error)
        }
        
        return SalaryPredictionResponse(
            predicted_salary_etb=int(prediction),
            predicted_salary_usd=int(prediction / 55),  # ETB to USD conversion
            confidence_interval=confidence_interval,
            model_info={
                "model_type": "Multiple Linear Regression",
                "features_used": ["experience", "test_score", "department", "education_level"],
                "accuracy": "R² = 0.86"
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/stats", response_model=DataStatsResponse)
async def get_data_stats():
    """Get dataset statistics"""
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    return DataStatsResponse(
        total_records=len(df),
        salary_range_etb={
            "min": int(df['salary_etb'].min()),
            "max": int(df['salary_etb'].max()),
            "mean": int(df['salary_etb'].mean()),
            "median": int(df['salary_etb'].median())
        },
        salary_range_usd={
            "min": int(df['salary_etb'].min() / 55),
            "max": int(df['salary_etb'].max() / 55),
            "mean": int(df['salary_etb'].mean() / 55),
            "median": int(df['salary_etb'].median() / 55)
        },
        departments=sorted(df['department'].unique().tolist()),
        education_levels=sorted(df['education_level'].unique().tolist()),
        locations=sorted(df['location'].unique().tolist()),
        average_experience=round(df['experience_years'].mean(), 1)
    )

@app.get("/departments", response_model=List[str])
async def get_departments():
    """Get available departments"""
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    return sorted(df['department'].unique().tolist())

@app.get("/education-levels", response_model=List[str])
async def get_education_levels():
    """Get available education levels"""
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    return sorted(df['education_level'].unique().tolist())

@app.get("/locations", response_model=List[str])
async def get_locations():
    """Get available locations"""
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    return sorted(df['location'].unique().tolist())

@app.get("/salary-insights")
async def get_salary_insights():
    """Get salary insights and analytics"""
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        insights = {
            "by_department": df.groupby('department')['salary_etb'].agg(['mean', 'count']).round(0).to_dict(),
            "by_education": df.groupby('education_level')['salary_etb'].agg(['mean', 'count']).round(0).to_dict(),
            "by_location": df.groupby('location')['salary_etb'].agg(['mean', 'count']).round(0).to_dict(),
            "experience_correlation": float(df[['experience_years', 'salary_etb']].corr().iloc[0, 1]),
            "top_paying_cities": df.groupby('location')['salary_etb'].mean().sort_values(ascending=False).head(5).round(0).to_dict(),
            "salary_distribution": {
                "percentiles": {
                    "25th": int(df['salary_etb'].quantile(0.25)),
                    "50th": int(df['salary_etb'].quantile(0.50)),
                    "75th": int(df['salary_etb'].quantile(0.75)),
                    "90th": int(df['salary_etb'].quantile(0.90))
                }
            }
        }
        return insights
    except Exception as e:
        logger.error(f"Insights error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)