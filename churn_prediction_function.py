
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
