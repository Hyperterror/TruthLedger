import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  walletAddress: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.walletAddress = action.payload.walletAddress;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      // Store token in localStorage
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.walletAddress = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Remove token from localStorage
      localStorage.removeItem('token');
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setWalletAddress,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
