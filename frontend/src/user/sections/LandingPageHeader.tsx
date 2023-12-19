import { Link } from "react-router-dom";
import { logo } from "../../assets/images";
import { client_baseurl } from "../../baseUrl";

const LandingPageHeader = () =>{
    return(
        <header className="header-section land-pg">
        <div className="overlay">
            <div className="container">
                <div className="row d-flex header-area">
                    <nav className="navbar d-flex navbar-expand-lg navbar-dark">
                        <Link className="navbar-brand" to={client_baseurl}>
                            <img src={logo} className="logo" alt="logo"/>
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-label="Toggle navigation">
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                            
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </header>
    )
}

export default LandingPageHeader;