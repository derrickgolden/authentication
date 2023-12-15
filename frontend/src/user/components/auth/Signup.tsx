import axios from 'axios';
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { left_arrow, register_illus, show_hide, logo } from '../../../assets/images';

import { countries as countriesList } from 'countries-list'
import { CountriesData, SignupDetails } from './types';

const countries: CountriesData = countriesList;

const Signup = () =>{
    const navigate = useNavigate()

    const [signupDetails, setSignupDetails] = useState<SignupDetails>({
        last_name: "", first_name:"",email:"", remember_me: false, country: "US", password: "", phone:""
    })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        console.log(e)
        const name = e.target.name
        const value = e.target.value
        console.log(name, value);
        setSignupDetails((obj) =>({...obj, [name]: value}))
        console.log(signupDetails);
    }

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignupDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        console.log(signupDetails);
        const phone = "+" + countries[signupDetails.country].phone + signupDetails.phone
        let data = JSON.stringify({...signupDetails, phone});

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/user/signup',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(response.data);
            if(response.data.msg === "User Registered"){
                navigate('/user/login', {replace: true});
            }else{
                alert(response.data.msg)
            }
            // return redirect('user/login')
        })
        .catch((error) => {
            console.log(error);
            alert("Server side error")
            // setSignupDetails((obj) =>({...obj, password: ""}))
        });
    }
    return(
        <section className="log-reg register land-pg">
        <div className="overlay pb-120">
            <div className="container">
                <div className="top-head-area">
                    <div className="row d-flex align-items-center">
                        <div className="col-sm-5 col">
                            <Link className="back-home" to='http://localhost:5173/'>
                                <img src={left_arrow} alt="image"/>
                                Back To World Wire Pay
                            </Link>
                        </div>
                        <div className="col-sm-5 col">
                            <Link to='http://localhost:5173/'>
                                <img src={logo} alt="image"/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center ">
                    <div className="col-md-5">
                        <div className="img-area">
                            <img src={register_illus} alt="image"/>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-7 z-1 text-center ">
                        <div className="form-box">
                            <h4>Register with World Wire Pay</h4>
                            <p className="alr-acc dont-acc">Already have an account? <Link to='http://localhost:5173/user/login'>Log in now.</Link></p>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="personal-tab" data-bs-toggle="tab"
                                        data-bs-target="#personal" type="button" role="tab" aria-controls="personal"
                                        aria-selected="true">Personal</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="business-tab" data-bs-toggle="tab" data-bs-target="#business"
                                        type="button" role="tab" aria-controls="business"
                                        aria-selected="false">Business</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                                    <form onSubmit={handleSignupDetailsSubmit} action="#">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={(e) =>{handleInputChange(e)}} required
                                                    type="text" name="first_name" placeholder="First Name"/>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={(e) =>{handleInputChange(e)}} required
                                                    type="text" name="last_name" placeholder="Last Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <select style={{width: "100%"}}
                                                    onChange={handleInputChange} name='country' defaultValue="US" >
                                                        <option value="1">Select Your Country</option>
                                                        {Object.keys(countries).map((code, i) => (
                                                            <option key={code} value={code}>
                                                                {countries[code].name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <span style={{paddingRight: "5px"}}>+{countries[signupDetails.country].phone}</span>
                                                    <input onChange={handleInputChange} required
                                                    type="number" name="phone" className="phoneInput" placeholder="Phone Number">
                                                    </input>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} required
                                                    type="email" name="email" placeholder="Email"/>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} required
                                                    type={showPassword ? 'text' : 'password'}
                                                     name="password" className="passInput" placeholder="Password"/>
                                                    <img onClick={toggleShowPassword}
                                                        className="showPass" src={show_hide} alt="image"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="remember-forgot d-flex justify-content-between">                                          
                                            <div className="form-group d-flex">
                                                <div className="checkbox_wrapper" >
                                                    <input onChange={handleInputChange} name='remember_me'
                                                    checked = {signupDetails.remember_me} className="check-box" id="check1" type="checkbox"/>
                                                    <label></label>
                                                </div>
                                                <label htmlFor="check1"><span className="check_span">Remember Me</span></label>
                                            </div> 
                                            <div className="forget-pw">
                                                <Link to="http://localhost:5173/user/forgot-password">Forgot your password?</Link>
                                            </div>
                                        </div>
                                        
                                        <div className="btn-area">
                                            <button type="submit" className="cmn-btn">Register Now</button>
                                        </div>
                                    </form>
                                    <div className="bottom-area">
                                        <div className="continue"><p>Or continue with</p></div>
                                        <div className="login-with d-flex align-items-center">
                                            <Link to="#"><img src="assets/img/google.png" alt="image"/></Link>
                                            <Link to="#"><img src="assets/img/fb.png" alt="image"/></Link>
                                        </div>
                                    </div>
                                    <div className="privacy">
                                        <p>By registering you accept our <Link to="terms-conditions.html">Terms & Conditions</Link> and <Link to="privacy-policy.html">Privacy Policy</Link></p>
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

export default Signup;