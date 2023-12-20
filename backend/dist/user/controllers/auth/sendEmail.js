"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (email, link) => {
    const send_email = process.env.EMAIL_NAME;
    const pass = process.env.EMAIL_PASS;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: send_email,
            pass: pass,
        },
    });
    var mailOptions = {
        from: send_email,
        to: email,
        subject: 'Password Reset Link',
        text: `Click the following link to reset your password: ${link}`,
    };
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent:');
        return ({ success: true, msg: "", response });
    }
    catch (error) {
        console.error('Error sending email:', error);
        return ({ success: false, msg: error.message });
    }
};
module.exports = {
    sendEmail,
};
//# sourceMappingURL=sendEmail.js.map