// API Configuration
const config = {
  // Development API URL (for local development)
  development: 'http://localhost:8000',
  
  // Production API URL (for deployed backend on Render)
  production: 'https://ecommerce-churn-backend.onrender.com',
  
  // Get current API URL based on environment
  getApiUrl: () => {
    if (process.env.NODE_ENV === 'production') {
      return config.production;
    }
    return config.development;
  }
};

export default config;
