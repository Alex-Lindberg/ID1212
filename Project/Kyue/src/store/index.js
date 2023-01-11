import { configureStore } from "@reduxjs/toolkit";
import { ErrorHandlerMiddleware, ThunkMiddleware } from "../middlewares";
import rootReducer from "../reducers";

const store = configureStore({
    reducer: rootReducer,
    middleware: [ErrorHandlerMiddleware, ThunkMiddleware],
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;