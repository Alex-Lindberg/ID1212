module.exports = {
    getUser: (req) => JSON.parse(req.headers).user,
    getCourse: (req) => JSON.parse(req.headers).course,
};
