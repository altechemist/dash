import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer, // Use rootReducer directly
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
