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
  const itemsPerPage = 10;

  // 🔹 Load API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cats = await fetchAllCategories();
        setCategories(['all', ...cats]);

        const res = await fetchAllProducts(1, 1000);
        setProducts(res.products);
      } catch {
        setError('Erreur de chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 CRUD CORRIGÉ
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(), // ✅ ID UNIQUE
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

  // 🔹 Filtres
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (selectedCategory !== 'all') {
      data = data.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  }, [products, selectedCategory, searchQuery]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    products: paginatedProducts,
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

    addProduct,
    editProduct,
    deleteProduct,
  };
};
