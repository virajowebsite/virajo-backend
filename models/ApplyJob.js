const mongoose = require('mongoose');

const ApplyJobSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Position is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  resume: {
    type: String, // Path to resume file
    required: [true, 'Resume is required']
  },
  coverLetter: {
    type: String
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  expectedSalary: {
    type: String
  },
  source: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ApplyJob', ApplyJobSchema);