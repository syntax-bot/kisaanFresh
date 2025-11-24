import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vegetables: [], // or { name, email, token }
};

const searchVegetableReducer = createSlice({
  name: "searchVegetable",
  initialState,
  reducers: {
    add_veges: (state, action) => {
      state.vegetables = action.payload;
    },
    remove_veges: (state) => {
      state.vegetables = null;
    }

  },
});

export const { add_veges, remove_veges } = searchVegetableReducer.actions;
export default searchVegetableReducer.reducer;