#!/usr/bin/env python3
"""
Ethiopian Salary Data Validation Script
=======================================

Comprehensive data validation and quality assessment for Ethiopian salary dataset.
Performs schema checks, statistical validation, outlier detection, business logic
rules and generates a detailed JSON + text report.

Usage:
    python src/validate.py                          # uses default data path
    python src/validate.py --data-path data/raw/ethiopia_salary_data.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.stats import normaltest, jarque_bera, shapiro
import warnings
warnings.filterwarnings('ignore')

import logging
import json
from datetime import datetime
from pathlib import Path
import argparse
import sys

# Resolve project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "ethiopia_salary_data.csv"
DEFAULT_REPORT_DIR = PROJECT_ROOT / "reports" / "validation"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_validation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class EthiopianSalaryDataValidator:
    """
    Comprehensive data validation class for Ethiopian salary dataset
    """
    
    def __init__(self, data_path, output_dir='validation_reports'):
        """
        Initialize the data validator
        
        Args:
            data_path (str): Path to the dataset CSV file
            output_dir (str): Directory to save validation reports
        """
        self.data_path = data_path
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        self.df = None
        self.validation_results = {}
        self.issues_found = []
        
        logger.info(f"Initialized DataValidator for {data_path}")
    
    def load_data(self):
        """Load and perform initial data inspection"""
        try:
            self.df = pd.read_csv(self.data_path)
            logger.info(f"Successfully loaded dataset: {self.df.shape[0]} rows × {self.df.shape[1]} columns")
            
            # Basic info
            self.validation_results['basic_info'] = {
                'file_path': str(self.data_path),
                'load_timestamp': datetime.now().isoformat(),
                'shape': self.df.shape,
                'columns': list(self.df.columns),
                'dtypes': self.df.dtypes.to_dict(),
                'memory_usage_mb': self.df.memory_usage(deep=True).sum() / 1024**2
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to load data: {str(e)}")
            return False
    
    def validate_schema(self):
        """Validate dataset schema and structure"""
        logger.info("Validating dataset schema...")
        
        # Expected schema for Ethiopian salary dataset
        expected_columns = {
            'employee_id': 'int64',
            'experience_years': 'float64',
            'test_score': 'float64',
            'education_level': 'object',
            'department': 'object',
            'location': 'object',
            'salary_etb': 'int64'
        }
        
        schema_issues = []
        
        # Check for missing columns
        missing_columns = set(expected_columns.keys()) - set(self.df.columns)
        if missing_columns:
            issue = f"Missing required columns: {missing_columns}"
            schema_issues.append(issue)
            self.issues_found.append(issue)
        
        # Check for unexpected columns
        unexpected_columns = set(self.df.columns) - set(expected_columns.keys())
        if unexpected_columns:
            issue = f"Unexpected columns found: {unexpected_columns}"
            schema_issues.append(issue)
            logger.warning(issue)
        
        # Check data types
        for col, expected_dtype in expected_columns.items():
            if col in self.df.columns:
                actual_dtype = str(self.df[col].dtype)
                if actual_dtype != expected_dtype and not (
                    expected_dtype == 'float64' and actual_dtype in ['int64', 'float64']
                ):
                    issue = f"Column '{col}' has dtype '{actual_dtype}', expected '{expected_dtype}'"
                    schema_issues.append(issue)
                    logger.warning(issue)
        
        self.validation_results['schema_validation'] = {
            'expected_columns': expected_columns,
            'actual_columns': dict(zip(self.df.columns, self.df.dtypes.astype(str))),
            'issues': schema_issues,
            'is_valid': len(schema_issues) == 0
        }
        
        logger.info(f"Schema validation complete. Issues found: {len(schema_issues)}")
        return len(schema_issues) == 0
    
    def validate_data_quality(self):
        """Comprehensive data quality validation"""
        logger.info("Performing data quality validation...")
        
        quality_results = {}
        
        # 1. Missing values analysis
        missing_analysis = {}
        for col in self.df.columns:
            missing_count = self.df[col].isnull().sum()
            missing_pct = (missing_count / len(self.df)) * 100
            missing_analysis[col] = {
                'count': int(missing_count),
                'percentage': round(missing_pct, 2)
            }
            
            if missing_pct > 10:  # More than 10% missing
                issue = f"Column '{col}' has {missing_pct:.1f}% missing values"
                self.issues_found.append(issue)
                logger.warning(issue)
        
        quality_results['missing_values'] = missing_analysis
        
        # 2. Duplicate records
        duplicate_count = self.df.duplicated().sum()
        duplicate_pct = (duplicate_count / len(self.df)) * 100
        quality_results['duplicates'] = {
            'count': int(duplicate_count),
            'percentage': round(duplicate_pct, 2)
        }
        
        if duplicate_count > 0:
            issue = f"Found {duplicate_count} duplicate records ({duplicate_pct:.1f}%)"
            self.issues_found.append(issue)
            logger.warning(issue)
        
        # 3. Outlier detection for numerical columns
        outlier_analysis = {}
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numerical_cols:
            if col in self.df.columns:
                Q1 = self.df[col].quantile(0.25)
                Q3 = self.df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = self.df[(self.df[col] < lower_bound) | (self.df[col] > upper_bound)]
                outlier_count = len(outliers)
                outlier_pct = (outlier_count / len(self.df)) * 100
                
                outlier_analysis[col] = {
                    'count': int(outlier_count),
                    'percentage': round(outlier_pct, 2),
                    'lower_bound': float(lower_bound),
                    'upper_bound': float(upper_bound),
                    'Q1': float(Q1),
                    'Q3': float(Q3),
                    'IQR': float(IQR)
                }
                
                if outlier_pct > 5:  # More than 5% outliers
                    issue = f"Column '{col}' has {outlier_pct:.1f}% outliers"
                    logger.warning(issue)
        
        quality_results['outliers'] = outlier_analysis
        
        # 4. Value range validation
        range_validation = {}
        
        # Specific validations for Ethiopian salary data
        validations = {
            'experience_years': {'min': 0, 'max': 50},
            'test_score': {'min': 0, 'max': 100},
            'salary_etb': {'min': 100000, 'max': 5000000}  # Reasonable salary range in ETB
        }
        
        for col, bounds in validations.items():
            if col in self.df.columns:
                invalid_count = len(self.df[
                    (self.df[col] < bounds['min']) | (self.df[col] > bounds['max'])
                ])
                invalid_pct = (invalid_count / len(self.df)) * 100
                
                range_validation[col] = {
                    'expected_min': bounds['min'],
                    'expected_max': bounds['max'],
                    'actual_min': float(self.df[col].min()),
                    'actual_max': float(self.df[col].max()),
                    'invalid_count': int(invalid_count),
                    'invalid_percentage': round(invalid_pct, 2)
                }
                
                if invalid_count > 0:
                    issue = f"Column '{col}' has {invalid_count} values outside expected range [{bounds['min']}, {bounds['max']}]"
                    self.issues_found.append(issue)
                    logger.warning(issue)
        
        quality_results['range_validation'] = range_validation
        
        # 5. Categorical value validation
        categorical_validation = {}
        expected_categories = {
            'education_level': ['Bachelor', 'Master', 'PhD'],
            'department': ['Engineering', 'IT', 'Software', 'Data Science'],
            'location': ['Addis Ababa', 'Bahir Dar', 'Mekelle', 'Dire Dawa', 'Hawassa', 'Jimma', 'Gondar', 'Adama', 'Dessie']
        }
        
        for col, expected_vals in expected_categories.items():
            if col in self.df.columns:
                actual_vals = self.df[col].unique().tolist()
                unexpected_vals = set(actual_vals) - set(expected_vals)
                missing_vals = set(expected_vals) - set(actual_vals)
                
                categorical_validation[col] = {
                    'expected_values': expected_vals,
                    'actual_values': actual_vals,
                    'unexpected_values': list(unexpected_vals),
                    'missing_expected_values': list(missing_vals)
                }
                
                if unexpected_vals:
                    issue = f"Column '{col}' has unexpected values: {unexpected_vals}"
                    self.issues_found.append(issue)
                    logger.warning(issue)
        
        quality_results['categorical_validation'] = categorical_validation
        
        self.validation_results['data_quality'] = quality_results
        logger.info("Data quality validation complete")
        
        return quality_results
    
    def validate_statistical_properties(self):
        """Validate statistical properties of the dataset"""
        logger.info("Validating statistical properties...")
        
        stats_results = {}
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numerical_cols:
            if col in self.df.columns and not self.df[col].isnull().all():
                col_data = self.df[col].dropna()
                
                # Basic statistics
                basic_stats = {
                    'count': int(len(col_data)),
                    'mean': float(col_data.mean()),
                    'median': float(col_data.median()),
                    'std': float(col_data.std()),
                    'min': float(col_data.min()),
                    'max': float(col_data.max()),
                    'skewness': float(col_data.skew()),
                    'kurtosis': float(col_data.kurtosis())
                }
                
                # Normality tests
                normality_tests = {}
                
                if len(col_data) >= 8:  # Minimum sample size for Shapiro-Wilk
                    try:
                        # Shapiro-Wilk test (for smaller samples)
                        if len(col_data) <= 5000:
                            shapiro_stat, shapiro_p = shapiro(col_data)
                            normality_tests['shapiro_wilk'] = {
                                'statistic': float(shapiro_stat),
                                'p_value': float(shapiro_p),
                                'is_normal': shapiro_p > 0.05
                            }
                        
                        # Jarque-Bera test
                        jb_stat, jb_p = jarque_bera(col_data)
                        normality_tests['jarque_bera'] = {
                            'statistic': float(jb_stat),
                            'p_value': float(jb_p),
                            'is_normal': jb_p > 0.05
                        }
                        
                    except Exception as e:
                        logger.warning(f"Normality test failed for {col}: {str(e)}")
                
                stats_results[col] = {
                    'basic_statistics': basic_stats,
                    'normality_tests': normality_tests
                }
        
        self.validation_results['statistical_properties'] = stats_results
        logger.info("Statistical validation complete")
        
        return stats_results
    
    def validate_business_logic(self):
        """Validate business logic and domain-specific rules"""
        logger.info("Validating business logic...")
        
        business_issues = []
        
        # 1. Salary should generally increase with experience
        if 'experience_years' in self.df.columns and 'salary_etb' in self.df.columns:
            correlation = self.df['experience_years'].corr(self.df['salary_etb'])
            if correlation < 0.3:  # Weak positive correlation expected
                issue = f"Weak correlation between experience and salary: {correlation:.3f}"
                business_issues.append(issue)
                logger.warning(issue)
        
        # 2. Higher education should generally lead to higher salaries
        if 'education_level' in self.df.columns and 'salary_etb' in self.df.columns:
            edu_salary_means = self.df.groupby('education_level')['salary_etb'].mean()
            if 'Bachelor' in edu_salary_means and 'Master' in edu_salary_means:
                if edu_salary_means['Master'] <= edu_salary_means['Bachelor']:
                    issue = "Master's degree holders don't earn more than Bachelor's on average"
                    business_issues.append(issue)
                    logger.warning(issue)
        
        # 3. Test scores should have some correlation with salary
        if 'test_score' in self.df.columns and 'salary_etb' in self.df.columns:
            test_salary_corr = self.df['test_score'].corr(self.df['salary_etb'])
            if test_salary_corr < 0.1:  # Very weak correlation
                issue = f"Very weak correlation between test scores and salary: {test_salary_corr:.3f}"
                business_issues.append(issue)
                logger.warning(issue)
        
        # 4. Addis Ababa should generally have higher salaries
        if 'location' in self.df.columns and 'salary_etb' in self.df.columns:
            location_means = self.df.groupby('location')['salary_etb'].mean()
            if 'Addis Ababa' in location_means:
                addis_mean = location_means['Addis Ababa']
                other_locations_mean = location_means[location_means.index != 'Addis Ababa'].mean()
                if addis_mean <= other_locations_mean:
                    issue = "Addis Ababa doesn't have higher average salary than other locations"
                    business_issues.append(issue)
                    logger.warning(issue)
        
        self.validation_results['business_logic'] = {
            'issues': business_issues,
            'is_valid': len(business_issues) == 0
        }
        
        logger.info(f"Business logic validation complete. Issues found: {len(business_issues)}")
        return len(business_issues) == 0
    
    def generate_report(self):
        """Generate comprehensive validation report"""
        logger.info("Generating validation report...")
        
        # Summary
        total_issues = len(self.issues_found)
        validation_summary = {
            'validation_timestamp': datetime.now().isoformat(),
            'dataset_path': str(self.data_path),
            'total_issues_found': total_issues,
            'validation_passed': total_issues == 0,
            'issues_list': self.issues_found
        }
        
        self.validation_results['summary'] = validation_summary
        
        # Save detailed report
        report_path = self.output_dir / f'validation_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(report_path, 'w') as f:
            json.dump(self.validation_results, f, indent=2, default=str)
        
        logger.info(f"Detailed report saved to: {report_path}")
        
        # Generate summary report
        summary_path = self.output_dir / 'validation_summary.txt'
        with open(summary_path, 'w') as f:
            f.write("ETHIOPIAN SALARY DATASET VALIDATION REPORT\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Validation Date: {validation_summary['validation_timestamp']}\n")
            f.write(f"Dataset: {validation_summary['dataset_path']}\n")
            f.write(f"Total Issues Found: {total_issues}\n")
            f.write(f"Validation Status: {'PASSED' if total_issues == 0 else 'FAILED'}\n\n")
            
            if total_issues > 0:
                f.write("ISSUES FOUND:\n")
                f.write("-" * 20 + "\n")
                for i, issue in enumerate(self.issues_found, 1):
                    f.write(f"{i}. {issue}\n")
            else:
                f.write("✅ All validations passed successfully!\n")
        
        logger.info(f"Summary report saved to: {summary_path}")
        
        return self.validation_results
    
    def run_full_validation(self):
        """Run complete validation pipeline"""
        logger.info("Starting full validation pipeline...")
        
        # Load data
        if not self.load_data():
            return False
        
        # Run all validations
        self.validate_schema()
        self.validate_data_quality()
        self.validate_statistical_properties()
        self.validate_business_logic()
        
        # Generate report
        self.generate_report()
        
        total_issues = len(self.issues_found)
        if total_issues == 0:
            logger.info("✅ All validations passed successfully!")
            return True
        else:
            logger.error(f"❌ Validation failed with {total_issues} issues")
            return False

def main():
    """Main function for command-line usage"""
    parser = argparse.ArgumentParser(description='Validate Ethiopian Salary Dataset')
    parser.add_argument(
        '--data-path',
        default=str(DEFAULT_DATA_PATH),
        help='Path to the dataset CSV file'
    )
    parser.add_argument(
        '--output-dir',
        default=str(DEFAULT_REPORT_DIR),
        help='Directory to save validation reports'
    )

    args = parser.parse_args()
    
    # Run validation
    validator = EthiopianSalaryDataValidator(args.data_path, args.output_dir)
    success = validator.run_full_validation()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()