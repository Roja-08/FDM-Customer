// API Configuration
const config = {
  // Development API URL (for local development)
  development: 'http://localhost:8000',
  
  // Production API URL (fallback if env not provided)
  production: 'https://ecommerce-churn-backend.onrender.com',
  
  // Get current API URL with env override support
  getApiUrl: () => {
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl && envUrl.trim()) {
      return envUrl.trim();
    }
    if (process.env.NODE_ENV === 'production') {
      return config.production;
    }
    return config.development;
  }
};

export default config;
