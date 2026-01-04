import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

// Interface pour les réponses de l'API
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

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Version SIMPLIFIÉE et CORRIGÉE
export const productApi = {
  // Récupérer tous les produits
  getAllProducts: async (limit: number = 10, skip: number = 0): Promise<ProductsResponse> => {
    try {
      const response = await axios.get<ProductsResponse>(`${API_BASE_URL}/products`, {
        params: { limit, skip }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      // Retourner une réponse vide en cas d'erreur
      return {
        products: [],
        total: 0,
        skip: 0,
        limit: 0
      };
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement du produit ${id}:`, error);
      throw error;
    }
  },

  // Récupérer toutes les catégories
  getAllCategories: async (): Promise<string[]> => {
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      return [];
    }
  },

  // Rechercher des produits
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    try {
      const response = await axios.get<ProductsResponse>(`${API_BASE_URL}/products/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return {
        products: [],
        total: 0,
        skip: 0,
        limit: 0
      };
    }
  },

  // Récupérer les produits par catégorie
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    try {
      const response = await axios.get<ProductsResponse>(`${API_BASE_URL}/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement de la catégorie ${category}:`, error);
      return {
        products: [],
        total: 0,
        skip: 0,
        limit: 0
      };
    }
  }
};