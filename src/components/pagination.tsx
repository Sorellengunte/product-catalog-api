import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDummyJsonPagination } from '../context/PaginationContext';

interface PaginationProps {
  className?: string;
  showPageInfo?: boolean;
  showNavigation?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  className = '',
  showPageInfo = true,
  showNavigation = true,
  variant = 'default',
  maxVisiblePages = 5,
}) => {
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
  } = useDummyJsonPagination();

  let visiblePages: number[] = [];
  
  if (variant === 'minimal' || variant === 'compact') {
    visiblePages = [currentPage];
  } else {
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end === totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    if (start === 1) {
      end = Math.min(totalPages, maxVisiblePages);
    }
    
    for (let i = start; i <= end; i++) {
      if (i <= totalPages) visiblePages.push(i);
    }
  }

  if (totalPages <= 1) {
    return null;
  }

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
            
           
          </>
        )}
      </div>
    </div>
  );
};

export const PaginationComponent = Pagination;