const { query } = require("../api/db");
const { getUser } = require("../utils");
const utils = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        courses: null,
    };
    return next();
};

const courseExists = (boolean) => (req, res, next) => {
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

const updateCourseDescription = async (req, res, next) => {
    try {
        console.log('req.body.description :>> ', req.body.description);
        const pgResult = await query(
            `SELECT set_course_description('${req.params.courseId}', '${req.body.description}')`
        );
        res.locals.course = pgResult?.rows?.[0]?.set_course_description
        return next();
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const setCourseAdministrator = (boolean) => async (req, res, next) => {
    try {
        const user = req.body.userId || res.locals.user || null;
        if (!user)
            res.sendStatus(400);
        if (boolean) {
            await query(
                `INSERT INTO administrators VALUES ('${user.id}', '${req.body.courseId}')`
            );
        } else if (!boolean) {
            await query(
                `DELETE FROM administrators WHERE course_id='${req.body.courseId}' AND user_id='${user.id}'`
            );
        }
        return next();
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const isAdministrator = async (req, res, next) => {
    try {
        const user = res.locals.user || utils.getUser(req) || null;
        if (user?.role === "admin") return next();
        const pgResponse = await query(
            `SELECT * FROM administrators WHERE user_id='${user.id}' AND course_id='${req.body.courseId}'`
        );
        if (pgResponse?.rows?.length > 0) return next();

        return res.sendStatus(403);
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        await query(
            `DELETE FROM queue_item WHERE course_id='${req.body.courseId}'`
        );
        await query(
            `DELETE FROM administrators WHERE course_id='${req.body.courseId}'`
        );
        await query(`DELETE FROM courses WHERE id='${req.body.courseId}'`);
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const getCourses = async (req, res, next) => {
    try {
        const courses = await query(
            `SELECT courses.*,
                COALESCE (array_agg(administrators.user_id) 
                    filter (where administrators.user_id is not null), 
                    '{}') AS administrators
            FROM courses
            LEFT JOIN administrators ON administrators.course_id = id
            GROUP BY id;`
        );
        res.locals.courses = courses.rows;
        return next();
    } catch (error) {
        return res.sendStatus(500);
    }
};

const getCourse = async (req, res, next) => {
    try {
        const courseId = req.params.courseId || utils.getCourse(req).id;
        // Selects the course and the id's of all administrators
        const courses = await query(
            `SELECT courses.*,
                COALESCE (array_agg(administrators.user_id) 
                    filter (where administrators.user_id is not null), 
                    '{}') AS administrators
            FROM courses
            LEFT JOIN administrators ON administrators.course_id = id
            WHERE id='${courseId}'
            GROUP BY id;`
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

const checkCourseExist = async (req, res, next) => {
    try {
        const courseId = req.params.courseId || utils.getCourse(req).id;
        const courses = await query(
            `SELECT * FROM courses WHERE id='${courseId}'`
        );
        if (!courses?.rows[0]) {
            return res.status(404).send(`No course found with id ${courseId}`);
        }
        return next();
    } catch (error) {
        return res.sendStatus(500);
    }
};

const getCourseItems = async (req, res, next) => {
    try {
        const courseId = req.params.courseId || utils.getCourse(req).id;
        const courses = await query(
            `SELECT user_id, course_id, username, location, comment, status, queue_item.created_at
            FROM queue_item 
            INNER JOIN users ON users.id = user_id 
            WHERE course_id='${courseId}'
            ORDER BY queue_item.created_at;`
        );
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
    checkCourseExist,
    getCourseItems,
    updateCourseDescription,
};
