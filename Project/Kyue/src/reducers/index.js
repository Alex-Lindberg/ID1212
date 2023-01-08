import { combineReducers } from '@reduxjs/toolkit';
import courseReducer from './courseReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    userState: userReducer,
    courseState: courseReducer
});

export default rootReducer;