import LogoutButton from "./LogoutButton";
import "./Navbar.css";
import "../index.css";

const Navbar = ({ username }) => {
    return (
        <div className="navbar-wrapper">
            <nav className="navbar">
                <span className="crumb">Welcome {username || ""}</span>
                <span className="crumb">
                    <LogoutButton />
                </span>
            </nav>
        </div>
    );
};

export default Navbar;
