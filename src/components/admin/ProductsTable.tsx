// src/components/admin/ProductsTable.tsx
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from '@tanstack/react-table';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';

interface Product {
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

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  getStockColor: (stock: number) => string;
  getCategoryColor: (category: string) => string;
  onDelete: (product: Product) => void; // Changé pour accepter le produit entier
  pageSize?: number;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

// Filtre personnalisé pour la recherche
const customFilterFn: FilterFn<Product> = (row, columnId, value) => {
  if (!value) return true;
  
  const searchValue = value.toLowerCase();
  const cellValue = String(row.getValue(columnId)).toLowerCase();
  
  return cellValue.includes(searchValue);
};

export default function ProductsTable({
  products,
  loading,
  error,
  getStockColor,
  getCategoryColor,
  onDelete,
  pageSize = 12,
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
}: ProductsTableProps) {
  // États pour la table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState(searchQuery);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);

  // Synchroniser les états avec les props
  useEffect(() => {
    setGlobalFilter(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  // Définition des colonnes
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Produit',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Produit';
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                <p className="text-sm text-gray-500 truncate">{product.brand || 'Sans marque'}</p>
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-amber-500">★</span>
                    <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                  </div>
                )}
                {product.id > 1000 && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Produit local
                  </span>
                )}
              </div>
            </div>
          );
        },
        enableSorting: true,
        filterFn: customFilterFn,
      },
      {
        accessorKey: 'category',
        header: 'Catégorie',
        cell: ({ row }) => {
          const category = row.original.category;
          return (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        filterFn: customFilterFn,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
          const stock = row.original.stock;
          return (
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStockColor(stock)}`}>
                {stock} unités
              </span>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'price',
        header: 'Prix',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/products/edit/${product.id}`}
                className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Modifier</span>
              </Link>
              <button
                onClick={() => onDelete(product)} // Appelle onDelete avec le produit entier
                className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Supprimer</span>
              </button>
            </div>
          );
        },
      },
    ],
    [getCategoryColor, getStockColor, onDelete]
  );

  // Configuration de la table
  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      custom: customFilterFn,
    },
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  // Gérer le changement de catégorie
  const handleCategoryChange = (category: string) => {
    setLocalSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    if (category === 'all') {
      table.getColumn('category')?.setFilterValue(undefined);
    } else {
      table.getColumn('category')?.setFilterValue(category);
    }
  };

  // Gérer le changement de recherche
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Calcul des statistiques
  const totalProducts = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const startItem = totalProducts === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalProducts);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-500">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <EyeIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header avec filtres */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Produits ({totalProducts})
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Affichage de {startItem} à {endItem} sur {totalProducts} produits
            </p>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtre par catégorie */}
            {categories.length > 0 && (
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={localSelectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Toutes catégories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Recherche globale */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={globalFilter ?? ''}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: <ChevronUpIcon className="h-4 w-4" />,
                            desc: <ChevronDownIcon className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination complète */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Informations et sélection de page size */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{startItem}-{endItem}</span> sur{' '}
              <span className="font-medium">{totalProducts}</span> produits
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Produits par page:</span>
              <select
                className="px-2 py-1 border rounded text-sm"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[6, 12, 24, 48, 96].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation des pages */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Navigation principale */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                title="Première page"
              >
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              </button>
              
              <button
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title="Page précédente"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              {/* Sélection de page */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 px-2">Page</span>
                
                <select
                  className="px-2 py-1 border rounded text-sm"
                  value={currentPage}
                  onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
                
                <span className="text-sm text-gray-600 px-2">sur {totalPages}</span>
              </div>

              <button
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title="Page suivante"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
              
              <button
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                title="Dernière page"
              >
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Informations de page */}
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> sur{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}