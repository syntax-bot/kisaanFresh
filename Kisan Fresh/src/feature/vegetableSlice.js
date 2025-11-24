import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vegetables: null, // or { name, email, token }
};

const sellerVegetableReducer = createSlice({
  name: "vegetables",
  initialState,
  reducers: {
    add_veges_from_server: (state, action) => {
      state.vegetables = action.payload;
    },
    remove_veges_on_logout: (state) => {
      state.vegetables = null;
    }

  },
});

export const { add_veges_from_server, remove_veges_on_logout } = sellerVegetableReducer.actions;
export default sellerVegetableReducer.reducer;