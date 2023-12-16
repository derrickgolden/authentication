import { useNavigate } from "react-router-dom"

const LandingPage: React.FC = () =>{
    const navigate = useNavigate()
    return(
        <div>
            <h1>Landing Page...</h1>
            <button onClick={() => navigate("/user/login")} 
                type="button">Login</button>
            <button onClick={() => navigate("/user/signup")} 
                type="button">Signup</button>
        </div>
    )
}

export default LandingPage