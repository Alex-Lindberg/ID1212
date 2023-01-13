import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login as apiLogin, loadUser as apiLoadUser, logout as apiLogout} from "../api";

const initialState = {
    loading: false,
    error: "",
    user: null
}

export const login = createAsyncThunk(
    "user/login",
    async (credentials) => await apiLogin(credentials)
);

export const loadUser = createAsyncThunk(
    "user/load",
    async (user) => await apiLoadUser(user)
);

export const logout = createAsyncThunk(
    "user/logout",
    async (user) => await apiLogout(user)
);

const userSlice = createSlice({
    name: "userState",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            if(state.user) logout(state.user);
            else logout()
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action, res) => {
            state.loading = false;
            state.user = action.payload;
            state.error = "";
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.error.message;
        });
        builder.addCase(loadUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = "";
        });
        builder.addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.error.message;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = "";
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.error.message;
        });
    },
});



export const userActions = userSlice.actions;
export default userSlice.reducer;
