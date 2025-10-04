#!/bin/bash

# E-Commerce Churn Analysis - Full Stack Setup Script
# Group-04 - Fundamentals of Data Mining - SLIIT

echo "🚀 Setting up E-Commerce Churn Analysis Full Stack Application"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

print_info "Setting up Backend (Flask + SQLite)..."

# Create virtual environment for backend
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_status "Created Python virtual environment"
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
print_status "Installed backend dependencies"

# Setup database
cd ../database
python3 setup_db.py
print_status "Database setup completed"

cd ..

print_info "Setting up Frontend (React)..."

# Install frontend dependencies
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    print_status "Installed frontend dependencies"
else
    print_warning "Frontend dependencies already installed"
fi

cd ..

# Create startup scripts
print_info "Creating startup scripts..."

# Backend startup script
cat > start_backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Flask Backend Server..."
cd backend
source venv/bin/activate
python app.py
EOF

chmod +x start_backend.sh

# Frontend startup script
cat > start_frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting React Frontend Server..."
cd frontend
npm start
EOF

chmod +x start_frontend.sh

# Full stack startup script
cat > start_fullstack.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Full Stack Application..."

# Start backend in background
echo "Starting backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
EOF

chmod +x start_fullstack.sh

# Create README for the full stack app
cat > FULLSTACK_README.md << 'EOF'
# E-Commerce Customer Churn Analysis - Full Stack Application

## 🚀 Quick Start

### Option 1: Start Everything at Once
```bash
./start_fullstack.sh
```

### Option 2: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
./start_backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start_frontend.sh
```

## 🌐 Access Points

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api/health

## 📁 Project Structure

```
FDM/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/               # React dashboard
│   ├── src/                # React source code
│   ├── public/             # Static files
│   └── package.json        # Node.js dependencies
├── database/               # SQLite database
│   ├── churn_analysis.db   # Main database file
│   └── setup_db.py         # Database setup script
├── complete_churn_analysis.py  # Original ML analysis
└── *.pkl, *.joblib         # ML model files
```

## 🔧 Features

### Backend (Flask API)
- RESTful API endpoints
- SQLite database integration
- ML model integration
- Customer management
- Prediction services
- Campaign management
- Analytics endpoints

### Frontend (React Dashboard)
- Modern, responsive UI
- Real-time dashboards
- Customer management interface
- Churn prediction form
- Campaign management
- Interactive analytics charts
- Mobile-friendly design

### Database (SQLite)
- Customer data storage
- Prediction history
- Campaign tracking
- Performance metrics
- Optimized indexes

## 🎯 Key Endpoints

### Customer Management
- `GET /api/customers` - List customers with pagination
- `GET /api/customers/{id}` - Get customer details
- `POST /api/predict` - Predict churn risk

### Analytics
- `GET /api/analytics/summary` - Dashboard summary
- `GET /api/analytics/charts` - Chart data

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign

## 🛠️ Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Management
```bash
cd database
python setup_db.py
```

## 📊 ML Model Integration

The application uses the trained ML models from the original analysis:
- `churn_model.joblib` - Gradient Boosting classifier
- `feature_scaler.joblib` - Feature scaler
- `label_encoder.joblib` - Label encoder
- `feature_info.joblib` - Feature information

## 🎉 Ready to Use!

Your full-stack E-Commerce Churn Analysis application is now ready!

**Group-04 - Fundamentals of Data Mining - SLIIT**
EOF

print_status "Setup completed successfully!"
print_info "Created startup scripts:"
print_info "  - start_backend.sh (Backend only)"
print_info "  - start_frontend.sh (Frontend only)" 
print_info "  - start_fullstack.sh (Both servers)"
print_info "  - FULLSTACK_README.md (Documentation)"

echo ""
echo "🎉 Full Stack Application Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo "  ./start_fullstack.sh"
echo ""
echo "Or start individually:"
echo "  ./start_backend.sh  (Terminal 1)"
echo "  ./start_frontend.sh (Terminal 2)"
echo ""
echo "Access points:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "📚 See FULLSTACK_README.md for detailed documentation"
