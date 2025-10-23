// emailService.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM, // verified sender in SendGrid
      subject,
      text
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error.response ? error.response.body : error);
    throw error;
  }
};

module.exports = { sendEmail };
