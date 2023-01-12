import axios from "axios";
import useUserState from "../hooks/useUserState";

export const getCourses = async () => {
    try {
        const { user } = useUserState();
        if (!user?.currentUser) {
            window.location.pathname = "/login";
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user.currentUser),
                sessionId: user.sessionId
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

export const getCourseItems = async (courseId) => {
    try {
        const { user } = useUserState();
        if (!user?.currentUser) {
            window.location.pathname = "/login";
        }
        if (!courseId) return;
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user.currentUser),
                sessionId: user.sessionId
            },
        };
        return axios
            .get(`http://localhost:3000/api/courses/${courseId}`, config)
            .then(({ data }) => {
                return data;
            })
            .catch(() => {
                console.log('No data found');
                return []
            });
    } catch (error) {
        console.error(error);
    }
};
