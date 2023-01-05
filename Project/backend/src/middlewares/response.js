module.exports = {
    sendResponse: (path) => (_, res) => {
        return res.send(res.locals[path])
    },
};
