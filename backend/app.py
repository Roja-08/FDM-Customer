# E-Commerce Churn Analysis - Flask Backend
# Group-04 - Fundamentals of Data Mining - SLIIT

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import joblib
import os
import json
from sqlalchemy import create_engine, text
import sqlite3

# Initialize Flask app
app = Flask(__name__)
# Restrict CORS to the deployed Netlify domain and preflight for /api/* routes
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "https://fdm-customer-analysis.netlify.app",
        "https://*.netlify.app"
    ]}},
)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///churn_analysis.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Load ML model and components
try:
    model = joblib.load('../churn_model.joblib')
    scaler = joblib.load('../feature_scaler.joblib')
    label_encoder = joblib.load('../label_encoder.joblib')
    feature_info = joblib.load('../feature_info.joblib')
    print("✅ ML models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading ML models: {e}")
    model = None

# Database Models
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_unique_id = db.Column(db.String(100), unique=True, nullable=False)
    customer_city = db.Column(db.String(100))
    customer_state = db.Column(db.String(10))
    customer_zip_code_prefix = db.Column(db.String(10))
    total_orders = db.Column(db.Integer, default=0)
    first_order_date = db.Column(db.DateTime)
    last_order_date = db.Column(db.DateTime)
    total_payment = db.Column(db.Float, default=0.0)
    avg_order_value = db.Column(db.Float, default=0.0)
    unique_products = db.Column(db.Integer, default=0)
    unique_categories = db.Column(db.Integer, default=0)
    product_diversity_ratio = db.Column(db.Float, default=0.0)
    category_diversity_ratio = db.Column(db.Float, default=0.0)
    customer_lifetime_days = db.Column(db.Integer, default=0)
    avg_days_between_orders = db.Column(db.Float, default=0.0)
    avg_review_score = db.Column(db.Float, default=0.0)
    total_review_comments = db.Column(db.Integer, default=0)
    avg_payment_methods = db.Column(db.Float, default=0.0)
    max_installments = db.Column(db.Integer, default=0)
    total_freight = db.Column(db.Float, default=0.0)
    avg_freight = db.Column(db.Float, default=0.0)
    std_payment = db.Column(db.Float, default=0.0)
    recency_days = db.Column(db.Integer, default=0)
    frequency = db.Column(db.Integer, default=0)
    monetary = db.Column(db.Float, default=0.0)
    churn_risk = db.Column(db.String(20), default='Unknown')
    cluster = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    predicted_churn_risk = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    prediction_date = db.Column(db.DateTime, default=datetime.utcnow)
    features_used = db.Column(db.Text)  # JSON string of features used

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_risk_level = db.Column(db.String(20), nullable=False)
    campaign_type = db.Column(db.String(50), nullable=False)
    discount_percentage = db.Column(db.Float, default=0.0)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    target_customers = db.Column(db.Integer, default=0)
    engaged_customers = db.Column(db.Integer, default=0)

# API Routes

@app.route('/')
def index():
    return jsonify({
        "message": "E-Commerce Churn Analysis API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "customers": "/api/customers",
            "analytics": "/api/analytics",
            "predictions": "/api/predictions",
            "campaigns": "/api/campaigns"
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'model_loaded': model is not None
    })

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers with pagination and filtering"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    risk_filter = request.args.get('risk_level', None)
    search = request.args.get('search', None)
    
    query = Customer.query
    
    if risk_filter:
        query = query.filter(Customer.churn_risk == risk_filter)
    
    if search:
        query = query.filter(
            (Customer.customer_unique_id.contains(search)) |
            (Customer.customer_city.contains(search)) |
            (Customer.customer_state.contains(search))
        )
    
    customers = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'customers': [{
            'id': c.id,
            'customer_unique_id': c.customer_unique_id,
            'customer_city': c.customer_city,
            'customer_state': c.customer_state,
            'total_orders': c.total_orders,
            'total_payment': c.total_payment,
            'avg_order_value': c.avg_order_value,
            'churn_risk': c.churn_risk,
            'recency_days': c.recency_days,
            'frequency': c.frequency,
            'monetary': c.monetary,
            'last_order_date': c.last_order_date.isoformat() if c.last_order_date else None
        } for c in customers.items],
        'total': customers.total,
        'pages': customers.pages,
        'current_page': page
    })

