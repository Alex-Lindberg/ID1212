import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import "./index.css";
import ErrorPage from "./errorPage";
import { Login } from "./routes";

const router = createBrowserRouter(
    [
        {
            path: "/home",
            element: <Root />
        },
        {
            path: "/login",
            element: <Login />,
        },
    ].map((route) => {
        // default elements
        if (route.errorElement) return route;
        return { ...route, errorElement: <ErrorPage /> };
    })
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
