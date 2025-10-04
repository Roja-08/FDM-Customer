# Deployment Guide

## Frontend (Netlify) ✅
- **Status**: Deployed
- **URL**: Your Netlify URL
- **Configuration**: Automatic build from GitHub

## Backend (Render) 🚀

### Step 1: Go to Render
1. Visit: https://render.com
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect Repository
1. Connect GitHub repository: `Roja-08/FDM-Customer`
2. Choose **"Deploy from a Git repository"**

### Step 3: Configure Service
- **Name**: `ecommerce-churn-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`

### Step 4: Environment Variables
Add these in Render dashboard:
- `FLASK_ENV` = `production`
- `SECRET_KEY` = (Render will generate this automatically)
- `DATABASE_URL` = `sqlite:///instance/database.db`

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Get your backend URL: `https://ecommerce-churn-backend.onrender.com`

### Step 6: Update Frontend (if needed)
The frontend is already configured to use the correct API URL automatically.

## Troubleshooting

### If Render shows "Service Root Directory missing":
1. Make sure **Root Directory** is set to `backend` (not empty)
2. Redeploy the service

### If backend fails to start:
1. Check the logs in Render dashboard
2. Ensure all environment variables are set
3. Verify the build completed successfully

## File Structure
```
FDM/
├── frontend/          # Netlify deployment
├── backend/           # Render deployment (Root Directory)
│   ├── app.py
│   ├── requirements.txt
│   └── instance/      # Database files
└── render.yaml        # Render configuration
```
