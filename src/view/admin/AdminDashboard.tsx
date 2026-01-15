import { useState } from 'react';
import { Link } from 'react-router'; // Correction ici
import {
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/AuthContext';
import { useProducts } from '../../hook/useproducts';
import { useCategories } from '../../hook/usecategories';
import ProductsTable from '../../components/admin/ProductsTable';

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

interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  const {
    products,
    loading: productsLoading,
    error: productsError,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    editProduct,
    deleteProduct,
  } = useProducts();

  const {
    categories,
    selectedCategory,
    loading: categoriesLoading,
    error: categoriesError,
    selectCategory,
    resetCategory,
  } = useCategories();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{open: boolean; productId: number | null; productTitle: string}>({
    open: false,
    productId: null,
    productTitle: ''
  });

  const formatCategoryName = (category: string): string => {
    if (category === 'all') return 'Toutes les catégories';
    
    const categoryStr = typeof category === 'string' ? category : String(category);
    
    return categoryStr
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        const productCategory = product.category?.toLowerCase?.() || '';
        return productCategory === selectedCategory.toLowerCase();
      });

  const searchedProducts = searchQuery.trim() === ''
    ? filteredProducts
    : filteredProducts.filter(product => {
        const title = product.title?.toLowerCase?.() || '';
        const description = product.description?.toLowerCase?.() || '';
        const category = product.category?.toLowerCase?.() || '';
        const brand = product.brand?.toLowerCase?.() || '';
        const searchTerm = searchQuery.toLowerCase();
        
        return title.includes(searchTerm) || 
               description.includes(searchTerm) || 
               category.includes(searchTerm) ||
               brand.includes(searchTerm);
      });

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  const confirmDelete = (product: Product) => {
    setDeleteConfirmation({
      open: true,
      productId: product.id,
      productTitle: product.title
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.productId) {
      deleteProduct(deleteConfirmation.productId);
      addNotification('success', 'Produit supprimé', `${deleteConfirmation.productTitle} a été supprimé avec succès`);
      setDeleteConfirmation({ open: false, productId: null, productTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ open: false, productId: null, productTitle: '' });
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'smartphones': 'bg-blue-100 text-blue-800',
      'laptops': 'bg-purple-100 text-purple-800',
      'fragrances': 'bg-pink-100 text-pink-800',
      'skincare': 'bg-green-100 text-green-800',
      'groceries': 'bg-amber-100 text-amber-800',
      'home-decoration': 'bg-orange-100 text-orange-800',
      'furniture': 'bg-indigo-100 text-indigo-800',
      'tops': 'bg-teal-100 text-teal-800',
      'womens-dresses': 'bg-rose-100 text-rose-800',
      'womens-shoes': 'bg-fuchsia-100 text-fuchsia-800',
      'mens-shirts': 'bg-cyan-100 text-cyan-800',
      'mens-shoes': 'bg-lime-100 text-lime-800',
      'mens-watches': 'bg-emerald-100 text-emerald-800',
      'womens-watches': 'bg-violet-100 text-violet-800',
      'womens-bags': 'bg-amber-100 text-amber-800',
      'womens-jewellery': 'bg-pink-100 text-pink-800',
      'sunglasses': 'bg-sky-100 text-sky-800',
      'automotive': 'bg-slate-100 text-slate-800',
      'motorcycle': 'bg-stone-100 text-stone-800',
      'lighting': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case 'info': return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* NOTIFICATIONS */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-md ${getNotificationColor(notification.type)} animate-slide-in`}
          >
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm mt-1">{notification.message}</div>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmation.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-gray-600 mt-1">
                  Êtes-vous sûr de vouloir supprimer <span className="font-medium">"{deleteConfirmation.productTitle}"</span> ?
                  Cette action est irréversible.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white p-6 shadow-xl">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-blue-200 text-sm">Gestion des produits</p>
        </div>
        
        <div className="flex items-center gap-3 mb-8 p-3 bg-blue-600/30 rounded-xl">
          <ChartBarIcon className="h-6 w-6" />
          <span className="font-medium">Produits</span>
        </div>
        
        <div className="mt-auto pt-6 border-t border-blue-600/30">
          <div className="flex items-center gap-3 mb-4 p-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.username || 'Admin'}</p>
              <p className="text-blue-200 text-sm">Administrateur</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 text-red-200 hover:bg-red-500/20 rounded-xl transition-all"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, {user?.username || 'Admin'} 👋
            </h1>
            <p className="text-gray-600 mt-1">Gérez vos produits en toute simplicité</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <UserCircleIcon className="h-7 w-7 text-white" />
          </div>
        </header>

        {/* FILTERS & ACTIONS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white appearance-none"
                value={selectedCategory}
                onChange={(e) => {
                  selectCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((cat) => {
                  const categoryValue = typeof cat === 'string' ? cat : String(cat);
                  return (
                    <option key={categoryValue} value={categoryValue}>
                      {formatCategoryName(categoryValue)}
                    </option>
                  );
                })}
              </select>
              {selectedCategory !== 'all' && (
                <button
                  onClick={resetCategory}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title="Réinitialiser la catégorie"
                >
                  ✕
                </button>
              )}
            </div>
            
            <Link
              to="/admin/products/new"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              <PlusIcon className="h-5 w-5" />
              Ajouter un produit
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                <span>Catégorie:</span>
                <span className="font-semibold">{formatCategoryName(selectedCategory)}</span>
                <button
                  onClick={resetCategory}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                <span>Recherche:</span>
                <span className="font-semibold">"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </span>
            )}
            <span className="text-sm text-gray-600">
              {searchedProducts.length} produit{searchedProducts.length !== 1 ? 's' : ''} trouvé{searchedProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-red-700">Erreur: {productsError || categoriesError}</p>
          </div>
        )}

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <ProductsTable
            products={searchedProducts}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            getStockColor={getStockColor}
            getCategoryColor={getCategoryColor}

            onDelete={confirmDelete}
          />
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && !loading && !error && searchedProducts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Précédent
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }).filter(Boolean)}
            </div>
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Suivant
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = `
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}