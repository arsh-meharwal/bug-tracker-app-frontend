import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/auth/usersSlice";
import ttReducer from "../features/ticket/createTicketSlice";
import allTTReducer from "../features/ticket/getTicketSlice";
import allProjectReducer from "../features/project/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    newTicket: ttReducer,
    allProject: allProjectReducer,
  },
});
