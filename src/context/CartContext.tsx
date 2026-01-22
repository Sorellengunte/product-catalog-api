// src/api/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock?: number; 
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  cartCount: number; // Nombre d'articles uniques dans le panier
  totalItems: number; // Somme de toutes les quantités (nouveau)
  isInCart: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  notification: { message: string; type: 'info' | 'success' } | null;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "shopping_cart";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      console.log("Panier chargé depuis localStorage:", parsedCart.length, "produits");
      return parsedCart;
    }
  } catch (error) {
    console.error(" Erreur lors du chargement du panier:", error);
  }
  
  return [];
};

const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log("💾 Panier sauvegardé:", cart.map(item => `${item.title} (x${item.quantity})`));
  } catch (error) {
    console.error(" Erreur lors de la sauvegarde du panier:", error);
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' } | null>(null);
  
  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Fonction pour afficher une notification
  const showNotification = (message: string, type: 'info' | 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    console.log("🛒 Ajout au panier:", product.id, product.title, "quantité:", quantity);
    
    setCart((prevCart) => {
      // Rechercher si le produit existe déjà
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      
      if (existingIndex >= 0) {
        // Produit déjà dans le panier : incrémenter la quantité
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        
        showNotification(
          `"${product.title}" quantité augmentée à ${newCart[existingIndex].quantity}`,
          'info'
        );
        
        console.log("Produit existant, nouvelle quantité:", newCart[existingIndex].quantity);
        return newCart;
      } else {
        // Produit pas encore dans le panier : ajouter
        showNotification(`"${product.title}" a été ajouté à votre panier !`, 'success');
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    console.log(" Suppression du produit:", id);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    console.log("Mise à jour quantité:", id, "→", quantity);
    
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const incrementQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity - 1;
          if (newQuantity < 1) {
            removeFromCart(id);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    console.log(" Panier vidé");
    setCart([]);
  };

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return parseFloat(total.toFixed(2));
  };

  // Nombre de produits UNIQUES dans le panier (pour le badge navbar)
  const cartCount = cart.length;
  
  // Somme de toutes les quantités (pour affichage ailleurs si besoin)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const isInCart = (id: number): boolean => {
    return cart.some(item => item.id === id);
  };
  
  const getItemQuantity = (id: number): number => {
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        cartCount, // Renvoie le nombre d'articles uniques
        totalItems, // Renvoie la somme des quantités
        isInCart,
        getItemQuantity,
        incrementQuantity,
        decrementQuantity,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};