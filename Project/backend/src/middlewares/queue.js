const { query } = require("../api/db");
const { getSession } = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        user: null,
        course: null,
    };
    return next();
};

const enqueue = async (req, res, next) => {
    try {
        const succeeded = await query(
            `SELECT enqueue(
                '${res.locals.user.id}'::UUID,
                '${req.params.courseId}',
                '${req.body.location}', 
                '${req.body.comment}')`
        );
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const dequeue = async (req, res, next) => {
    try {
    } catch (error) {
        console.error("error :>> ", error);
        return res.send(500);
    }
};

const setItem = async (req, res, next) => {
    try {
        const comment = req.body.comment ? `'${req.body.comment}'` : null;
        const status = req.body.status ? `'${req.body.status}'` : null;
        const location = req.body.location ? `'${req.body.location}'` : null;
        const pgResponse = await query(
            `UPDATE queue_item SET 
                comment= COALESCE (${comment}, comment),
                status= COALESCE (${status}, status),
                location= COALESCE (${location}, location)
            WHERE id='${req.params.queueItemId}'::UUID RETURNING queue_item;`
        );
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.send(500);
    }
};

module.exports = {
    initLocals,
    enqueue,
    dequeue,
    setItem,
};
