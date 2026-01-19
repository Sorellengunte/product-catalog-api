import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductCard from '../components/productCard';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductsPage } from '../hook/useProductsPage';
import { useCart } from '../api/CartContext';
import { useCategories } from '../hook/usecategories';

// Interface Product pour cette page
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

// Type pour ProductCard
interface ProductCardType {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  stock: number;
}

const ProductsPage: React.FC = () => {
  const { 
    products, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    
  } = useProductsPage();
  
  const { categories, selectedCategory, selectCategory, resetCategory } = useCategories();
  const { addToCart } = useCart();
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showNotification, setShowNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState('');

  // Synchroniser la recherche locale avec le hook
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setAddedProduct(product.title);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Filtrer par catégorie
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  // Filtrer par recherche
  const finalProducts = localSearch.trim() === ''
    ? filteredProducts
    : filteredProducts.filter(p => 
        p.title?.toLowerCase().includes(localSearch.toLowerCase())
      );

  // Mapper pour ProductCard
  const mapToProductCardType = (product: Product): ProductCardType => {
    return {
      id: product.id,
      title: product.title || 'Sans titre',
      price: product.price || 0,
      discountPercentage: product.discountPercentage || 0,
      rating: product.rating || 0,
      brand: product.brand || 'Marque non spécifiée',
      category: product.category || 'Non catégorisé',
      thumbnail: product.thumbnail || 'https://via.placeholder.com/300',
      stock: product.stock || 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des produits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 md:top-6 right-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{addedProduct}</p>
              <p className="text-xs text-green-600">Ajouté au panier</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-4 py-4 md:py-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <div className="w-full bg-blue-700 py-8 md:py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4">
                Nos Produits
              </h1>
              <p className="text-base md:text-xl text-gray-300">
                Découvrez notre collection exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-sm md:text-base"
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    selectCategory(e.target.value);
                    setLocalSearch('');
                  }}
                  className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-2.5 md:py-3 rounded-lg bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none appearance-none text-sm md:text-base"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map(cat => {
                    const value = typeof cat === 'string' ? cat : String(cat);
                    const displayName = value === 'all' ? 'Toutes catégories' : 
                      value.charAt(0).toUpperCase() + value.slice(1);
                    return <option key={value} value={value}>{displayName}</option>;
                  })}
                </select>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={resetCategory}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtres actifs */}
          {(selectedCategory !== 'all' || localSearch.trim() !== '') && (
            <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-4">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg text-xs md:text-sm">
                  <span className="font-medium">Catégorie:</span>
                  <span className="truncate max-w-[80px] md:max-w-none">{selectedCategory}</span>
                  <button onClick={resetCategory} className="text-gray-600 hover:text-gray-800 text-xs">✕</button>
                </span>
              )}
              {localSearch.trim() !== '' && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg text-xs md:text-sm">
                  <span className="font-medium">Recherche:</span>
                  <span className="truncate max-w-[60px] md:max-w-none">"{localSearch}"</span>
                  <button onClick={() => setLocalSearch('')} className="text-gray-600 hover:text-gray-800 text-xs">✕</button>
                </span>
              )}
              <span className="text-xs md:text-sm text-gray-600">
                {finalProducts.length} produit{finalProducts.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Erreurs */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center text-sm md:text-base">{error}</p>
          </div>
        )}

        {/* Produits */}
        {finalProducts.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 text-sm md:text-base mb-4">Essayez d'autres critères</p>
            <button
              onClick={() => { resetCategory(); setLocalSearch(''); }}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <>
            {/* Grille de produits - 1 par ligne sur mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {finalProducts.map(product => {
                const productForCard = mapToProductCardType(product);
                
                return (
                  <div key={product.id} className="w-full">
                    <ProductCard 
                      product={productForCard} 
                      addToCart={() => handleAddToCart(product, 1)} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 py-4 md:py-6">
                <div className="text-xs md:text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition-colors text-sm md:text-base ${
                            currentPage === pageNum
                              ? 'bg-gray-900 text-white'
                              : 'bg-white border border-gray-200 hover:border-gray-900'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;