import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products/categories');
      
      if (!response.ok) throw new Error('Erreur API');
      
      const data = await response.json();
      
      // Formater en tableau de strings
      const categoryList = data.map((cat: any) => {
        // S'assurer qu'on a toujours une string
        if (typeof cat === 'string') return cat;
        // Si c'est un objet, prendre le slug ou le name
        if (cat && typeof cat === 'object') {
          return cat.slug || cat.name || String(cat);
        }
        return String(cat);
      }).filter((cat: string) => cat && cat.trim() !== ''); // Filtrer les valeurs vides
      
      setCategories(['all', ...categoryList]);
      setError(null);
      
    } catch (err) {
      setError('Impossible de charger les catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fonction pour rafraîchir
  const refreshCategories = () => {
    fetchCategories();
  };

  // Fonction pour filtrer des produits par catégorie
  const filterProductsByCategory = (products: any[], category: string) => {
    if (category === 'all' || !category) return products;
    return products.filter(product => {
      const productCategory = product.category?.toLowerCase?.() || '';
      return productCategory === category.toLowerCase();
    });
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
  };
};