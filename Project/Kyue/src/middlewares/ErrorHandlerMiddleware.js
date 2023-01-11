const getType = () => {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol")
        return (obj) => typeof obj;
    return (obj) => {
        return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
    };
};

const isPromise = (value) => {
    if (
        value !== null &&
        (typeof value === "undefined" ? "undefined" : getType(value)) ===
            "object"
    ) {
        return value && typeof value.then === "function";
    }
    return false;
};

const ErrorHandlingMiddleware = () => (next) => (action) => {
    if (!isPromise(action.payload)) return next(action);
    if (!action.meta || !action.meta.localError)
        return next(action).catch((err) => err);

    return next(action);
};

export default ErrorHandlingMiddleware;
