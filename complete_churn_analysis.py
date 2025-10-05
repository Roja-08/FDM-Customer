# E-Commerce Customer Behavior Analysis & Churn Prediction System
# Group-04 - Fundamentals of Data Mining - SLIIT

# Import all necessary libraries
import pandas as pd  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
import numpy as np  # pyright: ignore[reportMissingImports]
import matplotlib.pyplot as plt  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
import seaborn as sns  # pyright: ignore[reportMissingModuleSource]
import plotly.express as px  # pyright: ignore[reportMissingImports]
import plotly.graph_objects as go  # pyright: ignore[reportMissingImports]
from plotly.subplots import make_subplots  # pyright: ignore[reportMissingImports]
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Machine Learning libraries
from sklearn.model_selection import train_test_split, cross_val_score  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.preprocessing import StandardScaler, LabelEncoder  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.cluster import KMeans  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.linear_model import LogisticRegression  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
from sklearn.metrics import precision_score, recall_score, f1_score  # pyright: ignore[reportMissingModuleSource, reportMissingImports]
import pickle

print("🚀 Starting E-Commerce Churn Analysis System")
print("=" * 60)

# 1. DATA LOADING
print("\n📊 STEP 1: Loading all datasets...")

# Define file paths
data_path = 'fdm/'

try:
    # Load all datasets
    customers_df = pd.read_csv(f'{data_path}olist_customers_dataset.csv')
    orders_df = pd.read_csv(f'{data_path}olist_orders_dataset.csv')
    order_items_df = pd.read_csv(f'{data_path}olist_order_items_dataset.csv')
    order_payments_df = pd.read_csv(f'{data_path}olist_order_payments_dataset.csv')
    order_reviews_df = pd.read_csv(f'{data_path}olist_order_reviews_dataset.csv')
    products_df = pd.read_csv(f'{data_path}olist_products_dataset.csv')
    sellers_df = pd.read_csv(f'{data_path}olist_sellers_dataset.csv')
    geolocation_df = pd.read_csv(f'{data_path}olist_geolocation_dataset.csv')
    product_translation_df = pd.read_csv(f'{data_path}product_category_name_translation.csv')
    
    print("✅ All datasets loaded successfully!")
    
    # Display dataset information
    datasets = {
        'Customers': customers_df.shape,
        'Orders': orders_df.shape,
        'Order Items': order_items_df.shape,
        'Order Payments': order_payments_df.shape,
        'Order Reviews': order_reviews_df.shape,
        'Products': products_df.shape,
        'Sellers': sellers_df.shape,
        'Geolocation': geolocation_df.shape,
        'Product Translation': product_translation_df.shape
    }
    
    print("\n📈 Dataset Overview:")
    for name, shape in datasets.items():
        print(f"{name:20}: {shape[0]:>8,} rows × {shape[1]:>2} columns")
        
except Exception as e:
    print(f"❌ Error loading datasets: {e}")
    print("Please ensure all CSV files are in the 'fdm/' directory")
    exit()

# 2. DATA PREPROCESSING
print("\n🔧 STEP 2: Data preprocessing and cleaning...")

# Convert date columns
date_columns = [
    'order_purchase_timestamp', 'order_approved_at', 
    'order_delivered_carrier_date', 'order_delivered_customer_date', 
    'order_estimated_delivery_date'
]

for col in date_columns:
    if col in orders_df.columns:
        orders_df[col] = pd.to_datetime(orders_df[col], errors='coerce')

# Convert review dates
order_reviews_df['review_creation_date'] = pd.to_datetime(order_reviews_df['review_creation_date'], errors='coerce')
order_reviews_df['review_answer_timestamp'] = pd.to_datetime(order_reviews_df['review_answer_timestamp'], errors='coerce')

# Convert order items date
order_items_df['shipping_limit_date'] = pd.to_datetime(order_items_df['shipping_limit_date'], errors='coerce')

print("✅ Date conversions completed")

