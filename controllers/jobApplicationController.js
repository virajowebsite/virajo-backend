// controllers/jobApplicationController.js
const JobApplication = require('../models/JobApplication');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up file storage for resumes
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
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
  }
};

// Set up multer
exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Submit a job application
exports.submitApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    const { jobId, name, email, phone, coverLetter } = req.body;

    const newApplication = new JobApplication({
      job: jobId,
      name,
      email,
      phone,
      resume: req.file.path,
      coverLetter
    });

    const application = await newApplication.save();
    res.status(201).json({
      success: true,
      application
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate('job', 'title department')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications by job ID
exports.getApplicationsByJobId = async (req, res) => {
  try {
    const applications = await JobApplication.find({ job: req.params.jobId })
      .populate('job', 'title department')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'interviewed', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Delete resume file
    if (application.resume && fs.existsSync(application.resume)) {
      fs.unlinkSync(application.resume);
    }
    
    await application.remove();
    
    res.json({ message: 'Application removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};