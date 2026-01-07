import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import { Search, Filter, Loader2, ShoppingBag, Heart, Star } from 'lucide-react'; 
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

  // Charger les produits
  const loadProducts = async () => {
    setLoading(true);
    try {
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
          thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop'
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
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
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
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-3">Nos Produits</h1>
              <p className="text-blue-100">
                Découvrez notre sélection exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div className="w-full md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Toutes catégories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Grille de produits SIMPLIFIÉE */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
                const isInWishlist = wishlist.includes(product.id);

                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Image du produit - PLUS PETITE */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop';
                        }}
                      />
                      
                      {/* Badge de réduction */}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{product.discountPercentage}%
                          </span>
                        </div>
                      )}
                      
                      {/* Bouton wishlist */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <Heart 
                          className="w-4 h-4" 
                          fill={isInWishlist ? "#dc2626" : "none"}
                          stroke={isInWishlist ? "#dc2626" : "#4b5563"}
                        />
                      </button>
                    </div>

                    {/* Informations du produit - MINIMALISTES */}
                    <div className="p-3">
                      {/* Catégorie discrète */}
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">
                          {product.category}
                        </span>
                      </div>

                      {/* Titre - UNE LIGNE */}
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {product.title}
                      </h3>

                      {/* Marque - discrète */}
                      <p className="text-xs text-gray-600 mb-2">
                        {product.brand}
                      </p>

                      {/* Note simplifiée */}
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        </div>
                        <span className="text-xs text-gray-700 ml-1">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Prix - informations essentielles */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-gray-900">
                              {discountedPrice.toFixed(0)}€
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                {product.price.toFixed(0)}€
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link to={`/product/${product.id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
  Voir plus
</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Catégories rapides */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Catégories populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.filter(cat => cat !== 'all').map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
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