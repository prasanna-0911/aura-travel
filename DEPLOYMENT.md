# Aura Travel - Production Build Config

# Vercel Deployment
# Connect your GitHub repo at https://vercel.com
# Set environment variable: VITE_API_URL = https://your-render-backend.onrender.com/api

# Render Deployment
# Create Web Service → Connect GitHub repo
# Root directory: backend
# Build command: npm install
# Start command: node src/server.js
# Node version: 18

# Environment Variables (set in Render dashboard)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://database_admin:gbzMfmVc4oQxihB1@cluster0.zcmxfjj.mongodb.net/?appName=Cluster0
JWT_SECRET=aura-travel-secret-key-2024-production
JWT_EXPIRE=24h
FRONTEND_URL=https://your-vercel-frontend.vercel.app