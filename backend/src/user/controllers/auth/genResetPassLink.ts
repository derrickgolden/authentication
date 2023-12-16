const crypto = require('crypto');
const { generateAuthToken } = require('./generateToken');

const generateResetPasswordLink = (base_url: string, length =16): {link: string, token: string} =>{
    const token: string = crypto.randomBytes(length).toString('hex');
    console.log(typeof token);
    
    const link: string = `${base_url}/user/reset-password/${token}`;

    return {link, token};
}

module.exports ={
    generateResetPasswordLink,
}