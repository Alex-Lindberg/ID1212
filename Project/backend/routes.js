const usersMiddleware = require("./middlewares/users");
const responseMiddleware = require("./middlewares/response");
const authMiddleware = require("./middlewares/authentication");

const init = (app) => {
    // creating user
    app.post(
        "/api/users",
        usersMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        usersMiddleware.userExists(false),
        usersMiddleware.createUser,
        responseMiddleware.sendResponse("user")
        // set session etc.
        // authMiddleware.setToken()
    );
    // fetching user by id
    app.get(
        "/api/users/:userId",
        usersMiddleware.initLocals,
        usersMiddleware.getUser,
        responseMiddleware.sendResponse("user")
    );
    app.post(
        "/api/login",
        usersMiddleware.getUserByEmail,
        usersMiddleware.userExists(true),
        authMiddleware.validateCredentials,
        authMiddleware.login,
        responseMiddleware.sendResponse("user")
    );
    app.post(
        "/api/logout",
        usersMiddleware.getUserByEmail,
        usersMiddleware.userExists(true),
        authMiddleware.logout,
        responseMiddleware.sendResponse("user")
    );
};

module.exports = { init };
