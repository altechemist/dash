import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "./store";

// Define interfaces for Product
interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  sku: string;
  category: string;
  subCategory: string;
  sizeOptions: string[];
  isReturnable: boolean;
  isVisible: boolean;
  onSale: boolean;
  bashProductUUID: string;
  productCode: string;
  soldBy: string;
  images?: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Get API base URL from the environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";  // Fallback to localhost for local dev

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.loading = false;
    },
    addProductToState(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
      state.loading = false;
    },
    updateProductInState(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.loading = false;
    },
    removeProductFromState(state, action: PayloadAction<string>) {
      state.products = state.products.filter(product => product.id !== action.payload);
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Fetch all products from the API
export const fetchAllProducts = () => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    const response = await axios.get(`${API_URL}/api/products`);  // API call to fetch all products
    dispatch(productSlice.actions.setProducts(response.data.products));
  } catch (error) {
    dispatch(productSlice.actions.setError(error instanceof Error ? error.message : "Failed to fetch products"));
  }
};

// Create a new product through the API
export const createProduct = (product: Omit<Product, "id">) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    // Validate product information to match expected data structure
    if (!product.name || !product.brand || !product.price || !product.sku || !product.category || !product.subCategory || !product.sizeOptions || !product.bashProductUUID || !product.productCode || !product.soldBy) {
      dispatch(productSlice.actions.setError("Product information is missing or invalid."));
      return;
    }

    const response = await axios.post(`${API_URL}/api/products`, product);  // API call to create product
    dispatch(productSlice.actions.addProductToState({ ...product, id: response.data.productId }));
  } catch (error) {
    dispatch(productSlice.actions.setError(error instanceof Error ? error.message : "Failed to create product"));
  }
};

// Update product details through the API
export const updateProduct = (id: string, product: Partial<Product>) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    // Validate product information to ensure valid data before making the update
    if (Object.keys(product).length === 0) {
      dispatch(productSlice.actions.setError("No product data provided to update."));
      return;
    }

    const response = await axios.patch(`${API_URL}/api/products/${id}`, product);  // API call to update product
    dispatch(productSlice.actions.updateProductInState(response.data.product));
  } catch (error) {
    dispatch(productSlice.actions.setError(error instanceof Error ? error.message : "Failed to update product"));
  }
};

// Delete a product through the API
export const deleteProduct = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    await axios.delete(`${API_URL}/api/products/${id}`);  // API call to delete product
    dispatch(productSlice.actions.removeProductFromState(id));
  } catch (error) {
    dispatch(productSlice.actions.setError(error instanceof Error ? error.message : "Failed to delete product"));
  }
};

export const { setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
