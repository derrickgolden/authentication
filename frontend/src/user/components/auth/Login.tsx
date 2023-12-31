import axios from 'axios';
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from "react-router-dom";
import { fb, google, left_arrow, logo, show_hide } from '../../../assets/images';
import { setUserDetails } from '../../../redux/userDetails';
import { client_baseurl, server_baseurl } from '../../../baseUrl';
import { GoogleUser, GoogleUserProfile } from './types';
import { useGoogleLogin } from '@react-oauth/google';
import { googleSignup } from './controllers/googleAuth';

interface PersonDetails{ email: string; password: string; acc_type: string }
type UserAcc = "personal" | "business";

const Login: React.FC = () =>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ user, setUser ] = useState<{} | GoogleUser>({});
    const [ profile, setProfile ] = useState<GoogleUserProfile | null>(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            
            setUser(codeResponse)
        },
        onError: (error: any) => console.log('Login Failed:', error)
    });

    // google signin
    useEffect(() => {
        if ('access_token' in user) {
            googleSignup({user, setProfile, navigate, auth: "login"})
        }
    },[ user ]);

    const [acc_type, setAcc_type] =  useState<UserAcc>("personal");
    const [loginDetails, setLoginDetails] = useState<PersonDetails>({
        email:"", password: "", acc_type
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const name = e.target.name
        const value = e.target.value
        setLoginDetails((obj) =>({...obj, [name]: value}))
    }

    useEffect(()=>{
        setLoginDetails((obj) => ({...obj, acc_type}));
    }, [acc_type]);
    
    const handleLoginDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        // console.log(loginDetails);
        let data = JSON.stringify({...loginDetails, auth_with: "app"});

        fetch(`${server_baseurl}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
        })
        .then(response => response.json())
        .then(data => {
            console.log("login successful");
            if(data.success){
                sessionStorage.setItem("user", JSON.stringify(data?.details[0]));
                sessionStorage.setItem("userToken", JSON.stringify(data?.token));
                dispatch(setUserDetails(data?.details[0]));
                navigate('/user/dashboard', {replace: true});
            }else{
                return alert(data.msg)
            }
        })
        .catch(error => {
            console.log(error);
            setLoginDetails(obj => ({ ...obj, password: '' }));
            alert("Sorry, something went wrong")
        });
    }

    return(
    <section className="log-reg land-pg">
        <div className="overlay pb-120">
            <div className="container">
                <div className="top-head-area">
                    <div className="row d-flex align-items-center">
                        <div className="col-sm-5 col">
                            <Link className="back-home" to="/">
                                <img src={left_arrow} alt="image"/>
                                Back to World Wire Pay
                            </Link>
                        </div>
                        <div className="col-sm-5 col">
                            <Link to='http://localhost:5173/'>
                                <img src={logo} alt="image"/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center">
                        <div className="form-box">
                            <h4>Log in to World Wire Pay</h4>
                            <p className="dont-acc">Don't have an account? 
                                <Link to={`${client_baseurl}/user/signup`}>Register</Link>
                            </p>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button onClick={() => setAcc_type("personal")}
                                    className={`nav-link ${acc_type === "personal"? "active ": ""}`} id="personal-tab" 
                                        type="button" role="tab" aria-selected="true">Personal</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button onClick={() => setAcc_type("business")}
                                    className={`nav-link ${acc_type === "personal"? " ": "active "}`} id="business-tab" 
                                        type="button" role="tab" aria-selected="false">Business</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="personal" role="tabpanel" 
                                aria-labelledby="personal-tab">                                
                                    <form onSubmit={handleLoginDetailsSubmit} action="#">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} name='email' type="email" 
                                                    placeholder={acc_type === "personal"? "Email": "Business Email"}/>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} name='password'
                                                    type="password" className="passInput" placeholder="Password"/>
                                                    <img className="showPass" src={show_hide} alt="image"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-area">
                                            <button type='submit' className="cmn-btn">Log in</button>
                                        </div>
                                    </form>
                                    <div className="form-bottom">
                                        <div className="continue"><p>Or continue with</p></div>
                                        <div className="login-with d-flex align-items-center">
                                            <a onClick={() => login()}
                                            href="#"><img src={google} alt="image"/></a>
                                            <a href="#"><img src={fb} alt="image"/></a>
                                        </div>
                                        <div className="forget-pw">
                                            <Link to='http://localhost:5173/user/forgot-password'>
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default Login;