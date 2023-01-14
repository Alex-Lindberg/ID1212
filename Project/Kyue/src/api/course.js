import axios from "axios";

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

export const getCourseItems = async ({ courseId, user }) => {
    try {
        console.log('courseId :>> ', courseId);
        if (!user || !courseId) return;
        console.log('Fuck you');
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user),
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
