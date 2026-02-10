import { configureStore } from '@reduxjs/toolkit';
import materialsReducer from './slices/materialsSlice';
import productsReducer from './slices/productsSlice';
import productionReducer from './slices/productionSlice';

export const store = configureStore({
  reducer: {
    materials: materialsReducer,
    products: productsReducer,
    production: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
