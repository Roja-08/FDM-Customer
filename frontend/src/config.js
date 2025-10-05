// API Configuration
const config = {
  // Hard default for local development
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
    const isLocal = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    if (isLocal) {
      return config.development;
    }
    // Default for Netlify/production: use same-origin proxy
    return config.productionDefault;
  }
};

export default config;
