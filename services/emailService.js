// services/emailService.js - FINAL VERSION
const { Resend } = require('resend');

console.log('📧 EmailService loaded - Using Resend API');

const resend = new Resend(process.env.RESEND_API_KEY);

// Main email function using Resend
async function sendEmail({ name, email, phone, message }) {
  try {
    console.log('🚀 Attempting to send email via Resend...');
    console.log('📧 Resend API Key present:', !!process.env.RESEND_API_KEY);
    console.log('📧 Email TO:', process.env.EMAIL_TO);

    const result = await resend.emails.send({
      from: 'Virajo Website <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO],
      subject: 'New Contact Form Submission - Virajo Website',
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff;">
              ${message}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            Sent from Virajo website at ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    console.log('✅ Email sent successfully via Resend');
    console.log('📧 Message ID:', result.data?.id);
    
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Resend email error:', error.message);
    console.error('❌ Full error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = sendEmail;