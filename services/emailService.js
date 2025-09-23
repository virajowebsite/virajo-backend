// services/emailService.js - COMPLETE WORKING VERSION
const { Resend } = require('resend');

console.log('📧 EmailService loaded - Using Resend API');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to normalize form data from ALL different forms
function normalizeFormData(formData) {
  console.log('🔍 RAW FORM DATA RECEIVED:', JSON.stringify(formData, null, 2));
  
  // Handle FLOATING FORM fields: name, contact, email, company, message
  // Handle CONTACT FORM fields: firstName, lastName, email, phone, message
  
  let normalizedName = 'Name not provided';
  let normalizedEmail = '';
  let normalizedPhone = null;
  let normalizedMessage = 'No message provided';
  let normalizedCompany = null;
  
  // Extract NAME
  if (formData.name) {
    normalizedName = formData.name;
  } else if (formData.firstName || formData.lastName) {
    normalizedName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
  }
  
  // Extract EMAIL
  normalizedEmail = formData.email || '';
  
  // Extract PHONE/CONTACT
  if (formData.contact) {
    normalizedPhone = formData.contact;
  } else if (formData.phone) {
    normalizedPhone = formData.phone;
  }
  
  // Extract MESSAGE
  if (formData.message) {
    normalizedMessage = formData.message;
  }
  
  // Extract COMPANY
  if (formData.company) {
    normalizedCompany = formData.company;
  }

  const normalized = {
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    message: normalizedMessage,
    company: normalizedCompany
  };

  console.log('✅ NORMALIZED DATA:', normalized);
  return normalized;
}

