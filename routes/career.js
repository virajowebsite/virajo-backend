const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

// @route   GET api/careers
// @desc    Get all job openings
// @access  Public
router.get('/', careerController.getJobs);

// @route   GET api/careers/:id
// @desc    Get job opening by ID
// @access  Public
router.get('/:id', careerController.getJob);

// @route   POST api/careers
// @desc    Create a job opening
// @access  Private
router.post('/', careerController.createJob);

// @route   PUT api/careers/:id
// @desc    Update a job opening
// @access  Private
router.put('/:id', careerController.updateJob);

// @route   DELETE api/careers/:id
// @desc    Delete a job opening
// @access  Private
router.delete('/:id', careerController.deleteJob);

module.exports = router;