# Display date range
print(f"\n📅 Data Period:")
print(f"First order: {orders_df['order_purchase_timestamp'].min()}")
print(f"Last order: {orders_df['order_purchase_timestamp'].max()}")
total_days = (orders_df['order_purchase_timestamp'].max() - orders_df['order_purchase_timestamp'].min()).days
print(f"Analysis period: {total_days} days")

# 3. DATA INTEGRATION
print("\n🔗 STEP 3: Integrating datasets...")

# Merge datasets to create comprehensive customer view
customer_orders = orders_df.merge(customers_df, on='customer_id', how='left')
customer_orders = customer_orders.merge(order_items_df, on='order_id', how='left')

# Aggregate payment information per order
order_payments_agg = order_payments_df.groupby('order_id').agg({
    'payment_sequential': 'count',
    'payment_installments': 'max',
    'payment_value': 'sum'
}).reset_index()
order_payments_agg.columns = ['order_id', 'payment_methods_count', 'max_installments', 'total_payment_value']

customer_orders = customer_orders.merge(order_payments_agg, on='order_id', how='left')

# Aggregate review information per order
reviews_agg = order_reviews_df.groupby('order_id').agg({
    'review_score': 'mean',
    'review_comment_message': lambda x: x.notna().sum()
}).reset_index()
reviews_agg.columns = ['order_id', 'avg_review_score', 'review_comments_count']

customer_orders = customer_orders.merge(reviews_agg, on='order_id', how='left')

# Add product information
customer_orders = customer_orders.merge(products_df, on='product_id', how='left')

print(f"✅ Integrated dataset created: {customer_orders.shape}")

# 4. CUSTOMER-LEVEL FEATURE ENGINEERING
print("\n👥 STEP 4: Creating customer-level features...")

# Define analysis cutoff date
analysis_date = orders_df['order_purchase_timestamp'].max()
print(f"Analysis cutoff date: {analysis_date}")

# Create customer-level aggregations
customer_features = customer_orders.groupby('customer_unique_id').agg({
    'order_id': 'count',
    'order_purchase_timestamp': ['min', 'max'],
    'price': ['sum', 'mean', 'std'],
    'freight_value': ['sum', 'mean'],
    'total_payment_value': ['sum', 'mean', 'std'],
    'product_id': 'nunique',
    'product_category_name': 'nunique',
    'avg_review_score': 'mean',
    'review_comments_count': 'sum',
    'payment_methods_count': 'mean',
    'max_installments': 'max',
    'customer_city': 'first',
    'customer_state': 'first',
    'customer_zip_code_prefix': 'first'
}).reset_index()

# Flatten column names
customer_features.columns = [
    'customer_unique_id', 'total_orders', 'first_order_date', 'last_order_date',
    'total_price', 'avg_price', 'std_price', 'total_freight', 'avg_freight',
    'total_payment', 'avg_payment', 'std_payment', 'unique_products', 'unique_categories',
    'avg_review_score', 'total_review_comments', 'avg_payment_methods', 'max_installments',
    'customer_city', 'customer_state', 'customer_zip_code_prefix'
]

print(f"✅ Customer features created: {customer_features.shape}")

# 5. RFM ANALYSIS
print("\n💰 STEP 5: Calculating RFM features...")

# Calculate RFM metrics
customer_features['recency_days'] = (analysis_date - customer_features['last_order_date']).dt.days
customer_features['frequency'] = customer_features['total_orders']
customer_features['monetary'] = customer_features['total_payment']

# Additional behavioral features
customer_features['customer_lifetime_days'] = (
    customer_features['last_order_date'] - customer_features['first_order_date']
).dt.days
customer_features['customer_lifetime_days'] = customer_features['customer_lifetime_days'].fillna(0)

customer_features['avg_days_between_orders'] = np.where(
    customer_features['frequency'] > 1,
    customer_features['customer_lifetime_days'] / (customer_features['frequency'] - 1),
    0
)

customer_features['avg_order_value'] = customer_features['monetary'] / customer_features['frequency']
customer_features['product_diversity_ratio'] = customer_features['unique_products'] / customer_features['frequency']
customer_features['category_diversity_ratio'] = customer_features['unique_categories'] / customer_features['frequency']

