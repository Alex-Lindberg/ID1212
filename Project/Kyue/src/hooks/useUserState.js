import { useDispatch, useSelector } from "react-redux";
import { login, loadUser, logout } from "../reducers/userReducer";

const useUserState = () => {
    const userState = useSelector((state) => state.userState);
    const dispatch = useDispatch();
    
    return {
        user: {
            get currentUser() {
                return userState.user
            },
            get id() {
                return userState.id
            },
            get sessionId() {
                return userState.sessionId;
            },
            get isAuthenticated() {
                return userState.isAuthenticated
            },
            get isLoading() {
                return userState.loading
            },
            login: (credentials) => {
                dispatch(login(credentials))
            },
            loadUser: (user) => {
                dispatch(loadUser(user))
            },
            logout: (user) => {
                dispatch(logout(user))
            }
        },
    };
};

export default useUserState;
