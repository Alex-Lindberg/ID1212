import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourses } from "../api";

const initialState = {
    loading: false,
    courses: [],
    error: "",
};

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async (user) => await getCourses(user)
);

const courseSlice = createSlice({
    name: "courseState",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload
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
    },
});

export const courseActions = courseSlice.actions;
export default courseSlice.reducer;
