import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // or { name, email, token }
  isAuthenticated: false,
};

const sellerVegetableReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = sellerVegetableReducer.actions;
export default sellerVegetableReducer.reducer;