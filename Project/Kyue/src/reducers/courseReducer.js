import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourses } from "../api/course";

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async () => await getCourses()
);

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        loading: false,
        courses: [],
        error: "",
    },
    reducers: {
        setCourses: (state, action) => {
            console.log('action.payload :>> ', action.payload);
            console.log('state.courses :>> ', state.courses);
            console.log('state.courses :>> ', [...state.courses, action.payload]);
            state.courses = [...state.courses, action.payload]
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
