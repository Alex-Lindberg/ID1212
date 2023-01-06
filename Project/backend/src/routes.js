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
    app.post(
        "/api/courses",
        coursesMiddleware.initLocals,
        coursesMiddleware.courseExists(false),
        coursesMiddleware.createCourse,
        responseMiddleware.sendResponse("courses")
    );
    app.delete(
        "/api/courses",
        coursesMiddleware.initLocals,
        coursesMiddleware.courseExists(true),
        coursesMiddleware.deleteCourse,
        responseMiddleware.sendResponse("courses")
    );
    app.post(
        "/api/courses/:courseId/enqueue",
        coursesMiddleware.initLocals,
        queueMiddleware.enqueue
    );
    app.post(
        "/api/courses/:courseId/dequeue",
        coursesMiddleware.initLocals,
        queueMiddleware.dequeue
    );

    app.put(
        "/api/courses/:courseId/updateStatus",
        coursesMiddleware.initLocals,
        queueMiddleware.updateStatus
    );
    app.put(
        "/api/courses/:courseId/updateLocation",
        coursesMiddleware.initLocals,
        queueMiddleware.updateLocation
    );
    app.put(
        "/api/courses/:courseId/updateComment",
        coursesMiddleware.initLocals,
        queueMiddleware.updateComment
    );

    app.get(
        "/api/courses",
        coursesMiddleware.initLocals,
        coursesMiddleware.getCourses,
        responseMiddleware.sendResponse("courses")
    );
    app.get(
        "/api/courses/:courseId",
        coursesMiddleware.initLocals,
        coursesMiddleware.getCourse,
        responseMiddleware.sendResponse("courses")
    );
};

const init = (app) => {
    userRoutes(app);
    queueRoutes(app);
};

module.exports = { init };
