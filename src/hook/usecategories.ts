import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products/categories');
      
      if (!response.ok) throw new Error('Erreur API');
      
      const data = await response.json();
      
      const categoryList = data.map((cat: any) => {
        if (typeof cat === 'string') return cat;
        if (cat && typeof cat === 'object') {
          return cat.slug || cat.name || String(cat);
        }
        return String(cat);
      }).filter((cat: string) => cat && cat.trim() !== '');
      
      setCategories(['all', ...categoryList]);
      setError(null);
      
    } catch (err) {
      setError('Impossible de charger les catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = () => {
    fetchCategories();
  };

  const filterProductsByCategory = (products: any[], category: string) => {
    if (category === 'all' || !category) return products;
    return products.filter(product => {
      const productCategory = product.category?.toLowerCase?.() || '';
      return productCategory === category.toLowerCase();
    });
  };

  // Fonction pour formater le nom des catégories
  const formatCategoryName = (category: string): string => {
    if (!category || category.trim() === '') return '';
    if (category === 'all') return 'Toutes catégories';
    
    const categoryStr = typeof category === 'string' ? category : String(category);
    
    return categoryStr
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return {
    categories,
    selectedCategory,
    loading,
    error,
    setSelectedCategory,
    filterProductsByCategory,
    refreshCategories,
    selectCategory: (category: string) => setSelectedCategory(category),
    resetCategory: () => setSelectedCategory('all'),
    formatCategoryName,
  };
};