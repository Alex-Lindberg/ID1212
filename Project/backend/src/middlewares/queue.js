const { query } = require("../api/db");

const enqueue = (req, res, next) => {
    return res.send(501);
};

const dequeue = (req, res, next) => {
    return res.send(501);
};

const updateComment = (req, res, next) => {
    return res.send(501);
};

const updateStatus = (req, res, next) => {
    return res.send(501);
};

const updateLocation = (req, res, next) => {
    return res.send(501);
};

module.exports = {
    enqueue,
    dequeue,
    updateComment,
    updateLocation,
    updateStatus,
};
