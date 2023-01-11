import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../api";

const userSlice = createSlice({
    name: "userState",
    initialState: JSON.parse(localStorage.getItem("user")) || null,
    reducers: {
        setUser: (state, action) => {
            state.user = localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );
        },
        logout: (state) => {
            logout();
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
