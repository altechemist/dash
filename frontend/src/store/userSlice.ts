import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { AppDispatch } from "./store";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Define a custom user interface
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

export interface AuthState {
  user: CustomUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Load user from local storage
const loadUserFromLocalStorage = (): CustomUser | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    ...initialState,
    user: loadUserFromLocalStorage(),
  },
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
  },
});

// Create user profile in Firestore
const createUserProfile = async (user: CustomUser) => {
  try {
    await setDoc(doc(db, "Users", user.uid), {
      uid: user.uid,
      role: "client",
      username: user.username,
      email: user.email,
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wishlist: [],
      orders: [],
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

// Register action
export const register =
  (email: string, password: string, username: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);

      const customUser: CustomUser = {
        uid: user.uid,
        role: "client",
        username: username,
        email: user.email,
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wishlist: [],
        orders: [],
      };

      await createUserProfile(customUser);
      dispatch(setUser(customUser));
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Update user profile
export const updateProfile =
  (
    userId: string,
    updatedData: { username?: string; email?: string; addresses?: string[] }
  ) =>
  async (dispatch: AppDispatch) => {
    if (!userId || !updatedData) return;
    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, updatedData);

      // Get the updated user data
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const updatedUserData = userDoc.data() as CustomUser;
        dispatch(setUser(updatedUserData));
      }
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Login action
export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as CustomUser;
        dispatch(setUser({ ...userData, uid: user.uid }));
      } else {
        dispatch(setError("User data not found."));
      }
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Social login actions
export const socialLogin =
  (provider: "google" | "facebook" | "twitter") =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    let authProvider;

    switch (provider) {
      case "google":
        authProvider = new GoogleAuthProvider();
        break;
      case "facebook":
        authProvider = new FacebookAuthProvider();
        break;
      case "twitter":
        authProvider = new TwitterAuthProvider();
        break;
      default:
        return;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      const customUser: CustomUser = {
        uid: user.uid,
        role: "client",
        username: user.email?.split("@")[0] || null,
        email: user.email,
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wishlist: [],
        orders: [],
      };

      await createUserProfile(customUser);
      dispatch(setUser(customUser));
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Add item to wishlist
export const addToWishlist =
  (userId: string, itemId: string) => async (dispatch: AppDispatch) => {
    if (!userId || !itemId) return;
    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, { wishlist: arrayUnion(itemId) });

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const updatedUserData = userDoc.data() as CustomUser;
        dispatch(setUser(updatedUserData));
      }
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Remove item from wishlist
export const removeFromWishlist =
  (userId: string, itemId: string) => async (dispatch: AppDispatch) => {
    if (!userId || !itemId) return;
    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, { wishlist: arrayRemove(itemId) });

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const updatedUserData = userDoc.data() as CustomUser;
        dispatch(setUser(updatedUserData));
      }
    } catch (error) {
      handleAuthError(error as Error, dispatch);
    }
  };

// Logout action
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    await signOut(auth);
    dispatch(setUser(null));
  } catch (error) {
    handleAuthError(error as Error, dispatch);
  }
};

// User-Friendly Error Handler
const handleAuthError = (error: Error, dispatch: AppDispatch) => {
  const errorMessage = getUserFriendlyError(error.message);
  dispatch(setError(errorMessage));
};

const getUserFriendlyError = (error: string) => {
  switch (error) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please try another.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/user-not-found":
      return "No user found with this email.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

// Reset password
export const resetPassword =
  (email: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

export const { setLoading, setUser, setError } = userSlice.actions;

export default userSlice.reducer;