@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get specific customer details"""
    customer = Customer.query.get_or_404(customer_id)
    return jsonify({
        'id': customer.id,
        'customer_unique_id': customer.customer_unique_id,
        'customer_city': customer.customer_city,
        'customer_state': customer.customer_state,
        'customer_zip_code_prefix': customer.customer_zip_code_prefix,
        'total_orders': customer.total_orders,
        'first_order_date': customer.first_order_date.isoformat() if customer.first_order_date else None,
        'last_order_date': customer.last_order_date.isoformat() if customer.last_order_date else None,
        'total_payment': customer.total_payment,
        'avg_order_value': customer.avg_order_value,
        'unique_products': customer.unique_products,
        'unique_categories': customer.unique_categories,
        'avg_review_score': customer.avg_review_score,
        'recency_days': customer.recency_days,
        'frequency': customer.frequency,
        'monetary': customer.monetary,
        'churn_risk': customer.churn_risk,
        'cluster': customer.cluster,
        'created_at': customer.created_at.isoformat() if customer.created_at else None,
        'updated_at': customer.updated_at.isoformat() if customer.updated_at else None
    })

@app.route('/api/predict', methods=['POST'])
def predict_churn():
    """Predict churn risk for a customer"""
    if not model:
        return jsonify({'error': 'ML model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        # Prepare features for prediction
        features = []
        for feature in feature_info['feature_columns']:
            if feature in data:
                features.append(data[feature])
            else:
                features.append(0)  # Default value for missing features
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        
        # Convert to readable format
        predicted_class = label_encoder.inverse_transform([prediction])[0]
        confidence = max(probabilities)
        class_probabilities = dict(zip(feature_info['class_names'], probabilities))
        
        return jsonify({
            'predicted_churn_risk': predicted_class,
            'confidence': float(confidence),
            'class_probabilities': class_probabilities,
            'features_used': dict(zip(feature_info['feature_columns'], features))
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get analytics summary"""
    total_customers = Customer.query.count()
    
    churn_distribution = db.session.query(
        Customer.churn_risk,
        db.func.count(Customer.id).label('count')
    ).group_by(Customer.churn_risk).all()
    
    total_revenue = db.session.query(db.func.sum(Customer.total_payment)).scalar() or 0
    
    avg_order_value = db.session.query(db.func.avg(Customer.avg_order_value)).scalar() or 0
    
    recent_predictions = Prediction.query.order_by(Prediction.prediction_date.desc()).limit(10).all()
    
    return jsonify({
        'total_customers': total_customers,
        'total_revenue': float(total_revenue),
        'avg_order_value': float(avg_order_value),
        'churn_distribution': {item.churn_risk: item.count for item in churn_distribution},
        'recent_predictions': [{
            'id': p.id,
            'customer_id': p.customer_id,
            'predicted_churn_risk': p.predicted_churn_risk,
            'confidence': p.confidence,
            'prediction_date': p.prediction_date.isoformat()
        } for p in recent_predictions]
    })

@app.route('/api/analytics/charts', methods=['GET'])
def get_chart_data():
    """Get data for charts and visualizations"""
    chart_type = request.args.get('type', 'churn_distribution')
    
    if chart_type == 'churn_distribution':
        data = db.session.query(
            Customer.churn_risk,
            db.func.count(Customer.id).label('count')
        ).group_by(Customer.churn_risk).all()
        
        return jsonify({
            'labels': [item.churn_risk for item in data],
            'data': [item.count for item in data]
        })
    
    elif chart_type == 'revenue_by_risk':
        data = db.session.query(
            Customer.churn_risk,
            db.func.sum(Customer.total_payment).label('total_revenue'),
            db.func.avg(Customer.total_payment).label('avg_revenue')
        ).group_by(Customer.churn_risk).all()
        
        return jsonify({
            'labels': [item.churn_risk for item in data],
            'total_revenue': [float(item.total_revenue) for item in data],
            'avg_revenue': [float(item.avg_revenue) for item in data]
        })
    
    elif chart_type == 'geographic_distribution':
        data = db.session.query(
            Customer.customer_state,
            db.func.count(Customer.id).label('count')
        ).group_by(Customer.customer_state).order_by(db.func.count(Customer.id).desc()).limit(10).all()
        
        return jsonify({
            'labels': [item.customer_state for item in data],
            'data': [item.count for item in data]
        })
    
    return jsonify({'error': 'Invalid chart type'}), 400

