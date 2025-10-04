#!/usr/bin/env python3
"""
Simple data loading script for E-Commerce Churn Analysis
"""

import pandas as pd
import sqlite3
import os

def load_customer_data():
    """Load customer data from CSV to SQLite database"""
    
    # Database path
    db_path = '/Users/roja/Desktop/FDM/backend/instance/churn_analysis.db'
    
    # CSV path
    csv_path = '/Users/roja/Desktop/FDM/customer_features_with_churn_labels.csv'
    
    if not os.path.exists(csv_path):
        print(f"❌ CSV file not found: {csv_path}")
        return False
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        return False
    
    try:
        # Read CSV data
        print("📊 Reading CSV data...")
        df = pd.read_csv(csv_path)
        print(f"✅ Loaded {len(df)} rows from CSV")
        
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Clear existing data
        print("🗑️ Clearing existing data...")
        cursor.execute("DELETE FROM customer")
        conn.commit()
        
        # Prepare data for insertion
        print("📝 Preparing data for insertion...")
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            # Prepare batch data
            batch_data = []
            for _, row in batch.iterrows():
                data_tuple = (
                    row['customer_unique_id'],
                    None,  # customer_city
                    None,  # customer_state
                    None,  # customer_zip_code_prefix
                    0,     # total_orders
                    None,  # first_order_date
                    None,  # last_order_date
                    float(row['monetary']) if pd.notna(row['monetary']) else 0.0,  # total_payment
                    float(row['avg_order_value']) if pd.notna(row['avg_order_value']) else 0.0,  # avg_order_value
                    int(row['unique_products']) if pd.notna(row['unique_products']) else 0,  # unique_products
                    int(row['unique_categories']) if pd.notna(row['unique_categories']) else 0,  # unique_categories
                    float(row['product_diversity_ratio']) if pd.notna(row['product_diversity_ratio']) else 0.0,  # product_diversity_ratio
                    float(row['category_diversity_ratio']) if pd.notna(row['category_diversity_ratio']) else 0.0,  # category_diversity_ratio
                    int(row['customer_lifetime_days']) if pd.notna(row['customer_lifetime_days']) else 0,  # customer_lifetime_days
                    float(row['avg_days_between_orders']) if pd.notna(row['avg_days_between_orders']) else 0.0,  # avg_days_between_orders
                    float(row['avg_review_score']) if pd.notna(row['avg_review_score']) else 0.0,  # avg_review_score
                    int(row['total_review_comments']) if pd.notna(row['total_review_comments']) else 0,  # total_review_comments
                    float(row['avg_payment_methods']) if pd.notna(row['avg_payment_methods']) else 0.0,  # avg_payment_methods
                    int(row['max_installments']) if pd.notna(row['max_installments']) else 0,  # max_installments
                    float(row['total_freight']) if pd.notna(row['total_freight']) else 0.0,  # total_freight
                    float(row['avg_freight']) if pd.notna(row['avg_freight']) else 0.0,  # avg_freight
                    float(row['std_payment']) if pd.notna(row['std_payment']) else 0.0,  # std_payment
                    int(row['recency_days']) if pd.notna(row['recency_days']) else 0,  # recency_days
                    int(row['frequency']) if pd.notna(row['frequency']) else 0,  # frequency
                    float(row['monetary']) if pd.notna(row['monetary']) else 0.0,  # monetary
                    row['churn_risk'] if pd.notna(row['churn_risk']) else 'Unknown',  # churn_risk
                    int(row['cluster']) if pd.notna(row['cluster']) else 0,  # cluster
                )
                batch_data.append(data_tuple)
            
            # Insert batch
            cursor.executemany("""
                INSERT INTO customer (
                    customer_unique_id, customer_city, customer_state, customer_zip_code_prefix,
                    total_orders, first_order_date, last_order_date, total_payment, avg_order_value,
                    unique_products, unique_categories, product_diversity_ratio, category_diversity_ratio,
                    customer_lifetime_days, avg_days_between_orders, avg_review_score, total_review_comments,
                    avg_payment_methods, max_installments, total_freight, avg_freight, std_payment,
                    recency_days, frequency, monetary, churn_risk, cluster
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, batch_data)
            
            conn.commit()
            total_inserted += len(batch_data)
            print(f"✅ Inserted {total_inserted} customers...")
        
        conn.close()
        print(f"🎉 Successfully loaded {total_inserted} customers into database!")
        return True
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting data loading process...")
    success = load_customer_data()
    if success:
        print("✅ Data loading completed successfully!")
    else:
        print("❌ Data loading failed!")
