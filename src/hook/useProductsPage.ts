// src/hooks/useProductsPage.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDummyJsonPagination } from '../context/PaginationContext';
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
  // États pour les produits locaux
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  // États pour les produits API (paginés)
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  
  // Contexte de pagination
  const pagination = useDummyJsonPagination();

  // ==================== CHARGEMENT DES PRODUITS LOCAUX ====================
  const loadLocalProducts = useCallback(() => {
    try {
      const loadedProducts = loadProductsFromStorage();
      const sortedProducts = loadedProducts.sort((a, b) => b.id - a.id);
      setLocalProducts(sortedProducts);
    } catch (err) {
      console.error('Erreur chargement local:', err);
      setLocalProducts([]);
    }
  }, []);

  // ==================== CHARGEMENT DES PRODUITS API (PAGINÉS) ====================
  const loadApiProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire l'URL en fonction de la catégorie
      let url: string;
      
      if (selectedCategory !== 'all') {
        // Utiliser l'endpoint de catégorie pour la pagination
        url = `https://dummyjson.com/products/category/${selectedCategory}${pagination.getQueryString()}`;
      } else {
        // Pagination normale
        url = `https://dummyjson.com/products${pagination.getQueryString()}`;
      }
      
      console.log('📡 Chargement API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Données API reçues:', {
        total: data.total,
        count: data.products?.length,
        skip: data.skip,
        limit: data.limit
      });
      
      // Transformer les données
      const transformedProducts: Product[] = (data.products || []).map((item: any) => ({
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
      
      // Mettre à jour la pagination avec la réponse de l'API
      pagination.updateFromApiResponse({
        products: transformedProducts,
        total: data.total || 0,
        skip: data.skip || 0,
        limit: data.limit || pagination.itemsPerPage
      });
      
    } catch (err: any) {
      console.error('❌ Erreur API paginée:', err);
      setError(`Impossible de charger les produits: ${err.message}`);
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination, selectedCategory]);

  // ==================== CHARGEMENT DES CATÉGORIES ====================
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const apiCategories = await response.json();
      
      const loadedLocalProducts = loadProductsFromStorage();
      const localCategories = [...new Set(loadedLocalProducts.map(p => p.category))];
      
      const allCategories = ['all', ...new Set([...apiCategories, ...localCategories])];
      setCategories(allCategories);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      const loadedLocalProducts = loadProductsFromStorage();
      const localCategories = ['all', ...new Set(loadedLocalProducts.map(p => p.category))];
      setCategories(localCategories);
    }
  }, []);

  // ==================== CHARGEMENT INITIAL ====================
  useEffect(() => {
    loadLocalProducts();
    loadCategories();
    loadApiProducts();
  }, []); // Exécuter une seule fois au montage

  // ==================== RE-CHARGEMENT QUAND LA PAGE CHANGE ====================
  useEffect(() => {
    console.log('Page changée:', pagination.currentPage);
    loadApiProducts();
  }, [pagination.currentPage]);

  // ==================== RE-CHARGEMENT QUAND LA CATÉGORIE CHANGE ====================
  useEffect(() => {
    console.log('Catégorie changée:', selectedCategory);
    // Retour à la première page quand la catégorie change
    pagination.goToFirstPage();
    loadApiProducts();
  }, [selectedCategory]);

  // ==================== CRUD LOCAL ====================
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    try {
      // ID pour produits locaux (commence à 1001 pour éviter les conflits)
      const loadedProducts = loadProductsFromStorage();
      const maxLocalId = Math.max(0, ...loadedProducts.map(p => p.id), 1000);
      const newId = maxLocalId + 1;
      
      const newProduct: Product = {
        ...productData,
        id: newId,
      };
      
      // Ajouter au DÉBUT des produits locaux
      const updatedLocalProducts = [newProduct, ...loadedProducts];
      setLocalProducts(updatedLocalProducts);
      saveProductsToStorage(updatedLocalProducts);
      
      // Mettre à jour les catégories
      loadCategories();
      
      console.log('✅ Produit local ajouté:', newProduct);
      return newProduct;
      
    } catch (err) {
      console.error('❌ Erreur ajout produit:', err);
      throw err;
    }
  }, [loadCategories]);

  const editProduct = useCallback((updatedProduct: Product) => {
    try {
      const loadedProducts = loadProductsFromStorage();
      let updatedLocalProducts = [...loadedProducts];
      
      const productIndex = loadedProducts.findIndex(p => p.id === updatedProduct.id);
      
      if (productIndex !== -1) {
        // Mettre à jour le produit existant
        updatedLocalProducts[productIndex] = updatedProduct;
      } else {
        // Ajouter comme nouveau produit local
        const maxLocalId = Math.max(0, ...loadedProducts.map(p => p.id), 1000);
        updatedProduct.id = maxLocalId + 1;
        updatedLocalProducts = [updatedProduct, ...updatedLocalProducts];
      }
      
      // Re-trier
      updatedLocalProducts.sort((a, b) => b.id - a.id);
      setLocalProducts(updatedLocalProducts);
      saveProductsToStorage(updatedLocalProducts);
      
      // Mettre à jour les catégories
      loadCategories();
      
      console.log('✅ Produit modifié:', updatedProduct);
      return updatedProduct;
      
    } catch (err) {
      console.error('❌ Erreur modification produit:', err);
      throw err;
    }
  }, [loadCategories]);

  const deleteProduct = useCallback((id: number) => {
    try {
      const loadedProducts = loadProductsFromStorage();
      const updatedLocalProducts = loadedProducts.filter(p => p.id !== id);
      setLocalProducts(updatedLocalProducts);
      saveProductsToStorage(updatedLocalProducts);
      
      // Mettre à jour les catégories
      loadCategories();
      
      console.log('🗑️ Produit supprimé:', id);
      
    } catch (err) {
      console.error('❌ Erreur suppression produit:', err);
      throw err;
    }
  }, [loadCategories]);

  // ==================== COMBINAISON ET FILTRAGE ====================
  
  // Filtrer les produits locaux par catégorie et recherche
  const filteredLocalProducts = useMemo(() => {
    let filtered = localProducts;
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filtrer par recherche texte
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [localProducts, selectedCategory, searchQuery]);

  // Produits à afficher: locaux filtrés + API de la page courante
  const products = useMemo(() => {
    return [...filteredLocalProducts, ...apiProducts];
  }, [filteredLocalProducts, apiProducts]);

  // Gestionnaires de filtres
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    pagination.goToFirstPage();
  }, [pagination]);

  // Recharger tous les produits
  const reloadProducts = useCallback(() => {
    loadLocalProducts();
    loadApiProducts();
    loadCategories();
  }, [loadLocalProducts, loadApiProducts, loadCategories]);

  // Statistiques
  const stats = useMemo(() => {
    const showingStart = ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1;
    const showingEnd = Math.min(pagination.currentPage * pagination.itemsPerPage, products.length);
    
    return {
      totalLocal: localProducts.length,
      totalApi: pagination.totalItems || 0,
      totalFiltered: products.length,
      totalPages: pagination.totalPages || 1,
      showingStart: showingStart > products.length ? 0 : showingStart,
      showingEnd,
    };
  }, [localProducts.length, pagination, products.length]);

  return {
    // ==================== DONNÉES ====================
    products,
    localProducts,
    apiProducts,
    
    // ==================== ÉTATS ====================
    loading,
    error,
    
    // ==================== FILTRES ====================
    searchQuery,
    setSearchQuery: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    
    // ==================== PAGINATION ====================
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.goToPage,
    totalPages: pagination.totalPages,
    totalProducts: localProducts.length + (pagination.totalItems || 0),
    itemsPerPage: pagination.itemsPerPage,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    goToFirstPage: pagination.goToFirstPage,
    goToLastPage: pagination.goToLastPage,
    
    // ==================== CATÉGORIES ====================
    categories,
    
    // ==================== CRUD ====================
    addProduct,
    editProduct,
    deleteProduct,
    
    // ==================== FONCTIONS UTILITAIRES ====================
    reloadProducts,
    resetFilters,
    getStats: () => stats,
  };
};