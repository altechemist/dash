import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "./store";

// Define interfaces for Cart and CartItem
interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

interface Cart {
  userId?: string;
  items: CartItem[];
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  subtotal: number;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  subtotal: 0,
};

// Get API base URL from the environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";  // Fallback to localhost for local dev

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setCart(state, action: PayloadAction<Cart | null>) {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
      // Recalculate subtotal when cart is set
      if (state.cart) {
        state.subtotal = calculateSubtotal(state.cart); // Call the helper here
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setSubtotal(state) {
      if (state.cart) {
        state.subtotal = calculateSubtotal(state.cart); // Recalculate subtotal here as well
      }
    },
  },
});

// Helper function to calculate the subtotal based on cart items
const calculateSubtotal = (cart: Cart): number => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return 0;
  }
  return cart.items.reduce((total, item) => total + item.productPrice * item.quantity, 0);
};

// Fetch the user's cart from the API
export const fetchCart = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());
  try {
    const response = await axios.get(`${API_URL}/api/carts/${userId}`);
    dispatch(cartSlice.actions.setCart(response.data.cart));
  } catch (error) {
    dispatch(cartSlice.actions.setError(error instanceof Error ? error.message : "Failed to fetch cart"));
  }
};

// Add to the cart via the API (or local storage for guests)
export const addToCart = (
  productId: string, 
  productName: string, 
  productPrice: number, 
  productImage: string, 
  quantity: number, 
  userId?: string
) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());

  try {
    if (!userId) {
      // Handle guest users - cart stored locally
      const localCart: Cart = JSON.parse(localStorage.getItem('guestCart') || '{"items": []}');
      const existingItemIndex = localCart.items.findIndex((item: CartItem) => item.productId === productId);

      if (existingItemIndex > -1) {
        localCart.items[existingItemIndex].quantity += quantity;
      } else {
        localCart.items.push({ 
          productId, 
          productName, 
          productPrice, 
          productImage, 
          quantity 
        });
      }

      localStorage.setItem('guestCart', JSON.stringify(localCart));
      dispatch(cartSlice.actions.setCart(localCart)); // Recalculate subtotal after adding item
    } else {
      // Handle authenticated users - cart stored via API
      const response = await axios.post(`${API_URL}/api/carts/${userId}/add`, { 
        productId, 
        productName, 
        productPrice, 
        productImage, 
        quantity 
      });

      dispatch(cartSlice.actions.setCart(response.data.cart)); // Recalculate subtotal after adding item
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError(error instanceof Error ? error.message : "Failed to add to cart"));
  }
};

// Remove an item from the cart via the API (or local storage for guests)
export const removeFromCart = (userId: string | undefined, productId: string) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());

  try {
    if (userId) {
      // Handle authenticated users - cart stored via API
      const response = await axios.post(`${API_URL}/api/carts/${userId}/remove`, { productId });
      dispatch(cartSlice.actions.setCart(response.data.cart)); // Recalculate subtotal after removing item
    } else {
      // Handle guest users - cart stored in localStorage
      const localCart: Cart = JSON.parse(localStorage.getItem("guestCart") || '{"items": []}');
      localCart.items = localCart.items.filter(item => item.productId !== productId);

      localStorage.setItem("guestCart", JSON.stringify(localCart));
      dispatch(cartSlice.actions.setCart(localCart)); // Recalculate subtotal after removing item
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError(error instanceof Error ? error.message : "Failed to remove from cart"));
  }
};

// Update the quantity of a cart item via the API (or local storage for guests)
export const updateCartItemQuantity = (userId: string | undefined, productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());

  try {
    if (userId) {
      // Handle authenticated users - cart stored via API
      const response = await axios.post(`${API_URL}/api/carts/${userId}/update`, { 
        productId, 
        quantity 
      });
      dispatch(cartSlice.actions.setCart(response.data.cart));
    } else {
      // Handle guest users - cart stored in localStorage
      const localCart: Cart = JSON.parse(localStorage.getItem("guestCart") || '{"items": []}');
      const existingItemIndex = localCart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        localCart.items[existingItemIndex].quantity = quantity;
        localStorage.setItem("guestCart", JSON.stringify(localCart));
        dispatch(cartSlice.actions.setCart(localCart));
      } else {
        dispatch(cartSlice.actions.setError("Product not found in cart."));
      }
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError(error instanceof Error ? error.message : "Failed to update item quantity"));
  }
};

// Sync local data with the API for authenticated users
export const syncCartWithApi = async (userId: string, dispatch: AppDispatch) => {
  const localCart: Cart = JSON.parse(localStorage.getItem('guestCart') || '{"items": []}');
  
  if (localCart.items.length > 0) {
    try {
      const response = await axios.post(`${API_URL}/api/carts/${userId}/sync`, { items: localCart.items });
      
      // Remove local cart after syncing
      localStorage.removeItem('guestCart');
      
      // Dispatch the updated cart from the API to Redux
      dispatch(cartSlice.actions.setCart(response.data.cart)); // Recalculate subtotal after syncing cart
    } catch (error) {
      dispatch(cartSlice.actions.setError(error instanceof Error ? error.message : "Failed to sync cart"));
    }
  }
};

// Fetch the user's cart if available (called on app load)
export const fetchCartOnLoad = (userId: string | undefined) => async (dispatch: AppDispatch) => {
  if (userId) {
    // Fetch cart from API if user is authenticated
    dispatch(fetchCart(userId));
  } else {
    // For guest users, load the local cart
    const localCart: Cart = JSON.parse(localStorage.getItem('guestCart') || '{"items": []}');
    dispatch(cartSlice.actions.setCart(localCart)); // Recalculate subtotal on load
  }
};

export const { setLoading, setCart, setError, setSubtotal } = cartSlice.actions;
export default cartSlice.reducer;
