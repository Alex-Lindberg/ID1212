const { query } = require("../api/db");
const utils = require("../utils");

const initLocals = (_req, res, next) => {
    res.locals = {
        user: null,
    };
    return next();
};

const getUserByEmail = async (req, res, next) => {
    const email = req.body.email || utils.getUser(req).email;
    console.log("userEmail :>> ", email);
    try {
        const results = await query(
            `SELECT * FROM users WHERE email='${email}'`
        );
        res.locals.user = results.rows.length > 0 ? results.rows[0] : null;
        return next();
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const userExists = (boolean) => (req, res, next) => {
    if (!!res.locals.user !== boolean) {
        if (req.method === "POST" && req.url === '/api/users') {
            return res.send(303, `User already exists`);
        }
        return res.sendStatus(404);
    }
    return next();
};

const getUser = async (req, res, next) => {
    const userId = req.params.userId || utils.getUser(req).id;
    try {
        const results = await query(`SELECT * FROM users WHERE id='${userId}'`);
        if (results.rows.length === 0)
            return res.send(404, `No user found with id ${userId}`);
        else {
            res.locals.user = results.rows[0];
            return next();
        }
    } catch (error) {
        console.log("error :>> ", error);
        return res.sendStatus(500);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const result = await query(
            `SELECT register_user('${username}', '${email}', '${password}')`
        );
        console.log("result :>> ", JSON.stringify(result, null, 2));
        res.locals.user = result.rows[0];
        return next();
    } catch (error) {
        console.log("error :>> ", error);
        res.sendStatus(500);
    }
};

module.exports = {
    getUser,
    createUser,
    getUserByEmail,
    userExists,
    initLocals,
};
