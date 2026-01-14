import { useEffect, useMemo, useState } from 'react';
import { fetchAllProducts, fetchAllCategories } from '../api/ProductApi';

export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  stock: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
        // S'assurer que ce sont des strings
        const validCategories = cats
          .map(cat => String(cat).trim())
          .filter(cat => cat.length > 0);
        
        setCategories(['all', ...validCategories]);

        // Produits
        const res = await fetchAllProducts(1, 100);
        setProducts(res.products);
        
      } catch {
        setError('Erreur de chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 CRUD (inchangé)
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const editProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔹 Filtres simplifiés
  const filteredProducts = useMemo(() => {
    let data = [...products];

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
        p.category.toLowerCase().includes(query)
      );
    }

    return data;
  }, [products, selectedCategory, searchQuery]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return {
    products: paginatedProducts,
    filteredProducts,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    addProduct,
    editProduct,
    deleteProduct,
  };
};