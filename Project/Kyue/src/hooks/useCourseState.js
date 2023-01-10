import { useDispatch, useSelector } from "react-redux";
import { courseActions, fetchCourses } from "../reducers/courseReducer";

const useCourseState = () => {
    const courseState = useSelector((state) => state.courseState);
    const dispatch = useDispatch();

    return {
        courses: {
            get courses() {
                // const localCourses = localStorage.getItem("courses")
                // return  localCourses ? JSON.parse(localCourses) : []
                return courseState.courses
            },
            get error() {
                return courseState.error !== "" ? courseState.error : ""
            },
            setCourses: (courses) => {
                dispatch(courseActions.setCourses(courses))
            },
            fetchCourses: () => {
                dispatch(fetchCourses())
            }
        },
    };
};

export default useCourseState;
