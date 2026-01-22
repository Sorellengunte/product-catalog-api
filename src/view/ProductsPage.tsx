import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductCard from '../components/productCard';
import { Search, Filter } from 'lucide-react';
import { useProductsPage } from '../hook/useProductsPage';
import { useCart } from '../context/CartContext';
import { useCategories } from '../hook/usecategories';
import { useDummyJsonPagination } from '../context/PaginationContext';
import { Pagination } from '../components/pagination'; 

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
    // Supprimé: currentPage, setCurrentPage, totalPages car gérés par le contexte
    reloadProducts, // Ajouté pour recharger les produits
  } = useProductsPage();
  
  const { 
    currentPage,
    
    // Les fonctions de pagination sont déjà incluses dans le composant Pagination
  } = useDummyJsonPagination();
  
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

  // Recharger les produits quand la page change
  useEffect(() => {
    reloadProducts();
  }, [currentPage, reloadProducts]);

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

      <main className="flex-1">
        {/* CAROUSEL EN PLEINE LARGEUR */}
        <section className="w-full overflow-hidden mb-8">
          <div >
            <div className="relative h-[300px] md:h-[400px]">
              {/* Image de fond */}
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Produits de qualité"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay bleu avec gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/85 via-blue-700/75 to-blue-500/80" />
              
              {/* Motif décoratif subtil */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
              </div>
              
              {/* Contenu avec style élégant */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                
                {/* Icône décorative */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                </div>
                
                {/* Titre principal avec effet */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    Nos Produits
                  </span>
                </h1>
                
                {/* Ligne décorative */}
                <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-full mb-6"></div>
                
                {/* Sous-titre stylisé */}
                <p className="text-xl md:text-2xl text-center text-blue-50 font-light tracking-wide">
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    Excellence & Raffinement
                  </span>
                </p>
                
               
              </div>
            </div>
          </div>
        </section>

        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
              {/* Grille de produit sur mobile */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
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
              <Pagination 
                className="mt-8"
                variant="default"
                showPageInfo={true}
                showNavigation={true}
                maxVisiblePages={5}
              />

             
            </>
          )}
        </div>
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
        
        /* Pour assurer que le carousel dépasse bien */
        .w-screen {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;