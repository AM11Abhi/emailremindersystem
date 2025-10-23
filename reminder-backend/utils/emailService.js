const nodemailer = require('nodemailer');

// Create transporter using SendGrid
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey', // this is literal 'apikey'
    pass: process.env.SENDGRID_API_KEY
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // your verified sender
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
