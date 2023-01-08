import { useDispatch, useSelector } from "react-redux";
import { courseActions, fetchCourses } from "../reducers/courseReducer";

const useCourseState = () => {
    const courseState = useSelector((state) => state.courses);
    const dispatch = useDispatch();

    return {
        courses: {
            get courses() {
                return courseState?.courses
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
