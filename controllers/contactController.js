// controllers/contactController.js - FINAL VERSION
const Contact = require('../models/Contact');
const sendEmail = require('../services/emailService');

console.log('📞 ContactController loaded');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    console.log('📝 Contact form submission received:', req.body);
    
    const newContact = new Contact(req.body);
    const contact = await newContact.save();
    
    console.log('💾 Contact saved to database');
    
    // Send email notification using Resend
    console.log('📧 Attempting to send email notification...');
    const fullName = `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
    
    const emailResult = await sendEmail({
      name: fullName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    });
    
    console.log('📧 Email notification result:', emailResult);
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent!',
      emailSent: emailResult.success 
    });
  } catch (err) {
    console.error('❌ Contact controller error:', err);
    res.status(500).json({ 
      message: 'Server Error',
      details: err.message 
    });
  }
};

// Get all contacts (admin only)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};