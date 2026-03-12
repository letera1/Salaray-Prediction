#!/usr/bin/env python3
"""
Ethiopian Salary Prediction - Machine Learning Project
=====================================================

A complete machine learning workflow for predicting salaries of Ethiopian tech professionals
using real-world data from universities, industry surveys, and government statistics.

Author: ML Engineering Team
Date: March 2026
Dataset: Ethiopian Tech Salary Data (200 records)
"""

# Core libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Scikit-learn modules
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

# Model persistence
import joblib

# Display settings
pd.set_option('display.max_columns', None)
sns.set_style('whitegrid')

def load_and_explore_data():
    """Load Ethiopian salary data and perform initial exploration."""
    print("=" * 80)
    print("ETHIOPIAN TECH SALARY PREDICTION PROJECT")
    print("=" * 80)
    
    # Load real Ethiopian salary data
    print("Loading Ethiopian salary dataset...")
    df = pd.read_csv('ethiopia_salary_data.csv')
    
    # Rename columns for consistency
    df = df.rename(columns={
        'experience_years': 'experience',
        'salary_etb': 'salary',
        'education_level': 'education_level',
        'department': 'department'
    })
    
    # Convert salary from ETB to USD for international comparison
    df['salary_usd'] = df['salary'] / 55  # 1 USD ≈ 55 ETB as of 2024
    
    # Introduce some missing values to simulate real-world challenges
    np.random.seed(42)
    missing_indices = np.random.choice(df.index, size=15, replace=False)
    df.loc[missing_indices, 'test_score'] = np.nan
    
    print(f"✓ Dataset loaded successfully with {len(df)} samples")
    print(f"Dataset shape: {df.shape}")
    print(f"Salary range: {df['salary'].min():,.0f} - {df['salary'].max():,.0f} ETB")
    print(f"Salary range (USD): ${df['salary_usd'].min():,.0f} - ${df['salary_usd'].max():,.0f}")
    
    return df

def perform_eda(df):
    """Perform exploratory data analysis."""
    print("\n" + "=" * 80)
    print("EXPLORATORY DATA ANALYSIS")
    print("=" * 80)
    
    # Dataset information
    print("\nDataset Info:")
    print(df.info())
    
    print(f"\nMissing values:")
    print(df.isnull().sum())
    
    print(f"\nStatistical summary:")
    print(df.describe())
    
    # Correlation analysis
    print("\n" + "=" * 60)
    print("CORRELATION ANALYSIS")
    print("=" * 60)
    correlation_data = df[['experience', 'test_score', 'salary']].corr()['salary'].sort_values(ascending=False)
    print("\nCorrelation with Salary (ETB):")
    for feature, corr in correlation_data.items():
        if feature != 'salary':
            print(f"  {feature}: {corr:.3f}")
    
    # Ethiopian context insights
    print("\n" + "=" * 60)
    print("ETHIOPIAN SALARY INSIGHTS")
    print("=" * 60)
    addis_avg = df[df['location']=='Addis Ababa']['salary'].mean()
    other_avg = df[df['location']!='Addis Ababa']['salary'].mean()
    print(f"Average salary in Addis Ababa: {addis_avg:,.0f} ETB")
    print(f"Average salary outside Addis Ababa: {other_avg:,.0f} ETB")
    print(f"Addis Ababa premium: {((addis_avg - other_avg) / other_avg * 100):.1f}%")
    
    dept_salaries = df.groupby('department')['salary'].mean().sort_values(ascending=False)
    print(f"\nDepartment salary ranking:")
    for dept, salary in dept_salaries.items():
        print(f"  {dept}: {salary:,.0f} ETB")

def preprocess_data(df):
    """Handle missing values and prepare data for modeling."""
    print("\n" + "=" * 80)
    print("DATA PREPROCESSING")
    print("=" * 80)
    
    # Handle missing values
    print("Handling missing values...")
    df['test_score'].fillna(df['test_score'].median(), inplace=True)
    print(f"✓ Missing values handled. Remaining: {df.isnull().sum().sum()}")
    
    # Separate features and target
    X_single = df[['experience']]  # Single feature model
    X_multi = df[['experience', 'test_score', 'department', 'education_level']]  # Multi-feature model
    y = df['salary']  # Target variable (Ethiopian Birr)
    
    print(f"\nFeature sets prepared:")
    print(f"  Single-feature dataset: {X_single.shape}")
    print(f"  Multi-feature dataset: {X_multi.shape}")
    print(f"  Target variable: {y.shape}")
    
    return X_single, X_multi, y

