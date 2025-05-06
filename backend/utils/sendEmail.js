const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/api/auth/verify/${token}`;
  console.log(`Sending verification to ${to}: ${link}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Email Verification',
    text: `Click this link to verify your account: ${link}`,
    html: `<p>Click this link to verify your account: <a href="${link}">${link}</a></p>`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.error(' Failed to send email:', error);
  }
};

module.exports = sendVerificationEmail;

