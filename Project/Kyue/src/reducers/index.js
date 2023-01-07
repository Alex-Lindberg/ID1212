import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    userState: userReducer,
});

export default rootReducer;