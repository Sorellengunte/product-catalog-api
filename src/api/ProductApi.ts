const BASE_URL = 'https://dummyjson.com';

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

// Tous les produits
export const fetchAllProducts = async (page = 1, limit = 20): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  const data: ProductsResponse = await res.json();
  return data;
};

// Toutes les catégories
export const fetchAllCategories = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  const data: string[] = await res.json();
  return data;
};

// Produits par catégorie
export const fetchProductsByCategory = async (
  category: string,
  page = 1,
  limit = 20
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
  const data: ProductsResponse = await res.json();
  return data;
};

// Rechercher des produits
export const searchProducts = async (
  query: string,
  page = 1,
  limit = 20
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  const data: ProductsResponse = await res.json();
  return data;
};

// 🔹 Récupérer un produit par ID
export const fetchProductById = async (id: number | string): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const data: Product = await res.json();
  return data;
};
