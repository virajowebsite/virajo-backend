// server.js - COMPLETE VERSION WITH HOMEPAGE ROUTE FOR PRERENDER INTEGRATION
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const prerender = require('prerender-node');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  
  // Log if this is a bot request
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|whatsapp|skypeuripreview|linkedinbot|slackbot|telegrambot|applebot|discordbot|bitlybot|tumblr|pinterest|reddit|crawler|spider|scraper/i.test(userAgent);
  if (isBot) {
    console.log('🤖 Bot detected:', userAgent);
  }
  
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

// CORS configuration for your domains
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

// Add environment-specific origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.CORS_ORIGIN) {
  const additionalOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...additionalOrigins);
}

console.log('🌐 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman, bots)
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// BASIC PRERENDER.IO CONFIGURATION (NO TOKEN REQUIRED)
console.log('🎭 Setting up basic Prerender.io...');

// Simple prerender setup that works without token
app.use(prerender
  .set('host', 'service.prerender.io')
  .set('protocol', 'https')
  .whitelist([
    '^/$',
    '^/about',
    '^/services',
    '^/products',
    '^/contact',
    '^/careers',
    '^/jobs',
    '^/blog',
    '^/prerender-test'
  ])
  .blacklist([
    '^/api/',
    '^/admin',
    '^/dashboard',
    '^/login',
    '^/register',
    '^/uploads/'
  ])
);

console.log('✅ Basic Prerender.io configured');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// HOMEPAGE ROUTE FOR PRERENDER.IO DETECTION
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|whatsapp|skypeuripreview|linkedinbot|slackbot|telegrambot|applebot|discordbot|bitlybot|tumblr|pinterest|reddit|crawler|spider|scraper/i.test(userAgent.toLowerCase());
  
  console.log('🏠 Homepage accessed by:', userAgent);
  console.log('🤖 Is bot:', isBot);
  
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virajo Backend - Prerender Integration</title>
    <meta name="description" content="Virajo backend service with Prerender.io integration for SEO optimization">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Virajo Backend Service">
    <meta property="og:description" content="Backend service with Prerender.io integration">
    <meta property="og:type" content="website">
</head>
<body>
    <header>
        <h1>Virajo Backend Service</h1>
    </header>
    
    <main>
        <section>
            <h2>Prerender.io Integration Active</h2>
            <p>This is the backend service for Virajo website with Prerender.io integration for SEO optimization.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>User Agent:</strong> ${userAgent}</p>
            <p><strong>Bot Detected:</strong> ${isBot ? 'Yes' : 'No'}</p>
            <p><strong>Prerender Status:</strong> Basic setup active</p>
        </section>
        
        <section>
            <h2>Available Endpoints:</h2>
            <ul>
                <li><a href="/health">/health</a> - Health check endpoint</li>
                <li><a href="/api/test">/api/test</a> - API test endpoint</li>
                <li><a href="/robots.txt">/robots.txt</a> - Robots.txt file</li>
                <li><a href="/prerender-test">/prerender-test</a> - Prerender test page</li>
            </ul>
        </section>
        
        <section>
            <h2>API Routes:</h2>
            <ul>
                <li>/api/blogs - Blog management</li>
                <li>/api/careers - Career opportunities</li>
                <li>/api/contact - Contact management</li>
                <li>/api/jobs - Job listings</li>
                <li>/api/applications - Job applications</li>
            </ul>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Virajo. All rights reserved.</p>
    </footer>
    
    <script>
        console.log('Page loaded at:', new Date().toISOString());
        console.log('Prerender integration active');
        console.log('Bot detected:', ${isBot});
    </script>
</body>
</html>`);
});

// Prerender test route
app.get('/prerender-test', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|whatsapp|skypeuripreview|linkedinbot|slackbot|telegrambot|applebot|discordbot|bitlybot|tumblr|pinterest|reddit|crawler|spider|scraper/i.test(userAgent.toLowerCase());
  
  console.log('🧪 Prerender test page accessed');
  
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Prerender Integration Test - Virajo</title>
    <meta name="description" content="Test page for Prerender.io integration verification">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Prerender Test Page</h1>
    <p>This page should be detectable by Prerender.io for SEO integration verification.</p>
    <p><strong>Current time:</strong> ${new Date().toISOString()}</p>
    <p><strong>User Agent:</strong> ${userAgent}</p>
    <p><strong>Bot Detected:</strong> ${isBot ? 'Yes' : 'No'}</p>
    
    <div id="dynamic-content">
        <h2>Dynamic Content Test</h2>
        <p>This content should be rendered by Prerender.io for search engines.</p>
    </div>
    
    <script>
        // Test JavaScript execution
        console.log('Prerender test page loaded');
        document.getElementById('dynamic-content').innerHTML += '<p>JavaScript executed successfully!</p>';
    </script>
</body>
</html>`);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    prerender: 'Basic setup - No token required'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route hit');
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|whatsapp|skypeuripreview|linkedinbot|slackbot|telegrambot|applebot|discordbot|bitlybot|tumblr|pinterest|reddit|crawler|spider|scraper/i.test(userAgent.toLowerCase());
  
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    userAgent: userAgent,
    isBot: isBot,
    prerender: 'Basic setup active'
  });
});

// SEO-friendly robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /api/`);
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

// For production - serve React build files
if (process.env.NODE_ENV === 'production') {
  console.log('🏭 Production mode: Serving static files');
  
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing - send all non-API requests to React app
  // This should come AFTER all your defined routes
  app.get('/app/*', (req, res) => {
    console.log('📄 Serving React app for:', req.path);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Handle 404 for development
if (process.env.NODE_ENV !== 'production') {
  app.use('*', (req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method,
      availableRoutes: [
        '/',
        '/health',
        '/api/test',
        '/prerender-test',
        '/robots.txt',
        '/api/blogs',
        '/api/careers',
        '/api/contact',
        '/api/jobs'
      ]
    });
  });
}

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Global error handler:', error);
  
  // Handle CORS errors
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.headers.origin
    });
  }
  
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
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/`);
  console.log(`🧪 Prerender test: http://localhost:${PORT}/prerender-test`);
  console.log(`📋 Apply job route: http://localhost:${PORT}/api/applyJob`);
  console.log(`🔒 CORS allowed origins:`, allowedOrigins);
  console.log(`🎭 Prerender.io: Basic setup (no token required)`);
  console.log(`🤖 Robots.txt: http://localhost:${PORT}/robots.txt`);
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