const ContactPageForm = require('../models/ContactPageForm');
const nodemailer = require('nodemailer');

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
    const emailSent = await sendEmailNotification({
      firstName,
      lastName,
      email,
      phone,
      message
    });
    
    res.status(201).json({
      success: true,
      data: contactForm,
      emailSent
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

// Helper function to send email notification
const sendEmailNotification = async (formData) => {
  try {
    // Create a test account if you don't have real credentials
    // For production, use your actual SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Setup email data
    const mailOptions = {
      from: `"Virajo IT Website" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: 'New Contact Page Form Submission',
      html: `
        <h2>New Contact Form Submission from Main Contact Page</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `
    };
    
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};