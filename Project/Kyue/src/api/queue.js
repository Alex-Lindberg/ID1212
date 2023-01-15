import axios from "axios";

export const enqueue = async ({ user, courseId, location, comment }) => {
    try {
        console.log("courseId, :>> ", courseId);
        if (!user || !courseId) return;
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user),
                sessionId: user.sessionId,
            },
        };
        const body = {
            location: location,
            comment: comment,
        };
        return axios
            .post(
                `http://localhost:3000/api/courses/${courseId}/queue`,
                body,
                config
            )
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const dequeue = async ({ user, courseId }) => {
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
            .delete(
                `http://localhost:3000/api/courses/${courseId}/queue`,
                config
            )
            .then(({ data }) => {
                return { data: data, userId: user.id, courseId: courseId };
            })
            .catch(console.error);
    } catch (err) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
};

export const updateQueueItem = async ({ courseId, user }) => {
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
            .put(`http://localhost:3000/api/courses/${courseId}/queue`, config)
            .then(({ data }) => {
                return data;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};
