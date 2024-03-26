import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjects } from "./projectAPI";

const initialState = {
  Projects: null,
  totalItems: null,
  status: "idle",
  error: null,
};

export const getAllProjectsAsync = createAsyncThunk(
  "project/getAllProjects",
  async ({ paginate, query, sort }) => {
    const response = await getProjects(paginate, query, sort);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const allProjectSlice = createSlice({
  name: "project",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjectsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllProjectsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.Projects = action.payload.data; // Assign the array to Tickets
        state.totalItems = action.payload.totalItems;
      });
  },
});

export const selectAllProject = (state) => state.allProject.Projects;
export const selectTotalItems = (state) => state.allProject.totalItems;
export const selectAllTicketError = (state) => state.allTicket.error;

export default allProjectSlice.reducer;
