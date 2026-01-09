import { useState, useEffect } from 'react';
import { fetchAllProducts, fetchAllCategories } from '../api/ProductApi';

export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  rating: number;
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesData = await fetchAllCategories();
        setCategories(['all', ...categoriesData]);

        const response = await fetchAllProducts(1, 1000);
        setProducts(response.products);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 Filtrer par catégorie
  const filteredByCategory =
    selectedCategory === 'all'
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // 🔹 Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageProducts = filteredByCategory.slice(indexOfFirstItem, indexOfLastItem);

  // 🔹 Recherche sur la page actuelle seulement
  const searchedProducts = searchQuery
    ? currentPageProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : currentPageProducts;

  const totalPages = Math.ceil(filteredByCategory.length / itemsPerPage);

  return {
    products: searchedProducts,
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
  };
};
