// API Configuration
const config = {
  // Development API URL (for local development)
  development: 'http://localhost:8000',
  
  // In production, prefer Netlify proxy (same-origin). Keep empty so
  // `${getApiUrl()}/api/...` resolves to `/api/...`
  productionDefault: '',
  
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
