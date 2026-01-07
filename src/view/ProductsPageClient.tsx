import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import { Search, Filter, Loader2, ShoppingBag, Heart } from 'lucide-react'; 
import Navbar from '../components/navBar'; 
import Footer from '../components/footer';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Charger les produits au démarrage
  useEffect(() => {
    loadProducts();
  }, []);

  // Charger les produits (simulation d'API)
  const loadProducts = async () => {
    setLoading(true);
    try {
      // Simulation de produits - en pratique viendrait d'une API
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          description: 'Le dernier iPhone avec écran Super Retina XDR et puce A17 Pro',
          price: 1099,
          discountPercentage: 10,
          rating: 4.8,
          stock: 50,
          brand: 'Apple',
          category: 'smartphones',
          thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop'
        },
        {
          id: 2,
          title: 'MacBook Air M2',
          description: 'Ultra-fin, ultra-puissant avec la puce M2',
          price: 1299,
          discountPercentage: 15,
          rating: 4.9,
          stock: 30,
          brand: 'Apple',
          category: 'laptops',
          thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop'
        },
        {
          id: 3,
          title: 'Samsung Galaxy S23',
          description: 'Écran Dynamic AMOLED 2X, appareil photo 200MP',
          price: 899,
          discountPercentage: 12,
          rating: 4.7,
          stock: 40,
          brand: 'Samsung',
          category: 'smartphones',
          thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop'
        },
        {
          id: 4,
          title: 'Sony WH-1000XM5',
          description: 'Casque sans fil avec réduction de bruit exceptionnelle',
          price: 399,
          discountPercentage: 8,
          rating: 4.8,
          stock: 60,
          brand: 'Sony',
          category: 'audio',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
        },
        {
          id: 5,
          title: 'Nike Air Max',
          description: 'Chaussures de sport avec amorti Air Max',
          price: 129,
          discountPercentage: 20,
          rating: 4.6,
          stock: 100,
          brand: 'Nike',
          category: 'fashion',
          thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
        },
        {
          id: 6,
          title: 'Dell XPS 13',
          description: 'Ultrabook avec écran InfinityEdge 4K',
          price: 1499,
          discountPercentage: 10,
          rating: 4.7,
          stock: 25,
          brand: 'Dell',
          category: 'laptops',
          thumbnail: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop'
        },
        {
          id: 7,
          title: 'Apple Watch Series 8',
          description: 'Montre connectée avec capteurs de santé avancés',
          price: 429,
          discountPercentage: 5,
          rating: 4.5,
          stock: 45,
          brand: 'Apple',
          category: 'wearables',
          thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop'
        },
        {
          id: 8,
          title: 'Bose QuietComfort 45',
          description: 'Casque avec réduction de bruit et confort optimal',
          price: 329,
          discountPercentage: 15,
          rating: 4.6,
          stock: 35,
          brand: 'Bose',
          category: 'audio',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
        }
      ];

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Gestion de la wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Calculer le prix après réduction
  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Notre Boutique</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Découvrez notre sélection exclusive de produits de qualité
              </p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit, une marque..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Filtre par catégorie */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Toutes les catégories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Indicateurs de filtres */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-600">
                  Filtres actifs: 
                  {searchQuery && <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">"{searchQuery}"</span>}
                  {selectedCategory !== 'all' && (
                    <span className="ml-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </span>
                  )}
                </p>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Produits disponibles</p>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Résultats trouvés</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Dans ma liste d'envies</p>
                  <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" fill={wishlist.length > 0 ? "#dc2626" : "none"} />
                </div>
              </div>
            </div>
          </div>

          {/* Grille de produits */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Essayez avec d'autres termes de recherche ou parcourez toutes nos catégories
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => {
                  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
                  const isInWishlist = wishlist.includes(product.id);

                  return (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image du produit */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop';
                          }}
                        />
                        
                        {/* Badge de réduction */}
                        {product.discountPercentage > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                              -{product.discountPercentage}%
                            </span>
                          </div>
                        )}
                        
                        {/* Bouton wishlist */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        >
                          <Heart 
                            className="w-5 h-5" 
                            fill={isInWishlist ? "#dc2626" : "none"}
                            stroke={isInWishlist ? "#dc2626" : "#4b5563"}
                          />
                        </button>
                      </div>

                      {/* Informations du produit */}
                      <div className="p-6">
                        {/* Catégorie */}
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </span>
                        </div>

                        {/* Titre et marque */}
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Note */}
                        <div className="flex items-center mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                          </span>
                        </div>

                        {/* Prix et actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {discountedPrice.toFixed(2)}€
                              </span>
                              {product.discountPercentage > 0 && (
                                <span className="text-lg text-gray-400 line-through">
                                  {product.price.toFixed(2)}€
                                </span>
                              )}
                            </div>
                            {product.discountPercentage > 0 && (
                              <p className="text-sm text-green-600 mt-1">
                                Économisez {(product.price - discountedPrice).toFixed(2)}€
                              </p>
                            )}
                          </div>
                          
                          <Link
                            to={`/product/${product.id}`}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination (optionnelle) */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    ← Précédent
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">3</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Suivant →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Section catégories populaires */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Parcourir par catégorie
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.filter(cat => cat !== 'all').slice(0, 8).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedCategory === category 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {products.filter(p => p.category === category).length} produits
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;