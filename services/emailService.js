const nodemailer = require('nodemailer');

// Create email transporter for Gmail
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// 1. Send notification for FloatingForm (Contact Form)
const sendFloatingFormNotification = async (formData) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: `"Virajo Website" <${process.env.EMAIL_USER}>`,
    to: 'pragati.said@virajo.in',
    subject: 'New Contact Form Submission - Floating Form',
    html: `
      <h2>New Contact Form Submission (Floating Form)</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Contact:</strong> ${formData.contact}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Company:</strong> ${formData.company}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Floating form notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending floating form notification:', error);
    return { success: false, error: error.message };
  }
};

// 2. Send notification for ContactPage Form
const sendContactPageNotification = async (formData) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: `"Virajo Website" <${process.env.EMAIL_USER}>`,
    to: 'pragati.said@virajo.in',
    subject: 'New Contact Form Submission - Contact Page',
    html: `
      <h2>New Contact Form Submission (Contact Page)</h2>
      <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact page notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending contact page notification:', error);
    return { success: false, error: error.message };
  }
};

// 3. Send notification for Job Application
const sendJobApplicationNotification = async (applicationData) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: `"Virajo Careers" <${process.env.EMAIL_USER}>`,
    to: 'pragati.said@virajo.in',
    subject: 'New Job Application Received',
    html: `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName || ''}</p>
      <p><strong>Email:</strong> ${applicationData.email}</p>
      <p><strong>Phone:</strong> ${applicationData.phone}</p>
      <p><strong>Position Applied:</strong> ${applicationData.position}</p>
      <p><strong>City:</strong> ${applicationData.city}</p>
      <p><strong>Experience:</strong> ${applicationData.experience}</p>
      <p><strong>Resume:</strong> ${applicationData.resume ? 'Uploaded' : 'Not provided'}</p>
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Job application notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending job application notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendFloatingFormNotification,
  sendContactPageNotification,
  sendJobApplicationNotification
};