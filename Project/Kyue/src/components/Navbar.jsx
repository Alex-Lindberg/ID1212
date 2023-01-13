import LogoutButton from "./LogoutButton";
import "./Navbar.css";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username }) => {
    const navigate = useNavigate();
    return (
        <div className="navbar-wrapper">
            <nav className="navbar">
                <div className="crumb">
                    <span className="nav-welcome">
                        Welcome {username || ""}
                    </span>
                    <a className="nav-menu-items" onClick={() => navigate("/")}>
                        Home
                    </a>
                    <a className="nav-menu-items">
                        About
                    </a>
                </div>
                <span className="crumb">
                    <LogoutButton />
                </span>
            </nav>
        </div>
    );
};

export default Navbar;
