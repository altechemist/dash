import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from '../../config/firebase';
import { AppDispatch } from "./store";

// Define a product interface
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

// Create the product slice
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
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.loading = false;
    },
    removeProductFromState(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Fetch all products
export const fetchAllProducts = () => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    dispatch(productSlice.actions.setProducts(products));
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    dispatch(productSlice.actions.setError(errorMessage));
  }
};

// Add a product
export const addProduct = (product: Product) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());

  // Validate product info
  if (!product.name ||!product.brand ||!product.price ||!product.description ||!product.sku ||!product.category ||!product.subCategory ||!product.sizeOptions ||!product.isReturnable ||!product.bashProductUUID ||!product.productCode ||!product.soldBy) {
    dispatch(productSlice.actions.setError("Product information is missing or invalid."));
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "products"), product);
    const newProduct: Product = { ...product, id: docRef.id };
    dispatch(productSlice.actions.addProductToState(newProduct));
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    dispatch(productSlice.actions.setError(errorMessage));
  }
};

// Update a product
export const updateProduct = (id: string, product: Partial<Product>) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, product);

    const updatedProduct: Product = {
      ...product,
      id,
    } as Product;

    dispatch(productSlice.actions.updateProductInState(updatedProduct));
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    dispatch(productSlice.actions.setError(errorMessage));
  }
};

// Delete a product
export const deleteProduct = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(productSlice.actions.setLoading());
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    dispatch(productSlice.actions.removeProductFromState(id));
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    dispatch(productSlice.actions.setError(errorMessage));
  }
};

// Export actions and reducer
export const { setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
