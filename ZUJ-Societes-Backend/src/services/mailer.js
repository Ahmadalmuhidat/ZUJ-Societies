const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    User: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail (to, subject, text) {
  const info = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  return await transporter.sendMail(info);
};

module.exports = {
  sendEmail
};
