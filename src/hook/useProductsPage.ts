import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import apiService from "../api/apiservice";
import { useDummyJsonPagination } from "../context/PaginationContext";
import { loadProductsFromStorage } from "../utils/productStorage";

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

interface ApiProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Category {
  slug: string;
  name: string;
}


interface ProductsData {
  products: Product[];
  total: number;
}

export const useProductsPage = () => {
  const pagination = useDummyJsonPagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");


  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const apiCategories = await apiService.get<Category[]>("products/categories");
      return [
        { slug: "all", name: "Toutes catégories" },
        ...apiCategories,
      ];
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
  });

  // CACHE DES PRODUITS
  const query = useQuery({
    queryKey: [
      "products",
      pagination.currentPage,
      pagination.itemsPerPage,
      selectedCategory,
      debouncedSearch,
    ],
    queryFn: async (): Promise<ProductsData> => {
      const endpoint = selectedCategory === "all"
        ? "products"
        : `products/category/${selectedCategory}`;

      // Récupération depuis l'API
      const apiData = await apiService.get<ApiProductsResponse>(endpoint, {
        limit: String(pagination.itemsPerPage),
        skip: String((pagination.currentPage - 1) * pagination.itemsPerPage),
      });


      pagination.updateFromApiResponse(apiData);

      const localProducts = loadProductsFromStorage();

      // Filtrage par recherche
      const q = debouncedSearch.toLowerCase().trim();

      const filteredApiProducts = q
        ? apiData.products.filter(p => p.title.toLowerCase().includes(q))
        : apiData.products;

      const filteredLocalProducts = q
        ? localProducts.filter(p => p.title.toLowerCase().includes(q))
        : localProducts;


      return {
        products: [...filteredLocalProducts, ...filteredApiProducts],
        total: apiData.total + localProducts.length,
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    placeholderData: (previousData) => previousData,
    enabled: !categoriesLoading, // Attend que les catégories soient chargées
  });

  // Gestion sécurisée des données
  const products = query.data?.products || [];
  const categoriesList = categories || [{ slug: "all", name: "Toutes catégories" }];

  return {

    products,
    categories: categoriesList,


    loading: query.isLoading || categoriesLoading,
    isFetching: query.isFetching,
    isLoading: query.isLoading,

    error: query.error ? (query.error as Error).message : null,

    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    pagination,


    isCached: query.data && !query.isFetching,
    isStale: query.isStale,
    dataUpdatedAt: query.dataUpdatedAt,
    isPlaceholderData: query.isPlaceholderData,
  };
};


export const useProduct = (productId: number | undefined) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      return await apiService.get<Product>(`products/${productId}`);
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
};