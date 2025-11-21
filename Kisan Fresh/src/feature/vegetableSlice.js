import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // or { name, email, token }
  isAuthenticated: false,
};

const sellerVegetableReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    add_veges_from_server: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },

  },
});

export const { login, logout } = sellerVegetableReducer.actions;
export default sellerVegetableReducer.reducer;