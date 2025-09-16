// services/emailService.js - COMPLETE REPLACEMENT
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Main email function
async function sendEmail({ name, email, phone, message }) {
  try {
    console.log("🚀 Sending contact form notification via Resend...");

    const result = await resend.emails.send({
      from: 'Virajo Website <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO], // Uses your EMAIL_TO environment variable
      subject: 'New Contact Form Submission - Virajo Website',
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
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
            Sent from Virajo website - ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      `
    });

    console.log("✅ Email sent successfully via Resend:", result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("❌ Resend email failed:", error);
    throw error;
  }
}

// Alias functions that your controllers expect
const sendFloatingFormNotification = async (data) => {
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  return await sendEmail({
    name: fullName,
    email: data.email,
    phone: data.phone,
    message: data.message
  });
};

const sendContactPageNotification = async (data) => {
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  return await sendEmail({
    name: fullName,
    email: data.email,
    phone: data.phone,
    message: data.message
  });
};

// Export all functions your controllers need
module.exports = {
  sendEmail,
  sendFloatingFormNotification,
  sendContactPageNotification
};