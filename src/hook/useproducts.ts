import { useState, useCallback } from 'react';

import { productService } from '../api/product.service';

// Définir les types localement
interface Product {
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

interface CreateProductData {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}
interface UseProductsReturn {
  // State
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  categories: string[];
  
  // CRUD Operations
  createProduct: (data: CreateProductData) => Promise<Product | null>;
  getProducts: (limit?: number, skip?: number) => Promise<void>;
  getProduct: (id: number) => Promise<Product | null>;
  updateProduct: (id: number, data: Partial<CreateProductData>) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  
  // Filtering
  searchProducts: (query: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
  getAllCategories: () => Promise<void>;
  
  // Utilities
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // CREATE
  const createProduct = useCallback(async (data: CreateProductData): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProduct = await productService.createProduct(data);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors de la création';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // READ - All products
  const getProducts = useCallback(async (limit: number = 10, skip: number = 0): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productService.getAllProducts(limit, skip);
      setProducts(response.products);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // READ - Single product
  const getProduct = useCallback(async (id: number): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const product = await productService.getProductById(id);
      setCurrentProduct(product);
      return product;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors du chargement';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UPDATE
  const updateProduct = useCallback(async (id: number, data: Partial<CreateProductData>): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      
      // Update in products list
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      
      // Update current product if it's the one being edited
      if (currentProduct?.id === id) {
        setCurrentProduct(updatedProduct);
      }
      
      return updatedProduct;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors de la mise à jour';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct]);

  // DELETE
  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.deleteProduct(id);
      
      // Remove from products list
      setProducts(prev => prev.filter(product => product.id !== id));
      
      // Clear current product if it's the one being deleted
      if (currentProduct?.id === id) {
        setCurrentProduct(null);
      }
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors de la suppression';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct]);

  // Search products
  const searchProducts = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      await getProducts();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productService.searchProducts(query);
      setProducts(response.products);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors de la recherche';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getProducts]);

  // Products by category
  const getProductsByCategory = useCallback(async (category: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProductsByCategory(category);
      setProducts(response.products);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur lors du filtrage';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get all categories
  const getAllCategories = useCallback(async (): Promise<void> => {
    try {
      const categoriesList = await productService.getAllCategories();
      setCategories(categoriesList);
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  }, []);

  // Utilities
  const clearError = useCallback(() => setError(null), []);
  const clearCurrentProduct = useCallback(() => setCurrentProduct(null), []);

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    categories,
    
    // CRUD Operations
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    
    // Filtering
    searchProducts,
    getProductsByCategory,
    getAllCategories,
    
    // Utilities
    clearError,
    clearCurrentProduct,
  };
};