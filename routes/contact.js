// routes/contact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactController.submitContact);

// @route   GET api/contact
// @desc    Get all contacts
// @access  Private (Admin only)
router.get('/', contactController.getContacts);

// @route   PUT api/contact/:id
// @desc    Update contact status
// @access  Private (Admin only)
router.put('/:id', contactController.updateContactStatus);

// @route   DELETE api/contact/:id
// @desc    Delete contact
// @access  Private (Admin only)
router.delete('/:id', contactController.deleteContact);

module.exports = router;