// controllers/careerController.js
const Career = require('../models/Career');

// @desc    Get all job openings
// @route   GET api/careers
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const careers = await Career.find().sort({ date: -1 });
    res.json(careers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get job opening by ID
// @route   GET api/careers/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(career);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a job opening
// @route   POST api/careers
// @access  Private
exports.createJob = async (req, res) => {
  try {
    const { 
      title, 
      location, 
      jobType, 
      description, 
      requirements, 
      responsibilities, 
      salary 
    } = req.body;

    // Create new career object
    const newCareer = new Career({
      title,
      location,
      jobType,
      description,
      requirements,
      responsibilities,
      salary
    });

    const career = await newCareer.save();
    res.json(career);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a job opening
// @route   PUT api/careers/:id
// @access  Private
exports.updateJob = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Update fields
    const { 
      title, 
      location, 
      jobType, 
      description, 
      requirements, 
      responsibilities, 
      salary 
    } = req.body;

    if (title) career.title = title;
    if (location) career.location = location;
    if (jobType) career.jobType = jobType;
    if (description) career.description = description;
    if (requirements) career.requirements = requirements;
    if (responsibilities) career.responsibilities = responsibilities;
    if (salary) career.salary = salary;

    await career.save();
    res.json(career);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a job opening
// @route   DELETE api/careers/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    await career.deleteOne();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
};