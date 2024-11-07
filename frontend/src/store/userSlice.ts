import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "./store";

// Define interfaces for CustomUser and AuthState
interface CustomUser {
  uid: string;
  role: string;
  username: string | null;
  email: string | null;
  addresses: string[];
  createdAt: Date;
  updatedAt: Date;
  wishlist: string[];
  orders: string[];
}

interface AuthState {
  user: CustomUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Fallback to localhost for local dev

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUser(state, action: PayloadAction<CustomUser | null>) {
      state.user = action.payload;
      state.loading = false;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setWishlist(state, action: PayloadAction<string[]>) {
      if (state.user) {
        state.user.wishlist = action.payload;
      }
      state.loading = false;
    },
  },
});

// Register a new user via the API
export const register =
  (email: string, password: string, username: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        email,
        password,
        username,
      });
      const customUser: CustomUser = response.data.user;
      dispatch(userSlice.actions.setUser(customUser));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error ? error.message : "Failed to register user"
        )
      );
    }
  };

// Login a user via the API
export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      const customUser: CustomUser = response.data.user;
      dispatch(userSlice.actions.setUser(customUser));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error ? error.message : "Failed to login"
        )
      );
    }
  };

// Logout the user via the API
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(userSlice.actions.setLoading());
  try {
    await axios.post(`${API_URL}/api/users/logout`); // API call to logout user
    dispatch(userSlice.actions.setUser(null));
  } catch (error) {
    dispatch(
      userSlice.actions.setError(
        error instanceof Error ? error.message : "Failed to logout"
      )
    );
  }
};

// Reset user password via the API
export const resetPassword =
  (email: string) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, { email }); // API call to reset password
      alert("Password reset email sent!");
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error ? error.message : "Failed to send reset email"
        )
      );
    }
  };

// Get user profile from the API
export const getUserProfile =
  (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      dispatch(userSlice.actions.setUser(response.data.user));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile"
        )
      );
    }
  };

// Update user profile via the API
export const updateProfile =
  (userId: string, updatedData: Partial<CustomUser>) =>
  async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.put(
        `${API_URL}/api/users/${userId}`,
        updatedData
      );
      dispatch(userSlice.actions.setUser(response.data.user));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error
            ? error.message
            : "Failed to update user profile"
        )
      );
    }
  };

// Add item to wishlist via the API
export const addToWishlist =
  (userId: string, itemId: string) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.patch(
        `${API_URL}/api/users/${userId}/wishlist/add`,
        { itemId }
      );
      dispatch(userSlice.actions.setWishlist(response.data.wishlist));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error ? error.message : "Failed to add to wishlist"
        )
      );
    }
  };

// Remove item from wishlist via the API
export const removeFromWishlist =
  (userId: string, itemId: string) => async (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.setLoading());
    try {
      const response = await axios.patch(
        `${API_URL}/api/users/${userId}/wishlist/remove`,
        { itemId }
      );
      dispatch(userSlice.actions.setWishlist(response.data.wishlist));
    } catch (error) {
      dispatch(
        userSlice.actions.setError(
          error instanceof Error
            ? error.message
            : "Failed to remove from wishlist"
        )
      );
    }
  };

export const { setLoading, setUser, setError, setWishlist } = userSlice.actions;

export default userSlice.reducer;