def split_data(X_single, X_multi, y):
    """Split data into training and testing sets."""
    print("\n" + "=" * 80)
    print("TRAIN-TEST SPLIT")
    print("=" * 80)
    
    # Split for single-feature model
    X_single_train, X_single_test, y_single_train, y_single_test = train_test_split(
        X_single, y, test_size=0.2, random_state=42
    )
    
    # Split for multi-feature model
    X_multi_train, X_multi_test, y_multi_train, y_multi_test = train_test_split(
        X_multi, y, test_size=0.2, random_state=42
    )
    
    print(f"Training samples: {X_single_train.shape[0]}")
    print(f"Testing samples: {X_single_test.shape[0]}")
    print(f"Split ratio: 80% train, 20% test")
    
    return (X_single_train, X_single_test, y_single_train, y_single_test,
            X_multi_train, X_multi_test, y_multi_train, y_multi_test)

def train_models(X_single_train, y_single_train, X_multi_train, y_multi_train):
    """Train both single-feature and multi-feature models."""
    print("\n" + "=" * 80)
    print("MODEL TRAINING")
    print("=" * 80)
    
    # Train simple linear regression (single feature)
    print("Training Simple Linear Regression (Experience only)...")
    model_single = LinearRegression()
    model_single.fit(X_single_train, y_single_train)
    
    print(f"✓ Simple model trained")
    print(f"  Intercept: {model_single.intercept_:,.0f} ETB")
    print(f"  Experience coefficient: {model_single.coef_[0]:,.0f} ETB per year")
    
    # Train multiple linear regression with preprocessing pipeline
    print("\nTraining Multiple Linear Regression (All features)...")
    
    # Define preprocessing
    numeric_features = ['experience', 'test_score']
    categorical_features = ['department', 'education_level']
    
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(drop='first', sparse_output=False)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    # Create pipeline
    model_multi = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    model_multi.fit(X_multi_train, y_multi_train)
    print(f"✓ Multi-feature model trained with preprocessing pipeline")
    
    return model_single, model_multi

def evaluate_models(model_single, model_multi, X_single_test, y_single_test, 
                   X_multi_test, y_multi_test):
    """Evaluate both models and compare performance."""
    print("\n" + "=" * 80)
    print("MODEL EVALUATION")
    print("=" * 80)
    
    # Make predictions
    y_single_pred = model_single.predict(X_single_test)
    y_multi_pred = model_multi.predict(X_multi_test)
    
    # Calculate metrics
    rmse_single = np.sqrt(mean_squared_error(y_single_test, y_single_pred))
    r2_single = r2_score(y_single_test, y_single_pred)
    
    rmse_multi = np.sqrt(mean_squared_error(y_multi_test, y_multi_pred))
    r2_multi = r2_score(y_multi_test, y_multi_pred)
    
    # Display results
    print("\n📊 Simple Linear Regression (Experience Only):")
    print(f"  RMSE: {rmse_single:,.0f} ETB")
    print(f"  R² Score: {r2_single:.4f} ({r2_single*100:.2f}% variance explained)")
    
    print("\n📊 Multiple Linear Regression (All Features):")
    print(f"  RMSE: {rmse_multi:,.0f} ETB")
    print(f"  R² Score: {r2_multi:.4f} ({r2_multi*100:.2f}% variance explained)")
    
    # Model comparison
    print("\n" + "=" * 80)
    print("MODEL COMPARISON")
    print("=" * 80)
    
    comparison_df = pd.DataFrame({
        'Model': ['Simple Linear Regression', 'Multiple Linear Regression'],
        'Features': ['Experience only', 'Experience + Test Score + Department + Education'],
        'RMSE (ETB)': [f"{rmse_single:,.0f}", f"{rmse_multi:,.0f}"],
        'R² Score': [f"{r2_single:.4f}", f"{r2_multi:.4f}"]
    })
    
    print(comparison_df.to_string(index=False))
    
    # Determine best model
    if r2_multi > r2_single:
        best_model = model_multi
        best_model_name = "Multiple Linear Regression"
        improvement = ((rmse_single - rmse_multi) / rmse_single) * 100
        print(f"\n🏆 WINNER: {best_model_name}")
        print(f"  RMSE improvement: {improvement:.1f}%")
        print(f"  Additional variance explained: {(r2_multi - r2_single)*100:.2f}%")
    else:
        best_model = model_single
        best_model_name = "Simple Linear Regression"
        print(f"\n🏆 WINNER: {best_model_name}")
    
    return best_model, best_model_name, (rmse_single, r2_single, rmse_multi, r2_multi)

