const { query } = require("../api/db");
const utils = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        courses: null,
    };
    return next();
};

const courseExists = (boolean) => (req, res, next) => {
    console.log("req.body :>> ", req.body);
    if (!!res.locals.courses !== boolean && !!req.body.courseId !== boolean) {
        if (req.method === "POST" && req.url === "/api/courses") {
            return res.status(303).send(`Course already exists`);
        }
        return res.sendStatus(404);
    }
    return next();
};

const createCourse = async (req, res, next) => {
    try {
        const course = await query(
            `SELECT create_course('${req.body.courseId}', '${req.body.title}')`
        );
        if (!course?.rows[0].create_course)
            return res.status(303).send("Course already exists");
        res.locals.courses = [
            ...(res?.locals?.courses || []),
            course?.rows[0]?.create_course,
        ];
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const setCourseAdministrator = (boolean) => async (req, res, next) => {
    try {
        console.log('res.body :>> ', req.body);
        if (boolean) {
            await query(
                `INSERT INTO administrators VALUES ('${req.body.userId}', '${req.body.courseId}')`
            );
        } else if (!boolean) {
            await query(
                `DELETE FROM administrators WHERE course_id='${req.body.courseId}' AND user_id='${req.body.userId}'`
            );
        }
        return next();
    } catch (error) {
        console.log('error :>> ', error);
        return res.sendStatus(500);
    }
};

const isAdministrator = async (req, res, next) => {
    try {
        const user = res.locals.user.id || utils.getUser(req)?.id || null;
        if (user?.role === "administrator") return next();
        const pgResponse = await query(
            `SELECT * FROM administrators WHERE user_id='${user}' AND course_id='${req.body.courseId}'`
        );
        if (pgResponse?.rows?.length > 0) return next();
        return res.sendStatus(403);
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        console.log("req.body.courseId :>> ", req.body.courseId);
        await query(
            `DELETE FROM queue_item WHERE course_id='${req.body.courseId}'`
        );
        await query(
            `DELETE FROM administrators WHERE course_id='${req.body.courseId}'`
        );
        await query(`DELETE FROM courses WHERE id='${req.body.courseId}'`);
        return next();
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const getCourses = async (req, res, next) => {
    try {
        const courses = await query(`SELECT * FROM courses`);
        res.locals.courses = courses.rows;
        return next();
    } catch (error) {
        return res.sendStatus(500);
    }
};

const getCourse = async (req, res, next) => {
    try {
        const courseId = req.body.courseId || utils.getCourse(req).id;
        const courses = await query(
            `SELECT * FROM courses WHERE id='${courseId}'`
        );
        if (!courses?.rows[0]) {
            return res.status(404).send(`No course found with id ${courseId}`);
        }
        res.locals.courses = courses.rows;
        return next();
    } catch (error) {
        return res.sendStatus(500);
    }
};

module.exports = {
    initLocals,
    createCourse,
    deleteCourse,
    getCourse,
    getCourses,
    courseExists,
    setCourseAdministrator,
    isAdministrator,
};
