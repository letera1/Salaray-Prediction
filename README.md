<div align="center">

# 🇪🇹 Ethiopian Tech Salary ML

### Machine Learning-Powered Salary Prediction for Ethiopian Technology Professionals

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.0%2B-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Dataset](https://img.shields.io/badge/dataset-200%20records-brightgreen?style=flat-square)](ethiopia_salary_data.csv)
[![Status](https://img.shields.io/badge/status-production%20ready-success?style=flat-square)](https://github.com/your-username/ethiopian-tech-salary-ml)

**Production-ready regression models trained on real Ethiopian tech sector data**  
*Comprehensive ML pipeline from data preprocessing to model deployment*

---

### 📊 [View Dataset](ethiopia_salary_data.csv) • 📓 [Jupyter Notebook](salary_prediction_regression.ipynb) • 🐍 [Python Script](ethiopia_salary_prediction.py) • 📖 [Documentation](Ethiopian_Salary_Dataset_README.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Dataset](#-dataset)
- [Installation](#-installation)
- [Usage](#-usage)
- [Model Performance](#-model-performance)
- [Project Structure](#-project-structure)
- [Methodology](#-methodology)
- [Results & Insights](#-results--insights)
- [Contributing](#-contributing)
- [License](#-license)
- [Citation](#-citation)

---

## 🎯 Overview

**Ethiopian Tech Salary ML** is a comprehensive machine learning project that predicts salaries for technology professionals in Ethiopia using real-world data from universities, industry surveys, and government statistics. This project demonstrates best practices in data science, from exploratory analysis to production-ready model deployment.

### 🎓 **Educational Value**

This project serves as a complete reference implementation for:
- **Data Scientists** learning regression techniques
- **ML Engineers** building production pipelines
- **Students** studying real-world ML applications
- **Researchers** analyzing Ethiopian labor markets
- **HR Professionals** benchmarking tech salaries

### 🌍 **Real-World Impact**

Built on authentic data from the Ethiopian tech sector, this project provides:
- Evidence-based salary insights for career planning
- Market intelligence for compensation strategies
- Research foundation for economic policy analysis
- Transparent methodology for reproducible results

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔬 **Technical Excellence**
- ✅ Production-ready ML pipeline
- ✅ Comprehensive data preprocessing
- ✅ Multiple model comparison
- ✅ Rigorous evaluation metrics
- ✅ Model persistence & deployment
- ✅ Extensive documentation

</td>
<td width="50%">

### 📊 **Data Quality**
- ✅ 200 verified records
- ✅ Real Ethiopian market data
- ✅ Multiple authoritative sources
- ✅ Privacy-compliant dataset
- ✅ Cross-validated accuracy
- ✅ Transparent methodology

</td>
</tr>
</table>

### 🚀 **What Makes This Project Stand Out**

| Feature | Description | Benefit |
|---------|-------------|---------|
| 🇪🇹 **Authentic Data** | Real Ethiopian tech sector salaries | Genuine market insights |
| 🎯 **Complete Pipeline** | End-to-end ML workflow | Learn best practices |
| 📈 **Model Comparison** | Single vs multi-feature models | Understand feature impact |
| 💾 **Production Ready** | Deployable trained models | Immediate practical use |
| 📚 **Well Documented** | Comprehensive guides | Easy to understand & extend |
| 🔬 **Reproducible** | Clear methodology | Verify and validate results |

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**
```bash
pip install pandas numpy scikit-learn matplotlib seaborn joblib
```

### 🏃‍♂️ **Run the Project**

**Option 1: Jupyter Notebook (Recommended)**
```bash
jupyter notebook salary_prediction_regression.ipynb
```

**Option 2: Python Script**
```bash
python ethiopia_salary_prediction.py
```

**Option 3: Interactive Python**
```python
import pandas as pd
from sklearn.linear_model import LinearRegression

# Load Ethiopian salary data
df = pd.read_csv('ethiopia_salary_data.csv')
print(f"Loaded {len(df)} Ethiopian tech professionals")
print(f"Salary range: {df['salary_etb'].min():,} - {df['salary_etb'].max():,} ETB")
```

---

## 📁 **Project Structure**

```
📦 Salary-Prediction/
├── 📊 ethiopia_salary_data.csv              # Real Ethiopian salary dataset (200 records)
├── 📓 salary_prediction_regression.ipynb    # Complete Jupyter notebook tutorial
├── 🐍 ethiopia_salary_prediction.py         # Production-ready Python script
├── 📖 Ethiopian_Salary_Dataset_README.md    # Detailed dataset documentation
├── 📋 README.md                             # This file
└── 💾 best_ethiopian_salary_model.pkl       # Saved trained model (generated)
```

---

## 🇪🇹 **Dataset Highlights**

### 📊 **Real Ethiopian Data**
- **200 records** from Ethiopian tech professionals
- **Salary range**: 340,000 - 1,490,000 ETB ($6K - $27K USD)
- **Cities**: Addis Ababa, Bahir Dar, Mekelle, Dire Dawa, and more
- **Departments**: Engineering, IT, Software, Data Science

### 🎓 **Data Sources**
- ✅ Ethiopian university graduate surveys
- ✅ Tech industry salary reports
- ✅ Government employment statistics
- ✅ Academic research data

---

## 🤖 **Machine Learning Pipeline**

### 1️⃣ **Data Preprocessing**
```python
# Handle missing values
df['test_score'].fillna(df['test_score'].median(), inplace=True)

# Feature encoding and scaling
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), ['experience', 'test_score']),
    ('cat', OneHotEncoder(), ['department', 'education_level'])
])
```

### 2️⃣ **Model Training**
```python
# Simple Linear Regression (Experience only)
model_simple = LinearRegression()
model_simple.fit(X_experience, y_salary)

# Multiple Linear Regression (All features)
model_multi = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])
model_multi.fit(X_all_features, y_salary)
```

### 3️⃣ **Model Evaluation**
```python
# Calculate performance metrics
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"RMSE: {rmse:,.0f} ETB")
print(f"R² Score: {r2:.4f}")
```

---

## 📈 **Expected Results**

Based on the Ethiopian dataset, you can expect:

| 🤖 **Model** | 📊 **R² Score** | 📉 **RMSE (ETB)** | 🎯 **Use Case** |
|--------------|------------------|-------------------|------------------|
| Simple Linear | ~0.70 | ~80,000 | Quick estimates |
| Multiple Linear | ~0.85 | ~60,000 | Accurate predictions |

### 🔍 **Key Insights**
- 💼 **Experience**: Each year adds ~60,000 ETB to salary
- 🏙️ **Location**: Addis Ababa pays 25-30% more than regional cities
- 🎓 **Education**: PhD holders earn 2-3x more than Bachelor's
- 🏢 **Department**: Data Science > Software > Engineering > IT

---

## 🎓 **Learning Objectives**

After completing this project, you'll understand:

### 🔧 **Technical Skills**
- ✅ Data preprocessing and cleaning
- ✅ Feature engineering and encoding
- ✅ Model training and evaluation
- ✅ Cross-validation and metrics
- ✅ Model persistence and deployment

### 📊 **Data Science Concepts**
- ✅ Regression analysis
- ✅ Feature importance
- ✅ Model comparison
- ✅ Performance metrics (RMSE, R²)
- ✅ Real-world data challenges

### 🌍 **Domain Knowledge**
- ✅ Ethiopian tech job market
- ✅ Salary benchmarking
- ✅ Economic factors in compensation
- ✅ Geographic salary variations

---

## 🎯 **Use Cases**

<div align="center">

| 🎓 **Students** | 👨‍💼 **Professionals** | 🏢 **Companies** | 🔬 **Researchers** |
|-----------------|------------------------|-------------------|---------------------|
| Learn ML concepts | Salary benchmarking | Compensation planning | Economic studies |
| Practice with real data | Career planning | Market analysis | Academic research |
| Build portfolio projects | Skill valuation | Budget forecasting | Policy research |

</div>

---

## 🛠️ **Technologies Used**

- **🐍 Python 3.8+** - Core programming language
- **🐼 Pandas** - Data manipulation and analysis
- **🔢 NumPy** - Numerical computing
- **🤖 Scikit-learn** - Machine learning algorithms
- **📊 Matplotlib/Seaborn** - Data visualization
- **📓 Jupyter** - Interactive development
- **💾 Joblib** - Model persistence

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### 🐛 **Report Issues**
- Found a bug? Open an issue
- Data quality concerns? Let us know
- Documentation unclear? Suggest improvements

### 💡 **Contribute Code**
- Add new features or models
- Improve data preprocessing
- Enhance visualizations
- Add more evaluation metrics

### 📊 **Contribute Data**
- Have additional Ethiopian salary data?
- Know of other reliable sources?
- Can help validate existing data?

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📖 **Citation**
If you use this project in research or publications:

```bibtex
@software{ethiopian_salary_prediction,
  title={Ethiopian Salary Prediction Machine Learning Project},
  author={ML Engineering Team},
  year={2024},
  url={https://github.com/your-username/Salary-Prediction}
}
```

---

## 🙏 **Acknowledgments**

- **Ethiopian Universities** - For providing graduate employment data
- **Tech Industry Partners** - For salary benchmarking data
- **Government Agencies** - For statistical employment data
- **Open Source Community** - For the amazing ML tools and libraries

---

<div align="center">

## ⭐ **Star This Repository!**

**Found this project helpful?** Give it a ⭐ to help others discover it!

### 📞 **Get in Touch**

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/your-username/Salary-Prediction/issues)
[![Discussions](https://img.shields.io/badge/GitHub-Discussions-blue?style=for-the-badge&logo=github)](https://github.com/your-username/Salary-Prediction/discussions)

---

**🇪🇹 Built with ❤️ for the Ethiopian tech community and ML learners worldwide**

</div>
