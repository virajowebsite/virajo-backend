// routes/applyJob.js - FINAL FIXED VERSION
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import the ApplyJob model
let ApplyJob;
try {
  ApplyJob = require('../models/ApplyJob');
  console.log('✅ ApplyJob model imported successfully');
} catch (error) {
  console.error('❌ Error importing ApplyJob model:', error);
}

// Test middleware - log all requests
router.use((req, res, next) => {
  console.log('🔄 Request received:', {
    method: req.method,
    url: req.url,
    contentType: req.get('Content-Type')
  });
  next();
});

// Debug route - Add this for debugging
router.post('/debug', (req, res) => {
  console.log('Debug route hit');
  console.log('Body:', req.body);
  res.json({ success: true, message: 'Debug route working' });
});

// Simple test route
router.get('/test', (req, res) => {
  console.log('✅ Test route hit successfully');
  res.json({ 
    success: true, 
    message: 'Route is working',
    timestamp: new Date().toISOString()
  });
});

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Setting up file destination...');
    const uploadDir = 'uploads/resumes';
    
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('✅ Created upload directory:', uploadDir);
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error('❌ Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    console.log('📝 Setting up filename for:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('🔍 Checking file type:', file.mimetype);
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File type approved:', file.mimetype);
    cb(null, true);
  } else {
    console.log('❌ File type rejected:', file.mimetype);
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/applyJob
// @desc    Submit a job application
// @access  Public
router.post('/', (req, res) => {
  console.log('🚨 ROUTE HIT - POST /api/applyJob');
  console.log('🚀 POST request received at /api/applyJob');
  
  upload.single('resume')(req, res, async (err) => {
    console.log('📤 Multer processing complete');
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'File too large. Maximum size is 5MB.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'File upload error: ' + err.message 
      });
    } else if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }

    try {
      console.log('📄 Received form data:', req.body);
      console.log('📎 Received file:', req.file ? {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : 'No file');
      
      // Check if file was uploaded
      if (!req.file) {
        console.error('❌ No file uploaded');
        return res.status(400).json({ 
          success: false, 
          message: 'Resume is required' 
        });
      }
      
      // Extract form data
      const { 
        name, 
        email, 
        phone, 
        location,
        experience, 
        position
      } = req.body;
      
      console.log('📊 Extracted fields:', { name, email, phone, location, experience, position });
      
      // Check for required fields
      if (!name || !email || !phone || !location || !experience || !position) {
        console.error('❌ Missing required fields');
        console.log('Missing field analysis:', {
          name: !name ? 'MISSING' : 'OK',
          email: !email ? 'MISSING' : 'OK',
          phone: !phone ? 'MISSING' : 'OK',
          location: !location ? 'MISSING' : 'OK',
          experience: !experience ? 'MISSING' : 'OK',
          position: !position ? 'MISSING' : 'OK'
        });
        
        // Delete uploaded file if validation fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file due to validation error');
        }
        
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required',
          receivedFields: Object.keys(req.body),
          missingFields: {
            name: !name,
            email: !email,
            phone: !phone,
            location: !location,
            experience: !experience,
            position: !position
          }
        });
      }
      
      // FIXED: Extract first and last name properly
      let firstName = name.trim();
      let lastName = "";
      
      if (name && name.includes(' ')) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      } else {
        // If no space in name, use the whole name as firstName and set lastName to empty
        firstName = name.trim();
        lastName = ""; // Set to empty string instead of "N/A"
      }
      
      console.log('👤 Processed names:', { firstName, lastName });
      
      // Check database connection
      const mongoose = require('mongoose');
      console.log('🔗 Database connection state:', mongoose.connection.readyState);
      
      if (mongoose.connection.readyState !== 1) {
        console.error('❌ Database not connected');
        return res.status(500).json({
          success: false,
          message: 'Database connection error'
        });
      }
      
      // Check if ApplyJob model is available
      if (!ApplyJob) {
        console.error('❌ ApplyJob model not available');
        return res.status(500).json({
          success: false,
          message: 'Database model not available'
        });
      }
      
      // FIXED: Create application data that matches your ApplyJob model exactly
      const applicationData = {
        position: position,
        firstName: firstName,
        lastName: lastName || "Not provided", // Provide default if empty
        email: email,
        phone: phone,
        address: location, // Use location as address
        city: location,    // Use location as city
        resume: req.file.path,
        experience: experience,
        source: 'Website',
        applicationDate: new Date()
      };
      
      console.log('📝 Application data to save:', applicationData);
      
      // Create and save new job application
      console.log('💾 Creating new application...');
      const newApplication = new ApplyJob(applicationData);
      
      console.log('💾 Saving to database...');
      const savedApplication = await newApplication.save();
      console.log('✅ Application saved successfully:', savedApplication._id);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully!',
        applicationId: savedApplication._id,
        data: {
          name: name,
          position: position,
          email: email
        }
      });

    } catch (error) {
      console.error('❌ Error in try-catch block:', error);
      console.error('❌ Error stack:', error.stack);
      
      // Delete uploaded file if database save fails
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file due to error');
        } catch (deleteError) {
          console.error('❌ Error deleting file:', deleteError);
        }
      }
      
      // Handle specific mongoose validation errors
      if (error.name === 'ValidationError') {
        console.error('❌ Mongoose validation error:', error.errors);
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit application',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        errorType: error.name
      });
    }
  });
});

// GET route for testing
router.get('/', async (req, res) => {
  console.log('🔍 GET request to fetch applications');
  
  try {
    if (!ApplyJob) {
      return res.status(500).json({
        success: false,
        message: 'Database model not available'
      });
    }
    
    const applications = await ApplyJob.find().sort({ applicationDate: -1 }).limit(10);
    console.log('✅ Found applications:', applications.length);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

console.log('🚀 applyJob routes configured');

module.exports = router;