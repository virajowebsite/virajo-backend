const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApplyJob = require('../models/ApplyJob');

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/apply-job
// @desc    Submit a job application
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
    }
    
    const { name, email, phone, jobLocation, experience, jobPosition } = req.body;
    
    // Extract first and last name from full name
    let firstName = name;
    let lastName = "";
    
    if (name && name.includes(' ')) {
      const nameParts = name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }
    
    // Create new job application
    const newApplication = new ApplyJob({
      position: jobPosition || 'Website Application', // Use jobPosition if available
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: 'Not provided',
      city: jobLocation,
      experience: experience,
      resume: req.file.path,
      source: 'Website'
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// @route   GET /api/apply-job
// @desc    Get all job applications
// @access  Private (you'll want to add auth middleware later)
router.get('/', async (req, res) => {
  try {
    const applications = await ApplyJob.find().sort({ applicationDate: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// @route   GET /api/apply-job/:id
// @desc    Get a specific job application
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const application = await ApplyJob.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
});

// @route   PUT /api/apply-job/:id
// @desc    Update a job application status
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await ApplyJob.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application,
      message: 'Application status updated'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
      error: error.message
    });
  }
});

// @route   DELETE /api/apply-job/:id
// @desc    Delete a job application
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const application = await ApplyJob.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Delete resume file if it exists
    if (application.resume) {
      try {
        fs.unlinkSync(application.resume);
      } catch (err) {
        console.warn('Error deleting resume file:', err);
      }
    }
    
    // Delete cover letter file if it exists
    if (application.coverLetter) {
      try {
        fs.unlinkSync(application.coverLetter);
      } catch (err) {
        console.warn('Error deleting cover letter file:', err);
      }
    }
    
    await application.remove();
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    });
  }
});

module.exports = router;