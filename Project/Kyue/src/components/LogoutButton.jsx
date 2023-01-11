import { logout } from "../api";
import "./LogoutButton.css";

const LogoutButton = () => {
    const handleLogout = () => {
        logout();
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
