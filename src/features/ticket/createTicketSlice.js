import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTicket } from "./ticketsAPI";

const initialState = {
  currentTicket: null,
  status: "idle",
  error: null,
};

export const createTicketAsync = createAsyncThunk(
  "ticket/createTicket",
  async (ticketData) => {
    const response = await createTicket(ticketData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTicketAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTicketAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentTicket = action.payload;
      });
  },
});

export const selectTicket = (state) => state.newTicket.currentTicket;
export const selectError = (state) => state.newTicket.error;

export default ticketSlice.reducer;
