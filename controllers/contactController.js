const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const contact = await newContact.save();
    
    // Send email notification (you'll need to configure this)
    // sendEmailNotification(contact);
    
    res.json({ success: true, message: 'Your message has been sent!' });
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

// Helper function to send email notification
const sendEmailNotification = (contact) => {
  // Configure nodemailer (this is just a placeholder - you'll need to add your email service details)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'your-email@virajo.com',
    subject: 'New Contact Form Submission',
    text: `
      Name: ${contact.name}
      Contact: ${contact.contact}
      Email: ${contact.email}
      Company: ${contact.company}
      Message: ${contact.message}
      Submitted: ${contact.createdAt}
    `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
