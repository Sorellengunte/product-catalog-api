import { useState, useEffect } from 'react';


export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les catégories depuis DummyJSON
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Récupérer les catégories depuis l'API
      const response = await fetch('https://dummyjson.com/products/categories');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      
      const categoryList = data;
      
      // S'assurer que ce sont bien des strings
      const validCategories = categoryList
        .map((cat: any) => {
          if (typeof cat === 'string') return cat;
          if (cat && typeof cat === 'object') {
            return cat.slug || cat.name || String(cat);
          }
          return String(cat);
        })
        .filter((cat: string) => cat && cat.trim() !== '')
        .sort(); 
      
      
      setCategories(['all', ...validCategories]);
      setError(null);
      
      console.log('✅ Catégories chargées:', validCategories.length, 'catégories');
      
    } catch (err) {
      console.error('❌ Erreur chargement catégories:', err);
      setError('Impossible de charger les catégories');
      
      // En cas d'erreur, garder seulement "all"
      setCategories(['all']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtre SIMPLE - vérifie l'égalité exacte
  const filterProductsByCategory = (products: any[], category: string) => {
    if (category === 'all' || !category || !products) return products;
    
    return products.filter(product => {
      if (!product || !product.category) return false;
      
      const productCategory = product.category.toLowerCase().trim();
      const selectedCategoryLower = category.toLowerCase().trim();
      
      return productCategory === selectedCategoryLower;
    });
  };

  // Formater le nom pour l'affichage (optionnel)
  const formatCategoryName = (category: string): string => {
    if (!category || category.trim() === '') return '';
    if (category === 'all') return 'Toutes catégories';
    
    // Convertir 
    return category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => {
        // Gérer les pluriels spéciaux
        if (word === 'womens') return "Women's";
        if (word === 'mens') return "Men's";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  return {
    // États
    categories,
    selectedCategory,
    loading,
    error,
    
    // Actions
    setSelectedCategory,
    selectCategory: (category: string) => setSelectedCategory(category),
    resetCategory: () => setSelectedCategory('all'),
    
    // Fonctions utilitaires
    filterProductsByCategory,
    formatCategoryName,
    
    // Rafraîchir
    refreshCategories: fetchCategories
  };
};