def save_model(model, model_name):
    """Save the best performing model."""
    print("\n" + "=" * 80)
    print("MODEL PERSISTENCE")
    print("=" * 80)
    
    filename = 'best_ethiopian_salary_model.pkl'
    joblib.dump(model, filename)
    
    file_size = os.path.getsize(filename) / 1024
    print(f"✓ Model saved successfully")
    print(f"  Model: {model_name}")
    print(f"  Filename: {filename}")
    print(f"  File size: {file_size:.2f} KB")
    
    # Verify model loading
    loaded_model = joblib.load(filename)
    print(f"✓ Model verification: Successfully loaded from disk")
    
    return filename

def make_sample_predictions(model, model_name):
    """Demonstrate model usage with sample predictions."""
    print("\n" + "=" * 80)
    print("SAMPLE PREDICTIONS")
    print("=" * 80)
    
    if "Multiple" in model_name:
        # Multi-feature model predictions
        sample_data = pd.DataFrame({
            'experience': [2, 5, 8],
            'test_score': [75, 85, 95],
            'department': ['Engineering', 'Data Science', 'Software'],
            'education_level': ['Bachelor', 'Master', 'PhD']
        })
        
        predictions = model.predict(sample_data)
        sample_data['predicted_salary_etb'] = predictions.astype(int)
        sample_data['predicted_salary_usd'] = (predictions / 55).astype(int)
        
        print("Sample Ethiopian Tech Professional Salary Predictions:")
        print(sample_data.to_string(index=False))
        
    else:
        # Single-feature model predictions
        sample_data = pd.DataFrame({
            'experience': [2, 5, 8]
        })
        
        predictions = model.predict(sample_data)
        sample_data['predicted_salary_etb'] = predictions.astype(int)
        sample_data['predicted_salary_usd'] = (predictions / 55).astype(int)
        
        print("Sample Salary Predictions (Experience-based):")
        print(sample_data.to_string(index=False))

def main():
    """Main execution function."""
    try:
        # Load and explore data
        df = load_and_explore_data()
        
        # Perform EDA
        perform_eda(df)
        
        # Preprocess data
        X_single, X_multi, y = preprocess_data(df)
        
        # Split data
        (X_single_train, X_single_test, y_single_train, y_single_test,
         X_multi_train, X_multi_test, y_multi_train, y_multi_test) = split_data(X_single, X_multi, y)
        
        # Train models
        model_single, model_multi = train_models(X_single_train, y_single_train, 
                                                X_multi_train, y_multi_train)
        
        # Evaluate models
        best_model, best_model_name, metrics = evaluate_models(
            model_single, model_multi, X_single_test, y_single_test,
            X_multi_test, y_multi_test
        )
        
        # Save best model
        filename = save_model(best_model, best_model_name)
        
        # Make sample predictions
        make_sample_predictions(best_model, best_model_name)
        
        print("\n" + "=" * 80)
        print("PROJECT COMPLETED SUCCESSFULLY! 🎉")
        print("=" * 80)
        print(f"✓ Best model: {best_model_name}")
        print(f"✓ Model saved as: {filename}")
        print(f"✓ Ready for production deployment")
        
    except FileNotFoundError:
        print("❌ Error: ethiopia_salary_data.csv not found!")
        print("Please ensure the dataset file is in the same directory.")
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")

if __name__ == "__main__":
    main()