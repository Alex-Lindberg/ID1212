import { configureStore } from "@reduxjs/toolkit";
import { ErrorHandlerMiddleware, ThunkMiddleware } from "../middlewares";
import rootReducer from "../reducers";

import storageSession from 'redux-persist/lib/storage/session'
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "root",
    storage: storageSession,
    stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [ErrorHandlerMiddleware, ThunkMiddleware],
    devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store)
export default store;
