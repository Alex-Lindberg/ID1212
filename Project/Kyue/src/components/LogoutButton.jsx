import { useEffect } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUserState from "../hooks/useUserState";
import { persistor } from "../store";
import "./LogoutButton.css";

const LogoutButton = () => {
    const { user } = useUserState();
    const navigate = useNavigate();
    const handleLogout = () => {
        user.logout(user);
    };
    useEffect(() => {
        if (!user.isLoading && !user?.currentUser) {
            persistor.purge().then(() => navigate("/login"));
        }
    }, [user.currentUser]);

    return (
        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
