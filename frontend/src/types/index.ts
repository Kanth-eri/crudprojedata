export interface Material {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface ProductMaterial {
  id?: number;
  material: Material;
  quantityNeeded: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  materials: ProductMaterial[];
}

export interface ProductionSuggestion {
  productName: string;
  quantity: number;
  totalValue: number;
}

export interface MaterialFormData {
  name: string;
  stockQuantity: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  materials: {
    material: { id: number };
    quantityNeeded: number;
  }[];
}