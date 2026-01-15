import { useEffect, useMemo, useState } from 'react';
import { fetchAllProducts, fetchAllCategories } from '../api/ProductApi';

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  stock: number;
  images?: string[];
}

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 🔹 Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Catégories
        const cats = await fetchAllCategories();
        const validCategories = cats
          .map(cat => String(cat).trim())
          .filter(cat => cat.length > 0);
        
        setCategories(['all', ...validCategories]);

        // Produits
        const res = await fetchAllProducts(1, 100);
        setAllProducts(res.products);
        
      } catch (err) {
        console.error('Erreur de chargement:', err);
        setError('Erreur de chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 CRUD amélioré
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: Date.now(),
      };
      
      console.log('Ajout produit:', newProduct);
      setAllProducts(prev => [newProduct, ...prev]);
      
      // Réinitialiser à la page 1 pour voir le nouveau produit
      setCurrentPage(1);
      
      return newProduct;
    } catch (err) {
      console.error('Erreur ajout produit:', err);
      throw err;
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      console.log('Modification produit:', updatedProduct);
      
      setAllProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      
      return updatedProduct;
    } catch (err) {
      console.error('Erreur modification produit:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      console.log('Suppression produit ID:', id);
      setAllProducts(prev => prev.filter(p => p.id !== id));
      
      // Ajuster la pagination si nécessaire
      if (currentPage > 1 && filteredProducts.length <= (currentPage - 1) * itemsPerPage) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      console.error('Erreur suppression produit:', err);
      throw err;
    }
  };

  // 🔹 Filtres
  const filteredProducts = useMemo(() => {
    let data = [...allProducts];

    // Filtre catégorie
    if (selectedCategory !== 'all') {
      data = data.filter(p => 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtre recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return data;
  }, [allProducts, selectedCategory, searchQuery]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Reset page quand filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // 🔹 Sélection de catégorie
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const resetCategory = () => {
    setSelectedCategory('all');
  };

  return {
    // Pour le dashboard: produits paginés
    products: paginatedProducts,
    // Pour le formulaire: tous les produits
    allProducts,
    // Pour les filtres: produits filtrés
    filteredProducts,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectCategory,
    resetCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    addProduct,
    editProduct,
    deleteProduct,
  };
};