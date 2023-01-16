import axios from "axios";
import routes from "../localization/routes";

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
                `${routes.HTTP_API}/api/courses/${courseId}/queue`,
                body,
                config
            )
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
            .delete(`${routes.HTTP_API}/api/courses/${courseId}/queue`, config)
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

const formatUpdateItemBody = (userToUpdate, location, comment, status) => {
    return Object.assign(
        {
            userId: userToUpdate,
            status: status,
        },
        location === null ? null : { location: location },
        comment === null ? null : { comment: comment }
    );
};

export const updateQueueItem = async ({
    courseId,
    user,
    userToUpdate,
    location,
    comment,
    status,
}) => {
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
            .patch(
                `${routes.HTTP_API}/api/courses/${courseId}/queue`,
                formatUpdateItemBody(userToUpdate, location, comment, status),
                config
            )
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
