module.exports = {
    getUser: (req) => {
        return req.headers?.user ? JSON.parse(req.headers?.user) : null
    },
    getSession: (req) => {
        return JSON.parse(req.headers?.sessionid) || null
    },
    getCourse: (req) => {
        return req.headers?.course ? JSON.parse(req.headers?.course) : null
    },
};