# Handle missing values
customer_features['avg_review_score'] = customer_features['avg_review_score'].fillna(customer_features['avg_review_score'].mean())
customer_features['std_price'] = customer_features['std_price'].fillna(0)
customer_features['std_payment'] = customer_features['std_payment'].fillna(0)

print("✅ RFM features calculated")

# Display RFM statistics
rfm_stats = customer_features[['recency_days', 'frequency', 'monetary']].describe()
print("\n📊 RFM Statistics:")
print(rfm_stats)

# 6. CHURN LABEL CREATION
print("\n🏷️ STEP 6: Creating 4-class churn labels...")

def create_churn_labels(df):
    """Create 4-class churn labels based on RFM analysis"""
    
    # Calculate percentiles for thresholds
    recency_75 = df['recency_days'].quantile(0.75)
    recency_50 = df['recency_days'].quantile(0.50)
    recency_25 = df['recency_days'].quantile(0.25)
    
    frequency_25 = df['frequency'].quantile(0.25)
    frequency_50 = df['frequency'].quantile(0.50)
    
    monetary_25 = df['monetary'].quantile(0.25)
    monetary_50 = df['monetary'].quantile(0.50)
    
    print(f"Recency thresholds: 25th={recency_25:.0f}, 50th={recency_50:.0f}, 75th={recency_75:.0f} days")
    print(f"Frequency thresholds: 25th={frequency_25:.0f}, 50th={frequency_50:.0f} orders")
    print(f"Monetary thresholds: 25th=${monetary_25:.2f}, 50th=${monetary_50:.2f}")
    
    churn_labels = []
    
    for _, row in df.iterrows():
        recency = row['recency_days']
        frequency = row['frequency']
        monetary = row['monetary']
        
        # High Risk: Long recency + low engagement
        if (recency > recency_75 and 
            (frequency <= frequency_25 or monetary <= monetary_25)):
            churn_labels.append('High Risk')
            
        # Stable: Recent activity + high engagement
        elif (recency <= recency_25 and 
              frequency >= frequency_50 and 
              monetary >= monetary_50):
            churn_labels.append('Stable')
            
        # Medium Risk: Moderate recency with mixed signals
        elif (recency > recency_50 and recency <= recency_75):
            if frequency <= frequency_25 or monetary <= monetary_25:
                churn_labels.append('Medium Risk')
            else:
                churn_labels.append('Low Risk')
                
        # Low Risk: Recent but lower engagement OR older but higher engagement
        elif ((recency <= recency_50 and (frequency < frequency_50 or monetary < monetary_50)) or
              (recency > recency_50 and frequency >= frequency_50 and monetary >= monetary_50)):
            churn_labels.append('Low Risk')
            
        else:
            churn_labels.append('Low Risk')
    
    return churn_labels

# Create churn labels
customer_features['churn_risk'] = create_churn_labels(customer_features)

# Display churn distribution
churn_distribution = customer_features['churn_risk'].value_counts()
churn_percentage = customer_features['churn_risk'].value_counts(normalize=True) * 100

print("\n📈 Churn Risk Distribution:")
for risk_level in ['High Risk', 'Medium Risk', 'Low Risk', 'Stable']:
    count = churn_distribution.get(risk_level, 0)
    percentage = churn_percentage.get(risk_level, 0)
    print(f"{risk_level:12}: {count:>6,} customers ({percentage:5.1f}%)")

print("✅ Churn labels created successfully!")

# 7. EXPLORATORY DATA ANALYSIS
#print("\n📊 STEP 7: Creating visualizations...")

# Set up plotting style
#plt.style.use('default')
#sns.set_palette("Set2")

# Create comprehensive visualizations
#fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
#fig.suptitle('E-Commerce Customer Churn Analysis - Overview', fontsize=16, fontweight='bold')

# 1. Churn distribution pie chart
#churn_counts = customer_features['churn_risk'].value_counts()
#colors = ['#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5']
#ax1.pie(churn_counts.values, labels=churn_counts.index, autopct='%1.1f%%', 
 #       colors=colors, startangle=90)
