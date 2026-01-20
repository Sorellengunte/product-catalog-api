// src/hook/useProductsPage.ts
import { useState, useEffect, useCallback } from 'react';
import { useDummyJsonPagination } from '../api/PaginationContext';
import { 
  loadProductsFromStorage, 
  saveProductsToStorage 
} from '../utils/productStorage';

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

export const useProductsPage = () => {
  // États du CRUD
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Contexte de pagination
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updateFromApiResponse,
    getQueryString
  } = useDummyJsonPagination();

  // ==================== PARTIE API DummyJSON ====================
  
  // Charger les produits depuis l'API avec pagination
  const loadApiProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construire l'URL selon la catégorie
      let url: string;
      const queryString = getQueryString(); // ?limit=12&skip=0
      
      if (selectedCategory && selectedCategory !== 'all') {
        // Utiliser l'endpoint de catégorie DummyJSON
        url = `https://dummyjson.com/products/category/${selectedCategory}${queryString}`;
      } else {
        // Pagination normale
        url = `https://dummyjson.com/products${queryString}`;
      }
      
      console.log('📡 Chargement API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Pour les catégories, la structure peut varier
      const productsData = selectedCategory !== 'all' 
        ? data.products || data  // Certains endpoints retournent directement
        : data.products;
      
      const transformedProducts: Product[] = (productsData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        stock: item.stock,
        category: item.category,
        thumbnail: item.thumbnail,
        brand: item.brand || '',
        rating: item.rating || 0,
        discountPercentage: item.discountPercentage || 0,
        description: item.description || ''
      }));
      
      setApiProducts(transformedProducts);
      
      // Mettre à jour la pagination avec la réponse API
      updateFromApiResponse({
        products: transformedProducts,
        total: data.total || 0,
        skip: data.skip || 0,
        limit: data.limit || itemsPerPage
      });
      
      setError(null);
      
    } catch (err) {
      console.error('❌ Erreur API:', err);
      setError('Impossible de charger les produits depuis l\'API');
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedCategory, getQueryString, updateFromApiResponse]);

  // ==================== PARTIE CRUD Local ====================
  
  // Charger les produits locaux depuis localStorage
  const loadLocalProducts = useCallback(() => {
    try {
      const loadedProducts = loadProductsFromStorage();
      // Produits locaux triés par ID décroissant (plus récents d'abord)
      const sortedProducts = loadedProducts.sort((a, b) => b.id - a.id);
      setLocalProducts(sortedProducts);
    } catch (err) {
      console.error('❌ Erreur chargement local:', err);
      setLocalProducts([]);
    }
  }, []);

  // AJOUTER un produit local
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    try {
      // ID pour produits locaux (commence à 1001 pour éviter les conflits)
      const maxLocalId = Math.max(0, ...localProducts.map(p => p.id), 1000);
      const newId = maxLocalId + 1;
      
      const newProduct: Product = {
        ...productData,
        id: newId,
      };
      
      // Ajouter au DÉBUT des produits locaux
      const updatedLocalProducts = [newProduct, ...localProducts];
      setLocalProducts(updatedLocalProducts);
      saveProductsToStorage(updatedLocalProducts);
      
      console.log('✅ Produit ajouté:', newProduct);
      return newProduct;
      
    } catch (err) {
      console.error('❌ Erreur ajout produit:', err);
      throw err;
    }
  }, [localProducts]);

  // ÉDITER un produit
  const editProduct = useCallback((updatedProduct: Product) => {
    try {
      const isLocalProduct = updatedProduct.id > 1000;
      
      let updatedLocalProducts = [...localProducts];
      
      if (isLocalProduct) {
        // C'est un produit local existant
        const productIndex = localProducts.findIndex(p => p.id === updatedProduct.id);
        
        if (productIndex !== -1) {
          updatedLocalProducts[productIndex] = updatedProduct;
        } else {
          updatedLocalProducts = [updatedProduct, ...updatedLocalProducts];
        }
        
        // Re-trier
        updatedLocalProducts.sort((a, b) => b.id - a.id);
        setLocalProducts(updatedLocalProducts);
        saveProductsToStorage(updatedLocalProducts);
      } else {
        // C'est un produit API - on le convertit en local avec nouvel ID
        const maxLocalId = Math.max(0, ...localProducts.map(p => p.id), 1000);
        const convertedProduct = {
          ...updatedProduct,
          id: maxLocalId + 1
        };
        
        const updatedLocalProducts = [convertedProduct, ...localProducts];
        setLocalProducts(updatedLocalProducts);
        saveProductsToStorage(updatedLocalProducts);
      }
      
      console.log('✅ Produit modifié:', updatedProduct);
      return updatedProduct;
      
    } catch (err) {
      console.error('❌ Erreur modification produit:', err);
      throw err;
    }
  }, [localProducts]);

  // SUPPRIMER un produit
  const deleteProduct = useCallback((id: number) => {
    try {
      const updatedLocalProducts = localProducts.filter(p => p.id !== id);
      setLocalProducts(updatedLocalProducts);
      saveProductsToStorage(updatedLocalProducts);
      
      console.log('🗑️ Produit supprimé:', id);
      
    } catch (err) {
      console.error('❌ Erreur suppression produit:', err);
      throw err;
    }
  }, [localProducts]);

  // ==================== COMBINAISON & FILTRAGE ====================
  
  // Charger initialement
  useEffect(() => {
    loadLocalProducts();
  }, [loadLocalProducts]);

  // Recharger les produits API quand la page ou la catégorie change
  useEffect(() => {
    loadApiProducts();
  }, [currentPage, selectedCategory, loadApiProducts]);

  // Combiner produits locaux et API
  const allProducts = [...localProducts, ...apiProducts];

  // Filtrer par recherche (côté client)
  const getFilteredProducts = useCallback(() => {
    let filtered = allProducts;
    
    // Filtre par catégorie
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filtre par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  const filteredProducts = getFilteredProducts();

  // Réinitialiser à la page 1 quand on recherche ou change de catégorie
  useEffect(() => {
    if (searchQuery.trim() || selectedCategory !== 'all') {
      goToPage(1);
    }
  }, [searchQuery, selectedCategory, goToPage]);

  // Obtenir les catégories uniques
  const getCategories = useCallback(() => {
    // Combiner catégories API + locales
    const allCategories = [...new Set([
      ...apiProducts.map(p => p.category),
      ...localProducts.map(p => p.category)
    ])];
    
    return ['all', ...allCategories.sort()];
  }, [apiProducts, localProducts]);

  // Recherche avancée (dans tous les produits)
  const searchAllProducts = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      return (data.products || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        stock: item.stock,
        category: item.category,
        thumbnail: item.thumbnail,
        brand: item.brand || '',
        rating: item.rating || 0,
        discountPercentage: item.discountPercentage || 0,
        description: item.description || ''
      }));
    } catch (err) {
      console.error('❌ Erreur recherche:', err);
      return [];
    }
  }, []);

  // Gestion de la recherche avec délai
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    goToPage(1);
  }, [goToPage]);

  return {
    // ==================== DONNÉES ====================
    
    // Produits combinés et filtrés
    products: filteredProducts,
    
    // Données séparées (pour debug/info)
    localProducts,
    apiProducts,
    allProducts,
    
    // ==================== ÉTATS ====================
    loading,
    error,
    
    // ==================== FILTRES ====================
    searchQuery,
    setSearchQuery: handleSearchChange,
    selectedCategory,
    setSelectedCategory,
    
    // ==================== PAGINATION ====================
    currentPage,
    setCurrentPage: goToPage,
    totalPages,
    totalProducts: totalItems + localProducts.length, // Total API + locaux
    itemsPerPage,
    
    // Navigation
    goToNextPage,
    goToPreviousPage,
    
    // ==================== CATÉGORIES ====================
    categories: getCategories(),
    
    // ==================== CRUD ====================
    // Ajout
    addProduct,
    
    // Modification
    editProduct,
    
    // Suppression
    deleteProduct,
    
    // ==================== FONCTIONS UTILITAIRES ====================
    // Recherche
    searchAllProducts,
    
    // Rechargement
    reloadProducts: () => {
      loadLocalProducts();
      loadApiProducts();
    },
    
    // Réinitialisation
    resetFilters,
    
    // Informations
    getStats: () => ({
      totalLocal: localProducts.length,
      totalApi: apiProducts.length,
      totalFiltered: filteredProducts.length,
      currentCategory: selectedCategory,
      hasSearch: searchQuery.trim().length > 0
    })
  };
};