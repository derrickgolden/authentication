"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var bcrypt = require('bcryptjs');
const router = express_1.default.Router();
const { loginUser, resetPassword, storeLinkToken, getLinkToken, signupUser, } = require('../dbServices/auth');
// const { sendText } = require('../controllers/sendText');
// const { generateRandomVerificationCode } = require('../controllers/randomCode');
// const { authenticateToken } = require('../middleware/authToken');
const generateToken_1 = require("../controllers/auth/generateToken");
const { getUserDetailsByemail } = require('../dbServices/users');
const { sendEmail } = require('../controllers/auth/sendEmail');
const { generateResetPasswordLink } = require('../controllers/auth/genResetPassLink');
router.post('/signup', async (req, res) => {
    const { auth_with } = req.body;
    console.log(req.body);
    if (auth_with === "app") {
        const { first_name, last_name, email, remember_me, country, password, phone } = req.body;
        const hash = await bcrypt.hash(password, 10);
        var response = await signupUser({ first_name, last_name,
            email, remember_me, country, hash, phone }, auth_with);
    }
    else if (auth_with === "google") {
        const { name, email, id, picture } = req.body;
        const { first_name, last_name } = separateName(name);
        var response = await signupUser({ first_name, last_name,
            email, id, picture }, auth_with);
    }
    try {
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        res.status(302).json({ success: false, res: error.message });
    }
});
router.post('/login', async (req, res) => {
    const { email, password, auth_with } = req.body;
    const response = await loginUser(email);
    const { passwordHash, userAvailable, details } = response;
    try {
        if (!userAvailable) {
            res.status(200).send({ success: false, msg: "Email not registered", details: response });
            return;
        }
        // generate JWT token
        const expiresInDays = 1;
        const { user_id, first_name, last_name, email } = details[0];
        const { token, exp_date } = await (0, generateToken_1.generateAuthToken)(user_id, first_name, last_name, email, expiresInDays);
        if (auth_with === "google") {
            res.status(200).send({ success: true, token, msg: "User Found", details });
            return;
        }
        const match = await bcrypt.compare(password, passwordHash);
        if (match) {
            res.status(200).send({ success: true, token, msg: "User Found", details });
        }
        else {
            res.status(200).send({ success: false, msg: "Incorrect Password" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).send({ success: false, msg: error.message });
    }
});
router.patch('/reset-password', async (req, res) => {
    const { password, email } = req.body;
    const token = req.header('Authorization');
    try {
        const tokenResponce = await getLinkToken(token);
        console.log(tokenResponce);
        if (tokenResponce.success) {
            const hash = await bcrypt.hash(password, 10);
            const response = await resetPassword(hash, email);
            return response.success ?
                res.status(200).send(response) :
                res.status(400).send(response);
        }
        else {
            return res.status(400).send(tokenResponce);
        }
    }
    catch (error) {
        console.log(error);
    }
});
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const response = await getUserDetailsByemail(email);
        if (response.success) {
            const { user_id, email } = response.details[0];
            const { link, token } = await generateResetPasswordLink('http://localhost:5173');
            const storeTokens = await storeLinkToken(user_id, email, token);
            if (storeTokens.success) {
                const resp = await sendEmail(email, link);
                resp.success ?
                    res.status(200).send({ success: true, msg: "Link sent" }) :
                    res.status(400).send(resp);
            }
            return;
        }
        res.status(400).send(response);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: "serverside error", error: error.message });
    }
});
const separateName = (name) => {
    const match = name.match(/^(\S+)\s+(\S+)$/);
    if (match) {
        const first_name = match[1];
        const last_name = match[2];
        return { first_name, last_name };
    }
    else {
        return { first_name: name, last_name: "" };
    }
};
exports.default = router;
//# sourceMappingURL=auth.js.map