import { configureStore } from "@reduxjs/toolkit";
import donationReducer from "./donationSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    donation: donationReducer,
    auth: authReducer,
  },
});
