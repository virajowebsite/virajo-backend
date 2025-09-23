// services/emailService.js - FINAL FIXED VERSION
const { Resend } = require('resend');

console.log('📧 EmailService loaded - Using Resend API');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to normalize form data from different forms
function normalizeFormData(formData) {
  // Handle different possible field names from different forms (case-sensitive)
  const name = formData.name || formData.Name || formData.fullName || formData.customerName || formData.user_name || 'Name not provided';
  const email = formData.email || formData.Email || formData.emailAddress || formData.user_email || formData.contactEmail;
  const phone = formData.phone || formData.Phone || formData.Contact || formData.contact || formData.phoneNumber || formData.mobile || formData.user_phone || null;
  const message = formData.message || formData.Message || formData['Your Message'] || formData.yourMessage || formData.inquiry || formData.comments || formData.description || 'No message provided';
  const company = formData['Company Name'] || formData.companyName || formData.company || null;

  console.log('🔄 Normalizing form data:');
  console.log('📝 Original data:', JSON.stringify(formData, null, 2));
  console.log('✅ Normalized data:', { name, email, phone, message, company });

  return { name, email, phone, message, company };
}

// Main email function using Resend
async function sendEmail(formData) {
  try {
    console.log('🚀 Attempting to send email via Resend...');
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f5f5;">
  
  <!-- Main Container -->
  <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%); padding: 40px 30px; text-align: center; position: relative;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        🚀 New Lead Alert
      </h1>
      <p style="color: rgba(255,255,255,0.95); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">
        Someone is interested in Virajo AutoSoft services
      </p>
      <div style="margin-top: 20px;">
        <span style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 20px; color: #ffffff; font-size: 14px; font-weight: 500; border: 1px solid rgba(255,255,255,0.1);">
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
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            <span style="color: white; font-size: 20px;">👤</span>
          </div>
          <div>
            <h2 style="margin: 0; color: #1e293b; font-size: 24px; font-weight: 600;">${name}</h2>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">New Contact Form Submission</p>
            ${company ? `<p style="margin: 2px 0 0 0; color: #3b82f6; font-size: 13px; font-weight: 500;">🏢 ${company}</p>` : ''}
          </div>
        </div>
        
        <!-- Contact Info Grid -->
        <div style="display: grid; gap: 20px; position: relative;">
          
          <!-- Email -->
          <div style="display: flex; align-items: center; padding: 20px; background: #ffffff; border-radius: 10px; border-left: 4px solid #10b981; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              <span style="color: white; font-size: 18px;">📧</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Email Address</p>
              <a href="mailto:${email}" style="color: #1e293b; font-size: 16px; font-weight: 500; text-decoration: none; margin-top: 4px; display: block; word-break: break-all;">${email}</a>
            </div>
          </div>
          
          <!-- Phone -->
          <div style="display: flex; align-items: center; padding: 20px; background: #ffffff; border-radius: 10px; border-left: 4px solid #f59e0b; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 18px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
              <span style="color: white; font-size: 18px;">📱</span>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Phone Number</p>
              ${phone && phone !== 'Not provided' ? 
                `<a href="tel:${phone}" style="color: #1e293b; font-size: 16px; font-weight: 500; text-decoration: none; margin-top: 4px; display: block;">${phone}</a>` 
                : 
                `<span style="color: #9ca3af; font-size: 16px; font-weight: 400; margin-top: 4px; display: block; font-style: italic;">Not provided</span>`
              }
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Message Section -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 8px; font-size: 20px;">💬</span>
          Customer Message
        </h3>
        <div style="background: linear-gradient(135deg, #fefefe 0%, #f9fafb 100%); padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div style="position: absolute; top: 18px; right: 18px; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);"></div>
          <p style="margin: 0; line-height: 1.7; color: #374151; font-size: 15px; white-space: pre-line; font-weight: 400;">${message}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="margin-top: 35px; text-align: center; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 1px solid #e5e7eb;">
        <h4 style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; font-weight: 600;">
          🎯 Ready to respond?
        </h4>
        <p style="margin: 0 0 25px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
          Click below to get started with your response
        </p>
        <div style="display: inline-flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
          <a href="mailto:${email}" style="display: inline-flex; align-items: center; padding: 14px 28px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
            <span style="margin-right: 8px;">📧</span>
            Reply via Email
          </a>
          ${phone && phone !== 'Not provided' ? `
          <a href="tel:${phone}" style="display: inline-flex; align-items: center; padding: 14px 28px; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
            <span style="margin-right: 8px;">📞</span>
            Call Now
          </a>
          ` : `
          <div style="display: inline-flex; align-items: center; padding: 14px 28px; background: #f3f4f6; color: #9ca3af; border-radius: 10px; font-weight: 500; font-size: 14px; border: 2px dashed #d1d5db;">
            <span style="margin-right: 8px;">📞</span>
            Phone not provided
          </div>
          `}
        </div>
      </div>
      
      <!-- Debug Info Section (REMOVE IN PRODUCTION) -->
      <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; font-size: 13px; color: #856404;">
        <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: 600;">🐛 Debug Information (Remove in production):</h4>
        <div style="background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; font-family: 'Courier New', monospace; white-space: pre-wrap; font-size: 12px; color: #374151; overflow-x: auto; max-height: 200px; overflow-y: auto;">
Original Form Data:
${JSON.stringify(formData, null, 2)}

Normalized Data:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
Company: ${company}
        </div>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6; font-weight: 400;">
        <strong style="color: #1e293b;">Virajo AutoSoft</strong> • Contact Form Notification<br>
        📍 Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
      <div style="margin-top: 15px;">
        <span style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #3730a3; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #a5b4fc;">
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
${company ? `Company: ${company}` : ''}

Message:
${message}

---
You can reply directly to this email to respond to the customer.
Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Debug Info:
${JSON.stringify(formData, null, 2)}
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