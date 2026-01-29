import { useState, useEffect, useCallback } from 'react';
import { loadProductsFromStorage, saveProductsToStorage } from '../utils/productStorage';
import { useDummyJsonPagination } from '../context/PaginationContext';
import apiService from '../api/apiservice';

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
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['all']);

  const pagination = useDummyJsonPagination();

  // ==================== CHARGEMENT PRODUITS ====================
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Charger les produits locaux
      const loadedLocalProducts = loadProductsFromStorage();
      const sortedLocalProducts = loadedLocalProducts.sort((a, b) => b.id - a.id);
      setLocalProducts(sortedLocalProducts);

      // 2. Récupérer les produits depuis l'API
      const params: Record<string, string> = {
        limit: String(pagination.itemsPerPage),
        skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
      };

      // Appel API avec gestion du type
      const result = await apiService.get<ApiResponse>('products', params);
      if (!result) {
        throw new Error('Aucune réponse de l\'API');
      }

      // Transformation des produits API
      const apiProductsData = (result.products || []).map(p => ({
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
      })).sort((a, b) => a.id - b.id);

      setApiProducts(apiProductsData);

      // 3. Combiner les produits (locaux d'abord)
      setAllProducts([...sortedLocalProducts, ...apiProductsData]);

      // 4. Charger les catégories si disponibles
      if (result.categories && Array.isArray(result.categories)) {
        const apiCategories = result.categories.filter(cat => 
          typeof cat === 'string' && cat.trim() !== ''
        );
        const localCategories = [...new Set(sortedLocalProducts.map(p => p.category))];
        const allCategories = ['all', ...new Set([...apiCategories, ...localCategories])];
        setCategories(allCategories.sort((a, b) => a.localeCompare(b)));
      } else {
        // Fallback: charger les catégories séparément
        loadCategories();
      }

      // 5. Mettre à jour la pagination
      if (pagination.updateFromApiResponse) {
        pagination.updateFromApiResponse({
          products: apiProductsData,
          total: result.total,
          skip: result.skip,
          limit: result.limit,
        });
      }

    } catch (err: any) {
      console.error('Erreur chargement:', err);
      setError(err.message || 'Erreur de chargement des produits');

      // Utiliser uniquement les produits locaux en cas d'erreur
      const loadedLocalProducts = loadProductsFromStorage();
      setAllProducts(loadedLocalProducts.sort((a, b) => b.id - a.id));
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // ==================== CHARGEMENT CATÉGORIES ====================
  const loadCategories = useCallback(async () => {
    try {
      // Appel API pour les catégories
      const categoriesResult = await apiService.get<string[]>('products/categories');
      
      if (!categoriesResult) {
        throw new Error('Aucune réponse pour les catégories');
      }

      let apiCategories: string[] = [];
      
      if (Array.isArray(categoriesResult)) {
        apiCategories = categoriesResult;
      }

      // Filtrer et nettoyer
      apiCategories = apiCategories.filter(
        (cat): cat is string => typeof cat === 'string' && cat.trim() !== ''
      );

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
  }, [localProducts]);

  // ==================== CRUD API ====================

  // POST - Créer un produit sur l'API
  const createProductOnApi = useCallback(async (productData: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      
      // Appel API POST
      const createdResult = await apiService.post<Product>('products/add', productData);
      
      if (!createdResult) {
        throw new Error('Échec de la création du produit');
      }
      
      // Ajouter aussi en local pour cohérence
      const maxId = Math.max(0, ...allProducts.map(p => p.id));
      const localProduct: Product = { ...productData, id: maxId + 1 };
      
      const updatedLocal = [localProduct, ...localProducts];
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      setAllProducts(prev => [localProduct, ...prev]);
      
      // Recharger les catégories
      loadCategories();
      
      return createdResult;
    } catch (err: any) {
      setError(err.message || 'Erreur création produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [allProducts, localProducts, loadCategories]);

  // PUT - Mettre à jour complètement un produit sur l'API
  const updateProductOnApi = useCallback(async (id: number, productData: Product) => {
    try {
      setLoading(true);
      
      // Appel API PUT
      const updatedResult = await apiService.put<Product>(`products/${id}`, productData);
      
      if (!updatedResult) {
        throw new Error('Échec de la mise à jour du produit');
      }
      
      // Mettre à jour aussi la version locale si c'est un produit local
      const updatedLocal = localProducts.map(p => 
        p.id === id ? { ...productData, id } : p
      );
      
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      setAllProducts(prev => prev.map(p => 
        p.id === id ? { ...productData, id } : p
      ));
      
      return updatedResult;
    } catch (err: any) {
      setError(err.message || 'Erreur mise à jour produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [localProducts]);

  // PATCH - Mettre à jour partiellement un produit sur l'API
  const patchProductOnApi = useCallback(async (id: number, partialData: Partial<Product>) => {
    try {
      setLoading(true);
      
      // Appel API PATCH
      const patchedResult = await apiService.patch<Product>(`products/${id}`, partialData);
      
      if (!patchedResult) {
        throw new Error('Échec de la modification du produit');
      }
      
      // Mettre à jour aussi la version locale
      const updatedLocal = localProducts.map(p => 
        p.id === id ? { ...p, ...partialData } : p
      );
      
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      setAllProducts(prev => prev.map(p => 
        p.id === id ? { ...p, ...partialData } : p
      ));
      
      return patchedResult;
    } catch (err: any) {
      setError(err.message || 'Erreur modification produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [localProducts]);

  // DELETE - Supprimer un produit de l'API
  const deleteProductFromApi = useCallback(async (id: number) => {
    try {
      setLoading(true);
      
      // Appel API DELETE
      const deleteResult = await apiService.delete<{ id: number; deleted: boolean }>(`products/${id}`);
      
      if (!deleteResult) {
        throw new Error('Échec de la suppression du produit');
      }
      
      // Supprimer aussi de la liste locale
      const updatedLocal = localProducts.filter(p => p.id !== id);
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      setAllProducts(prev => prev.filter(p => p.id !== id));
      
      // Recharger les produits API
      await loadProducts();
      
      return deleteResult;
    } catch (err: any) {
      setError(err.message || 'Erreur suppression produit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [localProducts, loadProducts]);

  // GET avec recherche sur l'API
  const searchProductsOnApi = useCallback(async (query: string) => {
    try {
      setLoading(true);
      
      // Appel API GET avec recherche
      const searchResult = await apiService.get<ApiResponse>('products/search', {
        q: query,
        limit: String(pagination.itemsPerPage),
        skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
      });
      
      if (!searchResult) {
        throw new Error('Aucun résultat de recherche');
      }
      
      const products: Product[] = (searchResult.products || []).map(p => ({
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
      
      setApiProducts(products);
      
      if (pagination.updateFromApiResponse) {
        pagination.updateFromApiResponse({
          products,
          total: searchResult.total || 0,
          skip: searchResult.skip || 0,
          limit: searchResult.limit || pagination.itemsPerPage,
        });
      }
      
      return products;
    } catch (err: any) {
      setError(err.message || 'Erreur recherche produits');
      return [];
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // ==================== CRUD LOCAL ====================
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const maxId = Math.max(0, ...allProducts.map(p => p.id));
    const newProduct: Product = { ...productData, id: maxId + 1 };

    const updatedLocalProducts = [newProduct, ...localProducts];
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);

    setAllProducts(prev => [newProduct, ...prev]);
    
    // Mettre à jour les catégories
    loadCategories();
    
    return newProduct;
  }, [allProducts, localProducts, loadCategories]);

  const editProduct = useCallback((updatedProduct: Product) => {
    const updatedLocalProducts = localProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);

    setAllProducts(prev => prev.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    
    return updatedProduct;
  }, [localProducts]);

  const deleteProduct = useCallback((id: number) => {
    const updatedLocalProducts = localProducts.filter(p => p.id !== id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);

    setAllProducts(prev => prev.filter(p => p.id !== id));
    
    // Mettre à jour les catégories
    loadCategories();
  }, [localProducts, loadCategories]);

  // ==================== FILTRAGE & PAGINATION ====================
  const searchProducts = useCallback((query: string, category?: string) => {
    const searchTerm = query?.toLowerCase().trim() || '';
    return allProducts.filter(p => {
      if (category && category !== 'all' && p.category.toLowerCase() !== category.toLowerCase()) 
        return false;
      if (!searchTerm) return true;
      return p.title.toLowerCase().includes(searchTerm)
        || p.brand?.toLowerCase().includes(searchTerm)
        || p.category.toLowerCase().includes(searchTerm)
        || p.description?.toLowerCase().includes(searchTerm);
    });
  }, [allProducts]);

  const getPaginatedProducts = useCallback(() => {
    const itemsPerPage = pagination.itemsPerPage;
    const startIndex = (pagination.currentPage - 1) * itemsPerPage;
    return allProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [allProducts, pagination.currentPage, pagination.itemsPerPage]);

  // Charger au démarrage et quand la page change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    products: allProducts,
    localProducts,
    apiProducts,
    paginatedProducts: getPaginatedProducts(),
    loading,
    error,
    categories,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    itemsPerPage: pagination.itemsPerPage,
    
    // CRUD local
    addProduct,
    editProduct,
    deleteProduct,
    
    // CRUD API
    createProductOnApi,
    updateProductOnApi,
    patchProductOnApi,
    deleteProductFromApi,
    searchProductsOnApi,
    
    // Recherche et pagination
    searchProducts,
    loadProducts,
    loadCategories,
    
    // Navigation pagination
    goToPage: pagination.goToPage,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    goToFirstPage: pagination.goToFirstPage,
    goToLastPage: pagination.goToLastPage,
  };
};