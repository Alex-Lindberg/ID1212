import axios from "axios";

export const register = async (user) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        return axios
            .post("http://localhost:3000/api/users", user, config)
            .then(({ data }) => {
                console.log("data :>> ", data);
                if (!data.register_user)
                    console.error("Failed to register user");
                else return true;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const login = async (user) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        return axios
            .post("http://localhost:3000/api/login", user, config)
            .then(({ data }) => {
                if (!data) console.error("Failed to retrieve user");
                localStorage.setItem("user", JSON.stringify(data));
                window.location.pathname = "/courses";
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};

export const loadUser = async (user) => {
    if (!user) user = localStorage.getItem("user");
    if (!user) return null
    const config = {
        headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user.currentUser),
        },
    };
    try {
        return await axios
                .get("http://localhost:3000/api/users/session", config)
                .then(({ data }) => {
                    localStorage.setItem("user", JSON.stringify(data));
                    return data;
                })
            
    } catch (error) {
        console.error(error);
    }
};

export const logout = async (user) => {
    if (!user) user = localStorage.getItem("user");
    if (!user) window.location.pathname = "/login";
    const config = {
        headers: {
            "Content-Type": "application/json",
            user,
        },
    };
    try {
        await axios
            .post("http://localhost:3000/api/logout", {}, config)
            .then(() => {
                localStorage.removeItem("user");
                localStorage.removeItem("courses");
                window.location.pathname = "/login";
                console.log("Removed");
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error("Failed to validate user", error);
    }
};