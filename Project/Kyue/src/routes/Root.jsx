import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useUserState from "../hooks/useUserState";
import "../index.css";
import "./Root.css";
import Searchbar from "../components/Searchbar";
import useCourseState from "../hooks/useCourseState";
import AsyncDataWrapper from "../components/AsyncDataWrapper";
import { Link } from "react-router-dom";

const Root = () => {
    const { user } = useUserState();
    const { courses } = useCourseState();

    useEffect(() => {
        courses.fetchCourses();
    }, []);

    return (
        <AsyncDataWrapper data={courses?.courses} error={courses?.error}>
            <div style={{ position: "relative" }} className="root-page">
                <Navbar username={user.currentUser.username} />
                <div className="list-header">
                    <div>Courses</div>
                    <Searchbar />
                </div>
                <div id="course-list-wrapper">
                    {!courses ||
                    (courses?.courses === null &&
                        courses.courses === undefined) ? (
                        <div>Error?</div>
                    ) : (
                        courses.courses.map((course, i) => {
                            return (
                                <Link
                                    key={i}
                                    to={`${course.id}`}
                                    className="course-item"
                                >
                                    <div>
                                        <span>{course.id + " "}</span>
                                        <span>{course.title}</span>
                                    </div>
                                    <div>{course.status}</div>
                                </Link>
                            );
                        })
                    )}
                </div>
                <div className="footer-wrapper">
                    <footer className="page-footer">
                        <hr />
                    </footer>
                </div>
            </div>
        </AsyncDataWrapper>
    );
};

export default Root;
