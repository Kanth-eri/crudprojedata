import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Material, MaterialFormData } from '@/types';
import { materialsApi } from '@/services/api';

interface MaterialsState {
  items: Material[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMaterials = createAsyncThunk('materials/fetchAll', async () => {
  return await materialsApi.getAll();
});

export const createMaterial = createAsyncThunk(
  'materials/create',
  async (material: MaterialFormData) => {
    return await materialsApi.create(material);
  }
);

export const updateMaterial = createAsyncThunk(
  'materials/update',
  async ({ id, material }: { id: number; material: MaterialFormData }) => {
    return await materialsApi.update(id, material);
  }
);

export const deleteMaterial = createAsyncThunk('materials/delete', async (id: number) => {
  await materialsApi.delete(id);
  return id;
});

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch materials';
      })
      // Create
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create material';
      })
      // Update
      .addCase(updateMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update material';
      })
      // Delete
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete material';
      });
  },
});

export const { clearError } = materialsSlice.actions;
export default materialsSlice.reducer;
