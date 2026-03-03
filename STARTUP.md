# 🚀 Easy Park - Complete Setup Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Git

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Chapa keys
npm run dev
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm start
```

### 3. Database Initialization
```bash
cd backend
node scripts/initDatabase.js
```

## Default Credentials
- **Admin Username**: admin
- **Admin Password**: admin123

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/easyparking
JWT_SECRET=your_secret_key_here
CHAPA_SECRET_KEY=CHASECK_TEST_xxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHAPA_PUBLIC_KEY=CHASECK_TEST_xxxxxxxxxxxxxxxx
```

## Features Included
✅ Landing Website (Home, About, Services, Testimony, Contact)
✅ Admin Dashboard with Sidebar Navigation
✅ Vehicle Management (Add/Remove/Track)
✅ Per-Minute Billing System
✅ QR Payment Integration (Chapa)
✅ Real-Time Analytics & Reports
✅ CSV Export Functionality
✅ Rate Management System
✅ MongoDB Integration
✅ JWT Authentication
✅ Responsive Design

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env

2. **CORS Issues**
   - Verify FRONTEND_URL matches your frontend URL
   - Check both frontend and backend are running

3. **Payment Issues**
   - Verify Chapa keys are correct
   - Use test mode for development

4. **Build Errors**
   - Run `npm install` in both directories
   - Clear node_modules and reinstall if needed

### Development Tips
- Use `npm run dev` for backend (auto-restart on changes)
- Use `npm start` for frontend (auto-reload on changes)
- Check browser console for errors
- Use MongoDB Compass for database visualization

## Production Deployment
1. Set NODE_ENV=production
2. Use MongoDB Atlas for database
3. Configure proper CORS origins
4. Use HTTPS for Chapa webhook
5. Set up proper logging and monitoring

## Support
For issues or questions:
- Check console logs
- Verify environment variables
- Ensure all dependencies are installed
- Test with default credentials first
