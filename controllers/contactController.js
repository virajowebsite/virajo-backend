const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { sendFloatingFormNotification } = require('../services/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const contact = await newContact.save();
    
    // Send email notification
    const emailResult = await sendFloatingFormNotification(req.body);
    console.log('Email notification result:', emailResult);
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent!',
      emailSent: emailResult.success 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
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