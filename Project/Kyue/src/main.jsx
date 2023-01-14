import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Login, Root, Queue, CourseList } from "./routes";
import { useUserState, useCourseState } from "./hooks";
import ErrorPage from "./errorPage";
import store from "./store";

import "./index.css";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
        },
        {
            path: "/courses",
            element: <CourseList />,
        },
        {
            path: "/courses/:courseId",
            element: <Queue />,
            loader: ({ params }) => {
                return params.courseId;
            },
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

const LifeCycle = ({ children }) => {
    const { user } = useUserState();
    const { courses } = useCourseState();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!dispatch || user || user.isLoading) return;
        dispatch(user.loadUser(user));
        dispatch(courses.fetchCourses(user));
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
