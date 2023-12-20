"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = void 0;
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateAuthToken(user_id, first_name, last_name, email, expiresInDays) {
    // Calculate the expiration date based on the provided expiresInDays
    const exp_date = new Date();
    exp_date.setDate(exp_date.getDate() + expiresInDays);
    console.log(exp_date);
    // Generate a token with the specified expiration time
    const token = jwt.sign({
        user_id, first_name, last_name, email
    }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: `${expiresInDays}d`
    });
    return { token, exp_date };
}
exports.generateAuthToken = generateAuthToken;
//# sourceMappingURL=generateToken.js.map