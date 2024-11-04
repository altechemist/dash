import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from '../../config/firebase';
import { AppDispatch } from "./store";

// Define interfaces for Cart and CartItem
interface CartItem {
  productId: string; // Product identifier
  quantity: number;  // Quantity of the product
}

interface Cart {
  userId: string;    // User identifier
  items: CartItem[]; // Array of cart items
}

export interface CartState {
  cart: Cart | null; // Current cart state
  loading: boolean;   // Loading state
  error: string | null; // Error message
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setCart(state, action: PayloadAction<Cart | null>) {
      state.cart = action.payload;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Fetch the user's cart from Firestore
export const fetchCart = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());
  try {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cartData = docSnap.data() as Cart;
      dispatch(cartSlice.actions.setCart(cartData));
    } else {
      // If no cart exists, create a new empty cart
      const emptyCart: Cart = { userId, items: [] };
      await setDoc(docRef, emptyCart);
      dispatch(cartSlice.actions.setCart(emptyCart));
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};

// Add an item to the cart
export const addToCart = (userId: string, productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());
  try {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cart = docSnap.data() as Cart;
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }
      
      await setDoc(docRef, cart);
      dispatch(cartSlice.actions.setCart(cart));
    } else {
      // Create a new cart if it doesn't exist
      const newCart: Cart = { userId, items: [{ productId, quantity }] };
      await setDoc(docRef, newCart);
      dispatch(cartSlice.actions.setCart(newCart));
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};

// Remove an item from the cart
export const removeFromCart = (userId: string, productId: string) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());
  try {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cart = docSnap.data() as Cart;
      cart.items = cart.items.filter(item => item.productId !== productId);
      await setDoc(docRef, cart);
      dispatch(cartSlice.actions.setCart(cart));
    } else {
      dispatch(cartSlice.actions.setError("Cart not found."));
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};

// Update the quantity of a cart item
export const updateCartItemQuantity = (userId: string, productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());
  try {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cart = docSnap.data() as Cart;
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = quantity; // Update quantity
        await setDoc(docRef, cart);
        dispatch(cartSlice.actions.setCart(cart));
      } else {
        dispatch(cartSlice.actions.setError("Product not found in cart."));
      }
    } else {
      dispatch(cartSlice.actions.setError("Cart not found."));
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};

export const { setLoading, setCart, setError } = cartSlice.actions;

export default cartSlice.reducer;
