import { useNavigate } from "react-router-dom"

const UserDashboard: React.FC = () =>{
    const navigate = useNavigate()
    const handleLogOut = () =>{
        sessionStorage.clear();
        navigate("/")
    }
    return(
        <div>
           <h2>User Dashboard</h2> 
           <button onClick={handleLogOut} type="button">Log Out</button>
        </div>
    )
}

export default UserDashboard;