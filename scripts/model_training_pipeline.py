#!/usr/bin/env python3
"""
Ethiopian Salary Model Training Pipeline
=======================================

Comprehensive model training pipeline with automated hyperparameter tuning,
cross-validation, and model evaluation for Ethiopian salary prediction.

Author: Ethiopian Salary ML Team
Date: March 2026
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Scikit-learn imports
from sklearn.model_selection import (
    train_test_split, cross_val_score, GridSearchCV, 
    RandomizedSearchCV, KFold
)
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, 
    r2_score, explained_variance_score
)

# Model imports
from sklearn.ensemble import (
    RandomForestRegressor, GradientBoostingRegressor,
    AdaBoostRegressor, ExtraTreesRegressor
)
from sklearn.linear_model import (
    LinearRegression, Ridge, Lasso, ElasticNet,
    BayesianRidge, HuberRegressor
)
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor

# Advanced libraries
try:
    import xgboost as xgb
    from xgboost import XGBRegressor
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

try:
    import lightgbm as lgb
    from lightgbm import LGBMRegressor
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False

# Utilities
import joblib
import json
import logging
import argparse
import sys
from datetime import datetime
from pathlib import Path
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('model_training.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class EthiopianSalaryModelTrainer:
    """
    Comprehensive model training pipeline for Ethiopian salary prediction
    """
    
    def __init__(self, config_path=None, output_dir='model_outputs'):
        """
        Initialize the model trainer
        
        Args:
            config_path (str): Path to configuration file
            output_dir (str): Directory to save model outputs
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        self.df = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.preprocessor = None
        
        self.results = {}
        self.best_model = None
        self.best_score = float('inf')
        
        # Load configuration
        self.config = self._load_config(config_path)
        
        logger.info(f"Initialized ModelTrainer with output directory: {output_dir}")
    
    def _load_config(self, config_path):
        """Load training configuration"""
        default_config = {
            'data_path': 'ethiopia_salary_data.csv',
            'target_column': 'salary_etb',
            'test_size': 0.2,
            'cv_folds': 5,
            'random_state': 42,
            'n_jobs': -1,
            'models_to_train': [
                'LinearRegression', 'Ridge', 'Lasso', 'RandomForest',
                'GradientBoosting', 'XGBoost', 'LightGBM'
            ],
            'hyperparameter_tuning': True,
            'tuning_method': 'grid_search',  # 'grid_search' or 'random_search'
            'tuning_iterations': 100
        }
        
        if config_path and Path(config_path).exists():
            with open(config_path, 'r') as f:
                user_config = json.load(f)
            default_config.update(user_config)
            logger.info(f"Loaded configuration from {config_path}")
        
        return default_config