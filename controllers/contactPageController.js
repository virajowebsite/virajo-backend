const ContactPageForm = require('../models/ContactPageForm');
const nodemailer = require('nodemailer');
const { sendContactPageNotification } = require('../services/emailService');

// Get all contact page form submissions
exports.getAllContactPageForms = async (req, res) => {
  try {
    const contactForms = await ContactPageForm.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contactForms.length,
      data: contactForms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single contact page form submission
exports.getContactPageForm = async (req, res) => {
  try {
    const contactForm = await ContactPageForm.findById(req.params.id);
    
    if (!contactForm) {
      return res.status(404).json({
        success: false,
        error: 'Form submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contactForm
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new contact page form submission
exports.createContactPageForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    // Create contact form in database
    const contactForm = await ContactPageForm.create({
      firstName,
      lastName,
      email,
      phone,
      message
    });
    
    // Send email notification
    const emailResult = await sendContactPageNotification({
      firstName,
      lastName,
      email,
      phone,
      message
    });
    
    console.log('Email notification result:', emailResult);
    
    res.status(201).json({
      success: true,
      data: contactForm,
      emailSent: emailResult.success
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete a contact page form submission
exports.deleteContactPageForm = async (req, res) => {
  try {
    const contactForm = await ContactPageForm.findById(req.params.id);
    
    if (!contactForm) {
      return res.status(404).json({
        success: false,
        error: 'Form submission not found'
      });
    }
    
    await contactForm.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};