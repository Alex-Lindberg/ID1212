const createThunkMiddleware = (args) => (ref) => {
    const dispatch = ref.dispatch;
    const getState = ref.getState;
    return (next) => (action) => {
        if (typeof action === "function")
            return action(dispatch, getState, args);
        return next(action);
    };
};

const ThunkMiddleware = createThunkMiddleware();
ThunkMiddleware.withArgs = createThunkMiddleware;

export default ThunkMiddleware;