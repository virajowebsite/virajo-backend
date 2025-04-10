const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  responsibilities: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true,
    default: "Pune/Mumbai"
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    default: 'Full-time'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationEmail: {
    type: String,
    default: "careers@virajo.com"
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Career', CareerSchema);