@app.route('/api/campaigns', methods=['GET'])
def get_campaigns():
    """Get all campaigns"""
    campaigns = Campaign.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'target_risk_level': c.target_risk_level,
        'campaign_type': c.campaign_type,
        'discount_percentage': c.discount_percentage,
        'message': c.message,
        'status': c.status,
        'created_at': c.created_at.isoformat(),
        'target_customers': c.target_customers,
        'engaged_customers': c.engaged_customers
    } for c in campaigns])

@app.route('/api/campaigns', methods=['POST'])
def create_campaign():
    """Create a new campaign"""
    data = request.get_json()
    
    campaign = Campaign(
        name=data['name'],
        target_risk_level=data['target_risk_level'],
        campaign_type=data['campaign_type'],
        discount_percentage=data.get('discount_percentage', 0.0),
        message=data.get('message', ''),
        target_customers=data.get('target_customers', 0)
    )
    
    db.session.add(campaign)
    db.session.commit()
    
    return jsonify({'id': campaign.id, 'message': 'Campaign created successfully'}), 201

@app.route('/api/campaigns/<int:campaign_id>', methods=['DELETE'])
def delete_campaign(campaign_id):
    """Delete a campaign"""
    campaign = Campaign.query.get(campaign_id)
    
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    db.session.delete(campaign)
    db.session.commit()
    
    return jsonify({'message': 'Campaign deleted successfully'}), 200

@app.route('/api/campaigns/<int:campaign_id>', methods=['PUT'])
def update_campaign(campaign_id):
    """Update a campaign"""
    campaign = Campaign.query.get(campaign_id)
    
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    data = request.get_json()
    
    campaign.name = data.get('name', campaign.name)
    campaign.target_risk_level = data.get('target_risk_level', campaign.target_risk_level)
    campaign.campaign_type = data.get('campaign_type', campaign.campaign_type)
    campaign.discount_percentage = data.get('discount_percentage', campaign.discount_percentage)
    campaign.message = data.get('message', campaign.message)
    campaign.target_customers = data.get('target_customers', campaign.target_customers)
    campaign.status = data.get('status', campaign.status)
    
    db.session.commit()
    
    return jsonify({'message': 'Campaign updated successfully'}), 200

