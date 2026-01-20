import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

// Types spécifiques à DummyJSON
export interface DummyJsonResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyJsonPaginationContextType {
  // État
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  
  // Paramètres pour l'API
  apiParams: {
    limit: number;
    skip: number;
  };
  
  // Navigation
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  
  // Mise à jour depuis la réponse API
  updateFromApiResponse: (response: DummyJsonResponse<any>) => void;
  
  // Getters pour l'URL
  getQueryString: () => string;
  getUrlWithPagination: (baseUrl: string) => string;
}

interface DummyJsonPaginationProviderProps {
  children: ReactNode;
  initialPage?: number;
  initialItemsPerPage?: number;
}

const DummyJsonPaginationContext = createContext<DummyJsonPaginationContextType | null>(null);

export const useDummyJsonPagination = () => {
  const context = useContext(DummyJsonPaginationContext);
  if (!context) {
    throw new Error('useDummyJsonPagination must be used within a DummyJsonPaginationProvider');
  }
  return context;
};

export const DummyJsonPaginationProvider: React.FC<DummyJsonPaginationProviderProps> = ({
  children,
  initialPage = 1,
  initialItemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);

  // Calculs
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage) || 1;
  }, [totalItems, itemsPerPage]);

  const skip = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  // Paramètres pour l'API
  const apiParams = useMemo(() => ({
    limit: itemsPerPage,
    skip,
  }), [itemsPerPage, skip]);

  // Navigation
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Mettre à jour depuis la réponse API
  const updateFromApiResponse = useCallback((response: DummyJsonResponse<any>) => {
    setTotalItems(response.total);
    
    // Vérifier que la page courante est toujours valide
    const newTotalPages = Math.ceil(response.total / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [currentPage, itemsPerPage]);

  // Getters pour construire les URLs
  const getQueryString = useCallback(() => {
    return `?limit=${itemsPerPage}&skip=${skip}`;
  }, [itemsPerPage, skip]);

  const getUrlWithPagination = useCallback((baseUrl: string) => {
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  }, [itemsPerPage, skip]);

  const value: DummyJsonPaginationContextType = useMemo(() => ({
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    apiParams,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    updateFromApiResponse,
    getQueryString,
    getUrlWithPagination,
  }), [
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    apiParams,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    updateFromApiResponse,
    getQueryString,
    getUrlWithPagination,
  ]);

  return (
    <DummyJsonPaginationContext.Provider value={value}>
      {children}
    </DummyJsonPaginationContext.Provider>
  );
};
