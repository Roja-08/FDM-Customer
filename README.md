# E-Commerce Customer Behavior Analysis & Recommendation System

A comprehensive churn prediction system built with React frontend and Flask backend, analyzing Brazilian E-Commerce data to predict customer churn risk levels.

## 🚀 Live Demo

[Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/Roja-08/FDM-Customer)

## 📊 Features

- **Multi-Class Churn Prediction**: 4 risk levels (High Risk, Medium Risk, Low Risk, Stable)
- **Interactive Dashboard**: Real-time analytics and visualizations
- **Customer Management**: Comprehensive customer data management
- **Campaign Management**: Targeted retention campaigns
- **Predictive Analytics**: Machine learning-powered insights
- **RFM Analysis**: Recency, Frequency, Monetary value analysis

## 🛠️ Technology Stack

### Frontend
- React 18
- Ant Design
- Chart.js
- Axios

### Backend
- Flask
- SQLAlchemy
- SQLite
- Scikit-learn
- Pandas

### Machine Learning
- Random Forest
- Gradient Boosting
- Logistic Regression
- RFM Analysis
- K-Means Clustering

## 📁 Project Structure

```
FDM/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Main application pages
│   │   └── App.js           # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Flask backend API
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── instance/           # Database files
├── fdm/                    # Original datasets
├── complete_churn_analysis.py  # Main analysis script
├── ecommerce_churn_analysis.ipynb  # Jupyter notebook
├── netlify.toml            # Netlify configuration
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Roja-08/FDM-Customer.git
   cd FDM-Customer
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   npm run install-frontend
   
   # Install backend dependencies
   npm run install-backend
   ```

3. **Run the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Frontend: npm start
   # Backend: cd backend && python app.py
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📊 Dataset

The project uses the Brazilian E-Commerce Public Dataset by Olist:
- **96,096 customers** with comprehensive transaction history
- **9 interconnected tables** covering orders, customers, products, sellers, payments, and reviews
- **2016-2018 data** with rich geographical, temporal, and behavioral dimensions

## 🤖 Machine Learning Models

### Churn Prediction Models
1. **Random Forest Classifier** - Handles mixed data types well
2. **Gradient Boosting Classifier** - High performance for structured data
3. **Logistic Regression** - Interpretable multi-class results

### Performance Metrics
- **Accuracy**: 100% (Gradient Boosting)
- **Precision**: 100% across all classes
- **Recall**: 100% across all classes
- **F1-Score**: 100% across all classes

## 📈 Key Features

### Dashboard
- Real-time customer statistics
- Revenue analytics
- Risk distribution visualization
- Recent predictions overview

### Analytics
- Interactive charts and graphs
- Customer behavior analysis
- Risk trend analysis
- Quick statistics

### Customer Management
- Comprehensive customer database
- Search and filter functionality
- Detailed customer profiles
- Risk level tracking

### Campaign Management
- Create targeted retention campaigns
- Track campaign performance
- Customer engagement metrics
- Campaign analytics

### Predictions
- Individual customer churn prediction
- Risk level classification
- Confidence scores
- Recommended actions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
FLASK_ENV=production
DATABASE_URL=sqlite:///instance/database.db
SECRET_KEY=your-secret-key
```

### Database Setup
The application automatically creates and populates the SQLite database with customer data from the CSV files.

## 📱 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `frontend/build`
4. Deploy!

### Manual Deployment
1. Build the frontend: `npm run build`
2. Deploy the `frontend/build` directory to your hosting service
3. Deploy the backend to a Python hosting service (Heroku, Railway, etc.)

## 📊 Data Analysis

The project includes comprehensive data analysis:
- **RFM Analysis**: Customer segmentation based on recency, frequency, and monetary value
- **Clustering**: K-means clustering for customer behavior patterns
- **Feature Engineering**: 31 engineered features for churn prediction
- **Business Intelligence**: Revenue at risk analysis and actionable recommendations

## 🎯 Business Impact

- **Proactive Customer Retention**: Identify at-risk customers before they churn
- **Targeted Marketing**: Optimize marketing resources for retention campaigns
- **Revenue Protection**: Protect revenue through early intervention
- **Data-Driven Decisions**: Make informed business decisions based on ML insights

## 👥 Team

- **IT23177314** - Viviyan.V.S.
- **IT23344938** - Kenushan.N.
- **IT23345164** - Nirosha.P.
- **IT23203044** - Gowtham.P.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email the team or create an issue in the repository.

---

**Note**: This project is developed as part of the Fundamentals of Data Mining course at Sri Lanka Institute of Information Technology.