import axios from "axios";

export const register = (user) => {
    try {
        const user = localStorage.getItem("user");
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        return axios.post("http://localhost:3000/api/users", user, config);
    } catch (error) {
        console.log("error :>> ", error);
    }
};

export const login = async (user) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        return await axios
            .post("http://localhost:3000/api/login", user, config)
            .then(({ data }) => {
                if (!data) console.error("Failed to retrieve user");
                localStorage.setItem("user", JSON.stringify(data));
                window.location.pathname = "/home";
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};

export const logout = async () => {
    const user = localStorage.getItem("user");
    if (!user) window.location.pathname = "/login";
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                user,
            },
        };
        await axios
            .post("http://localhost:3000/api/logout", {}, config)
            .then(() => {
                localStorage.removeItem("user");
                window.location.pathname = "/login";
                console.log('Removed');
            }).catch((error) => {
                console.error(error);
            })
    } catch (error) {
        console.error(error);
    }
};