#ax1.set_title('Customer Churn Risk Distribution', fontweight='bold')

# 2. RFM distribution by churn risk
#sns.boxplot(data=customer_features, x='churn_risk', y='recency_days', ax=ax2)
#ax2.set_title('Recency Distribution by Churn Risk', fontweight='bold')
#ax2.tick_params(axis='x', rotation=45)

#sns.boxplot(data=customer_features, x='churn_risk', y='frequency', ax=ax3)
#ax3.set_title('Frequency Distribution by Churn Risk', fontweight='bold')
#ax3.tick_params(axis='x', rotation=45)

#sns.boxplot(data=customer_features, x='churn_risk', y='monetary', ax=ax4)
#ax4.set_title('Monetary Value Distribution by Churn Risk', fontweight='bold')
#ax4.tick_params(axis='x', rotation=45)

#plt.tight_layout()
#plt.savefig('churn_analysis_overview.png', dpi=300, bbox_inches='tight')
#plt.show()

#print("✅ Overview visualizations created!")

# 8. CUSTOMER SEGMENTATION
print("\n🎯 STEP 8: Performing customer segmentation...")

# Prepare data for clustering
clustering_features = [
    'recency_days', 'frequency', 'monetary', 'avg_order_value',
    'unique_products', 'unique_categories', 'avg_review_score',
    'customer_lifetime_days', 'product_diversity_ratio'
]

clustering_data = customer_features[clustering_features].copy()
clustering_data = clustering_data.fillna(clustering_data.mean())

# Standardize features
scaler = StandardScaler()
clustering_data_scaled = scaler.fit_transform(clustering_data)

# Perform K-means clustering
optimal_k = 5
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
customer_features['cluster'] = kmeans.fit_predict(clustering_data_scaled)

print(f"✅ K-Means clustering completed with k={optimal_k}")

# Analyze cluster characteristics
cluster_summary = customer_features.groupby('cluster')[clustering_features].mean()
print("\n📊 Cluster Characteristics:")
print(cluster_summary.round(2))

# 9. MACHINE LEARNING MODEL PREPARATION
print("\n🔧 STEP 9: Preparing features for machine learning...")

# Select features for modeling (exclude 'cluster' to avoid leakage)
feature_columns = [
    'recency_days', 'frequency', 'monetary',
    'avg_order_value', 'unique_products', 'unique_categories',
    'product_diversity_ratio', 'category_diversity_ratio',
    'customer_lifetime_days', 'avg_days_between_orders',
    'avg_review_score', 'total_review_comments',
    'avg_payment_methods', 'max_installments',
    'total_freight', 'avg_freight', 'std_payment'
]

# Create feature matrix
X = customer_features[feature_columns].copy()
X = X.fillna(X.mean())

# Create target variable
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(customer_features['churn_risk'])

# Get label mapping
label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
print("\n🏷️ Label Mapping:")
for label, code in label_mapping.items():
    print(f"{label}: {code}")

# Split data BEFORE scaling to prevent test leakage
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Fit scaler on training set only, then transform both sets
scaler_ml = StandardScaler()
X_train = scaler_ml.fit_transform(X_train)
X_test = scaler_ml.transform(X_test)

print(f"\n📊 Dataset Split:")
print(f"Training set: {X_train.shape[0]:,} samples")
print(f"Testing set: {X_test.shape[0]:,} samples")
print(f"Number of features: {X_train.shape[1]}")

# 10. MODEL TRAINING AND EVALUATION
print("\n🤖 STEP 10: Training churn prediction models...")

# Initialize models
models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000, multi_class='ovr')
}

# Train and evaluate models
model_results = {}

for name, model in models.items():
    print(f"\n🔄 Training {name}...")
    
    # Train model
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    # Store results
    model_results[name] = {
        'model': model,
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'predictions': y_pred
    }
    
    print(f"✅ {name} - Accuracy: {accuracy:.4f}, F1-Score: {f1:.4f}")

