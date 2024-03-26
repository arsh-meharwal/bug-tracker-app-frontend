import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "./authAPI";

const initialState = {
  allUsers: null,
  status: "idle",
  error: null,
};

export const getUsersAsync = createAsyncThunk(
  "users/getUsers",
  async ({ page, query, limit }) => {
    const response = await getAllUsers(page, query, limit);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.allUsers = action.payload;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      });
  },
});

export const selectALLUsers = (state) => state.users.allUsers;
export const selectError = (state) => state.users.error;

export default userSlice.reducer;
