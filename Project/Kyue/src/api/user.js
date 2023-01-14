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
                if (!data.register_user)
                    console.error("Failed to register user");
                else return true;
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
};

export const login = async (credentials) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        return axios
            .post("http://localhost:3000/api/login", credentials, config)
            .then(({ data }) => {
                if (!data) console.error("Failed to retrieve user");
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};

export const loadUser = async (user) => {
    if (!user) return null;
    const config = {
        headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user.currentUser),
            sessionId: user.sessionId,
        },
    };
    try {
        return await axios
            .get("http://localhost:3000/api/users/session", config)
            .then(({ data }) => {
                return data;
            });
    } catch (error) {
        console.error(error);
    }
};

export const logout = async (user) => {
    if (!user || !user.currentUser) {
        window.location.pathname = "/login";
        return;
    }
    const config = {
        headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user.currentUser),
            sessionId: user.sessionId,
        },
    };
    try {
        await axios
            .post("http://localhost:3000/api/logout", {}, config)
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error("Failed to validate user", error);
    }
};
