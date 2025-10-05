// API Configuration
const config = {
  // Development API URL (for local development)
  development: 'http://localhost:8000',
  
  // In production, prefer Netlify proxy (same-origin) to avoid CORS
  productionDefault: '/api',
  
  // Get current API URL with env override support
  getApiUrl: () => {
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl && envUrl.trim()) {
      return envUrl.trim();
    }
    if (process.env.NODE_ENV === 'production') {
      return config.productionDefault;
    }
    return config.development;
  }
};

export default config;
