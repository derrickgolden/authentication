"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const { generateAuthToken } = require('./generateToken');
const generateResetPasswordLink = (base_url, length = 16) => {
    const token = crypto.randomBytes(length).toString('hex');
    console.log(typeof token);
    const link = `${base_url}/user/reset-password/${token}`;
    return { link, token };
};
module.exports = {
    generateResetPasswordLink,
};
//# sourceMappingURL=genResetPassLink.js.map