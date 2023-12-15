const crypto = require('crypto');
const { generateAuthToken } = require('./generateToken');

const generateResetPasswordLink = (base_url,length =16) =>{
    const token = crypto.randomBytes(length).toString('hex');
    const link = `${base_url}/user/reset-password/${token}`;

    return {link, token};
}

module.exports ={
    generateResetPasswordLink,
}