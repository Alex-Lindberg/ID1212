import axios from "axios";
import routes from "../localization/routes";

export const register = async (user) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        return axios
            .post(`${routes.HTTP_API}/api/users`, user, config)
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
            .post(`${routes.HTTP_API}/api/login`, credentials, config)
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
            .get(`${routes.HTTP_API}/api/users/session`, config)
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
            .post(`${routes.HTTP_API}/api/logout`, {}, config)
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error("Failed to validate user", error);
    }
};
