import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

import "./Root.css";

function Root() {
    const location = useLocation();
    //@ts-ignore
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        //@ts-ignore
        const user = JSON.parse(localStorage.getItem("user"));
        console.log('location.pathname :>> ', location.pathname);
        if (
            (location.pathname === "/login" ||
                location.pathname === "/signup") &&
            user
        ) {
            window.location.pathname = "/home";
        } else if (
            location.pathname !== "login" &&
            location.pathname !== "/signup" &&
            !user
        ) {
            window.location.pathname = "/login";
        }
    }, [user, location.pathname]);

    return (
        <div className="Root">
            <h1>Sug min Jarak bitch</h1>
            <LogoutButton />
        </div>
    );
}

export default Root;
