const { query } = require("../api/db");
const utils = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        user: null,
        ...res.locals
    };
    return next();
};

const getUserByEmail = async (req, res, next) => {
    try {
        const email = req.body.email || utils.getUser(req).email;
        const results = await query(
            `SELECT * FROM users WHERE email='${email}'`
        );
        res.locals.user = results.rows.length > 0 ? results.rows[0] : null;
        return next();
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};


const userExists = (boolean) => (req, res, next) => {
    if (!!res.locals.user !== boolean) {
        if (req.method === "POST" && req.url === '/api/users') {
            return res.status(303).send( `User already exists`);
        }
        return res.sendStatus(404);
    }
    return next();
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId || utils.getUser(req).id;
        const results = await query(`SELECT id, username, email, role, created_at FROM users WHERE id='${userId}'`);
        if (results.rows.length === 0)
            return res.status(404).send( `No user found with id ${userId}`);
        else {
            res.locals.user = results.rows[0];
            return next();
        }
    } catch (error) {
        console.error("error :>> ", error);
        return res.sendStatus(500);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const result = await query(
            `SELECT register_user('${username}', '${email}', '${password}')`
        );
        res.locals.user = result.rows[0];
        return next();
    } catch (error) {
        return res.sendStatus(500);
    }
};

module.exports = {
    getUser,
    createUser,
    getUserByEmail,
    userExists,
    initLocals,
};
