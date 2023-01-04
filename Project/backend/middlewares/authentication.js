const { query } = require("../api/db");

const login = async (req, res, next) => {
    try {
        res.locals.user.sessionId = await query(
            `SELECT new_session('${res.locals.user.id}')`
        );
        res.locals.user = {
            ...res.locals.user,
            sessionId: res.locals.user.sessionId.rows[0].new_session,
        };
        return next();
    } catch (error) {
        // console.error("error :>> ", error);
        res.sendStatus(500);
    }
};

const validateCredentials = (req, res, next) => {
    const emailValid = res.locals.user.email === req.body.email;
    const passwordValid = res.locals.user.password === req.body.password;
    if (emailValid && passwordValid) return next();
    else res.sendStatus(401);
};

const logout = async (req, res, next) => {
    try {
        console.log("res.locals.user :>> ", res.locals.user);
        await query(`CALL delete_session('${res.locals.user.id}'::UUID)`);
        return res.sendStatus(302);
    } catch (error) {
        // console.error("error :>> ", error);
        res.sendStatus(500);
    }
};

module.exports = {
    login,
    logout,
    validateCredentials,
};
