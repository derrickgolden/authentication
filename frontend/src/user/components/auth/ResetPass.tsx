import axios from 'axios';
import { useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { forgot_password_illus, forgot_pwd_2_illus, left_arrow, logo, show_hide } 
    from "../../../assets/images"
import { PersonDetails } from './types';

const ResetPassword: React.FC = () =>{
    const navigate = useNavigate()
    const {token} = useParams()

    console.log(token)

    const [signupDetails, setSignupDetails] = useState<PersonDetails>({
        email:"", password: "", confirm_password: ""
    })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const name = e.target.name
        const value = e.target.value
        setSignupDetails((obj) =>({...obj, [name]: value}))
    }
    const handleResetPassDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        const {password, confirm_password} = signupDetails;
        if(password !== confirm_password){
            alert("password does not match");
            return
        }

        // setToken(urltoken.replace(/_/g, '.'));

        let data = JSON.stringify(signupDetails);
        let config = {
            method: 'PATCH',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/user/reset-password',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            setSignupDetails((obj) =>({email:"", password: "", confirm_password: ""}))
            navigate('/user/login', {replace: true});
        })
        .catch((error) => {
            console.log(error.response.data);
            setSignupDetails((obj) =>({email:"", password: "", confirm_password: ""}))
            alert(`Error: ${error.response.data}`)
        });
    }
    return(
        <section className="log-reg forgot-pws reset-pws two land-pg">
        <div className="overlay pb-120">
            <div className="container">
                <div className="top-head-area">
                    <div className="row d-flex align-items-center">
                        <div className="col-sm-5 col">
                            <a className="back-home" href="index.html">
                                <img src={left_arrow} alt="image"/>
                                Back To Paylio
                            </a>
                        </div>
                        <div className="col-sm-5 col">
                            <a href="index.html">
                                <img src={logo} alt="image"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-5 d-flex align-items-end">
                        <div className="img-area">
                            <img src={forgot_pwd_2_illus} alt="image"/>
                        </div>
                    </div>
                    <div className="col-lg-6 z-1 text-center d-flex align-items-center">
                        <div className="form-box">
                            <div className="icon-area">
                                <img src={forgot_password_illus} alt="image"/>
                            </div>
                            <h4>Reset Your Password</h4>
                            <p>You can reset password using this form</p>
                            <form onSubmit={handleResetPassDetailsSubmit} action="#">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="single-input d-flex align-items-center">
                                            <input onChange={handleInputChange} required
                                            name="email" type="email" placeholder="Email"/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="single-input d-flex align-items-center">
                                            <input onChange={handleInputChange} required
                                            name='password' type="password" className="passInput" placeholder="Password"/>
                                            <img className="showPass" src={show_hide} alt="image"/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="single-input d-flex align-items-center">
                                            <input onChange={handleInputChange} required name='confirm_password'
                                            type="password" className="passInput" placeholder="Confirm Password"/>
                                            <img className="showPass" src={show_hide} alt="image"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-area">
                                    <button type="submit" className="cmn-btn">Reset Password</button>
                                </div>
                            </form>
                            <p className="back-login dont-acc">Go back to <Link to='http://localhost:5173/user/login'>Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default ResetPassword