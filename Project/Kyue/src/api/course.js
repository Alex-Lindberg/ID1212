import axios from "axios";
import useUserState from "../hooks/useUserState";

export const getCourses = async () => {
    try {
        
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
            // localStorage.setItem("courses", JSON.stringify(data)); // ??????
            return data;
        }).catch(console.error);
    } catch(error) {
        console.error(error);
    }
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
                // localStorage.setItem("courseItems", JSON.stringify(data));
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};
