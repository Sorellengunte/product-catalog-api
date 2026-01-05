import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router'; 
import Navbar from '../components/navBar'; 
import Footer from '../components/footer'; 
import { productApi } from '../api/requests'; 

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;

  // Logs de debug
  console.log('🔄 ProductsPage - Rendu avec', products.length, 'produits');
  console.log('📦 localStorage:', JSON.parse(localStorage.getItem('products') || '[]').length, 'produits');

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer depuis localStorage
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      console.log('📥 Produits locaux:', localProducts.length);
      
      // Récupérer depuis l'API
      const skip = (currentPage - 1) * productsPerPage;
      let apiProducts: any[] = [];
      let total = 0;
      
      try {
        const response = await productApi.getAllProducts(productsPerPage, skip);
        apiProducts = response.products || [];
        total = response.total || 0;
        console.log('🌐 Produits API:', apiProducts.length);
      } catch (error) {
        console.warn('API non disponible, utilisation des produits locaux uniquement');
        apiProducts = [];
        total = localProducts.length;
      }
      
      // Fusionner les produits : d'abord les locaux, puis ceux de l'API
      const allProducts = [
        ...localProducts.map((product: any, index: number) => ({
          ...product,
          id: product.id || `local-${Date.now()}-${index}`, // ID unique
          isLocal: true,
        })),
        ...apiProducts
      ];
      
      console.log('📊 Total produits fusionnés:', allProducts.length);
      
      // Transformer les données
      const saasProducts = allProducts.map((product: any) => ({
        ...product,
        pricing: {
          monthly: product.price,
          yearly: product.price * 10,
          freeTier: product.price < 50,
          trialDays: product.rating > 4 ? 30 : 14
        },
        features: [
          `${product.brand || 'Premium'} Technology`,
          'Cloud-Based',
          'Real-Time Updates',
          'Multi-Device Access'
        ],
        integrations: ['Slack', 'Google Workspace', 'Microsoft Teams'],
        saasSpecific: true
      }));
      
      setProducts(saasProducts);
      setFilteredProducts(saasProducts);
      setTotalPages(Math.ceil((total + localProducts.length) / productsPerPage));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // Charger initialement
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, loadProducts]);

  // ÉCOUTER TOUS LES ÉVÉNEMENTS DE PRODUITS (MODIFICATION IMPORTANTE)
  useEffect(() => {
    console.log('🎯 ProductsPage - Initialisation des écouteurs d\'événements');
    
    // Fonction pour rafraîchir
    const refreshProducts = () => {
      console.log('🔄 Rafraîchissement déclenché par événement');
      loadProducts();
    };
    
    // 1. Écouter les changements de localStorage (même onglet)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'products') {
        console.log('📦 Événement storage détecté pour key:', event.key);
        refreshProducts();
      }
    };
    
    // 2. Écouter les événements personnalisés
    const handleProductAdded = () => {
      console.log('➕ Événement productAdded reçu');
      refreshProducts();
    };
    
    // 3. ÉCOUTER LA SUPPRESSION (AJOUT CRITIQUE)
    const handleProductDeleted = () => {
      console.log('🗑️ Événement productDeleted reçu !');
      refreshProducts();
    };
    
    // 4. Écouter les modifications
    const handleProductUpdated = () => {
      console.log('✏️ Événement productUpdated reçu');
      refreshProducts();
    };
    
    // Ajouter tous les écouteurs
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productAdded', handleProductAdded);
    window.addEventListener('productDeleted', handleProductDeleted); // ← ÉCOUTEUR DE SUPPRESSION
    window.addEventListener('productUpdated', handleProductUpdated);
    
    console.log('✅ Tous les écouteurs sont actifs');
    
    // Nettoyer tous les écouteurs
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productAdded', handleProductAdded);
      window.removeEventListener('productDeleted', handleProductDeleted);
      window.removeEventListener('productUpdated', handleProductUpdated);
      console.log('🧹 Écouteurs nettoyés');
    };
  }, [loadProducts]);

  // Vérification périodique pour les mises à jour manquées
  useEffect(() => {
    const checkForUpdates = () => {
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const localProductIds = localProducts.map((p: any) => p.id);
      const displayedLocalProductIds = products
        .filter(p => p.isLocal)
        .map(p => p.id);
      
      // Vérifier s'il y a une différence
      if (localProducts.length !== displayedLocalProductIds.length) {
        console.log('⚠️ Incohérence détectée, rechargement...');
        console.log('LocalStorage:', localProducts.length, 'Displayed:', displayedLocalProductIds.length);
        loadProducts();
      }
    };
    
    const interval = setInterval(checkForUpdates, 2000); // Vérifier toutes les 2 secondes
    
    return () => clearInterval(interval);
  }, [products, loadProducts]);

  const loadCategories = async () => {
    try {
      const response = await productApi.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Catégories par défaut si l'API échoue
      setCategories([
        'smartphones', 'laptops', 'fragrances', 'skincare',
        'groceries', 'home-decoration', 'furniture'
      ]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    
    if (category === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const getSaaSCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'smartphones': 'Mobile Apps',
      'laptops': 'Productivity',
      'fragrances': 'Wellness',
      'skincare': 'Wellness',
      'groceries': 'Retail',
      'home-decoration': 'Home & Living',
      'furniture': 'Home & Living',
      'tops': 'Fashion',
      'womens-dresses': 'Fashion',
      'womens-shoes': 'Fashion',
      'mens-shirts': 'Fashion',
      'mens-shoes': 'Fashion',
      'mens-watches': 'Accessories',
      'womens-watches': 'Accessories',
      'womens-bags': 'Accessories',
      'womens-jewellery': 'Accessories',
      'sunglasses': 'Accessories',
      'automotive': 'Automotive',
      'motorcycle': 'Automotive',
      'lighting': 'Home & Living'
    };
    
    return categoryMap[category] || 'Business Tools';
  };

  const getSaaSPrice = (price: number) => {
    if (price < 20) return { monthly: 9.99, yearly: 99 };
    if (price < 50) return { monthly: 19.99, yearly: 199 };
    if (price < 100) return { monthly: 49.99, yearly: 499 };
    if (price < 200) return { monthly: 99.99, yearly: 999 };
    return { monthly: 199.99, yearly: 1999 };
  };

  const getSaaSFeatures = (product: any) => {
    const baseFeatures = [
      'Cloud Storage',
      'Mobile App',
      '24/7 Support',
      'API Access'
    ];
    
    const specificFeatures = [
      'AI Integration',
      'Team Collaboration',
      'Analytics Dashboard',
      'Custom Branding',
      'Multi-language',
      'SSO Support',
      'GDPR Compliant',
      'SOC 2 Certified'
    ];
    
    const randomFeatures = [...specificFeatures]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [...baseFeatures.slice(0, 1), ...randomFeatures];
  };

  // Fonction pour forcer le rafraîchissement manuellement
  const forceRefresh = () => {
    console.log('🔄 Forcer le rafraîchissement manuel');
    setIsLoading(true);
    setTimeout(() => {
      loadProducts();
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Catalogue de produit
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Découvrez notre catalogue de produits
              </p>
            </div>
          </div>
        </section>

        {/* Filtres et Recherche */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`px-4 py-2 rounded-lg ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Tous
                </button>
                {categories.slice(0, 6).map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {getSaaSCategory(category)}
                  </button>
                ))}
                
                {/* Bouton de rafraîchissement manuel (debug) */}
                <button
                  onClick={forceRefresh}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  title="Rafraîchir manuellement"
                >
                  🔄
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu Principal */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedCategory ? `${getSaaSCategory(selectedCategory)}` : 'Tous les produits'}
                </h2>
                <p className="text-slate-600">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
                  <span className="ml-2 text-sm text-blue-600">
                    ({JSON.parse(localStorage.getItem('products') || '[]').length} dans localStorage)
                  </span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <Link
                  to="/add-product"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un produit
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                    <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg mb-4" />
                    <div className="h-4 bg-slate-200 rounded mb-3" />
                    <div className="h-3 bg-slate-200 rounded w-3/4 mb-4" />
                    <div className="h-8 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 text-slate-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-slate-600 mb-6">
                  Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setFilteredProducts(products);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                  <Link
                    to="/add-product"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ajouter un produit
                  </Link>
                  <button
                    onClick={forceRefresh}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Rafraîchir
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Badge pour produits ajoutés localement */}
                {filteredProducts.some(p => p.isLocal) && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-700">
                        {filteredProducts.filter(p => p.isLocal).length} produit(s) ajouté(s) localement
                      </span>
                      <button
                        onClick={forceRefresh}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-800"
                      >
                        Actualiser
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => {
                    const saasPrice = getSaaSPrice(product.price);
                    const saasFeatures = getSaaSFeatures(product);
                    
                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                      >
                        {/* Badge pour produit local */}
                        {product.isLocal && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                              Local
                            </span>
                          </div>
                        )}
                        
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                          <img
                            src={product.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-6">
                          {/* Catégorie */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                              {getSaaSCategory(product.category)}
                            </span>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1 text-sm font-medium text-slate-700">
                                {product.rating || 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Titre */}
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                            {product.title}
                            {product.isLocal && (
                              <span className="ml-2 text-xs text-green-600">✓</span>
                            )}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          
                          {/* Features */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {saasFeatures.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Prix */}
                          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-2xl font-bold text-slate-900">
                                  ${product.price}
                                </div>
                              </div>
                              {product.discountPercentage && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                  -{product.discountPercentage}%
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                              Stock: {product.stock}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={`/products/${product.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                              >
                                Détails
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Précédent
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;