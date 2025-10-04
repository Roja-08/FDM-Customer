# E-Commerce Customer Behavior Analysis & Churn Prediction System

**Group-04 - Fundamentals of Data Mining - SLIIT**

## Team Members

- **IT23177314** - Viviyan.V.S.
- **IT23344938** - Kenushan.N
- **IT23345164** - Nirosha.P
- **IT23203044** - Gowtham.P

## Project Overview

This project implements a comprehensive customer churn prediction system using the Brazilian E-Commerce dataset from Olist. The system analyzes customer behavior patterns and predicts churn risk across 4 categories: **High Risk**, **Medium Risk**, **Low Risk**, and **Stable** customers.

## Dataset Information

- **Source**: Brazilian E-Commerce Public Dataset by Olist (Kaggle)
- **Period**: 2016-2018
- **Records**: 100,000+ orders
- **Files**: 9 interconnected CSV files

## Key Features

### 1. Data Processing & Integration

- Comprehensive data cleaning and preprocessing
- Integration of 9 CSV files into unified customer dataset
- Date conversions and data quality assurance
- Customer-level feature aggregation

### 2. RFM Analysis & Feature Engineering

- **Recency**: Days since last purchase
- **Frequency**: Total number of orders
- **Monetary**: Total customer value
- Additional behavioral features (product diversity, review patterns, etc.)

### 3. Customer Segmentation

- K-Means clustering for customer segmentation
- Behavioral pattern analysis
- Risk-based customer categorization

### 4. Churn Prediction Models

- **Random Forest Classifier**
- **Gradient Boosting Classifier**
- **Logistic Regression**
- Multi-class classification (4 risk levels)

### 5. Business Intelligence

- Revenue at risk analysis
- Customer lifetime value insights
- Actionable retention strategies
- Interactive visualizations

## Installation & Setup

### Prerequisites

```bash
Python 3.8+
pip (Python package manager)
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Dataset Setup

1. Place all 9 CSV files in the `fdm/` directory:
   - `olist_customers_dataset.csv`
   - `olist_orders_dataset.csv`
   - `olist_order_items_dataset.csv`
   - `olist_order_payments_dataset.csv`
   - `olist_order_reviews_dataset.csv`
   - `olist_products_dataset.csv`
   - `olist_sellers_dataset.csv`
   - `olist_geolocation_dataset.csv`
   - `product_category_name_translation.csv`

## Usage

### Option 1: Run Complete Analysis Script

```bash
python complete_churn_analysis.py
```

### Option 2: Use Jupyter Notebook

```bash
jupyter notebook ecommerce_churn_analysis.ipynb
```

## Project Structure

```
FDM/
├── fdm/                                    # Dataset directory
│   ├── olist_customers_dataset.csv
│   ├── olist_orders_dataset.csv
│   └── ... (other CSV files)
├── complete_churn_analysis.py              # Complete analysis script
├── ecommerce_churn_analysis.ipynb          # Jupyter notebook
├── requirements.txt                        # Python dependencies
├── README.md                              # This file
└── Output Files:
    ├── churn_prediction_model.pkl          # Trained ML model
    ├── customer_features_with_churn_labels.csv  # Processed dataset
    ├── analysis_results.pkl               # Analysis results
    └── churn_analysis_overview.png         # Visualizations
```

## Key Results

### Model Performance

- **Best Model**: Random Forest Classifier
- **Accuracy**: ~85-90%
- **Multi-class F1-Score**: ~0.85

### Customer Distribution

- **High Risk**: ~15-20% of customers
- **Medium Risk**: ~20-25% of customers
- **Low Risk**: ~25-30% of customers
- **Stable**: ~25-35% of customers

### Business Impact

- **Revenue at Risk**: Significant portion of total revenue
- **ROI Potential**: 20% churn reduction could save substantial revenue
- **Actionable Insights**: Targeted retention strategies for each risk segment

## Churn Risk Categories

### 🚨 High Risk Customers

- **Characteristics**: Long recency, low frequency/monetary value
- **Actions**: Immediate win-back campaigns, urgent re-engagement
- **Budget Allocation**: 60% of retention budget

### ⚠️ Medium Risk Customers

- **Characteristics**: Moderate recency with mixed engagement signals
- **Actions**: Proactive intervention, loyalty programs
- **Budget Allocation**: 25% of retention budget

### ✅ Low Risk Customers

- **Characteristics**: Recent activity but lower engagement OR older but higher engagement
- **Actions**: Maintain engagement, regular communication
- **Budget Allocation**: 10% of retention budget

### 🌟 Stable Customers

- **Characteristics**: Recent activity with high engagement
- **Actions**: Nurture and grow, upselling opportunities
- **Budget Allocation**: 5% of retention budget

## Technical Implementation

### Machine Learning Pipeline

1. **Data Preprocessing**: Cleaning, integration, feature engineering
2. **Exploratory Analysis**: Statistical analysis and visualizations
3. **Customer Segmentation**: K-Means clustering
4. **Feature Selection**: RFM + behavioral features
5. **Model Training**: Multiple algorithms with cross-validation
6. **Model Evaluation**: Comprehensive performance metrics
7. **Business Intelligence**: Revenue analysis and recommendations

### Key Technologies

- **Python**: Core programming language
- **Pandas/NumPy**: Data manipulation and analysis
- **Scikit-learn**: Machine learning models
- **Matplotlib/Seaborn/Plotly**: Data visualization
- **Jupyter**: Interactive development environment

## Deliverables

### 1. Technical Deliverables

- ✅ Complete source code (Python script + Jupyter notebook)
- ✅ Trained machine learning models
- ✅ Processed datasets with churn labels
- ✅ Comprehensive documentation

### 2. Business Deliverables

- ✅ Customer churn risk analysis
- ✅ Revenue at risk assessment
- ✅ Actionable retention strategies
- ✅ Interactive visualization dashboard

### 3. Academic Deliverables

- ✅ Statement of Work (SOW)
- ✅ Final project report
- ✅ Video presentation (10 minutes)
- ✅ Complete methodology documentation

## Model Deployment

The trained model can be deployed using the saved artifacts:

```python
import pickle

# Load model
with open('churn_prediction_model.pkl', 'rb') as f:
    model_artifacts = pickle.load(f)

# Make predictions for new customers
# (See complete_churn_analysis.py for prediction function)
```

## Future Enhancements

1. **Real-time Monitoring**: Implement live churn prediction dashboard
2. **A/B Testing**: Test retention campaigns by risk segment
3. **Seasonal Analysis**: Include seasonal and promotional effects
4. **Advanced Models**: Deep learning approaches for improved accuracy
5. **Integration**: Connect with CRM systems for automated interventions

## Academic Context

This project fulfills the requirements for:

- **Course**: Fundamentals of Data Mining (IT3051)
- **Institution**: Sri Lanka Institute of Information Technology (SLIIT)
- **Weight**: 25% of final grade
- **Evaluation**: Based on demonstration, viva, and reports

## Contact Information

For questions or clarifications, please contact any team member:

- Viviyan.V.S. - it23177314@my.sliit.lk
- Kenushan.N - it23344938@my.sliit.lk
- Nirosha.P - it23345164@my.sliit.lk
- Gowtham.P - it23203044@my.sliit.lk

---

**© 2025 Group-04, Fundamentals of Data Mining, SLIIT**
