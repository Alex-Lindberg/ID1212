import { userActions } from "../reducers/userReducer";
import store from ".";
import { courseActions, fetchCourses } from "../reducers/courseReducer";
import { fetchQueue, queueActions } from "../reducers/queueReducer";

const storeInterface = {
    user: {
        get currentUser() {
            return store.getState().userState.user;
        },
        get isAuthenticated() {
            const user = store.getState().userState.user;
            return user.id && user.sessionId;
        },
        get id() {
            return store.getState().userState.user.id;
        },
        get sessionId() {
            return store.getState().userState.user.sessionId;
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
        fetchCourses: () => {
            return store.dispatch(fetchCourses())
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
        fetchQueue: (courseId) => {
            return store.dispatch(fetchQueue(courseId))
        }
    }
    
};

export default storeInterface;
