// server.js - FIXED VERSION
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// Connect to MongoDB with better error handling
console.log('🔄 Connecting to MongoDB...');
connectDB().then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// FIXED: Proper CORS configuration for your domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://virajo.in',
  'https://www.virajo.in',
  'http://virajo.in',
  'http://www.virajo.in',
  'https://virajoautosoft.com',
  'https://www.virajoautosoft.com',
  'http://virajoautosoft.com',
  'http://www.virajoautosoft.com'
];

console.log('🌐 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    console.log('🔍 Checking origin:', origin);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route hit');
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Import routes
console.log('📁 Loading routes...');
try {
  const blogRoutes = require('./routes/blog');
  const careerRoutes = require('./routes/career');
  const contactRoutes = require('./routes/contact');
  const contactPageRoutes = require('./routes/contactPage');
  const jobRoutes = require('./routes/job');
  const jobApplicationRoutes = require('./routes/jobApplication');
  const applyJobRoutes = require('./routes/applyJob');
  
  console.log('✅ All routes loaded successfully');
  
  // API Routes
  app.use('/api/blogs', blogRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/contactpage', contactPageRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', jobApplicationRoutes);
  app.use('/api/applyJob', applyJobRoutes);
  
  console.log('✅ All routes registered successfully');
  
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// Handle 404
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
  console.log(`📋 Apply job route: http://localhost:${PORT}/api/applyJob`);
  console.log(`🔒 CORS allowed origins:`, allowedOrigins);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});