# Simple Flask app for initial deployment
from flask import Flask, jsonify
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "E-Commerce Churn Analysis API",
        "status": "running",
        "version": "1.0.0"
    })

@app.route('/api/health')
def health():
    return jsonify({
        "status": "healthy",
        "message": "API is running successfully"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    print(f"🚀 Starting simple Flask app on port {port}")
    app.run(debug=debug, host='0.0.0.0', port=port)
