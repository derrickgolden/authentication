import { Link } from "react-router-dom"
import { forgot_password_illus, left_arrow, logo } from "../../../assets/images"

import axios from 'axios';
import { useState } from "react";

const ForgotPassword = () =>{
    const [emailDetails, setEmailDetails] = useState({email:""})

    const handleInputChange = (e) =>{
        const value = e.target.value
        setEmailDetails({email: value})
    }
    const handleEmailDetailsSubmit = (e) =>{
        e.preventDefault()
        
        const {password, confirm_password} = emailDetails;
        if(password !== confirm_password){
            alert("password does not match");
            return
        }

        let data = JSON.stringify(emailDetails);
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/user/forgot-password',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            alert("Link sent to your email, use the link to reset your password")
        })
        .catch((error) => {
            console.log(error.response.data);
            alert(`Error: ${error.response.data.msg}`)
        });
    }
    return(
        <section className="log-reg forgot-pws land-pg">
        <div className="overlay pb-120">
            <div className="container">
                <div className="top-head-area">
                    <div className="row d-flex align-items-center">
                        <div className="col-sm-5 col">
                            <Link className="back-home" to="http://localhost:5173">
                                <img src={left_arrow} alt="image"/>
                                Back To Paylio
                            </Link>
                        </div>
                        <div className="col-sm-5 col">
                            <Link to="http://localhost:5173">
                                <img src={logo} alt="image"/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center">
                        <div className="form-box">
                            <div className="icon-area">
                                <img src={forgot_password_illus} alt="image"/>
                            </div>
                            <h4>Forgot your password?</h4>
                            <p>To reset your password, enter the email address that you used to set up your Paylio account. We'll send you a link to help you get back into your account.</p>
                            <form onSubmit={handleEmailDetailsSubmit} action="#">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="single-input d-flex align-items-center">
                                            <input onChange={handleInputChange} type="email" placeholder="Email"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-area">
                                    <button type="submit" className="cmn-btn">Recover Password</button>
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

export default ForgotPassword