# Find best model
performance_df = pd.DataFrame({
    'Model': list(model_results.keys()),
    'Accuracy': [results['accuracy'] for results in model_results.values()],
    'Precision': [results['precision'] for results in model_results.values()],
    'Recall': [results['recall'] for results in model_results.values()],
    'F1-Score': [results['f1_score'] for results in model_results.values()]
})

print("\n🏆 Model Performance Summary:")
print(performance_df.round(4))

# Best model analysis
best_model_name = performance_df.loc[performance_df['F1-Score'].idxmax(), 'Model']
best_model = model_results[best_model_name]['model']
best_predictions = model_results[best_model_name]['predictions']

print(f"\n🥇 Best performing model: {best_model_name}")

# Classification report
class_names = label_encoder.classes_
print("\n📋 Detailed Classification Report:")
print(classification_report(y_test, best_predictions, target_names=class_names))

# 11. BUSINESS INTELLIGENCE ANALYSIS
print("\n💡 STEP 11: Generating business insights...")

# Customer value analysis by churn risk
churn_business_impact = customer_features.groupby('churn_risk').agg({
    'customer_unique_id': 'count',
    'monetary': ['sum', 'mean'],
    'frequency': 'mean',
    'recency_days': 'mean',
    'avg_review_score': 'mean'
}).round(2)

churn_business_impact.columns = [
    'Customer_Count', 'Total_Revenue', 'Avg_Revenue_Per_Customer',
    'Avg_Order_Frequency', 'Avg_Recency_Days', 'Avg_Review_Score'
]

print("\n💰 Business Impact Analysis by Churn Risk:")
print(churn_business_impact)

# Calculate revenue at risk
high_risk_revenue = churn_business_impact.loc['High Risk', 'Total_Revenue']
medium_risk_revenue = churn_business_impact.loc['Medium Risk', 'Total_Revenue']
total_revenue = churn_business_impact['Total_Revenue'].sum()

revenue_at_risk = high_risk_revenue + (medium_risk_revenue * 0.5)
revenue_at_risk_percentage = (revenue_at_risk / total_revenue) * 100

print(f"\n⚠️ Revenue at Risk Analysis:")
print(f"High Risk Revenue: ${high_risk_revenue:,.2f}")
print(f"Medium Risk Revenue (50%): ${medium_risk_revenue * 0.5:,.2f}")
print(f"Total Revenue at Risk: ${revenue_at_risk:,.2f} ({revenue_at_risk_percentage:.1f}% of total revenue)")

# 12. SAVE MODEL AND RESULTS
print("\n🚀 STEP 12: Saving model and results...")

# Save model artifacts
model_artifacts = {
    'model': best_model,
    'scaler': scaler_ml,
    'label_encoder': label_encoder,
    'feature_columns': feature_columns,
    'class_names': class_names,
    'model_name': best_model_name
}

with open('churn_prediction_model.pkl', 'wb') as f:
    pickle.dump(model_artifacts, f)

# Save customer features dataset
customer_features.to_csv('customer_features_with_churn_labels.csv', index=False)

# Save analysis results
analysis_results = {
    'total_customers': len(customer_features),
    'analysis_period_days': total_days,
    'best_model': best_model_name,
    'model_accuracy': model_results[best_model_name]['accuracy'],
    'revenue_at_risk': revenue_at_risk,
    'revenue_at_risk_percentage': revenue_at_risk_percentage,
    'churn_distribution': churn_distribution.to_dict(),
    'business_impact': churn_business_impact.to_dict()
}

with open('analysis_results.pkl', 'wb') as f:
    pickle.dump(analysis_results, f)

print("✅ Model and results saved successfully!")

# 13. ACTIONABLE RECOMMENDATIONS
print("\n🎯 STEP 13: Generating actionable recommendations...")

