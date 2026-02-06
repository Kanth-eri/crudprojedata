import axios from 'axios';
import type {Product, ProductResource, ProductSuggestion, ProductionSuggestionDTO,
    Material, MaterialResource, ProductMaterial,} from '@types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL
    headers:
        'Content-Type:' 'application/json',
        },
    });

export const materialsApi = {
    getAll: async (): Promise<Material[]> => {
        const response = await api.get('/materials');
        return response.data;
        },
    create: async ((MaterialFormData): Promise<Material> => {
        const response = await api.post('/materials', material);
        return response.data;
        },
    update: async ((id: number, material: MaterialFormData): Promise<Material> => {
        const response = await api.put('/materials/${id}', material);
        return response.data;
        },
    delete: async (id: number): Promise<void> => {
        await api.delete('/materials/${id}');
        }
    };

export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get('/products');
        return response.data;
        },
    create: async ((ProductFormData): Promise<Product> => {
        const response = await api.post('/products', product);
        return response.data;
        },
    update: async ((id: number, product: ProductFormData): Promise<Product> => {
        const response = await api.put('/products/${id}', product);
        return response.data;
        },
    delete: async (id: number): Promise<void> => {
        await api.delete('/products/${id}');
        }
    };

export const productionApi = {
    getSuggestion: async(): Promise<ProductionSuggestion[]> => {
        const response = await.get('/productSuggestion');
        return response.data
        },
    };

export default api;