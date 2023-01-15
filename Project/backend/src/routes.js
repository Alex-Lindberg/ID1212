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
        usersMiddleware.initLocals,
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
        authMiddleware.validateSession,
        responseMiddleware.sendResponse("user")
    );
    app.get(
        "/api/users/session",
        usersMiddleware.initLocals,
        usersMiddleware.getUser,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        responseMiddleware.sendResponse("user")
    );
};

const courseRoutes = (app) => {
    app.post(
        "/api/courses",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.courseExists(false),
        coursesMiddleware.createCourse,
        coursesMiddleware.setCourseAdministrator(true),
        responseMiddleware.sendResponse("courses")
    );
    app.delete(
        "/api/courses",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.courseExists(true),
        coursesMiddleware.isAdministrator,
        coursesMiddleware.deleteCourse,
        responseMiddleware.sendResponse("courses")
    );
    app.get(
        "/api/courses",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.getCourses,
        responseMiddleware.sendResponse("courses")
    );
    app.get(
        "/api/courses/:courseId",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.checkCourseExist,
        coursesMiddleware.getCourseItems,
        responseMiddleware.sendResponse("courses")
    );
    
    app.post(
        "/api/courses/:courseId/queue",
        queueMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        queueMiddleware.enqueue,
        responseMiddleware.sendResponse("queueItem")
    );
    app.delete(
        "/api/courses/:courseId/queue",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        queueMiddleware.dequeue,
        responseMiddleware.sendResponse("queueItem")
    );
    app.patch(
        "/api/courses/:courseId/queue/:queueItemId",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        queueMiddleware.setItem,
        responseMiddleware.sendResponse("queueItem")
    );
    app.post(
        "/api/courses/:courseId/admin",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.isAdministrator,
        coursesMiddleware.setCourseAdministrator(true),
        responseMiddleware.sendResponse("queue")
    );
    app.delete(
        "/api/courses/:courseId/admin",
        coursesMiddleware.initLocals,
        usersMiddleware.getUserByEmail,
        authMiddleware.getSession,
        authMiddleware.validateSession,
        coursesMiddleware.isAdministrator,
        coursesMiddleware.setCourseAdministrator(false),
        responseMiddleware.sendResponse("queue")
    );
};

const init = (app) => {
    userRoutes(app);
    courseRoutes(app);
};

module.exports = { init };
