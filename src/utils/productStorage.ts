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

const STORAGE_KEY = 'admin_products';

export const loadProductsFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const products: Product[] = JSON.parse(saved);
      // 🔴 Trier par ID décroissant pour avoir les plus récents d'abord
      return products.sort((a, b) => b.id - a.id);
    }
  } catch (error) {
    console.error('Erreur chargement localStorage:', error);
  }
  return [];
};

export const saveProductsToStorage = (products: Product[]): void => {
  try {
    // 🔴 Sauvegarder déjà triés par ID décroissant
    const sortedProducts = [...products].sort((a, b) => b.id - a.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedProducts));
  } catch (error) {
    console.error('Erreur sauvegarde localStorage:', error);
  }
};

export const findProductInStorage = (id: number): Product | undefined => {
  const products = loadProductsFromStorage();
  return products.find(p => p.id === id);
};