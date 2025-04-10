// models/JobApplication.js
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  resume: {
    type: String,  // Path to the resume file
    required: true
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'hired'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);