
const nodemailer = require('nodemailer');

const sendResetPasswordLink = async (email, link) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'derricknyarangi22@gmail.com',
      pass: 'lmjm nwkc nqhs rzsu',
    },
  });

  var mailOptions = {
    from: 'derricknyarangi22@gmail.com',
    to: email, // Use the 'email' parameter instead of a hardcoded email address
    subject: 'Password Reset Link',
    text: `Click the following link to reset your password: ${link}`,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Email sent:', response);
    return ({success: true, response})
  } catch (error) {
    console.error('Error sending email:', error);
    return({success: false, error: error.message})
  }
};

module.exports ={
    sendResetPasswordLink,
}