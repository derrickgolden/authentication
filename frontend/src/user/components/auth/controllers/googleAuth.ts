import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { GoogleUser, GoogleUserProfile } from '../types';
import { server_baseurl } from '../../../../baseUrl';

interface Props {
    user: GoogleUser;
    setProfile: React.Dispatch<React.SetStateAction<GoogleUserProfile | null>>;
    navigate: (to: string, options?: { replace?: boolean }) => void;
    auth: "login" | "signup";
}

function googleSignup({user, setProfile, navigate, auth}: Props) {
    axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
            }
        })
        .then((res) => {
            console.log(res.data);
            setProfile(res.data);

            const data = JSON.stringify({...res.data, auth_with: "google"});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${server_baseurl}/user/${auth==="login"?"login":"signup"}`,
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
                }else if(response.data.success && response.data.msg === "User Found"){
                    navigate("/user/dashboard", {replace: true})
                }
                else{
                    alert(response.data.msg)
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Server side error")
            });
        })
        .catch((err) => console.log(err));
    }

export {
    googleSignup
}