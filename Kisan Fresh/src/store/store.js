import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../feature/userSlice.js";
import cartReducer from "../feature/cartSlice.js";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage


const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  // sellerveges: sellerVegetableReducer,
  // sellerOrders: sellerOrderReducer,
  // sellerProfile: sellerProfileReducer,

});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart"], // only persist these reducers
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
