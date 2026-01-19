// src/data/products.ts

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

// Stockage local pour les produits (persiste pendant la session)
let localProducts: Product[] = [];

// Récupérer tous les produits (API + Locaux)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // 1. Charger les produits de l'API
    const apiResponse = await fetch('https://dummyjson.com/products?limit=100');
    const apiData = await apiResponse.json();
    const apiProducts: Product[] = apiData.products;
    
    // 2. Fusionner avec les produits locaux
    // Les produits locaux écrasent les produits API avec le même ID
    const allProducts = [...localProducts];
    
    apiProducts.forEach(apiProduct => {
      // Vérifier si ce produit API n'existe pas déjà dans les produits locaux
      const localExists = localProducts.find(p => p.id === apiProduct.id);
      if (!localExists) {
        allProducts.push(apiProduct);
      }
    });
    
    // 3. Trier par ID décroissant (les plus récents en premier)
    return allProducts.sort((a, b) => b.id - a.id);
    
  } catch (error) {
    console.error('Erreur chargement API:', error);
    // Retourner seulement les produits locaux si l'API échoue
    return [...localProducts].sort((a, b) => b.id - a.id);
  }
};

// Ajouter un produit
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now() + Math.floor(Math.random() * 1000), // ID unique
  };
  
  // Ajouter en PREMIER
  localProducts = [newProduct, ...localProducts];
  
  // Stocker dans localStorage pour persistance
  try {
    localStorage.setItem('admin_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Erreur localStorage:', error);
  }
  
  return newProduct;
};

// Modifier un produit
export const updateProduct = (updatedProduct: Product): Product => {
  // Chercher dans les produits locaux
  const index = localProducts.findIndex(p => p.id === updatedProduct.id);
  
  if (index !== -1) {
    // Mettre à jour le produit local
    localProducts[index] = updatedProduct;
  } else {
    // Ajouter comme nouveau produit local
    localProducts = [updatedProduct, ...localProducts];
  }
  
  // Mettre à jour localStorage
  try {
    localStorage.setItem('admin_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Erreur localStorage:', error);
  }
  
  return updatedProduct;
};

// Supprimer un produit
export const deleteProduct = (id: number): void => {
  localProducts = localProducts.filter(p => p.id !== id);
  
  // Mettre à jour localStorage
  try {
    localStorage.setItem('admin_products', JSON.stringify(localProducts));
  } catch (error) {
    console.error('Erreur localStorage:', error);
  }
};

// Charger les produits depuis localStorage au démarrage
export const loadLocalProducts = (): void => {
  try {
    const saved = localStorage.getItem('admin_products');
    if (saved) {
      localProducts = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erreur chargement localStorage:', error);
    localProducts = [];
  }
};

// Vider les produits locaux (pour debug)
export const clearLocalProducts = (): void => {
  localProducts = [];
  localStorage.removeItem('admin_products');
};