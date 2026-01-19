// src/hook/useProductsPage.ts
import { useState, useEffect, useCallback } from 'react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Charger les produits depuis l'API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://dummyjson.com/products?limit=100');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transformer les produits pour correspondre à l'interface Product
      const transformedProducts: Product[] = data.products.map((item: any) => ({
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
      
      setProducts(transformedProducts);
      
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filtrer les produits basé sur la recherche et la pagination
  const getFilteredProducts = useCallback(() => {
    let filtered = products;
    
    // Appliquer le filtre de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      allProducts: filtered,
      paginatedProducts: filtered.slice(startIndex, endIndex),
      totalItems: filtered.length
    };
  }, [products, searchQuery, currentPage]);

  const {paginatedProducts, totalItems } = getFilteredProducts();

  // Réinitialiser à la page 1 quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    // Produits à afficher (paginés)
    products: paginatedProducts,
    
    
   
    
    // États
    loading,
    error,
    
    // Recherche et pagination
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    
    // Fonction pour recharger
    reloadProducts: loadProducts
  };
};