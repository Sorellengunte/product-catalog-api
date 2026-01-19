import { useState, useEffect, useCallback } from 'react';
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

export const useProducts = () => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les produits depuis l'API et localStorage
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Charger depuis l'API
      const response = await fetch('https://dummyjson.com/products?limit=100');
      const data = await response.json();
      
      // Transformation des produits API avec leurs catégories 
      const apiProductsData = data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        category: product.category, 
        thumbnail: product.thumbnail,
        brand: product.brand,
        rating: product.rating,
        discountPercentage: product.discountPercentage,
        description: product.description
      })).sort((a: Product, b: Product) => a.id - b.id); // Tri API par ID croissant
      
      // 2. Charger depuis localStorage (produits locaux)
      const loadedLocalProducts = loadProductsFromStorage();
      
      // Produits locaux triés par ID décroissant (plus récents d'abord)
      const sortedLocalProducts = loadedLocalProducts.sort((a, b) => b.id - a.id);
      setLocalProducts(sortedLocalProducts);
  
      const allProductsSorted = [
        ...sortedLocalProducts,  
        ...apiProductsData       
      ];
      
      setAllProducts(allProductsSorted);
      setError(null);
      
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur de chargement des produits');
      
      // En cas d'erreur API, utiliser seulement les produits locaux
      const loadedLocalProducts = loadProductsFromStorage();
      setAllProducts(loadedLocalProducts.sort((a, b) => b.id - a.id)); // Plus récents d'abord
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger au démarrage
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // AJOUTER un produit au DÉBUT
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    // Générer un ID unique très grand (pour distinguer des produits API)
    // Utiliser Date.now() pour garantir que l'ID est toujours plus grand
    const maxId = Math.max(0, ...allProducts.map(p => p.id));
    const newId = maxId + 1;
    
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    
    // Ajouter au DÉBUT des produits locaux
    const updatedLocalProducts = [newProduct, ...localProducts];
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    // Ajouter au DÉBUT de tous les produits
    setAllProducts(prev => [newProduct, ...prev]);
    
    return newProduct;
  }, [allProducts, localProducts]);

  // MODIFIER un produit
  const editProduct = useCallback((updatedProduct: Product) => {
    // Vérifier si c'est un produit local (ID > 1000) ou API
    const isLocalProduct = updatedProduct.id > 1000;
    
    // Mettre à jour dans les produits locaux
    const productIndex = localProducts.findIndex(p => p.id === updatedProduct.id);
    let updatedLocalProducts = [...localProducts];
    
    if (productIndex !== -1) {
      // Remplacer le produit existant
      updatedLocalProducts[productIndex] = updatedProduct;
    } else if (isLocalProduct) {
      // Ajouter comme nouveau produit local (au début)
      updatedLocalProducts = [updatedProduct, ...updatedLocalProducts];
    } else {
      // Produit API : ajouter à la fin
      updatedLocalProducts.push(updatedProduct);
    }
    
    // Trier par ID décroissant pour garder les plus récents d'abord
    updatedLocalProducts.sort((a, b) => b.id - a.id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    // Mettre à jour tous les produits
    setAllProducts(prev => {
      const productIndex = prev.findIndex(p => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        // Remplacer le produit existant
        const updated = [...prev];
        updated[productIndex] = updatedProduct;
        // Reconstruire l'ordre : locaux d'abord (ID décroissant), puis API (ID croissant)
        return [
          ...updated.filter(p => p.id > 1000).sort((a, b) => b.id - a.id), // Locaux
          ...updated.filter(p => p.id <= 1000).sort((a, b) => a.id - b.id) // API
        ];
      } else {
        // Ajouter comme nouveau produit
        if (isLocalProduct) {
          return [updatedProduct, ...prev]; // Local: ajouter au début
        } else {
          // API: ajouter à la fin et reconstruire l'ordre
          const newProducts = [...prev, updatedProduct];
          return [
            ...newProducts.filter(p => p.id > 1000).sort((a, b) => b.id - a.id), // Locaux
            ...newProducts.filter(p => p.id <= 1000).sort((a, b) => a.id - b.id) // API
          ];
        }
      }
    });
    
    return updatedProduct;
  }, [localProducts]);

  // SUPPRIMER un produit
  const deleteProduct = useCallback((id: number) => {
    // Retirer des produits locaux
    const updatedLocalProducts = localProducts.filter(p => p.id !== id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    // Retirer de tous les produits
    setAllProducts(prev => prev.filter(p => p.id !== id));
  }, [localProducts]);

  // RECHERCHER des produits
  const searchProducts = useCallback((query: string, category?: string) => {
    if (!query.trim() && !category) return allProducts;
    
    const searchTerm = query.toLowerCase().trim();
    
    return allProducts.filter(product => {
      // Filtre par catégorie
      if (category && category !== 'all') {
        if (product.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }
      
      // Filtre par recherche
      if (searchTerm) {
        const matchesTitle = product.title.toLowerCase().includes(searchTerm);
        const matchesBrand = product.brand?.toLowerCase().includes(searchTerm) || false;
        const matchesCategory = product.category.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description?.toLowerCase().includes(searchTerm) || false;
        
        return matchesTitle || matchesBrand || matchesCategory || matchesDescription;
      }
      
      return true;
    });
  }, [allProducts]);

  // Fonction pour obtenir les catégories uniques des produits
  const getCategories = useCallback(() => {
    const allCats = allProducts.map(p => p.category);
    return ['all', ...Array.from(new Set(allCats))];
  }, [allProducts]);

  return {
    // Produits à afficher (locaux d'abord, puis API)
    products: allProducts,
    
    // États
    loading,
    error,
    
    // Catégories disponibles
    categories: getCategories(),
    
    // Fonctions
    loadProducts,
    addProduct,
    editProduct,
    deleteProduct,
    searchProducts,
  };
};