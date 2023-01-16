import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import update from "immutability-helper";
import {
    getCourseItems,
    dequeue as apiDequeue,
    enqueue as apiEnqueue,
    updateQueueItem as apiUpdateQueueItem,
} from "../api";

const initialState = {
    loading: false,
    queue: [],
    isAdministrator: false,
    error: "",
};

export const fetchQueue = createAsyncThunk(
    "queue/fetchQueue",
    async (params) => await getCourseItems(params)
);

export const enqueue = createAsyncThunk(
    "queue/enqueue",
    async (params) => await apiEnqueue(params)
);

export const dequeue = createAsyncThunk(
    "queue/dequeue",
    async (params) => await apiDequeue(params)
);

export const updateQueueItem = createAsyncThunk(
    "queue/updateQueueItem",
    async (params) => await apiUpdateQueueItem(params)
);

const queueSlice = createSlice({
    name: "queueState",
    initialState,
    reducers: {
        setQueue: (state, action) => {
            state.queue = action.payload;
        },
        checkIfAdministrator: (state, action) => {
            const { user, course } = action.payload;
            state.isAdministrator =
                user.role === "admin" ||
                course?.administrators?.includes(user.id);
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
            state.queue = [];
            state.error = action.error.message;
        });
        builder.addCase(dequeue.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(dequeue.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.data[0].dequeue)
                state.queue = state.queue.filter(
                    (item) =>
                        !(
                            item.course_id.includes(action.payload.courseId) &&
                            item.user_id.includes(action.payload.userId)
                        )
                );
            state.error = "";
        });
        builder.addCase(dequeue.rejected, (state, action) => {
            state.loading = false;
            state.queue = [];
            state.error = action.error.message;
        });
        builder.addCase(enqueue.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(enqueue.fulfilled, (state, action) => {
            state.loading = false;
            state.queue = [...state.queue, action.payload];
            state.error = "";
        });
        builder.addCase(enqueue.rejected, (state, action) => {
            state.loading = false;
            state.queue = [];
            state.error = action.error.message;
        });
        builder.addCase(updateQueueItem.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateQueueItem.fulfilled, (state, action) => {
            state.loading = false;
            if (action?.payload) {
                const item = action?.payload;
                const idx = state.queue.findIndex(
                    (qItem) => qItem.user_id === item?.user_id
                );
                console.log('location: { $set: action.payload?.location  :>> ',state.queue[idx].location);
                update(state, {
                    queue: {
                        [idx]: {
                            location: { $set: (action.payload?.location 
                                || state.queue[idx].location)
                             },
                            comment: {$set: (action.payload?.comment 
                                || state.queue[idx].comment)
                            },
                            status: {$set: (action.payload?.status 
                                || state.queue[idx].status)
                            },
                        },
                    },
                });
            }
            state.error = "";
        });
        builder.addCase(updateQueueItem.rejected, (state, action) => {
            state.loading = false;
            state.queue = [];
            state.error = action.error.message;
        });
    },
});

export const queueActions = queueSlice.actions;
export default queueSlice.reducer;