@app.route('/api/load_initial_data', methods=['POST'])
def load_initial_data():
    """Load customer data from CSV file"""
    try:
        import pandas as pd
        import os
        
        # Path to the CSV file
        csv_path = '../customer_features_with_churn_labels.csv'
        
        if not os.path.exists(csv_path):
            return jsonify({'error': 'CSV file not found'}), 404
        
        # Read CSV data
        df = pd.read_csv(csv_path)
        
        # Clear existing data
        Customer.query.delete()
        db.session.commit()
        
        # Load data in batches
        batch_size = 1000
        total_loaded = 0
        
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                customer = Customer(
                    customer_unique_id=row['customer_unique_id'],
                    recency_days=int(row['recency_days']) if pd.notna(row['recency_days']) else 0,
                    frequency=int(row['frequency']) if pd.notna(row['frequency']) else 0,
                    monetary=float(row['monetary']) if pd.notna(row['monetary']) else 0.0,
                    avg_order_value=float(row['avg_order_value']) if pd.notna(row['avg_order_value']) else 0.0,
                    unique_products=int(row['unique_products']) if pd.notna(row['unique_products']) else 0,
                    unique_categories=int(row['unique_categories']) if pd.notna(row['unique_categories']) else 0,
                    product_diversity_ratio=float(row['product_diversity_ratio']) if pd.notna(row['product_diversity_ratio']) else 0.0,
                    category_diversity_ratio=float(row['category_diversity_ratio']) if pd.notna(row['category_diversity_ratio']) else 0.0,
                    customer_lifetime_days=int(row['customer_lifetime_days']) if pd.notna(row['customer_lifetime_days']) else 0,
                    avg_days_between_orders=float(row['avg_days_between_orders']) if pd.notna(row['avg_days_between_orders']) else 0.0,
                    avg_review_score=float(row['avg_review_score']) if pd.notna(row['avg_review_score']) else 0.0,
                    total_review_comments=int(row['total_review_comments']) if pd.notna(row['total_review_comments']) else 0,
                    avg_payment_methods=float(row['avg_payment_methods']) if pd.notna(row['avg_payment_methods']) else 0.0,
                    max_installments=int(row['max_installments']) if pd.notna(row['max_installments']) else 0,
                    total_freight=float(row['total_freight']) if pd.notna(row['total_freight']) else 0.0,
                    avg_freight=float(row['avg_freight']) if pd.notna(row['avg_freight']) else 0.0,
                    std_payment=float(row['std_payment']) if pd.notna(row['std_payment']) else 0.0,
                    cluster=int(row['cluster']) if pd.notna(row['cluster']) else 0,
                    churn_risk=row['churn_risk'] if pd.notna(row['churn_risk']) else 'Unknown',
                    total_payment=float(row['monetary']) if pd.notna(row['monetary']) else 0.0
                )
                db.session.add(customer)
            
            db.session.commit()
            total_loaded += len(batch)
            print(f"Loaded {total_loaded} customers...")
        
        return jsonify({
            'message': f'Successfully loaded {total_loaded} customers from CSV',
            'total_customers': total_loaded
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to load data: {str(e)}'}), 500

@app.route('/api/import-data', methods=['POST'])
def import_data():
    """Import customer data from CSV"""
    try:
        # This would typically handle file upload
        # For now, we'll assume data is already in the database
        return jsonify({'message': 'Data import endpoint ready'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Database initialization
def init_db():
    """Initialize database with sample data"""
    with app.app_context():
        db.create_all()
        
        # Check if data already exists
        if Customer.query.count() == 0:
            print("📊 Loading sample data...")
            # Load data from CSV if available
            try:
                df = pd.read_csv('../customer_features_with_churn_labels.csv')
                
                for _, row in df.head(1000).iterrows():  # Load first 1000 customers
                    customer = Customer(
                        customer_unique_id=row['customer_unique_id'],
                        customer_city=row.get('customer_city', ''),
                        customer_state=row.get('customer_state', ''),
                        customer_zip_code_prefix=row.get('customer_zip_code_prefix', ''),
                        total_orders=int(row.get('total_orders', 0)),
                        first_order_date=pd.to_datetime(row.get('first_order_date')) if pd.notna(row.get('first_order_date')) else None,
                        last_order_date=pd.to_datetime(row.get('last_order_date')) if pd.notna(row.get('last_order_date')) else None,
                        total_payment=float(row.get('total_payment', 0)),
                        avg_order_value=float(row.get('avg_order_value', 0)),
                        unique_products=int(row.get('unique_products', 0)),
                        unique_categories=int(row.get('unique_categories', 0)),
                        avg_review_score=float(row.get('avg_review_score', 0)),
                        recency_days=int(row.get('recency_days', 0)),
                        frequency=int(row.get('frequency', 0)),
                        monetary=float(row.get('monetary', 0)),
                        churn_risk=row.get('churn_risk', 'Unknown'),
                        cluster=int(row.get('cluster', 0))
                    )
                    db.session.add(customer)
                
                db.session.commit()
                print(f"✅ Loaded {Customer.query.count()} customers into database")
                
            except Exception as e:
                print(f"❌ Error loading data: {e}")

if __name__ == '__main__':
    init_db()
    print("🚀 Starting Flask backend server...")
    print("📊 E-Commerce Churn Analysis API")
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    print(f"🌐 Server running on port {port}")
    app.run(debug=debug, host='0.0.0.0', port=port)
