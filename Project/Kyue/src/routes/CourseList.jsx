import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as PlusCircleSvg } from "../assets/plusCircle.svg";
import {
    Navbar,
    Searchbar,
    AsyncDataWrapper,
    CreateCourseForm,
    MessageBox,
} from "../components";
import {
    useUserState,
    useCourseState,
    useQueueState,
    useMessageBox,
} from "../hooks";
import "../index.css";
import "./CourseList.css";

const CourseList = () => {
    const { user } = useUserState();
    const { courses } = useCourseState();
    const { queue } = useQueueState();

    // const [boxText, boxActive, setBoxText] = useMessageBox(5000, 1000);
    const [filteredList, setFilteredList] = useState([]);

    const [newCourseId, setNewCourseId] = useState("");
    const [newCourseTitle, setNewCourseTitle] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const submitNewCourse = () => {
        if (!user?.currentUser || !courses?.courses) return;
        if (newCourseId === "" || newCourseTitle === "") return;
        console.log("newCourse :>> ", {
            courseId: newCourseId,
            title: newCourseTitle,
            user: user.currentUser,
        });
        if (
            courses.courses.filter(
                (item) =>
                    item.id.toLowerCase().includes(newCourseId.toLowerCase()) ||
                    item.title
                        .toLowerCase()
                        .includes(newCourseTitle.toLowerCase())
            ).length > 0
        ) {
            console.log("Course already exists");
            setBoxText("Course already exists");
            return;
        }
        courses.createCourse({
            courseId: newCourseId,
            title: newCourseTitle,
            user: user.currentUser,
        });
        setNewCourseId("");
        setNewCourseTitle("");
        setShowMenu(false);
    };

    useEffect(() => {
        if (courses?.courses) setFilteredList(courses?.courses);
    }, [courses?.courses]);

    useEffect(() => {
        if (user.currentUser) {
            courses.fetchCourses(user);
        }
    }, [user.currentUser]);

    useEffect(() => {
        queue.setQueue([]);
    }, []);

    return (
        <div style={{ position: "relative" }} className="root-page">
            <Navbar username={user?.currentUser?.username} />
            <AsyncDataWrapper data={courses?.courses} error={courses?.error}>
                {/* <MessageBox
                    className="message-box"
                    boxActive={boxActive}
                    boxText={boxText}
                /> */}
                <div className="list-header">
                    <div>
                        <span>Courses</span>
                        <button
                            className="add-course-button"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <PlusCircleSvg />
                        </button>
                    </div>
                    <Searchbar
                        list={courses?.courses}
                        setFilteredList={setFilteredList}
                    />
                </div>
                {showMenu && (
                    <CreateCourseForm
                        showMenu={showMenu}
                        setCourseId={setNewCourseId}
                        setCourseTitle={setNewCourseTitle}
                        submitNewCourse={submitNewCourse}
                    />
                )}
                <div id="course-list-wrapper">
                    {filteredList.map((course, i) => {
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
                    })}
                </div>
                <div className="footer-wrapper">
                    <footer className="page-footer">
                        <hr />
                    </footer>
                </div>
            </AsyncDataWrapper>
        </div>
    );
};

export default CourseList;
