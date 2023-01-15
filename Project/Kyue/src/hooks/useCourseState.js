import { useDispatch, useSelector } from "react-redux";
import { courseActions, createCourse, fetchCourses } from "../reducers/courseReducer";

const useCourseState = () => {
    const courseState = useSelector((state) => state.courseState);
    const dispatch = useDispatch();

    return {
        courses: {
            get courses() {
                return courseState.courses
            },
            get error() {
                return courseState.error !== "" ? courseState.error : ""
            },
            setCourses: (courses) => {
                dispatch(courseActions.setCourses(courses))
            },
            fetchCourses: (user) => {
                dispatch(fetchCourses(user))
            },
            createCourse: (params) => {
                dispatch(createCourse(params))
            }
        },
    };
};

export default useCourseState;
