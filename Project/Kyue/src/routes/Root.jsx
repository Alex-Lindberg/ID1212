import { useUserState } from "../hooks";
import { Navigate } from "react-router-dom";
import "../index.css";

const Root = () => {
    const { user } = useUserState();

    return user?.currentUser ? (
        <Navigate to="/courses" />
    ) : (
        <Navigate to="/login" />
    );
};

export default Root;
