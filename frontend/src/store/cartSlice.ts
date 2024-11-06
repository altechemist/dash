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

// Create the cart slice
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
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setSubtotal(state) {
      // Ensure cart and items are available before calculating
      if (state.cart && state.cart.items) {
        state.subtotal = state.cart.items.reduce((total: number, item: { productPrice: number; quantity: number }) => {
          return total + item.productPrice * item.quantity;
        }, 0);
      } else {
        state.subtotal = 0;
      }
      state.error = null;
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

// Adds to cart
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

      // Check if the item already exists in the cart
      const existingItemIndex = localCart.items.findIndex((item: CartItem) => item.productId === productId);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        localCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item for guest, including all details
        localCart.items.push({ 
          productId, 
          productName, 
          productPrice, 
          productImage, 
          quantity 
        });
      }

      // Save updated cart to localStorage with all item details
      localStorage.setItem('guestCart', JSON.stringify(localCart));

      // Update the Redux store with the local cart
      dispatch(cartSlice.actions.setCart(localCart));

    } else {
      // Handle authenticated users - cart stored in Firestore
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        const cart = docSnap.data() as Cart;
        const existingItemIndex = cart.items.findIndex((item: CartItem) => item.productId === productId);
        
        if (existingItemIndex > -1) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to Firestore cart, including all details
          cart.items.push({ 
            productId, 
            productName, 
            productPrice, 
            productImage, 
            quantity 
          });
        }
        
        await setDoc(docRef, cart);
        dispatch(cartSlice.actions.setCart(cart));
      } else {
        // Create a new cart if it doesn't exist in Firestore
        const newCart: Cart = { userId, items: [{ 
          productId, 
          productName, 
          productPrice, 
          productImage, 
          quantity,
        }] };
        await setDoc(docRef, newCart);
        dispatch(cartSlice.actions.setCart(newCart));
      }
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};

// Remove an item from the cart
export const removeFromCart = (userId: string | undefined, productId: string) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());

  try {
    if (userId) {
      // Handle authenticated users - cart stored in Firestore
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cart = docSnap.data() as Cart;
        cart.items = cart.items.filter(item => item.productId !== productId);

        // Save updated cart in Firestore
        await setDoc(docRef, cart);
        dispatch(cartSlice.actions.setCart(cart));
      } else {
        dispatch(cartSlice.actions.setError("Cart not found."));
      }
    } else {
      // Handle guest users
      const localCart: Cart = JSON.parse(localStorage.getItem("guestCart") || '{"items": []}');
      localCart.items = localCart.items.filter(item => item.productId !== productId);
      console.log(localCart)

      // Save updated cart to localStorage
      localStorage.setItem("guestCart", JSON.stringify(localCart));
      dispatch(cartSlice.actions.setCart(localCart));
    }
  } catch (error) {
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};


// Update the quantity of a cart item
export const updateCartItemQuantity = (userId: string | undefined, productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  dispatch(cartSlice.actions.setLoading());

  try {
    if (userId) {
      // Handle authenticated users - cart stored in Firestore
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cart = docSnap.data() as Cart;
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity = quantity;
          await setDoc(docRef, cart);
          dispatch(cartSlice.actions.setCart(cart));
        } else {
          dispatch(cartSlice.actions.setError("Product not found in cart."));
        }
      } else {
        dispatch(cartSlice.actions.setError("Cart not found."));
      }
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
    dispatch(cartSlice.actions.setError((error as Error).message));
  }
};


// Sync local data with firebase
export const syncCartWithFirestore = async (userId: string, dispatch: AppDispatch) => {
  const localCart: Cart = JSON.parse(localStorage.getItem('guestCart') || '{"items": []}');

  if (localCart.items.length > 0) {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);

    const firestoreCart = docSnap.exists() ? docSnap.data() as Cart : { userId, items: [] };

    localCart.items.forEach((localItem: CartItem) => { 
      const existingItemIndex = firestoreCart.items.findIndex(item => item.productId === localItem.productId);
      if (existingItemIndex > -1) {
        firestoreCart.items[existingItemIndex].quantity += localItem.quantity;
      } else {
        firestoreCart.items.push(localItem);
      }
    });

    // Save the merged cart to Firestore
    await setDoc(docRef, firestoreCart);

    // Remove local cart from localStorage
    localStorage.removeItem('guestCart');

    // Dispatch the updated cart to Redux store
    dispatch(cartSlice.actions.setCart(firestoreCart));
  }
};

export const { setLoading, setCart, setError, setSubtotal } = cartSlice.actions;

// Subtotal calculation based on the current state
export const calculateSubtotal = (cart: Cart) => {
  const sub = cart.items.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  return sub.toFixed(2);
};

export default cartSlice.reducer;
