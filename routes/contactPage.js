const express = require('express');
const router = express.Router();
const {
  getAllContactPageForms,
  getContactPageForm,
  createContactPageForm,
  deleteContactPageForm
} = require('../controllers/contactPageController');

// Get all contact forms and create new contact form
router
  .route('/')
  .get(getAllContactPageForms)
  .post(createContactPageForm);

// Get and delete specific contact form by ID
router
  .route('/:id')
  .get(getContactPageForm)
  .delete(deleteContactPageForm);

module.exports = router;