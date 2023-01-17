import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourses } from "../api";
import update from "immutability-helper";
import {
    createCourse as apiCreateCourse,
    setCourseDescription as apiSetCourseDescription,
} from "../api/course";

const initialState = {
    loading: false,
    courses: [],
    error: "",
};

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async (user) => await getCourses(user)
);

export const createCourse = createAsyncThunk(
    "courses/createCourse",
    async (params) => await apiCreateCourse(params)
);

export const setCourseDescription = createAsyncThunk(
    "courses/setCourseDescription",
    async (params) => await apiSetCourseDescription(params)
);

const courseSlice = createSlice({
    name: "courseState",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCourses.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = action.payload;
            state.error = "";
        });
        builder.addCase(fetchCourses.rejected, (state, action) => {
            state.loading = false;
            state.courses = [];
            state.error = action.error.message;
        });
        builder.addCase(createCourse.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.courses.push(action.payload[0]);
            state.error = "";
        });
        builder.addCase(createCourse.rejected, (state, action) => {
            state.loading = false;
            state.courses = [];
            state.error = action.error.message;
        });
        builder.addCase(setCourseDescription.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(setCourseDescription.fulfilled, (state, action) => {
            state.loading = false;
            const idx = state.courses.findIndex(
                (c) => c.id === action.payload?.courseId
            );
            update(state.courses, {
                [idx]: {
                    course_description: {
                        $set: action.payload?.description,
                    },
                },
            });
            state.error = "";
        });
        builder.addCase(setCourseDescription.rejected, (state, action) => {
            state.loading = false;
            state.courses = [];
            state.error = action.error.message;
        });
    },
});

export const courseActions = courseSlice.actions;
export default courseSlice.reducer;
