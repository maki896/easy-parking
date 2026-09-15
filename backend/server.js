const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const path = require('path');
const fs = require('fs');

// Load environment variables reliably from backend/.env or root .env
const envBackendPath = path.join(__dirname, '.env');
const envRootPath = path.join(__dirname, '../.env');
if (fs.existsSync(envBackendPath)) {
  dotenv.config({ path: envBackendPath });
} else if (fs.existsSync(envRootPath)) {
  dotenv.config({ path: envRootPath });
} else {
  dotenv.config();
}

// Default fallbacks for critical environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || 'easyparking_super_secret_jwt_key_2024_make_it_long_and_random_for_security';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Import routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const contactRoutes = require('./routes/contact');
const rateRoutes = require('./routes/rates');
const capacityRoutes = require('./routes/capacity');

// Initialize Express app
const app = express();

// CORS configuration - MUST be before helmet
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.8.68:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl) or if origin is allowed or in non-production
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000000 // limit each IP to 10000000 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyparking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize default rates if not already set
  const Rate = require('./models/Rate');
  try {
    const existingRates = await Rate.find({});
    if (existingRates.length === 0) {
      await Rate.setDefaultRates();
      console.log('✅ Default rates initialized');
    }
  } catch (error) {
    console.error('⚠️  Error initializing rates:', error.message);
  }

  // Initialize default admin user if none exists
  const User = require('./models/User');
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const defaultAdmin = new User({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log('✅ Default admin account created (Username: admin, Password: admin123)');
    }
  } catch (error) {
    console.error('⚠️  Error checking/creating default admin user:', error.message);
  }
  
  // Initialize and synchronize parking capacity
  const ParkingCapacity = require('./models/ParkingCapacity');
  try {
    const capacity = await ParkingCapacity.getInstance();
    await capacity.synchronizeWithVehicles();
    console.log(`✅ Parking capacity synchronized: ${capacity.currentOccupied}/${capacity.totalCapacity} slots occupied`);
  } catch (error) {
    console.error('⚠️  Error synchronizing parking capacity:', error.message);
  }
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/capacity', capacityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Chapa webhook endpoint
app.post('/api/chapa/webhook', express.raw({type: 'application/json'}), (req, res) => {
  try {
    const event = JSON.parse(req.body);
    console.log('Chapa webhook received:', event);
    
    // Handle webhook events (payment verification)
    if (event.event === 'transaction.successful') {
      // Update payment status in database
      // This will be implemented in the payment routes
    }
    
    res.status(200).json({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({error: 'Invalid webhook payload'});
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }
  
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Serve static frontend build if available
const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// 404 handler for API routes or when static build is not present
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

// Handle MongoDB disconnection and auto-reconnect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  setTimeout(() => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyparking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch(err => console.error('❌ Reconnection failed:', err.message));
  }, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Prevent server from crashing on unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Promise Rejection:', reason?.message || reason);
});

// Prevent server from crashing on uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught Exception:', error.message);
  if (error.code === 'EADDRINUSE' || error.code === 'ECONNREFUSED') {
    process.exit(1);
  }
});
