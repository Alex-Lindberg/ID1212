const { query } = require("../api/db");
const utils = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        courses: null,
    };
    return next();
};

const courseExists = (boolean) => (req, res, next) => {
    if (!!res.locals.courses !== boolean && getCourse(req).id) {
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
        return res.send(500);
    }
};

const deleteCourse = (req, res, next) => {
    return res.send(501);
};

const getCourses = async (req, res, next) => {
    try {
        const courses = await query(`SELECT * FROM courses`);
        return res.status(200).send(courses.rows);
    } catch (error) {
        return res.send(500);
    }
};

const getCourse = async (req, res, next) => {
    try {
        const courseId = req.params.courseId || utils.getCourse(req).id;
        const courses = await query(
            `SELECT * FROM courses WHERE id='${courseId}'`
        );
        if (!courses?.rows[0]) {
            return res.status(404).send(`No course found with id ${courseId}`);
        }
        return res.status(200).send(courses.rows);
    } catch (error) {
        return res.send(500);
    }
};

module.exports = {
    initLocals,
    createCourse,
    deleteCourse,
    getCourse,
    getCourses,
    courseExists,
};
