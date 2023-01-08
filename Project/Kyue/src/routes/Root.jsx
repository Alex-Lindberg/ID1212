import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import useUserState from "../hooks/useUserState";
import "../index.css";
import "./Root.css";
import Searchbar from "../components/Searchbar";

const Root = () => {
    const location = useLocation();
    // const user = JSON.parse(localStorage.getItem("user"));
    const user = useUserState()?.user;

    useEffect(() => {
        // const user = JSON.parse(localStorage.getItem("user"));
        if (location.pathname === "/login" && user?.isAuthenticated) {
            window.location.pathname = "/courses";
        } else if (location.pathname !== "login" && !user?.isAuthenticated) {
            window.location.pathname = "/login";
        }
    }, [user, location.pathname]);


    return (
        <div style={{ position: "relative" }} className="root-page">
            <Navbar username={user.currentUser.username} />
            <div className="list-header">
                <div>Courses</div>
                <Searchbar />
            </div>
            <div id="course-list-wrapper">
                {[...Array(10).keys()].map((i) => {
                    return (
                        <div key={i} className="course-item">
                            <p>Lots of rows of text</p>
                            <p>Lots of rows of text</p>
                        </div>
                    );
                })}
            </div>
            <div className="footer-wrapper">
                <footer className="page-footer">
                    <hr />
                </footer>
            </div>
        </div>
    );
};

export default Root;
