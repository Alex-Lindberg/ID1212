import axios from "axios";
import routes from "../localization/routes";

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
            .get(`${routes.HTTP_API}/api/courses`, config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const getCourseItems = async ({ courseId, user }) => {
    try {
        if (!user || !courseId) return;
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user),
                sessionId: user.sessionId,
            },
        };
        return axios
            .get(`${routes.HTTP_API}/api/courses/${courseId}`, config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const createCourse = async ({courseId, title, user}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user),
                sessionId: user.sessionId,
            },
        };
        return axios
            .post(`${routes.HTTP_API}/api/courses`, {
                courseId: courseId,
                title: title,
            }, config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (err) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
};
