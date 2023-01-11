import { combineReducers } from '@reduxjs/toolkit';
import courseReducer from './courseReducer';
import queueReducer from './queueReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    userState: userReducer,
    courseState: courseReducer,
    queueState: queueReducer,
});

export default rootReducer;