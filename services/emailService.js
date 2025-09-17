// services/emailService.js - IMPROVED VERSION
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
            <p style="color: #e8e8e8; margin: 10px 0 0 0;">From Virajo AutoSoft Website</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333; font-size: 18px;">📋 Contact Details:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; font-weight: bold; color: #555; width: 100px;">👤 Name:</td>
                  <td style="padding: 12px 0; color: #333;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; font-weight: bold; color: #555;">📧 Email:</td>
                  <td style="padding: 12px 0; color: #333;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; font-weight: bold; color: #555;">📞 Phone:</td>
                  <td style="padding: 12px 0; color: #333;">
                    <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone || 'Not provided'}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 25px;">
              <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">💬 Message:</h3>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-line;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                💡 <strong>Quick Action:</strong> You can reply directly to this email to respond to ${name}
              </p>
            </div>
          </div>
          
          <div style="background-color: #343a40; padding: 20px; text-align: center;">
            <p style="color: #adb5bd; margin: 0; font-size: 12px;">
              This notification was sent from your Virajo AutoSoft website contact form<br>
              🕐 Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
        </div>
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