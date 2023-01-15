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
        console.log('item.rows :>> ', item.rows);
        if(item.rows.length === 0) return next()
        if(item.rows.length > 1) res.locals.queueItems = item.rows;
        else res.locals.queueItem = item.rows[0].enqueue
        console.log('res.locals :>> ', res.locals);
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const dequeue = async (req, res, next) => {
    try {
        console.log('req.body :>> ', req.body);
        console.log('req.params :>> ', req.params);
        console.log('res.locals :>> ', res.locals);
        const item = await query(
            `SELECT dequeue(
                '${res.locals.user.id}'::UUID,
                '${req.params.courseId}');`
        );
        console.log('dequeue item :>> ', item);
        console.log('dequeue item.rows :>> ', item.rows);
        res.locals.queueItem = item.rows
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const setItem = async (req, res, next) => {
    try {
        if (!req.params.courseId || !req.body.location || !req.body.comment)
            return res.sendStatus(400);
        const comment = req.body.comment ? `'${req.body.comment}'` : null;
        const status = req.body.status ? `'${req.body.status}'` : null;
        const location = req.body.location ? `'${req.body.location}'` : null;
        const pgResponse = await query(`SELECT update_queue_item(
                '${req.params.queueItemId}'::UUID, 
                '${req.body.courseId}', 
                '${comment}',
                '${location}',
                '${status}')`);
        console.log('pgResponse :>> ', pgResponse);
        res.locals.queueItem = pgResponse
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
