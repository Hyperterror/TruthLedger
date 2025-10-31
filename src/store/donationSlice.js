import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  donations: [],
};

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    setDonations: (state, action) => {
      state.donations = action.payload;
    },
    addDonation: (state, action) => {
      state.donations.push(action.payload);
    },
  },
});

export const { setDonations, addDonation } = donationSlice.actions;
export default donationSlice.reducer;
