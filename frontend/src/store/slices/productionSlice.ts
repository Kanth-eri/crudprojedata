import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductionSuggestion } from '@/types';
import { productionApi } from '@/services/api';

interface ProductionState {
  suggestions: ProductionSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  suggestions: [],
  loading: false,
  error: null,
};

export const fetchProductionSuggestions = createAsyncThunk(
  'production/fetchSuggestions',
  async () => {
    return await productionApi.getSuggestions();
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch production suggestions';
      });
  },
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer;
