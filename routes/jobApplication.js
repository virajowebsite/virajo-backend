// routes/jobApplication.js
const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');

// @route   POST api/applications
// @desc    Submit a job application
// @access  Public
router.post(
  '/',
  jobApplicationController.upload.single('resume'),
  jobApplicationController.submitApplication
);

// @route   GET api/applications
// @desc    Get all applications
// @access  Private
router.get('/', jobApplicationController.getAllApplications);

// @route   GET api/applications/job/:jobId
// @desc    Get applications by job ID
// @access  Private
router.get('/job/:jobId', jobApplicationController.getApplicationsByJobId);

// @route   GET api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', jobApplicationController.getApplicationById);

// @route   PUT api/applications/:id
// @desc    Update application status
// @access  Private
router.put('/:id', jobApplicationController.updateApplicationStatus);

// @route   DELETE api/applications/:id
// @desc    Delete an application
// @access  Private
router.delete('/:id', jobApplicationController.deleteApplication);

module.exports = router;