module.exports = {
    getUser: (req) => JSON.parse(req.headers).user,
};
