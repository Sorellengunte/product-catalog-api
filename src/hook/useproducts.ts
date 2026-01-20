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
      
    
      const response = await fetch('https://dummyjson.com/products?limit=100');
      const data = await response.json();
      
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


  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // AJOUTER un produit au DÉBUT
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {

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


  const editProduct = useCallback((updatedProduct: Product) => {

    const isLocalProduct = updatedProduct.id > 1000;

    const productIndex = localProducts.findIndex(p => p.id === updatedProduct.id);
    let updatedLocalProducts = [...localProducts];
    
    if (productIndex !== -1) {

      updatedLocalProducts[productIndex] = updatedProduct;
    } else if (isLocalProduct) {
      
      updatedLocalProducts = [updatedProduct, ...updatedLocalProducts];
    } else {
     
      updatedLocalProducts.push(updatedProduct);
    }
    
    
    updatedLocalProducts.sort((a, b) => b.id - a.id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    
    setAllProducts(prev => {
      const productIndex = prev.findIndex(p => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        
        const updated = [...prev];
        updated[productIndex] = updatedProduct;
        
        return [
          ...updated.filter(p => p.id > 1000).sort((a, b) => b.id - a.id), // Locaux
          ...updated.filter(p => p.id <= 1000).sort((a, b) => a.id - b.id) // API
        ];
      } else {
        
        if (isLocalProduct) {
          return [updatedProduct, ...prev]; 
        } else {
          
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

 
  const deleteProduct = useCallback((id: number) => {
    
    const updatedLocalProducts = localProducts.filter(p => p.id !== id);
    setLocalProducts(updatedLocalProducts);
    saveProductsToStorage(updatedLocalProducts);
    
    
    setAllProducts(prev => prev.filter(p => p.id !== id));
  }, [localProducts]);

  
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