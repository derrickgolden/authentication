import { DBServicesRes } from "user/type";

const nodemailer = require('nodemailer');
import { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
require('dotenv').config();

export interface SendEmailRes extends DBServicesRes{
  response?: SentMessageInfo
}

const sendEmail = async (email: string, link: string): Promise<SendEmailRes> => {
  const send_email = process.env.EMAIL_NAME
  const pass = process.env.EMAIL_PASS
  
  var transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: send_email,
      pass: pass,
    },
  });

  var mailOptions: SendMailOptions = {
    from: send_email,
    to: email, 
    subject: 'Password Reset Link',
    text: `Click the following link to reset your password: ${link}`,
  };

  try {
    const response: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent:');

    return ({success: true, msg: "", response})
  } catch (error) {
    console.error('Error sending email:', error);
    return({success: false, msg: error.message})
  }
};

module.exports ={
    sendEmail,
}