// routes/job.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', jobController.getAllJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', jobController.getJobById);

// @route   POST api/jobs
// @desc    Create a job
// @access  Private
router.post('/', jobController.createJob);

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', jobController.updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', jobController.deleteJob);

module.exports = router;