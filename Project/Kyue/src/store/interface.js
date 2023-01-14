import { login, loadUser, userActions } from "../reducers/userReducer";
import store from ".";
import { courseActions, fetchCourses } from "../reducers/courseReducer";
import { fetchQueue, queueActions } from "../reducers/queueReducer";
// import { loadUser } from "../api";

const storeInterface = {
    user: {
        get currentUser() {
            return store.getState().userState.user;
        },
        get isAuthenticated() {
            const user = store.getState().userState.user;
            return user.id && user.sessionId;
        },
        get isLoading() {
            return store.getState().userState.loading;
        },
        get id() {
            return store.getState().userState.user.id;
        },
        get sessionId() {
            return store.getState().userState.user.sessionId;
        },
        login: (credentials) => {
            return store.dispatch(login(credentials))
        },
        loadUser: (user) => {
            return store.dispatch(loadUser(user))  
        },
        setUser: (user) => {
            store.dispatch(userActions.setUser(user));
        },
        logout: () => {
            store.dispatch(userActions.logout());
        },
    },
    courses: {
        get courses() {
            return store.getState().courseState.courses
        },
        get error() {
            return store.getState().courseState.error
        },
        setCourses: (courses) => {
            return store.dispatch(courseActions.setCourses(courses))
        },
        fetchCourses: (user) => {
            return store.dispatch(fetchCourses(user))
        }
    },
    queue: {
        get queue() {
            return store.getState().queueState.queue
        },
        get error() {
            return store.getState().queueState.error
        },
        setQueue: (queue) => {
            return store.dispatch(queueActions.setQueue(queue))
        },
        fetchQueue: (params) => {
            return store.dispatch(fetchQueue(params))
        }
    }
    
};

export default storeInterface;
