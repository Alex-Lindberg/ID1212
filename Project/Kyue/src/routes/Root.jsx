import useUserState from "../hooks/useUserState";
import "../index.css";
import { Navigate } from "react-router-dom";

const Root = () => {
    const { user } = useUserState();

    return user?.currentUser ? (
        <Navigate to="/courses" />
    ) : (
        <Navigate to="/login" />
    );
};

export default Root;
