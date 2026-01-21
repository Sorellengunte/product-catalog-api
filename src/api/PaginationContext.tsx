import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


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

  // Calculs avec useMemo
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage) || 1;
  }, [totalItems, itemsPerPage]);

  const skip = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  
  const apiParams = useMemo(() => ({
    limit: itemsPerPage,
    skip,
  }), [itemsPerPage, skip]);

  // Fonctions de navigation 
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
    skip, 
  ]);

  return (
    <DummyJsonPaginationContext.Provider value={value}>
      {children}
    </DummyJsonPaginationContext.Provider>
  );
};


interface PaginationProps {
  className?: string;
  showPageInfo?: boolean;
  showNavigation?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  maxVisiblePages?: number;
}

// Composant de pagination 
export const Pagination: React.FC<PaginationProps> = ({
  className = '',
  showPageInfo = true,
  showNavigation = true,
  variant = 'default',
  maxVisiblePages = 5,
}) => {
  const context = useDummyJsonPagination();
  
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
  } = context;

  // Générer les pages visibles 
  const visiblePages = useMemo(() => {
    if (variant === 'minimal' || variant === 'compact') {
      return [currentPage];
    }

    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Ajuster si on est trop près de la fin
    if (end === totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    // Ajuster si on est trop près du début
    if (start === 1) {
      end = Math.min(totalPages, maxVisiblePages);
    }
    
    for (let i = start; i <= end; i++) {
      if (i <= totalPages) pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages, variant]);

  // Si une seule page, ne pas afficher la pagination
  if (totalPages <= 1) {
    return null;
  }

  // Variant minimal (juste les flèches)
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {showPageInfo && (
          <span className="text-sm text-gray-600 px-2">
            {currentPage} / {totalPages}
          </span>
        )}
        
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Variant compact
  if (variant === 'compact') {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
        {showPageInfo && (
          <div className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="p-2 text-sm rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
            aria-label="Première page"
          >
            ⟪
          </button>
          
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="px-3 py-2 border rounded-lg bg-gray-50 text-sm font-medium">
            {currentPage}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
            aria-label="Page suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="p-2 text-sm rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
            aria-label="Dernière page"
          >
            ⟫
          </button>
        </div>
      </div>
    );
  }

  // Variant par défaut (complet)
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      {showPageInfo && (
        <div className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </div>
      )}
      
      <div className="flex items-center gap-1 md:gap-2">
        {showNavigation && (
          <>
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="hidden sm:inline-flex p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors text-sm"
              aria-label="Première page"
            >
            
            </button>
            
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
        
        <div className="flex items-center gap-1">
          {visiblePages.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 hover:border-gray-900'
              }`}
              aria-label={`Aller à la page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}
          
          {totalPages > maxVisiblePages && currentPage < totalPages - 2 && (
            <>
              <span className="px-1 text-gray-400">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className="w-10 h-10 rounded-lg font-medium bg-white border border-gray-200 hover:border-gray-900 transition-colors"
                aria-label="Dernière page"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        {showNavigation && (
          <>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="hidden sm:inline-flex p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors text-sm"
              aria-label="Dernière page"
            >
              
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const PaginationComponent = Pagination;