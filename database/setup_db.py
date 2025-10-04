# Database Setup Script for E-Commerce Churn Analysis
# Group-04 - Fundamentals of Data Mining - SLIIT

import sqlite3
import pandas as pd  # pyright: ignore[reportMissingImports]
import os
from datetime import datetime

def create_database():
    """Create SQLite database with all necessary tables"""
    
    # Create database directory if it doesn't exist
    os.makedirs('database', exist_ok=True)
    
    # Connect to SQLite database
    conn = sqlite3.connect('database/churn_analysis.db')
    cursor = conn.cursor()
    
    print("🗄️ Creating database tables...")
    
    # Create customers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_unique_id TEXT UNIQUE NOT NULL,
            customer_city TEXT,
            customer_state TEXT,
            customer_zip_code_prefix TEXT,
            total_orders INTEGER DEFAULT 0,
            first_order_date DATETIME,
            last_order_date DATETIME,
            total_payment REAL DEFAULT 0.0,
            avg_order_value REAL DEFAULT 0.0,
            unique_products INTEGER DEFAULT 0,
            unique_categories INTEGER DEFAULT 0,
            avg_review_score REAL DEFAULT 0.0,
            recency_days INTEGER DEFAULT 0,
            frequency INTEGER DEFAULT 0,
            monetary REAL DEFAULT 0.0,
            churn_risk TEXT DEFAULT 'Unknown',
            cluster INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create predictions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            predicted_churn_risk TEXT NOT NULL,
            confidence REAL NOT NULL,
            prediction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            features_used TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers (id)
        )
    ''')
    
    # Create campaigns table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            target_risk_level TEXT NOT NULL,
            campaign_type TEXT NOT NULL,
            discount_percentage REAL DEFAULT 0.0,
            message TEXT,
            status TEXT DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            target_customers INTEGER DEFAULT 0,
            engaged_customers INTEGER DEFAULT 0
        )
    ''')
    
    # Create customer_interactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customer_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            interaction_type TEXT NOT NULL,
            interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            details TEXT,
            campaign_id INTEGER,
            FOREIGN KEY (customer_id) REFERENCES customers (id),
            FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
        )
    ''')
    
    # Create model_performance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS model_performance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_name TEXT NOT NULL,
            accuracy REAL NOT NULL,
            precision_score REAL NOT NULL,
            recall_score REAL NOT NULL,
            f1_score REAL NOT NULL,
            test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_customers_churn_risk ON customers(churn_risk)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_unique_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_predictions_customer_id ON predictions(customer_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_predictions_date ON predictions(prediction_date)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON customer_interactions(customer_id)')
    
    conn.commit()
    print("✅ Database tables created successfully!")
    
    return conn

def load_sample_data(conn):
    """Load sample data from CSV files"""
    
    print("📊 Loading sample data...")
    
    try:
        # Load customer data from CSV
        df = pd.read_csv('../customer_features_with_churn_labels.csv')
        
        # Prepare data for insertion
        customer_data = []
        for _, row in df.head(1000).iterrows():  # Load first 1000 customers
            customer_data.append((
                row['customer_unique_id'],
                row.get('customer_city', ''),
                row.get('customer_state', ''),
                row.get('customer_zip_code_prefix', ''),
                int(row.get('total_orders', 0)),
                pd.to_datetime(row.get('first_order_date')) if pd.notna(row.get('first_order_date')) else None,
                pd.to_datetime(row.get('last_order_date')) if pd.notna(row.get('last_order_date')) else None,
                float(row.get('total_payment', 0)),
                float(row.get('avg_order_value', 0)),
                int(row.get('unique_products', 0)),
                int(row.get('unique_categories', 0)),
                float(row.get('avg_review_score', 0)),
                int(row.get('recency_days', 0)),
                int(row.get('frequency', 0)),
                float(row.get('monetary', 0)),
                row.get('churn_risk', 'Unknown'),
                int(row.get('cluster', 0))
            ))
        
        # Insert customer data
        cursor = conn.cursor()
        cursor.executemany('''
            INSERT OR REPLACE INTO customers (
                customer_unique_id, customer_city, customer_state, customer_zip_code_prefix,
                total_orders, first_order_date, last_order_date, total_payment, avg_order_value,
                unique_products, unique_categories, avg_review_score, recency_days,
                frequency, monetary, churn_risk, cluster
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', customer_data)
        
        # Insert sample campaigns
        sample_campaigns = [
            ('High Risk Win-Back', 'High Risk', 'Email', 25.0, 'Special 25% discount for your return!', 'Active', 500, 150),
            ('Medium Risk Engagement', 'Medium Risk', 'SMS', 15.0, 'New products just for you!', 'Active', 300, 75),
            ('Low Risk Maintenance', 'Low Risk', 'Push', 10.0, 'Check out our latest collection', 'Active', 200, 120),
            ('Stable VIP Program', 'Stable', 'Email', 0.0, 'Exclusive VIP access to new products', 'Active', 100, 95)
        ]
        
        cursor.executemany('''
            INSERT INTO campaigns (name, target_risk_level, campaign_type, discount_percentage, message, status, target_customers, engaged_customers)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_campaigns)
        
        # Insert sample model performance data
        model_performance = [
            ('Gradient Boosting', 1.0, 1.0, 1.0, 1.0, datetime.now(), 'Best performing model'),
            ('Random Forest', 0.9999, 0.9999, 0.9999, 0.9999, datetime.now(), 'Second best model'),
            ('Logistic Regression', 0.751, 0.8089, 0.751, 0.7145, datetime.now(), 'Baseline model')
        ]
        
        cursor.executemany('''
            INSERT INTO model_performance (model_name, accuracy, precision_score, recall_score, f1_score, test_date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', model_performance)
        
        conn.commit()
        print(f"✅ Loaded {len(customer_data)} customers and sample data successfully!")
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        conn.rollback()

def create_views(conn):
    """Create useful database views"""
    
    print("👁️ Creating database views...")
    
    cursor = conn.cursor()
    
    # Customer summary view
    cursor.execute('''
        CREATE VIEW IF NOT EXISTS customer_summary AS
        SELECT 
            churn_risk,
            COUNT(*) as customer_count,
            AVG(total_payment) as avg_revenue,
            AVG(total_orders) as avg_orders,
            AVG(recency_days) as avg_recency,
            AVG(avg_review_score) as avg_review_score
        FROM customers
        GROUP BY churn_risk
    ''')
    
    # Campaign performance view
    cursor.execute('''
        CREATE VIEW IF NOT EXISTS campaign_performance AS
        SELECT 
            c.name,
            c.target_risk_level,
            c.campaign_type,
            c.target_customers,
            c.engaged_customers,
            CASE 
                WHEN c.target_customers > 0 
                THEN ROUND((c.engaged_customers * 100.0 / c.target_customers), 2)
                ELSE 0 
            END as engagement_rate,
            c.status,
            c.created_at
        FROM campaigns c
    ''')
    
    # Recent predictions view
    cursor.execute('''
        CREATE VIEW IF NOT EXISTS recent_predictions AS
        SELECT 
            p.id,
            c.customer_unique_id,
            p.predicted_churn_risk,
            p.confidence,
            p.prediction_date,
            c.customer_city,
            c.customer_state
        FROM predictions p
        JOIN customers c ON p.customer_id = c.id
        ORDER BY p.prediction_date DESC
        LIMIT 100
    ''')
    
    conn.commit()
    print("✅ Database views created successfully!")

def main():
    """Main setup function"""
    
    print("🚀 Setting up E-Commerce Churn Analysis Database")
    print("=" * 60)
    
    # Create database and tables
    conn = create_database()
    
    # Load sample data
    load_sample_data(conn)
    
    # Create views
    create_views(conn)
    
    # Display database statistics
    cursor = conn.cursor()
    
    # Get table counts
    tables = ['customers', 'predictions', 'campaigns', 'customer_interactions', 'model_performance']
    
    print("\n📊 Database Statistics:")
    for table in tables:
        cursor.execute(f'SELECT COUNT(*) FROM {table}')
        count = cursor.fetchone()[0]
        print(f"  {table}: {count} records")
    
    # Get churn distribution
    cursor.execute('''
        SELECT churn_risk, COUNT(*) as count 
        FROM customers 
        GROUP BY churn_risk 
        ORDER BY count DESC
    ''')
    
    print("\n👥 Customer Churn Distribution:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} customers")
    
    conn.close()
    
    print("\n🎉 Database setup completed successfully!")
    print("📁 Database file: database/churn_analysis.db")
    print("🔗 Ready for backend integration!")

if __name__ == '__main__':
    main()
