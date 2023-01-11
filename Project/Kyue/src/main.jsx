import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    redirect,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import Root from "./routes/Root";
import ErrorPage from "./errorPage";
import { Login } from "./routes";
import { loadUser } from "./api";
import store from "./store";
import Queue from "./routes/Queue";
import "./index.css";
import { useEffect } from "react";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "/:courseId",
                    element: <Queue />,
                },
            ],
        },
        {
            path: "/login",
            element: <Login />,
        },
    ].map((route) => {
        // default elements
        if (route.children) {
            route.children = route.children.map((child) => {
                if (child.errorElement) return child;
                return { ...child, errorElement: <ErrorPage /> };
            });
        }
        if (route.errorElement) return route;
        return { ...route, errorElement: <ErrorPage /> };
    })
);

const LifeCycle = ({children}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!dispatch) return;

        dispatch(loadUser);
    }, [dispatch]);
    return { ...children };
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <React.StrictMode>
            <LifeCycle>
                <RouterProvider router={router} />
            </LifeCycle>
        </React.StrictMode>
    </Provider>
);
