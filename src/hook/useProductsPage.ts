import { useEffect, useState } from "react";
import { useDummyJsonPagination } from "../context/PaginationContext";
import apiService from "../api/apiservice";
import {
  loadProductsFromStorage,
  saveProductsToStorage,
} from "../utils/productStorage";

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

export const useProductsPage = () => {
  // ==================== STATES ====================
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const pagination = useDummyJsonPagination();

  // ==================== PRODUITS LOCAUX ====================
  useEffect(() => {
    try {
      const products = loadProductsFromStorage().sort((a, b) => b.id - a.id);
      setLocalProducts(products);
    } catch {
      setLocalProducts([]);
    }
  }, []);

  // ==================== CATÉGORIES ====================
  useEffect(() => {
    const loadCategories = async () => {
      try {
       
        const apiData = await apiService.get<string[] | { [key: string]: string }>(
          "products/categories"
        );
        let apiCategories: string[] = [];
        
        if (Array.isArray(apiData)) {
          apiCategories = apiData;
        } else if (apiData && typeof apiData === 'object') {
          apiCategories = Object.values(apiData);
        }

        apiCategories = apiCategories.filter(
          (cat): cat is string => typeof cat === 'string' && cat.trim() !== ''
        );

        // Récupérer les catégories locales
        const storedProducts = loadProductsFromStorage();
        const localCats = storedProducts
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat && cat.trim()));

        // Combiner, dédupliquer et trier
        const uniqueCategories = [...new Set([...apiCategories, ...localCats])]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCategories(["all", ...uniqueCategories]);

      } catch (error) {
        console.error("Erreur chargement catégories API:", error);
        
        // Fallback: catégories locales seulement
        const storedProducts = loadProductsFromStorage();
        const localCats = storedProducts
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat && cat.trim()));
        
        const uniqueLocalCats = [...new Set(localCats)]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        
        setCategories(["all", ...uniqueLocalCats]);
      }
    };

    loadCategories();
  }, []);

  // ==================== PRODUITS API ====================
  useEffect(() => {
    const loadApiProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint =
          selectedCategory === "all"
            ? `products`
            : `products/category/${selectedCategory}`;

        // GET avec params de pagination
        const data = await apiService.get<any>(endpoint, {
          limit: String(pagination.itemsPerPage),
          skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
        });

        const products: Product[] = (data.products || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          stock: p.stock || 0,
          category: p.category || "Uncategorized",
          thumbnail: p.thumbnail || "",
          brand: p.brand,
          rating: p.rating,
          discountPercentage: p.discountPercentage,
          description: p.description,
        }));

        setApiProducts(products);

        if (pagination.updateFromApiResponse) {
          pagination.updateFromApiResponse({
            products,
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || pagination.itemsPerPage,
          });
        }
      } catch (err: any) {
        setError(err.message || "Erreur chargement produits");
        setApiProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadApiProducts();
  }, [pagination.currentPage, selectedCategory, pagination.itemsPerPage]);

  // ==================== FILTRAGE LOCAL ====================
  const filteredLocalProducts = localProducts.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const products = [...filteredLocalProducts, ...apiProducts];

  // ==================== CRUD LOCAL ====================
  const addProduct = (data: Omit<Product, "id">) => {
    const stored = loadProductsFromStorage();
    const existingIds = stored.map((p) => p.id);
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1001;

    const newProduct: Product = { ...data, id: newId };
    const updated = [newProduct, ...stored];

    setLocalProducts(updated);
    saveProductsToStorage(updated);
  };

  const editProduct = (product: Product) => {
    const stored = loadProductsFromStorage();
    const updated = stored.map((p) =>
      p.id === product.id ? product : p
    );

    setLocalProducts(updated);
    saveProductsToStorage(updated);
  };

  const deleteProduct = (id: number) => {
    const stored = loadProductsFromStorage();
    const updated = stored.filter((p) => p.id !== id);

    setLocalProducts(updated);
    saveProductsToStorage(updated);
  };
  
  // POST 
  const createProductOnApi = async (productData: Omit<Product, "id">) => {
    try {
      setLoading(true);
      const newProduct = await apiService.post<Product>("products/add", productData);
      const stored = loadProductsFromStorage();
      const existingIds = stored.map((p) => p.id);
      const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1001;
      const localProduct: Product = { ...productData, id: newId };
      
      const updatedLocal = [localProduct, ...stored];
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      return newProduct;
    } catch (err: any) {
      setError(err.message || "Erreur création produit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PUT
  const updateProductOnApi = async (id: number, productData: Product) => {
    try {
      setLoading(true);
      const updatedProduct = await apiService.put<Product>(`products/${id}`, productData);
      const updatedLocal = localProducts.map(p => 
        p.id === id ? { ...productData, id } : p
      );
      
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      return updatedProduct;
    } catch (err: any) {
      setError(err.message || "Erreur mise à jour produit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PATCH 
  const patchProductOnApi = async (id: number, partialData: Partial<Product>) => {
    try {
      setLoading(true);
      const patchedProduct = await apiService.patch<Product>(`products/${id}`, partialData);
      const updatedLocal = localProducts.map(p => 
        p.id === id ? { ...p, ...partialData } : p
      );
      
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      
      return patchedProduct;
    } catch (err: any) {
      setError(err.message || "Erreur modification produit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE 
  const deleteProductFromApi = async (id: number) => {
    try {
      setLoading(true);
      await apiService.delete(`products/${id}`);
      const updatedLocal = localProducts.filter(p => p.id !== id);
      setLocalProducts(updatedLocal);
      saveProductsToStorage(updatedLocal);
      const endpoint = selectedCategory === "all" 
        ? `products` 
        : `products/category/${selectedCategory}`;
      
      const data = await apiService.get<any>(endpoint, {
        limit: String(pagination.itemsPerPage),
        skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
      });
      
      const products: Product[] = (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        stock: p.stock || 0,
        category: p.category || "Uncategorized",
        thumbnail: p.thumbnail || "",
        brand: p.brand,
        rating: p.rating,
        discountPercentage: p.discountPercentage,
        description: p.description,
      }));
      
      setApiProducts(products);
      
    } catch (err: any) {
      setError(err.message || "Erreur suppression produit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET avec recherche sur l'API
  const searchProductsOnApi = async (query: string) => {
    try {
      setLoading(true);
      
      // GET avec paramètres de recherche
      const data = await apiService.get<any>("products/search", {
        q: query,
        limit: String(pagination.itemsPerPage),
        skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
      });
      
      const products: Product[] = (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        stock: p.stock || 0,
        category: p.category || "Uncategorized",
        thumbnail: p.thumbnail || "",
        brand: p.brand,
        rating: p.rating,
        discountPercentage: p.discountPercentage,
        description: p.description,
      }));
      
      setApiProducts(products);
      
      if (pagination.updateFromApiResponse) {
        pagination.updateFromApiResponse({
          products,
          total: data.total || 0,
          skip: data.skip || 0,
          limit: data.limit || pagination.itemsPerPage,
        });
      }
      
      return products;
    } catch (err: any) {
      setError(err.message || "Erreur recherche produits");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ==================== STATS ====================
  const stats = {
    totalLocal: localProducts.length,
    totalApi: pagination.totalItems || 0,
    totalProducts: products.length,
    totalPages: pagination.totalPages,
  };

  return {
    // data
    products,
    localProducts,
    apiProducts,
    categories,

    // state
    loading,
    error,
    setError,

    // filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,

    // pagination
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.goToPage,
    totalPages: pagination.totalPages,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    itemsPerPage: pagination.itemsPerPage,

    // crud local
    addProduct,
    editProduct,
    deleteProduct,

    // crud API
    createProductOnApi,
    updateProductOnApi,
    patchProductOnApi,
    deleteProductFromApi,
    searchProductsOnApi,
    stats,
  };
};