// src/api/ProductApi.ts
import apiService from './apiservice';

export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand?: string;
  category: string;
  thumbnail: string;
  stock: number;
  description?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Récupérer tous les produits
export const fetchAllProducts = async (
  page: number = 1,
  limit: number = 20
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await apiService.get<ProductsResponse>('products', { limit: limit.toString(), skip: skip.toString() });
  return res;
};

// Récupérer toutes les catégories (uniquement les noms)
export const fetchAllCategories = async (): Promise<string[]> => {
  const res = await apiService.get<string[]>('products/categories');
  // S'assure que tout est bien string
  return res.map(c => (typeof c === 'string' ? c : String(c)));
};

// Récupérer les produits par catégorie
export const fetchProductsByCategory = async (
  category: string,
  page: number = 1,
  limit: number = 20
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await apiService.get<ProductsResponse>(`products/category/${encodeURIComponent(category)}`, {
    limit: limit.toString(),
    skip: skip.toString(),
  });
  return res;
};

// Rechercher des produits
export const searchProducts = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await apiService.get<ProductsResponse>('products/search', {
    q: query,
    limit: limit.toString(),
    skip: skip.toString(),
  });
  return res;
};

// Récupérer un produit par ID
export const fetchProductById = async (id: number | string): Promise<Product> => {
  const res = await apiService.get<Product>(`products/${id}`);
  return res;
};
