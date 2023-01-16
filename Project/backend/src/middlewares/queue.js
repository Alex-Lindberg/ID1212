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
        if (!req.params.courseId || !req.body.location || !req.body.comment)
            return res.sendStatus(400);
        const item = await query(
            `SELECT enqueue(
                '${res.locals.user.id}'::UUID,
                '${req.params.courseId}',
                '${req.body.location}', 
                '${req.body.comment}')`
        );
        if(item.rows.length === 0) return next()
        if(item.rows.length > 1) res.locals.queueItems = item.rows;
        else res.locals.queueItem = item.rows[0].enqueue
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const dequeue = async (req, res, next) => {
    try {
        const item = await query(
            `SELECT dequeue(
                '${res.locals.user.id}'::UUID,
                '${req.params.courseId}');`
        );
        res.locals.queueItem = item.rows
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const setItem = async (req, res, next) => {
    try {
        if (!req.params.courseId || !req.body.userId)
            return res.sendStatus(400);
        const location = req.body.location ? `'${req.body.location}'` : null;
        const comment = req.body.comment ? `'${req.body.comment}'` : null;
        const status = req.body.status ? `${req.body.status}` : null;
        const pgResponse = await query(`SELECT update_queue_item(
                '${req.body.userId}'::UUID, 
                '${req.params.courseId}', 
                ${comment},
                ${location},
                ${status})`);
        if(pgResponse.rows.length > 0)
            res.locals.queueItem = pgResponse.rows[0].update_queue_item
        if(res.locals.queueItem.location === "null") delete res.locals.queueItem.location
        if(res.locals.queueItem.comment === "null") delete res.locals.queueItem.comment
        if(res.locals.queueItem.status === "null") delete res.locals.queueItem.status
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
