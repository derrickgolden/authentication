import axios from 'axios';
import { useState } from "react";
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from "react-router-dom";
import { left_arrow, logo, show_hide } from '../../../assets/images';
import { setUserDetails } from '../../../redux/userDetails';
import { server_baseurl } from '../../../baseUrl';

interface PersonDetails{
    email: string,
    password: string,
}

const ALogin: React.FC = () =>{
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginDetails, setLoginDetails] = useState<PersonDetails>({
        email:"", password: "",
    })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const name = e.target.name
        const value = e.target.value
        setLoginDetails((obj) =>({...obj, [name]: value}))
    }
    const handleLoginDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        // console.log(loginDetails);
        let data = JSON.stringify(loginDetails);

        fetch(`${server_baseurl}/admin/login`, {
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
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">                                
                                    <form onSubmit={handleLoginDetailsSubmit} action="#">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="single-input d-flex align-items-center">
                                                    <input onChange={handleInputChange} name='email'
                                                    type="email" placeholder="Email"/>
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

export default ALogin;