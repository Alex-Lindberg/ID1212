const usersMiddleware = require("./middlewares/users");
const responseMiddleware = require("./middlewares/response");
const authMiddleware = require("./middlewares/authentication");
const coursesMiddleware = require("./middlewares/courses");
const queueMiddleware = require("./middlewares/queue");

const userRoutes = (app) => {
    app.post(
        "/api/users",
        usersMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        usersMiddleware.userExists(false),
        usersMiddleware.createUser,
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

    app.get(
        "/api/users/:userId",
        usersMiddleware.initLocals,
        usersMiddleware.getUser,
        authMiddleware.getSession,
        responseMiddleware.sendResponse("user")
    );
};

const queueRoutes = (app) => {
    app.post("/api/courses/createCourse", coursesMiddleware.createCourse);
    app.post("/api/courses/deleteCourse", coursesMiddleware.deleteCourse);
    app.post("/api/courses/:courseId/enqueue", queueMiddleware.enqueue);
    app.post("/api/courses/:courseId/dequeue", queueMiddleware.dequeue);

    app.put(
        "/api/courses/:courseId/updateStatus",
        queueMiddleware.updateStatus
    );
    app.put(
        "/api/courses/:courseId/updateLocation",
        queueMiddleware.updateLocation
    );
    app.put(
        "/api/courses/:courseId/updateComment",
        queueMiddleware.updateComment
    );

    app.get("/api/courses", coursesMiddleware.getCourses);
    app.get("/api/courses/:courseId", coursesMiddleware.getCourse);
};

const init = (app) => {
    userRoutes(app);
    queueRoutes(app);
};

module.exports = { init };
