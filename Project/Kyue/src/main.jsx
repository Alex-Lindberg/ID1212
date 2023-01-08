import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import Root from "./routes/Root";
import ErrorPage from "./errorPage";
import { Login } from "./routes";
import { validateUser } from "./api/user";
import store from "./store";
import Queue from "./routes/Queue";
import "./index.css";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
            loader: async () => {
                return validateUser().catch(() => {
                    return redirect("/login");
                });
            },
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

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </Provider>
);
