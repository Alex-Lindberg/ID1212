import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../api/user";

const userSlice = createSlice({
    name: "user",
    initialState: JSON.parse(localStorage.getItem("user")) || {},
    reducers: {
        setUser: (state, action) => {
            console.log("Userslice setUser");
            state.user = localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );
        },
        logout: (state) => {
            logout();
            console.log("Userslice logout");
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
