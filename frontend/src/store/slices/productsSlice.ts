import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product, ProductFormData } from '@/types';
import { productsApi } from '@/services/api';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await productsApi.getAll();
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: ProductFormData) => {
    return await productsApi.create(product);
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, product }: { id: number; product: Partial<ProductFormData> }) => {
    return await productsApi.update(id, product);
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await productsApi.delete(id);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create product';
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update product';
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
