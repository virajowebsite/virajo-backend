const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  overlayColor: {
    type: String,
    default: "rgba(0, 61, 187, 0.45)"
  },
  author: {
    type: String,
    default: "Virajo Team"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', BlogSchema);