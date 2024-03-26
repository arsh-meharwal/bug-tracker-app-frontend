// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getTickets } from "./ticketsAPI";

// const initialState = {
//   Tickets: null,
//   totalItems: null,
//   status: "idle",
//   error: null,
// };

// export const getAllTicketsAsync = createAsyncThunk(
//   "tickets/getAllTickets",
//   async ({ paginate, query, sort }) => {
//     const response = await getTickets(paginate, query, sort);
//     // The value we return becomes the `fulfilled` action payload
//     return response;
//   }
// );

// export const allTicketSlice = createSlice({
//   name: "tickets",
//   initialState,
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllTicketsAsync.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getAllTicketsAsync.fulfilled, (state, action) => {
//         state.status = "idle";
//         state.Tickets = action.payload.data; // Assign the array to Tickets
//         state.totalItems = action.payload.totalItems;
//       });
//   },
// });

// export const selectAllTicket = (state) => state.allTicket.Tickets;
// export const selectTotalItems = (state) => state.allTicket.totalItems;
// export const selectAllTicketError = (state) => state.allTicket.error;

// export default allTicketSlice.reducer;
