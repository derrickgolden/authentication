import express, {Request, Response} from 'express';
import { TokenResponse } from '../controllers/auth/generateToken';
import {  GoogleUserProfile, LinkTokenRes, LoginResponse, 
    PersonDetails, SignupDetails, SignupResponse } from 'user/type';

var bcrypt = require('bcryptjs');
const router = express.Router();

const { loginUser, resetPassword, storeLinkToken, getLinkToken, signupUser,
    } =  require('../dbServices/auth');
// const { sendText } = require('../controllers/sendText');
// const { generateRandomVerificationCode } = require('../controllers/randomCode');
// const { authenticateToken } = require('../middleware/authToken');
import { generateAuthToken } from '../controllers/auth/generateToken';
import { UserDetailsRes } from '../dbServices/users';
import { SendEmailRes } from 'user/controllers/auth/sendEmail';
import { StoreLinkTokenRes } from 'user/dbServices/auth';

const { getUserDetailsByemail } = require('../dbServices/users');
const { sendEmail } = require('../controllers/auth/sendEmail');
const { generateResetPasswordLink } = require('../controllers/auth/genResetPassLink');

router.post('/signup', async (req: Request, res: Response): Promise<void> =>{
    const {signup_with} = req.body;
    
    if(signup_with === "app"){
        const { first_name, last_name, email, remember_me, country,
            password, phone }: SignupDetails = req.body;

        const hash = await bcrypt.hash(password, 10);
        var response:SignupResponse = await signupUser({first_name, last_name, 
            email, remember_me, country, hash, phone}, signup_with);

    }else if(signup_with === "google"){
        const { name, email, id, picture }: GoogleUserProfile = req.body;
        const {first_name, last_name} = separateName(name)

        var response:SignupResponse = await signupUser({first_name, last_name, 
            email, id, picture}, signup_with )    
    } 

    try{

        response.success ? 
            res.status(200).json(response) : 
            res.status(302).json(response)
    }catch(error){
        res.status(302).json({success: false, res: error.message})
    }
});

router.post('/login', async (req: Request, res: Response): Promise<void> =>{
    const { email, password, auth_with}: PersonDetails = req.body;

    const response: LoginResponse = await loginUser(email);
    const { passwordHash, userAvailable, details } = response;

    try {
        if(!userAvailable){
            res.status(200).send({success: false, msg: "Email not registered", details: response});
            return;
        }

        // generate JWT token
        const expiresInDays: number = 1;
        const {user_id, first_name, last_name, email} = details[0];
        const { token, exp_date }: TokenResponse = await generateAuthToken(
            user_id, first_name, last_name, email, expiresInDays
        );

        if(auth_with === "google"){
            res.status(200).send({success: true, token, msg: "User Found", details}) ;
            return; 
        }

        const match: boolean = await bcrypt.compare(password, passwordHash);
        if(match) {
            res.status(200).send({success: true, token, msg: "User Found", details}) ;
            
        }else{
            res.status(200).send({success: false, msg: "Incorrect Password"});
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({success: false, msg: error.message})
    }
});

router.patch('/reset-password', async(req: Request, res: Response) =>{
    const { password, email }: PersonDetails = req.body;
    const token: string = req.header('Authorization');

    try {
        const tokenResponce: LinkTokenRes = await getLinkToken(token)
        console.log(tokenResponce);
        
        if(tokenResponce.success){
            const hash = await bcrypt.hash(password, 10);
    
            const response = await resetPassword(hash, email)
            return response.success ?
                res.status(200).send(response) :
                res.status(400).send(response)
        }else{
            return res.status(400).send(tokenResponce);
        }

    } catch (error) {
        console.log(error)
    }
});

router.post('/forgot-password', async(req: Request, res: Response): Promise<void> =>{
    const { email }: PersonDetails = req.body;

    try {
        interface UserDetailsRes2 extends UserDetailsRes{
            details?: Array<{
                user_id: number;
                email: string;
            }>;
        }

        const response: UserDetailsRes2 = await getUserDetailsByemail(email);

        if(response.success ){
            const {user_id,  email} = response.details[0];
            const {link,token}: {link: string, token: string} 
                = await generateResetPasswordLink('http://localhost:5173');

            const storeTokens: StoreLinkTokenRes= await storeLinkToken(user_id,email,token)

            if(storeTokens.success){
                const resp: SendEmailRes  = await sendEmail(email, link);
                resp.success ?
                    res.status(200).send({success: true, msg: "Link sent"}):
                    res.status(400).send(resp)
                }
                return;
            }
        res.status(400).send(response)

    } catch (error) {
        console.log(error)
        res.status(400).send({success: false, msg: "serverside error", error: error.message})
    }
});

const separateName = (name: string) =>{
    const match = name.match(/^(\S+)\s+(\S+)$/);

    if (match) {
        const first_name = match[1];
        const last_name = match[2]; 
        return {first_name, last_name}
    } else {
        return {first_name: name, last_name: ""}
    }
}

export default router;