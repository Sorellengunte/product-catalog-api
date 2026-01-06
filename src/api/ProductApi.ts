// api/ProductApi.ts
import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';
const API_ENDPOINT = `${API_BASE_URL}/products`;

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// GET: Récupérer tous les produits
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_ENDPOINT);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// GET: Récupérer un produit par ID
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// POST: Créer un nouveau produit
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// PUT: Mettre à jour complètement un produit
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// PATCH: Mettre à jour partiellement un produit
export const patchProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axios.patch(`${API_ENDPOINT}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error patching product ${id}:`, error);
    throw error;
  }
};

// DELETE: Supprimer un produit
// IMPORTANT: L'API dummyjson nécessite de retourner une promesse avec le produit supprimé
export const deleteProduct = async (id: number): Promise<Product> => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Méthode générique pour les requêtes HTTP
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await axios({
      method,
      url,
      data
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};