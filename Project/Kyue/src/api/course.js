import axios from "axios";
import useUserState from "../hooks/useUserState";

export const getCourses = async (user) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user.currentUser),
                sessionId: user.sessionId,
            },
        };
        return axios
            .get("http://localhost:3000/api/courses", config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const getCourseItems = async (courseId, user) => {
    try {
        if (!user) return;
        if (!courseId) return;
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user.currentUser),
                sessionId: user.sessionId,
            },
        };
        return axios
            .get(`http://localhost:3000/api/courses/${courseId}`, config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};
