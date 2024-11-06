import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from '../../config/firebase';
import { AppDispatch } from "./store";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  address: string;
  address2?: string;
  country: string;
  state: string;
  zip: string;
}

interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  status: "Pending" | "Canceled" | "Completed";
  billingInfo: BillingInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
      state.loading = false;
    },
    addOrderToState(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
      state.loading = false;
    },
    updateOrderInState(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      state.loading = false;
    },
    removeOrderFromState(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Fetch all orders
export const fetchAllOrders = () => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    dispatch(orderSlice.actions.setOrders(orders));
  } catch (error) {
    dispatch(orderSlice.actions.setError((error as Error).message));
  }
};

// Create a new order
export const createOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => async (dispatch: AppDispatch) => {
    dispatch(orderSlice.actions.setLoading());
    try {
      const newOrder: Omit<Order, "id"> = {
        ...order,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      // Create the full order object with the new ID
      const createdOrder: Order = {
        ...newOrder,
        id: docRef.id, // Assign the generated document ID
      };
      
      dispatch(orderSlice.actions.addOrderToState(createdOrder));
    } catch (error) {
      dispatch(orderSlice.actions.setError((error as Error).message));
    }
  };
  
// Update order status
export const updateOrderStatus = (id: string, status: "Pending" | "Canceled" | "Completed") => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { status, updatedAt: new Date() });
      const updatedOrder = { id, ...docSnap.data(), status } as Order;
      dispatch(orderSlice.actions.updateOrderInState(updatedOrder));
    } else {
      dispatch(orderSlice.actions.setError("Order not found"));
    }
  } catch (error) {
    dispatch(orderSlice.actions.setError((error as Error).message));
  }
};

// Cancel an order
export const cancelOrder = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { status: "Canceled", updatedAt: new Date() });
      const canceledOrder = { id, ...docSnap.data(), status: "Canceled" } as Order;
      dispatch(orderSlice.actions.updateOrderInState(canceledOrder));
    } else {
      dispatch(orderSlice.actions.setError("Order not found"));
    }
  } catch (error) {
    dispatch(orderSlice.actions.setError((error as Error).message));
  }
};

export const { setLoading, setError } = orderSlice.actions;

export default orderSlice.reducer;
