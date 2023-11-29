import axios from 'axios';
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { left_arrow, register_illus, show_hide, logo } from '../../../assets/images';

import { countries } from 'countries-list'

const Signup = () =>{
    const navigate = useNavigate()

    const [signupDetails, setSignupDetails] = useState({
        last_name: "", first_name:"",email:"", remember_me: false, country: "US", password: "", phone:""
    })
    const handleInputChange = (e) =>{
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

    const handleSignupDetailsSubmit = (e) =>{
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
        <section class="log-reg register land-pg">
        <div class="overlay pb-120">
            <div class="container">
                <div class="top-head-area">
                    <div class="row d-flex align-items-center">
                        <div class="col-sm-5 col">
                            <Link class="back-home" to='http://localhost:5173/'>
                                <img src={left_arrow} alt="image"/>
                                Back To World Wire Pay
                            </Link>
                        </div>
                        <div class="col-sm-5 col">
                            <Link to='http://localhost:5173/'>
                                <img src={logo} alt="image"/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center align-items-center ">
                    <div class="col-md-5">
                        <div class="img-area">
                            <img src={register_illus} alt="image"/>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-7 z-1 text-center ">
                        <div class="form-box">
                            <h4>Register with World Wire Pay</h4>
                            <p class="alr-acc dont-acc">Already have an account? <Link to='http://localhost:5173/user/login'>Log in now.</Link></p>
                            {/* <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="personal-tab" data-bs-toggle="tab"
                                        data-bs-target="#personal" type="button" role="tab" aria-controls="personal"
                                        aria-selected="true">Personal</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="business-tab" data-bs-toggle="tab" data-bs-target="#business"
                                        type="button" role="tab" aria-controls="business"
                                        aria-selected="false">Business</button>
                                </li>
                            </ul> */}
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                                    <form onSubmit={handleSignupDetailsSubmit} action="#">
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="single-input d-flex align-items-center">
                                                    <input onChange={(e) =>{handleInputChange(e)}} required
                                                    type="text" name="first_name" placeholder="First Name"/>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="single-input d-flex align-items-center">
                                                    <input onChange={(e) =>{handleInputChange(e)}} required
                                                    type="text" name="last_name" placeholder="Last Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="single-input d-flex align-items-center">
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

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="single-input d-flex align-items-center">
                                                    <span style={{paddingRight: "5px"}}>+{countries[signupDetails.country].phone}</span>
                                                    <input onChange={handleInputChange} required
                                                    type="number" name="phone" class="phoneInput" placeholder="Phone Number">
                                                    </input>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} required
                                                    type="email" name="email" placeholder="Email"/>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} required
                                                    type={showPassword ? 'text' : 'password'}
                                                     name="password" class="passInput" placeholder="Password"/>
                                                    <img onClick={toggleShowPassword}
                                                        class="showPass" src={show_hide} alt="image"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="remember-forgot d-flex justify-content-between">
{/*                                             
                                            <div class="form-group d-flex">
                                                <div class="checkbox_wrapper" >
                                                    <input onChange={handleInputChange} name='remember_me'
                                                    checked = {signupDetails.remember_me} class="check-box" id="check1" type="checkbox"/>
                                                    <label></label>
                                                </div>
                                                <label for="check1"><span class="check_span">Remember Me</span></label>
                                            </div> */}
                                            <div class="forget-pw">
                                                <Link to="http://localhost:5173/user/forgot-password">Forgot your password?</Link>
                                            </div>
                                        </div>
                                        
                                        <div class="btn-area">
                                            <button type="submit" class="cmn-btn">Register Now</button>
                                        </div>
                                    </form>
                                    {/* <div class="bottom-area">
                                        <div class="continue"><p>Or continue with</p></div>
                                        <div class="login-with d-flex align-items-center">
                                            <Link href="javascript:void(0)"><img src="assets/img/google.png" alt="image"/></Link>
                                            <Link href="javascript:void(0)"><img src="assets/img/fb.png" alt="image"/></Link>
                                        </div>
                                    </div> */}
                                    <div class="privacy">
                                        <p>By registering you accept our <Link href="terms-conditions.html">Terms & Conditions</Link> and <Link href="privacy-policy.html">Privacy Policy</Link></p>
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