// src/components/AdminDashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
 
} from '@heroicons/react/24/outline';

import { useProducts } from '../../hook/useproducts';
import { useCategories } from '../../hook/usecategories';
import Sidebar from '../../components/Sidebar';
import ProductsTable from '../../components/admin/ProductsTable';

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

export default function AdminDashboard() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    deleteProduct,
    
    searchProducts,
  } = useProducts();

  const { 
    categories, 
    selectedCategory, 
    loading: categoriesLoading,
    error: categoriesError,
    selectCategory, 
    resetCategory,
    formatCategoryName 
  } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    productId: null as number | null,
    productTitle: ''
  });

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory !== 'all' ? selectedCategory : undefined);
  }, [products, searchQuery, selectedCategory, searchProducts]);

  // Fermer sidebar sur mobile quand on change de page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  

  const handleDelete = (product: Product) => {
    setDeleteConfirmation({
      open: true,
      productId: product.id,
      productTitle: product.title
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.productId) {
      deleteProduct(deleteConfirmation.productId);
      showNotification('success', 'Supprimé!', `"${deleteConfirmation.productTitle}" supprimé`);
      setDeleteConfirmation({ open: false, productId: null, productTitle: '' });
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      smartphones: 'bg-purple-100 text-purple-800',
      laptops: 'bg-blue-100 text-blue-800',
      fragrances: 'bg-pink-100 text-pink-800',
      skincare: 'bg-green-100 text-green-800',
      groceries: 'bg-yellow-100 text-yellow-800',
      'home-decoration': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 lg:top-6 lg:right-6 z-50 space-y-3 max-w-sm">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`
              p-4 rounded-lg shadow-lg border transition-transform duration-300
              ${notif.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
              }
              animate-slide-in
            `}
          >
            <div className="font-medium">{notif.title}</div>
            <div className="text-sm">{notif.message}</div>
          </div>
        ))}
      </div>

      {/* Modal suppression */}
      {deleteConfirmation.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">Confirmer suppression</h3>
                <p className="text-gray-600 mt-1 truncate">
                  Supprimer "<span className="font-medium">{deleteConfirmation.productTitle}</span>" ?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 flex-col sm:flex-row">
              <button
                onClick={() => setDeleteConfirmation({ open: false, productId: null, productTitle: '' })}
                className="flex-1 py-3 px-4 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header mobile */}
        <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Main content */}
        <div className="p-4 lg:p-6">
          {/* Header */}
          <header className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
                {/* <p className="text-gray-600 mt-1">
                  Total: {products.length} produits | 
                  Filtre: {filteredProducts.length} produits
                </p> */}
              </div>
              
             
            </div>
          </header>

          {/* Filtres */}
          <div>
            
            
            {/* Indicateurs de filtres actifs */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm">
                    Recherche: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm">
                    Catégorie: {formatCategoryName(selectedCategory)}
                    <button 
                      onClick={resetCategory}
                      className="text-green-600 hover:text-green-800 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tableau */}
          <ProductsTable
            products={filteredProducts}
            loading={loading}
            error={error}
            
            
            getStockColor={getStockColor}
            getCategoryColor={getCategoryColor}
            onDelete={handleDelete}
          />

       
        </div>
      </div>
    </div>
  );
}