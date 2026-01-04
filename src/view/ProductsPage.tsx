import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const skip = (currentPage - 1) * productsPerPage;
      const response = await productApi.getAllProducts(productsPerPage, skip);
      
      // Transformer les données en format SaaS
      const saasProducts = response.products.map((product: any) => ({
        ...product,
        // Ajout des spécificités SaaS
        pricing: {
          monthly: product.price,
          yearly: product.price * 10, // -20% pour l'annuel
          freeTier: product.price < 50,
          trialDays: product.rating > 4 ? 30 : 14
        },
        features: [
          `${product.brand} Technology`,
          'Cloud-Based',
          'Real-Time Updates',
          'Multi-Device Access'
        ],
        integrations: ['Slack', 'Google Workspace', 'Microsoft Teams'],
        saasSpecific: true
      }));
      
      setProducts(saasProducts);
      setFilteredProducts(saasProducts);
      setTotalPages(Math.ceil(response.total / productsPerPage));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productApi.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
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
    // Prix SaaS typiques
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
    
    // Sélectionner 3-4 features aléatoires
    const randomFeatures = [...specificFeatures]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [...baseFeatures.slice(0, 1), ...randomFeatures];
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
                Catalogue d'Outils SaaS
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Découvrez notre sélection exclusive d'outils SaaS premium pour booster votre productivité
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
                    placeholder="Rechercher un outil SaaS..."
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
                  {selectedCategory ? `${getSaaSCategory(selectedCategory)} Tools` : 'Tous les outils SaaS'}
                </h2>
                <p className="text-slate-600">
                  {filteredProducts.length} outils disponibles
                </p>
              </div>
              
              <Link
                to="/add-product"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un outil
              </Link>
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
                  Aucun outil trouvé
                </h3>
                <p className="text-slate-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
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
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => {
                    const saasPrice = getSaaSPrice(product.price);
                    const saasFeatures = getSaaSFeatures(product);
                    
                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Badge SaaS */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                            SaaS
                          </span>
                        </div>
                        
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-6">
                          {/* Catégorie SaaS */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                              {getSaaSCategory(product.category)}
                            </span>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1 text-sm font-medium text-slate-700">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                          
                          {/* Titre */}
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                            {product.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          
                          {/* Features SaaS */}
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
                          
                          {/* Pricing SaaS */}
                          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-2xl font-bold text-slate-900">
                                  ${saasPrice.monthly}
                                  <span className="text-sm font-normal text-slate-600">/mois</span>
                                </div>
                                <div className="text-sm text-slate-500">
                                  ${saasPrice.yearly}/an (-20%)
                                </div>
                              </div>
                              {product.price < 50 && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                                  Free Tier
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                              {product.stock} utilisateurs
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

        {/* Info Section SaaS */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Pourquoi choisir des outils SaaS ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  {
                    icon: '☁️',
                    title: 'Cloud-Native',
                    description: 'Accédez à vos outils depuis n\'importe où, sans installation'
                  },
                  {
                    icon: '🔄',
                    title: 'Mises à jour automatiques',
                    description: 'Toujours la dernière version sans effort'
                  },
                  {
                    icon: '💰',
                    title: 'Abonnement flexible',
                    description: 'Payez seulement pour ce que vous utilisez'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white/80 p-6 rounded-xl border border-white/20">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;