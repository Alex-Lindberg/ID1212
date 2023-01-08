import axios from "axios";
import useUserState from "../../hooks/useUserState";

export const getCourses = async () => {
    const user = useUserState()?.user?.currentUser;
    if (!user) {
        window.location.pathname = "/login";
    }
    const config = {
        headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user),
        },
    };
    return axios
        .get("http://localhost:3000/api/courses", config)
        .then(({ data }) => {
            return data;
        });
};

export const getCourseItems = async () => {
    try {
        const user = useUserState()?.user?.currentUser;
        if (!user) window.location.pathname = "/login";
        const config = {
            headers: {
                "Content-Type": "application/json",
                user: JSON.stringify(user),
            },
        };
        return await axios
            .get("http://localhost:3000/api/users/session", config)
            .then(({ data }) => {
                localStorage.setItem("user", JSON.stringify(data));
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};
