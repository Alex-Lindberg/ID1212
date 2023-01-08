import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import useUserState from "../hooks/useUserState";
import "../index.css";
import "./Root.css";
import Searchbar from "../components/Searchbar";
import useCourseState from "../hooks/useCourseState";

const Root = () => {
    const location = useLocation();

    const { user } = useUserState();
    const { courses } = useCourseState();

    useEffect(() => {
        if (location.pathname === "/login" && user?.isAuthenticated) {
            window.location.pathname = "/";
        } else if (location.pathname !== "login" && !user?.isAuthenticated) {
            window.location.pathname = "/login";
        }
    }, [user, location.pathname]);

    useEffect(() => {
        courses.fetchCourses()
    }, []);
    if(!courses.courses)
        return (<div>text</div>)
    return (
        <div style={{ position: "relative" }} className="root-page">
            <Navbar username={user.currentUser.username} />
            <div className="list-header">
                <div>Courses</div>
                <Searchbar />
            </div>
            <div id="course-list-wrapper">
                {courses.courses !== undefined || courses.courses !== null ? (
                    courses?.courses.map((course, i) => {
                        return (
                            <div key={i} className="course-item">
                                <div>
                                    <span>{course.id}</span>
                                    <span>{course.title}</span>
                                </div>
                                <div>{course.status}</div>
                            </div>
                        );
                    })
                ) : (
                    <div>Error</div>
                )}
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
