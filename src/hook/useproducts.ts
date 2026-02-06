// src/hooks/admin/useProducts.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadProductsFromStorage, saveProductsToStorage } from '../utils/productStorage';
import { useDummyJsonPagination } from '../context/PaginationContext';
import apiService from '../api/apiservice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  categories?: string[];
}

export const useProducts = () => {
  const queryClient = useQueryClient();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const pagination = useDummyJsonPagination();

  // 1. Récupérer TOUS les produits API avec TanStack Query
  const { 
    data: apiProductsData = [], 
    isLoading: apiLoading,
    isFetching: apiFetching,
    error: apiError,
    refetch: refetchApiProducts 
  } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async (): Promise<Product[]> => {
      try {
        // Pour DummyJSON, on récupère tout en une seule requête
        const result = await apiService.get<ApiResponse>('products', {
          limit: '100', // Maximum de DummyJSON
          skip: '0'
        });
        
        return (result.products || []).map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          stock: p.stock || 0,
          category: p.category || 'Uncategorized',
          thumbnail: p.thumbnail || '',
          brand: p.brand,
          rating: p.rating,
          discountPercentage: p.discountPercentage,
          description: p.description,
        }));
      } catch (error) {
        console.error('Erreur API:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // 2. Charger les produits locaux
  useEffect(() => {
    const loadedLocalProducts = loadProductsFromStorage();
    const sortedLocalProducts = loadedLocalProducts.sort((a, b) => b.id - a.id);
    setLocalProducts(sortedLocalProducts);
  }, []);

  // 3. Fusionner tous les produits
  useEffect(() => {
    const all = [...localProducts, ...apiProductsData];
    setAllProducts(all);
    
    // Mettre à jour la pagination
    if (pagination.updateFromApiResponse) {
      pagination.updateFromApiResponse({
        products: apiProductsData,
        total: apiProductsData.length,
        skip: 0,
        limit: apiProductsData.length,
      });
    }
  }, [apiProductsData, localProducts, pagination]);

  // 4. Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResult = await apiService.get<string[]>('products/categories');
        const apiCategories = Array.isArray(categoriesResult) ? categoriesResult : [];
        
        const localCats = localProducts
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat && cat.trim()));
        
        const uniqueCategories = ['all', ...new Set([...apiCategories, ...localCats])]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
        const localCats = localProducts
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat && cat.trim()));
        
        const uniqueLocalCats = ['all', ...new Set(localCats)]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        
        setCategories(uniqueLocalCats);
      }
    };
    
    loadCategories();
  }, [localProducts]);

  // 5. Fonction pour supprimer un produit (corrigée)
  const deleteProduct = useCallback((productId: number) => {
    return new Promise<void>((resolve) => {
      if (productId > 1000) {
        // Produit local
        const updatedLocal = localProducts.filter(p => p.id !== productId);
        setLocalProducts(updatedLocal);
        saveProductsToStorage(updatedLocal);
        
        // Mettre à jour allProducts immédiatement
        setAllProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        // Produit API - simulation
        console.log(`Suppression API simulée: ${productId}`);
        
        // Filtrer le produit API des données locales (simulation)
        setAllProducts(prev => prev.filter(p => p.id !== productId));
      }
      
      // Invalider le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      resolve();
    });
  }, [localProducts, queryClient]);

  // 6. Mutation pour supprimer (version optimisée)
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Recharger les catégories après suppression
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories', 'all'] });
    },
  });

  // 7. Fonction de recherche/filtrage
  const searchProducts = useCallback((query: string, category?: string) => {
    return allProducts.filter(product => {
      // Filtre par catégorie
      if (category && category !== 'all') {
        if (product.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }
      
      // Filtre par recherche
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          product.title.toLowerCase().includes(q) ||
          (product.brand?.toLowerCase().includes(q) ?? false) ||
          product.category.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q)
        );
      }
      
      return true;
    });
  }, [allProducts]);

  // 8. Produits filtrés
  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory !== 'all' ? selectedCategory : undefined);
  }, [searchProducts, searchQuery, selectedCategory]);

  return {
    // Données complètes
    allProducts: filteredProducts, // Tous les produits filtrés
    products: filteredProducts, // Alias pour compatibilité
    rawAllProducts: allProducts, // Tous les produits sans filtrage
    
    // États
    loading: apiLoading,
    isFetching: apiFetching,
    error: apiError ? (apiError as Error).message : null,
    
    // Catégories
    categories,
    
    // Recherche et filtres
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    searchProducts,
    
    // Pagination (pour compatibilité)
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    itemsPerPage: pagination.itemsPerPage,
    goToPage: pagination.goToPage,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    goToFirstPage: pagination.goToFirstPage,
    goToLastPage: pagination.goToLastPage,
    
    // Actions - CORRIGÉ : passer directement la fonction
    deleteProduct: deleteProduct, // Passe la fonction directement, pas la mutation
    handleDeleteProduct: (product: Product) => {
      if (window.confirm(`Voulez-vous vraiment supprimer "${product.title}" ?`)) {
        deleteProduct(product.id);
      }
    },
    
    // Pour les mutations si besoin ailleurs
    deleteMutation,
    
    // Autres actions
    addProduct: useCallback((productData: Omit<Product, 'id'>) => {
      const maxId = Math.max(0, ...allProducts.map(p => p.id));
      const newProduct: Product = { ...productData, id: maxId + 1 };
      
      const updatedLocal = [newProduct, ...localProducts];
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      // Mettre à jour allProducts
      setAllProducts(prev => [newProduct, ...prev]);
      
      return newProduct;
    }, [allProducts, localProducts]),
    
    editProduct: useCallback((updatedProduct: Product) => {
      const updatedLocal = localProducts.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      // Mettre à jour allProducts
      setAllProducts(prev => prev.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      
      return updatedProduct;
    }, [localProducts]),
    
    // Rechargement
    refetchApiProducts,
    
    // Statistiques
    localProductsCount: localProducts.length,
    apiProductsCount: apiProductsData.length,
    totalProducts: filteredProducts.length,
  };
};