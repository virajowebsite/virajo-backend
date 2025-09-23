// services/emailService.js - FIXED VERSION FOR MULTIPLE FORMS
const { Resend } = require('resend');

console.log('📧 EmailService loaded - Using Resend API');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to normalize form data from different forms
function normalizeFormData(formData) {
  // Handle different possible field names from different forms
  const name = formData.name || formData.fullName || formData.customerName || formData.user_name || 'Name not provided';
  const email = formData.email || formData.emailAddress || formData.user_email || formData.contactEmail;
  const phone = formData.phone || formData.phoneNumber || formData.mobile || formData.contact || formData.user_phone || null;
  const message = formData.message || formData.inquiry || formData.comments || formData.description || 'No message provided';

  console.log('🔄 Normalizing form data:');
  console.log('📝 Original data:', JSON.stringify(formData, null, 2));
  console.log('✅ Normalized data:', { name, email, phone, message });

  return { name, email, phone, message };
}

// Main email function using Resend
async function sendEmail(formData) {
  try {
    console.log('🚀 Attempting to send email via Resend...');
    console.log('📧 Resend API Key present:', !!process.env.RESEND_API_KEY);
    console.log('📧 Email TO:', process.env.EMAIL_TO);

    // Normalize the form data to handle different form structures
    const { name, email, phone, message } = normalizeFormData(formData);

    // Validate required fields
    if (!email) {
      throw new Error('Email is required but not provided');
    }

    const result = await resend.emails.send({
      from: 'Virajo AutoSoft Contact Form <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO],
      subject: '🔔 New Contact Form Submission - Virajo AutoSoft',
      replyTo: email,
      headers: {
        'X-Priority': '1',
        'Importance': 'high',
        'X-MSMail-Priority': 'High'
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f5f5;">
  
  <!-- Main Container -->
  <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%); padding: 40px 30px; text-align: center; position: relative;">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"40\" r=\"0.8\" fill=\"%23ffffff\" opacity=\"0.08\"/><circle cx=\"40\" cy=\"80\" r=\"1.2\" fill=\"%23ffffff\" opacity=\"0.06\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>'); opacity: 0.3;"></div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; position: relative;">
        🚀 New Lead Alert
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; position: relative;">
        Someone is interested in Virajo AutoSoft services
      </p>
      <div style="margin-top: 20px; position: relative;">
        <span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: #ffffff; font-size: 14px; font-weight: 500;">
          📅 ${new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
          })}
        </span>
      </div>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      
      <!-- Contact Card -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
        
        <!-- Background Pattern -->
        <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #3b82f6, #8b5cf6); border-radius: 50%; opacity: 0.05;"></div>
        
        <div style="display: flex; align-items: center; margin-bottom: 25px; position: relative;">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="color: white; font-size: 20px;">👤</span>
          </div>
          <div>
            <h2 style="margin: 0; color: #1e293b; font-size: 24px; font-weight: 600;">${name}</h2>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">New Contact Form Submission</p>
          </div>
        </div>
        
        <!-- Contact Info Grid -->
        <div style="display: grid; gap: 20px; position: relative;">
          
          <!-- Email -->
          <div style="display: flex; align-items: center; padding: 16px; background: #ffffff; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="color: white; font-size: 18px;">📧</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Email Address</p>
              <a href="mailto:${email}" style="color: #1e293b; font-size: 16px; font-weight: 500; text-decoration: none; margin-top: 2px; display: block;">${email}</a>
            </div>
          </div>
          
          <!-- Phone -->
          <div style="display: flex; align-items: center; padding: 16px; background: #ffffff; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="color: white; font-size: 18px;">📱</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Phone Number</p>
              <a href="tel:${phone}" style="color: #1e293b; font-size: 16px; font-weight: 500; text-decoration: none; margin-top: 2px; display: block;">${phone || 'Not provided'}</a>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Message Section -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 8px;">💬</span>
          Customer Message
        </h3>
        <div style="background: linear-gradient(135deg, #fefefe 0%, #f9fafb 100%); padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; position: relative;">
          <div style="position: absolute; top: 15px; right: 15px; width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></div>
          <p style="margin: 0; line-height: 1.7; color: #374151; font-size: 15px; white-space: pre-line;">${message}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="margin-top: 35px; text-align: center; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px;">
        <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">
          Ready to respond? Click below to get started:
        </p>
        <div style="display: inline-flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
          <a href="mailto:${email}" style="display: inline-flex; align-items: center; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
            <span style="margin-right: 8px;">📧</span>
            Reply via Email
          </a>
          ${phone && phone !== 'Not provided' ? `
          <a href="tel:${phone}" style="display: inline-flex; align-items: center; padding: 12px 24px; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
            <span style="margin-right: 8px;">📞</span>
            Call Now
          </a>
          ` : ''}
        </div>
      </div>
      
      <!-- Debug Info (remove in production) -->
      <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
        <strong>Debug Info:</strong><br>
        Original form data: ${JSON.stringify(formData, null, 2)}
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
        <strong>Virajo AutoSoft</strong> • Contact Form Notification<br>
        📍 Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
      <div style="margin-top: 15px;">
        <span style="display: inline-block; padding: 6px 12px; background: #e0e7ff; color: #3730a3; border-radius: 20px; font-size: 11px; font-weight: 500;">
          🔔 High Priority
        </span>
      </div>
    </div>
    
  </div>
  
</body>
</html>
      `,
      text: `
New Contact Form Submission - Virajo AutoSoft

Contact Details:
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
You can reply directly to this email to respond to the customer.
Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
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