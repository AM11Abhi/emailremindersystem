const nodemailer = require('nodemailer');

// Use SendGrid SMTP directly
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,           // TLS port that works on Render
  secure: false,       // TLS will be used automatically with STARTTLS
  auth: {
    user: 'apikey',    // literal string 'apikey'
    pass: process.env.SENDGRID_API_KEY
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // verified sender in SendGrid
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
