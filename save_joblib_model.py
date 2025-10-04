# Convert pickle files to joblib format
# This script converts the trained model to joblib format for better performance

import pickle
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

print("🔄 Converting pickle files to joblib format...")

# Load the existing pickle files
print("📂 Loading existing model artifacts...")

# Load model artifacts
with open('churn_prediction_model.pkl', 'rb') as f:
    model_artifacts = pickle.load(f)

# Load analysis results
with open('analysis_results.pkl', 'rb') as f:
    analysis_results = pickle.load(f)

print("✅ Files loaded successfully!")

# Extract components
model = model_artifacts['model']
scaler = model_artifacts['scaler']
label_encoder = model_artifacts['label_encoder']
feature_columns = model_artifacts['feature_columns']
class_names = model_artifacts['class_names']
model_name = model_artifacts['model_name']

print(f"📊 Model: {model_name}")
print(f"🔧 Features: {len(feature_columns)}")
print(f"🏷️ Classes: {len(class_names)}")

# Save individual components as joblib files
print("\n💾 Saving individual components...")

# 1. Save the trained model
joblib.dump(model, 'churn_model.joblib')
print("✅ Model saved as 'churn_model.joblib'")

# 2. Save the scaler (normalizer)
joblib.dump(scaler, 'feature_scaler.joblib')
print("✅ Scaler saved as 'feature_scaler.joblib'")

# 3. Save the label encoder
joblib.dump(label_encoder, 'label_encoder.joblib')
print("✅ Label encoder saved as 'label_encoder.joblib'")

# 4. Save feature information
feature_info = {
    'feature_columns': feature_columns,
    'class_names': class_names,
    'model_name': model_name
}
joblib.dump(feature_info, 'feature_info.joblib')
print("✅ Feature info saved as 'feature_info.joblib'")

# 5. Save complete model package
complete_model = {
    'model': model,
    'scaler': scaler,
    'label_encoder': label_encoder,
    'feature_columns': feature_columns,
    'class_names': class_names,
    'model_name': model_name
}
joblib.dump(complete_model, 'complete_churn_model.joblib')
print("✅ Complete model saved as 'complete_churn_model.joblib'")

# Create a simple prediction function
def create_prediction_function():
    """Create a simple prediction function using joblib files"""
    
    prediction_code = '''
# Load joblib model components
import joblib
import pandas as pd
import numpy as np

def load_churn_model():
    """Load all model components"""
    model = joblib.load('churn_model.joblib')
    scaler = joblib.load('feature_scaler.joblib')
    label_encoder = joblib.load('label_encoder.joblib')
    feature_info = joblib.load('feature_info.joblib')
    
    return model, scaler, label_encoder, feature_info

def predict_churn_risk(customer_data):
    """
    Predict churn risk for a customer
    
    Parameters:
    customer_data: dict or DataFrame with customer features
    
    Returns:
    dict with prediction results
    """
    
    # Load model components
    model, scaler, label_encoder, feature_info = load_churn_model()
    
    # Prepare input data
    if isinstance(customer_data, dict):
        customer_df = pd.DataFrame([customer_data])
    else:
        customer_df = customer_data.copy()
    
    # Select and scale features
    X_new = customer_df[feature_info['feature_columns']].fillna(0)
    X_new_scaled = scaler.transform(X_new)
    
    # Make predictions
    prediction = model.predict(X_new_scaled)
    probabilities = model.predict_proba(X_new_scaled)
    
    # Convert to readable format
    predicted_class = label_encoder.inverse_transform(prediction)[0]
    class_probabilities = dict(zip(feature_info['class_names'], probabilities[0]))
    confidence = max(probabilities[0])
    
    return {
        'predicted_churn_risk': predicted_class,
        'confidence': confidence,
        'class_probabilities': class_probabilities
    }

# Example usage:
if __name__ == "__main__":
    # Sample customer data
    sample_customer = {
        'recency_days': 45,
        'frequency': 3,
        'monetary': 250.0,
        'avg_order_value': 83.33,
        'unique_products': 5,
        'unique_categories': 3,
        'product_diversity_ratio': 1.67,
        'category_diversity_ratio': 1.0,
        'customer_lifetime_days': 120,
        'avg_days_between_orders': 60,
        'avg_review_score': 4.2,
        'total_review_comments': 2,
        'avg_payment_methods': 1.0,
        'max_installments': 1,
        'total_freight': 25.0,
        'avg_freight': 8.33,
        'std_payment': 15.0,
        'cluster': 2
    }
    
    # Make prediction
    result = predict_churn_risk(sample_customer)
    print("Prediction Result:", result)
'''
    
    with open('churn_prediction_function.py', 'w') as f:
        f.write(prediction_code)
    
    print("✅ Prediction function saved as 'churn_prediction_function.py'")

# Create the prediction function
create_prediction_function()

print("\n🎉 Joblib conversion completed successfully!")
print("\n📁 Files created:")
print("• churn_model.joblib - Trained model")
print("• feature_scaler.joblib - Feature scaler/normalizer")
print("• label_encoder.joblib - Label encoder")
print("• feature_info.joblib - Feature information")
print("• complete_churn_model.joblib - Complete model package")
print("• churn_prediction_function.py - Ready-to-use prediction function")

print("\n🚀 Usage:")
print("from churn_prediction_function import predict_churn_risk")
print("result = predict_churn_risk(your_customer_data)")