// Main email function using Resend
async function sendEmail(formData) {
  try {
    console.log('🚀 Starting email send process...');
    console.log('📧 Resend API Key present:', !!process.env.RESEND_API_KEY);
    console.log('📧 Email TO:', process.env.EMAIL_TO);

    // Normalize the form data to handle different form structures
    const { name, email, phone, message, company } = normalizeFormData(formData);

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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  
  <!-- Main Container -->
  <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.8px; text-shadow: 0 4px 8px rgba(0,0,0,0.2); font-family: 'Segoe UI', Arial, sans-serif;">
        🚀 NEW LEAD ALERT
      </h1>
      <p style="color: #ffffff; margin: 12px 0 0 0; font-size: 18px; font-weight: 400; opacity: 0.95;">
        Someone is interested in Virajo AutoSoft services
      </p>
      <div style="margin-top: 25px;">
        <span style="display: inline-block; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); padding: 10px 20px; border-radius: 25px; color: #ffffff; font-size: 14px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2);">
          📅 ${new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
          })} • ${new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Asia/Kolkata' 
          })}
        </span>
      </div>
    </div>
    
    <!-- Content -->
    <div style="padding: 50px 40px;">
      
      <!-- Contact Card -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 40px; border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
        
        <div style="display: flex; align-items: center; margin-bottom: 30px; position: relative;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
            <span style="color: white; font-size: 24px;">👤</span>
          </div>
          <div>
            <h2 style="margin: 0; color: #1a202c; font-size: 28px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif;">${name}</h2>
            <p style="margin: 8px 0 0 0; color: #718096; font-size: 16px; font-weight: 500;">New Contact Form Submission</p>
            ${company ? `<p style="margin: 4px 0 0 0; color: #667eea; font-size: 14px; font-weight: 600;">🏢 ${company}</p>` : ''}
          </div>
        </div>
        
        <!-- Contact Info Grid -->
        <div style="display: grid; gap: 25px; position: relative;">
          
          <!-- Email -->
          <div style="display: flex; align-items: center; padding: 25px; background: #ffffff; border-radius: 12px; border-left: 5px solid #48bb78; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 6px 16px rgba(72, 187, 120, 0.3);">
              <span style="color: white; font-size: 20px;">📧</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #718096; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">EMAIL ADDRESS</p>
              <a href="mailto:${email}" style="color: #1a202c; font-size: 18px; font-weight: 600; text-decoration: none; margin-top: 6px; display: block; word-break: break-all;">${email}</a>
            </div>
          </div>
          
          <!-- Phone -->
          <div style="display: flex; align-items: center; padding: 25px; background: #ffffff; border-radius: 12px; border-left: 5px solid #ed8936; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ed8936, #dd6b20); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 6px 16px rgba(237, 137, 54, 0.3);">
              <span style="color: white; font-size: 20px;">📱</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #718096; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">PHONE NUMBER</p>
              ${phone ? 
                `<a href="tel:${phone}" style="color: #1a202c; font-size: 18px; font-weight: 600; text-decoration: none; margin-top: 6px; display: block;">${phone}</a>` 
                : 
                `<span style="color: #a0aec0; font-size: 18px; font-weight: 500; margin-top: 6px; display: block; font-style: italic;">Not provided</span>`
              }
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Message Section -->
      <div style="margin-top: 40px;">
        <h3 style="color: #1a202c; font-size: 22px; margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; font-family: 'Segoe UI', Arial, sans-serif;">
          <span style="margin-right: 12px; font-size: 24px;">💬</span>
          Customer Message
        </h3>
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%); padding: 30px; border-radius: 16px; border: 2px solid #e2e8f0; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="position: absolute; top: 20px; right: 20px; width: 10px; height: 10px; background: #48bb78; border-radius: 50%; box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.2);"></div>
          <p style="margin: 0; line-height: 1.8; color: #2d3748; font-size: 16px; white-space: pre-line; font-weight: 400;">${message}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="margin-top: 40px; text-align: center; padding: 40px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 2px solid #e2e8f0;">
        <h4 style="margin: 0 0 25px 0; color: #1a202c; font-size: 20px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif;">
          🎯 Ready to Respond?
        </h4>
        <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6;">
          Click below to get started with your response
        </p>
        <div style="display: inline-flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
          <a href="mailto:${email}" style="display: inline-flex; align-items: center; padding: 16px 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
            <span style="margin-right: 10px;">📧</span>
            Reply via Email
          </a>
          ${phone ? `
          <a href="tel:${phone}" style="display: inline-flex; align-items: center; padding: 16px 32px; background: linear-gradient(135deg, #48bb78, #38a169); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 6px 16px rgba(72, 187, 120, 0.3); transition: all 0.3s ease;">
            <span style="margin-right: 10px;">📞</span>
            Call Now
          </a>
          ` : `
          <div style="display: inline-flex; align-items: center; padding: 16px 32px; background: #f7fafc; color: #a0aec0; border-radius: 12px; font-weight: 600; font-size: 16px; border: 2px dashed #e2e8f0;">
            <span style="margin-right: 10px;">📞</span>
            Phone not provided
          </div>
          `}
        </div>
      </div>
      
      <!-- Debug Info Section -->
      <div style="margin-top: 30px; padding: 25px; background: #fff8e1; border: 2px solid #ffb74d; border-radius: 12px; font-size: 14px; color: #e65100;">
        <h4 style="margin: 0 0 15px 0; color: #e65100; font-size: 16px; font-weight: 700;">🐛 Debug Information:</h4>
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ffcc02; font-family: 'Courier New', monospace; white-space: pre-wrap; font-size: 13px; color: #424242; overflow-x: auto; max-height: 300px; overflow-y: auto;">
RAW FORM DATA:
${JSON.stringify(formData, null, 2)}

PROCESSED DATA:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
Company: ${company}
        </div>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px 40px; border-top: 2px solid #e2e8f0; text-align: center;">
      <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.8; font-weight: 500;">
        <strong style="color: #1a202c; font-weight: 700;">Virajo AutoSoft</strong> • Contact Form Notification<br>
        📍 Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
      <div style="margin-top: 20px;">
        <span style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #3730a3; border-radius: 25px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; border: 2px solid #a5b4fc;">
          🔔 HIGH PRIORITY
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
${company ? `Company: ${company}` : ''}

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