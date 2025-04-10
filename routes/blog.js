const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// @route   GET api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', blogController.getBlogs);

// @route   GET api/blogs/:slug
// @desc    Get blog by slug
// @access  Public
router.get('/:slug', blogController.getBlogBySlug);

// @route   POST api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', blogController.createBlog);

// @route   PUT api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', blogController.updateBlog);

// @route   DELETE api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
