import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourseItems } from "../api";

const initialState = {
    loading: false,
    queue: {
        id: "",
        title: "",
        status: "",
    },
    error: "",
};

export const fetchQueue = createAsyncThunk(
    "queue/fetchQueue",
    async (courseId) => await getCourseItems(courseId)
);

const queueSlice = createSlice({
    name: "queueState",
    initialState,
    reducers: {
        setQueue: (state, action) => {
            state.queue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchQueue.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchQueue.fulfilled, (state, action) => {
            state.loading = false;
            state.queue = action.payload;
            state.error = "";
        });
        builder.addCase(fetchQueue.rejected, (state, action) => {
            state.loading = false;
            state.queue = {
                id: "",
                title: "",
                status: "",
            };
            state.error = action.error.message;
        });
    },
});

export const queueActions = queueSlice.actions;
export default queueSlice.reducer;
