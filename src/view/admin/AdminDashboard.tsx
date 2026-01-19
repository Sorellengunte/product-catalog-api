import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
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
  TrashIcon,
  HomeIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/AuthContext';
import { useProducts } from '../../hook/useproducts';
import { useCategories } from '../../hook/usecategories';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    deleteProduct,
    loadProducts,
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
  const [currentPage, setCurrentPage] = useState(1);
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

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // États combinés
  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  // Notifications
  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Modifier un produit
  const handleEdit = (product: Product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  // Supprimer un produit
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

  // Couleurs pour le stock
  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 rounded-lg shadow-lg border ${notif.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="font-medium">{notif.title}</div>
            <div className="text-sm">{notif.message}</div>
          </div>
        ))}
      </div>

      {/* Modal suppression */}
      {deleteConfirmation.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Confirmer suppression</h3>
                <p className="text-gray-600 mt-1">
                  Supprimer "<span className="font-medium">{deleteConfirmation.productTitle}</span>" ?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmation({ open: false, productId: null, productTitle: '' })}
                className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-blue-200 text-sm">Gestion produits</p>
        </div>
        
        <nav className="space-y-2 mb-8">
          <Link
            to="/admin/products/add"
            className="flex items-center gap-3 p-3 bg-blue-700 rounded-lg"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter produit</span>
          </Link>
          <Link
            to="/home"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Retour au site</span>
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="h-10 w-10" />
            <div>
              <p className="font-medium">{user?.username || 'Admin'}</p>
              <p className="text-sm text-blue-200">Administrateur</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-red-200 hover:bg-red-900/20 rounded-lg"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
          <p className="text-gray-600">
            Total: {products.length} produits | 
            Filtre: {filteredProducts.length} produits
          </p>
        </header>

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, marque, catégorie..."
                className="w-full pl-10 p-3 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Catégorie */}
            <div className="w-full md:w-64 relative">
              <select
                className="w-full p-3 border rounded-lg appearance-none pr-10"
                value={selectedCategory}
                onChange={(e) => selectCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)}
                  </option>
                ))}
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
            
            {/* Bouton Ajouter */}
            <div>
              <Link
                to="/admin/products/add"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </Link>
            </div>
          </div>
          
          {/* Indicateurs de filtres actifs */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
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
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
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

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Chargement des produits...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6">
            <p className="text-red-700">
              {productsError || categoriesError}
            </p>
            <button
              onClick={() => {
                loadProducts();
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Tableau */}
        {!loading && !error && (
          <>
            {paginatedProducts.length > 0 ? (
              <>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">Produit</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">Catégorie</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">Stock</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">Prix</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.map(product => (
                          <tr key={product.id} className="border-t hover:bg-gray-50">
                            <td className="p-4 text-sm text-gray-500">
                              #{product.id}
                              {product.id > 100000 && (
                                <span className="ml-1 text-xs text-blue-600 bg-blue-100 px-1 rounded">Nouveau</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.thumbnail || 'https://via.placeholder.com/150'}
                                  alt={product.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div>
                                  <p className="font-medium">{product.title}</p>
                                  <p className="text-sm text-gray-500">{product.brand || 'Sans marque'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {formatCategoryName(product.category)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${getStockColor(product.stock)}`}>
                                {product.stock} unités
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-bold">${product.price.toFixed(2)}</p>
                              {product.discountPercentage && product.discountPercentage > 0 && (
                                <p className="text-sm text-green-600">-{product.discountPercentage}%</p>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                      Affichage {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} sur {filteredProducts.length} produits
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50 flex items-center gap-2"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Précédent
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + i;
                          }
                          if (pageNum > totalPages) return null;
                          
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
                        })}
                      </div>
                      
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50 flex items-center gap-2"
                      >
                        Suivant
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <EyeIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium">Aucun produit trouvé</h3>
                <p className="text-gray-600 mt-1">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Aucun résultat pour ces filtres' 
                    : 'Ajoutez votre premier produit'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      resetCategory();
                    }}
                    className="mt-4 inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                {!searchQuery && selectedCategory === 'all' && (
                  <Link
                    to="/admin/products/add"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Ajouter un produit
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}