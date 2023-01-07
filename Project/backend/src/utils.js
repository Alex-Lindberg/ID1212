module.exports = {
    getUser: (req) => {
        return req.headers?.user ? JSON.parse(req.headers?.user) : null;
    },
    getSession: (req) => {
        const getSessionId = (user) => {
            if (user && JSON.parse(user)?.sessionId)
                return JSON.parse(user)?.sessionId;
        };
        return getSessionId(req.headers?.user) || JSON.parse(req.headers?.sessionid || "{}");
    },
    getCourse: (req) => {
        return req.headers?.course ? JSON.parse(req.headers?.course) : null;
    },
};
