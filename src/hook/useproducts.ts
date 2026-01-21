// src/hook/useProducts.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  loadProductsFromStorage, 
  saveProductsToStorage
} from '../utils/productStorage';
import { useDummyJsonPagination } from '../api/PaginationContext';

export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
  description?: string;
}

export const useProducts = () => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le contexte de pagination
  const pagination = useDummyJsonPagination();

  // Charger les produits depuis l'API et localStorage avec pagination
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Utiliser les paramètres de pagination pour l'API
      const apiUrl = `https://dummyjson.com/products${pagination.getQueryString()}`;
      
      // 1. Charger depuis l'API avec pagination
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      // Transformation des produits API
      const apiProductsData = data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        category: product.category, 
        thumbnail: product.thumbnail,
        brand: product.brand,
        rating: product.rating,
        discountPercentage: product.discountPercentage,
        description: product.description
      })).sort((a: Product, b: Product) => a.id - b.id);
      
      // 2. Charger depuis localStorage (produits locaux)
      const loadedLocalProducts = loadProductsFromStorage();
      const sortedLocalProducts = loadedLocalProducts.sort((a, b) => b.id - a.id);
      
      setLocalProducts(sortedLocalProducts);
      
      // 3. Combiner les produits (locaux d'abord, puis API)
      const allProductsSorted = [
        ...sortedLocalProducts,  
        ...apiProductsData       
      ];
      
      setAllProducts(allProductsSorted);
      setError(null);
      
      // 4. Mettre à jour la pagination avec la réponse de l'API
      pagination.updateFromApiResponse({
        products: apiProductsData,
        total: data.total || 0,
        skip: data.skip || 0,
        limit: data.limit || 10
      });
      
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur de chargement des produits');
      
      // En cas d'erreur API, utiliser seulement les produits locaux
      const loadedLocalProducts = loadProductsFromStorage();
      setAllProducts(loadedLocalProducts.sort((a, b) => b.id - a.id));
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Charger au démarrage
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Recharger quand la page change
  useEffect(() => {
    if (pagination.currentPage > 1) {
      loadProducts();
    }
  }, [pagination.currentPage, loadProducts]);

  // AJOUTER un produit
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const maxId = Math.max(0, ...allProducts.map(p => p.id));
    const newId = maxId + 1;
    
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    
    // Ajouter au DÉBUT des produits locaux
    const updatedLocalProducts = [newProduct, ...localProducts];
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    // Ajouter au DÉBUT de tous les produits
    setAllProducts(prev => [newProduct, ...prev]);
    
    return newProduct;
  }, [allProducts, localProducts]);

  // MODIFIER un produit
  const editProduct = useCallback((updatedProduct: Product) => {
    const isLocalProduct = updatedProduct.id > 1000;
    const productIndex = localProducts.findIndex(p => p.id === updatedProduct.id);
    let updatedLocalProducts = [...localProducts];
    
    if (productIndex !== -1) {
      updatedLocalProducts[productIndex] = updatedProduct;
    } else if (isLocalProduct) {
      updatedLocalProducts = [updatedProduct, ...updatedLocalProducts];
    } else {
      updatedLocalProducts.push(updatedProduct);
    }
    
    updatedLocalProducts.sort((a, b) => b.id - a.id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    // Mettre à jour tous les produits
    setAllProducts(prev => {
      const productIndex = prev.findIndex(p => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        const updated = [...prev];
        updated[productIndex] = updatedProduct;
        return [
          ...updated.filter(p => p.id > 1000).sort((a, b) => b.id - a.id),
          ...updated.filter(p => p.id <= 1000).sort((a, b) => a.id - b.id)
        ];
      } else {
        if (isLocalProduct) {
          return [updatedProduct, ...prev];
        } else {
          const newProducts = [...prev, updatedProduct];
          return [
            ...newProducts.filter(p => p.id > 1000).sort((a, b) => b.id - a.id),
            ...newProducts.filter(p => p.id <= 1000).sort((a, b) => a.id - b.id)
          ];
        }
      }
    });
    
    return updatedProduct;
  }, [localProducts]);

  // SUPPRIMER un produit
  const deleteProduct = useCallback((id: number) => {
    const updatedLocalProducts = localProducts.filter(p => p.id !== id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    setAllProducts(prev => prev.filter(p => p.id !== id));
  }, [localProducts]);

  // RECHERCHER des produits avec pagination locale
  const searchProducts = useCallback((query: string, category?: string) => {
    if (!query.trim() && !category) return allProducts;
    
    const searchTerm = query.toLowerCase().trim();
    
    return allProducts.filter(product => {
      if (category && category !== 'all') {
        if (product.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }
      
      if (searchTerm) {
        const matchesTitle = product.title.toLowerCase().includes(searchTerm);
        const matchesBrand = product.brand?.toLowerCase().includes(searchTerm) || false;
        const matchesCategory = product.category.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description?.toLowerCase().includes(searchTerm) || false;
        
        return matchesTitle || matchesBrand || matchesCategory || matchesDescription;
      }
      
      return true;
    });
  }, [allProducts]);

  // Obtenir les produits paginés pour l'admin (tous les produits)
  const getPaginatedProducts = useCallback(() => {
    const itemsPerPage = 12;
    const startIndex = (pagination.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return allProducts.slice(startIndex, endIndex);
  }, [allProducts, pagination.currentPage]);

  // Fonction pour obtenir les catégories
  const getCategories = useCallback(() => {
    const allCats = allProducts.map(p => p.category);
    return ['all', ...Array.from(new Set(allCats))];
  }, [allProducts]);

  return {
    // Tous les produits
    products: allProducts,
    
    // Produits paginés pour l'admin
    paginatedProducts: getPaginatedProducts(),
    
    // Informations de pagination
    currentPage: pagination.currentPage,
    totalPages: Math.max(1, Math.ceil(allProducts.length / 12)),
    itemsPerPage: 12,
    
    // États
    loading,
    error,
    
    // Catégories
    categories: getCategories(),
    
    // Fonctions
    loadProducts,
    addProduct,
    editProduct,
    deleteProduct,
    searchProducts,
    
    // Fonctions de pagination du contexte
    goToPage: pagination.goToPage,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    goToFirstPage: pagination.goToFirstPage,
    goToLastPage: pagination.goToLastPage,
  };
};