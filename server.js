// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./routes/blog');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const careerRoutes = require('./routes/career');
const contactRoutes = require('./routes/contact');
const contactPageRoutes = require('./routes/contactPage');
const jobRoutes = require('./routes/job');
const jobApplicationRoutes = require('./routes/jobApplication');
const applyJobRoutes = require('./routes/applyJob');

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contactpage', contactPageRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/applyJob', applyJobRoutes); // Changed from 'apply-job' to 'applyJob' to match frontend

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});