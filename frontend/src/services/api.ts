import axios from 'axios';
import type { Material, Product, ProductionSuggestion, MaterialFormData, ProductFormData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const materialsApi = {
  getAll: async (): Promise<Material[]> => {
    const response = await api.get('/materials');
    return response.data;
  },

  create: async (material: MaterialFormData): Promise<Material> => {
    const response = await api.post('/materials', material);
    return response.data;
  },

  update: async (id: number, material: MaterialFormData): Promise<Material> => {
    const response = await api.put(`/materials/${id}`, material);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/materials/${id}`);
  },
};

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  create: async (product: ProductFormData): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<ProductFormData>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const productionApi = {
  getSuggestions: async (): Promise<ProductionSuggestion[]> => {
    const response = await api.get('/production/suggest');
    return response.data;
  },
};

export default api;
