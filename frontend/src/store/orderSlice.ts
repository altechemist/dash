import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "./store";

// Define interfaces for Order and related entities
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
  status: string;
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

// Define API URL (adjust it as per your environment setup)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";  // Fallback to localhost

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

// Fetch all orders from the API
export const fetchAllOrders = () => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const response = await axios.get(`${API_URL}/api/orders`);
    dispatch(orderSlice.actions.setOrders(response.data.orders));
  } catch (error) {
    dispatch(orderSlice.actions.setError(error instanceof Error ? error.message : "Failed to fetch orders"));
  }
};

// Create a new order through the API
export const createOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const newOrder = {
      ...order,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await axios.post(`${API_URL}/api/orders`, newOrder);
    const createdOrder: Order = { ...newOrder, id: response.data.id }; // Assuming response includes new order ID

    dispatch(orderSlice.actions.addOrderToState(createdOrder));
  } catch (error) {
    dispatch(orderSlice.actions.setError(error instanceof Error ? error.message : "Failed to create order"));
  }
};

// Update the order status through the API
export const updateOrderStatus = (id: string, status: "Pending" | "Canceled" | "Completed") => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const response = await axios.put(`${API_URL}/api/orders/${id}`, { status, updatedAt: new Date() });

    const updatedOrder: Order = { ...response.data, id }; // Assuming the updated data is returned
    dispatch(orderSlice.actions.updateOrderInState(updatedOrder));
  } catch (error) {
    dispatch(orderSlice.actions.setError(error instanceof Error ? error.message : "Failed to update order status"));
  }
};

// Cancel an order via the API
export const cancelOrder = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(orderSlice.actions.setLoading());
  try {
    const response = await axios.put(`${API_URL}/api/orders/${id}/cancel`, { updatedAt: new Date() });

    const canceledOrder: Order = { ...response.data, status: "Canceled", id };
    dispatch(orderSlice.actions.updateOrderInState(canceledOrder));
  } catch (error) {
    dispatch(orderSlice.actions.setError(error instanceof Error ? error.message : "Failed to cancel order"));
  }
};

export const { setLoading, setError } = orderSlice.actions;

export default orderSlice.reducer;
