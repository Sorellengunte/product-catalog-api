import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface DummyJsonResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyJsonPaginationContextType {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  
  apiParams: {
    limit: number;
    skip: number;
  };
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  updateFromApiResponse: (response: DummyJsonResponse<any>) => void;
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

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  
  const apiParams = {
    limit: itemsPerPage,
    skip,
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const updateFromApiResponse = (response: DummyJsonResponse<any>) => {
    setTotalItems(response.total);
    
    const newTotalPages = Math.ceil(response.total / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const getQueryString = () => {
    return `?limit=${itemsPerPage}&skip=${skip}`;
  };

  const getUrlWithPagination = (baseUrl: string) => {
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  };

  const value: DummyJsonPaginationContextType = {
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
  };

  return (
    <DummyJsonPaginationContext.Provider value={value}>
      {children}
    </DummyJsonPaginationContext.Provider>
  );
};