recommendations = {
    'High Risk': {
        'priority': 'IMMEDIATE ACTION REQUIRED 🚨',
        'actions': [
            "Send personalized win-back campaigns with 20-30% discounts",
            "Offer free shipping on next order",
            "Conduct exit surveys to understand inactivity reasons",
            "Provide exclusive access to new products",
            "Implement urgent email/SMS re-engagement campaigns"
        ]
    },
    'Medium Risk': {
        'priority': 'PROACTIVE INTERVENTION ⚠️',
        'actions': [
            "Send targeted product recommendations",
            "Offer loyalty program enrollment with immediate benefits",
            "Provide moderate discounts (10-15%)",
            "Send educational content about products",
            "Implement retargeting campaigns"
        ]
    },
    'Low Risk': {
        'priority': 'MAINTAIN ENGAGEMENT ✅',
        'actions': [
            "Send regular newsletters with new arrivals",
            "Provide cross-selling recommendations",
            "Offer seasonal promotions",
            "Encourage product reviews and social sharing",
            "Maintain consistent communication"
        ]
    },
    'Stable': {
        'priority': 'NURTURE & GROW 🌟',
        'actions': [
            "Focus on upselling premium products",
            "Invite to VIP/premium loyalty tiers",
            "Request referrals with incentives",
            "Provide early access to new collections",
            "Gather feedback for product development"
        ]
    }
}

print("\n" + "="*80)
print("📊 CUSTOMER RETENTION STRATEGY RECOMMENDATIONS")
print("="*80)

for risk_level, info in recommendations.items():
    if risk_level in churn_business_impact.index:
        customer_count = churn_business_impact.loc[risk_level, 'Customer_Count']
        avg_revenue = churn_business_impact.loc[risk_level, 'Avg_Revenue_Per_Customer']
        
        print(f"\n{info['priority']}")
        print(f"📈 {risk_level}: {customer_count:,} customers (${avg_revenue:.2f} avg revenue)")
        print("💡 Recommended Actions:")
        for action in info['actions']:
            print(f"   • {action}")

print("\n" + "="*80)
print("🎯 STRATEGIC PRIORITIES")
print("="*80)
print("1. 🚨 Focus 60% of retention budget on High Risk customers")
print("2. ⚠️  Allocate 25% of budget to Medium Risk prevention")
print("3. ✅ Use 10% for Low Risk maintenance campaigns")
print("4. 🌟 Invest 5% in Stable customer growth initiatives")
print(f"\n💰 Expected ROI: Reducing churn by 20% could save ${revenue_at_risk * 0.2:,.2f} annually")

# 14. PROJECT SUMMARY
print("\n" + "="*80)
print("📋 PROJECT COMPLETION SUMMARY")
print("="*80)

print("\n🎯 OBJECTIVES ACHIEVED:")
print("✅ Comprehensive data preprocessing and integration")
print("✅ RFM analysis and customer segmentation")
print("✅ 4-class churn prediction model development")
print("✅ Business intelligence analysis and insights")
print("✅ Actionable retention strategy recommendations")

print(f"\n📊 KEY RESULTS:")
print(f"• Customers analyzed: {len(customer_features):,}")
print(f"• Best model: {best_model_name} (Accuracy: {model_results[best_model_name]['accuracy']:.1%})")
print(f"• Revenue at risk: ${revenue_at_risk:,.2f} ({revenue_at_risk_percentage:.1f}%)")

print(f"\n👥 CUSTOMER SEGMENTS:")
for risk in ['High Risk', 'Medium Risk', 'Low Risk', 'Stable']:
    if risk in churn_distribution.index:
        count = churn_distribution[risk]
        pct = count / len(customer_features) * 100
        print(f"• {risk}: {count:,} customers ({pct:.1f}%)")

print("\n🚀 DELIVERABLES CREATED:")
print("• churn_prediction_model.pkl - Trained ML model")
print("• customer_features_with_churn_labels.csv - Processed dataset")
print("• analysis_results.pkl - Complete analysis results")
print("• churn_analysis_overview.png - Visualization dashboard")

print("\n🎉 E-COMMERCE CHURN ANALYSIS SYSTEM COMPLETED SUCCESSFULLY!")
print("Group-04 - Fundamentals of Data Mining - SLIIT")
print("="*80)
