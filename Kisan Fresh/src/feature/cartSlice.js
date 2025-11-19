import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // <-- Start empty, not with a dummy object
  totalQuantity: 0,
  totalPrice: 0,
};

// Helper function to recalculate totals
const updateTotals = (state) => {
  state.totalQuantity = state.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.cartItems.reduce(
    (sum, i) => sum + parseInt(i.price) * i.quantity,
    0
  );
};

export const selectItemQuantity = (state, itemId) => {
  const item = state.cart.cartItems.find((i) => i.id === itemId);
  return item ? item.quantity : 0;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1; // increment quantity if exists
      } else {
        // add new item with quantity 1
        state.cartItems.push({ ...item, quantity: 1 });
      }
      updateTotals(state);
    },

    // Removes one specific item entirely
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      updateTotals(state);
    },

    // Clears all items from cart
    clearCart: (state) => {f
      state.cartItems = [];
      updateTotals(state);
    },

    // decrease quantity by 1 
    decreaseQuantityby1: (state, action) => {
      console.log(action.payload);
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // remove item if quantity would hit 0
        state.cartItems = state.cartItems.filter(
          (i) => i.id !== action.payload
        );
      }

      updateTotals(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, decreaseQuantityby1 } =
  cartSlice.actions;
export default cartSlice.reducer;
