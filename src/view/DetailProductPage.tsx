import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchProductById } from '../api/ProductApi';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Star, ShoppingBag, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../api/CartContext';

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
  images: string[];
}

// Type pour les données de l'API (potentiellement différentes)
interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fonction pour mapper les données de l'API vers notre interface Product
  const mapApiToProduct = (apiData: ApiProduct): Product => {
    return {
      id: apiData.id,
      title: apiData.title || 'Produit sans nom',
      description: apiData.description || 'Aucune description disponible',
      price: apiData.price || 0,
      discountPercentage: apiData.discountPercentage || 0,
      rating: apiData.rating || 0,
      stock: apiData.stock || 0,
      brand: apiData.brand || 'Marque non spécifiée',
      category: apiData.category || 'Non catégorisé',
      thumbnail: apiData.thumbnail || '',
      images: apiData.images && apiData.images.length > 0 
        ? apiData.images 
        : apiData.thumbnail 
          ? [apiData.thumbnail] 
          : ['https://via.placeholder.com/600']
    };
  };

  const loadProduct = async () => {
    if (!id) {
      setError('ID de produit non spécifié');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        throw new Error('ID de produit invalide');
      }
      
      const apiData = await fetchProductById(productId);
      
      if (!apiData) {
        throw new Error('Produit non trouvé');
      }
      
      // Mapper les données de l'API vers notre interface
      const mappedProduct = mapApiToProduct(apiData as ApiProduct);
      setProduct(mappedProduct);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du produit';
      setError(errorMessage);
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  const discountedPrice = product ? product.price * (1 - product.discountPercentage / 100) : 0;

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock < 10) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      smartphones: 'bg-blue-50 text-blue-700 border-blue-200',
      laptops: 'bg-purple-50 text-purple-700 border-purple-200',
      fragrances: 'bg-pink-50 text-pink-700 border-pink-200',
      skincare: 'bg-green-50 text-green-700 border-green-200',
      groceries: 'bg-amber-50 text-amber-700 border-amber-200',
      'home-decoration': 'bg-orange-50 text-orange-700 border-orange-200',
      furniture: 'bg-amber-50 text-amber-700 border-amber-200',
      tops: 'bg-rose-50 text-rose-700 border-rose-200',
      'womens-dresses': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
      'womens-shoes': 'bg-purple-50 text-purple-700 border-purple-200',
      'mens-shirts': 'bg-blue-50 text-blue-700 border-blue-200',
      'mens-shoes': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'mens-watches': 'bg-gray-50 text-gray-700 border-gray-200',
      'womens-watches': 'bg-pink-50 text-pink-700 border-pink-200',
      'womens-bags': 'bg-red-50 text-red-700 border-red-200',
      'womens-jewellery': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      sunglasses: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      automotive: 'bg-slate-50 text-slate-700 border-slate-200',
      motorcycle: 'bg-neutral-50 text-neutral-700 border-neutral-200',
      lighting: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return colors[normalizedCategory] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        },
        quantity
      );

      setShowNotification(true);

      // Cacher la notification après 1.5 secondes et naviguer
      setTimeout(() => {
        setShowNotification(false);
        navigate('/products');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Produit non trouvé'}</h2>
            <p className="text-gray-600 mb-6">Nous n'avons pas pu charger les détails de ce produit.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retour aux produits
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification d'ajout au panier */}
      {showNotification && (
        <div className="fixed top-20 md:top-24 right-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{product.title}</p>
              <p className="text-xs text-green-600">
                Ajouté au panier ({quantity} {quantity > 1 ? 'articles' : 'article'})
              </p>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux produits</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Images du produit */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-contain p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600';
                  }}
                />
              </div>
              
              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} - vue ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Catégorie */}
                <div className="mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(product.category)}`}>
                    {product.category.replace(/-/g, ' ')}
                  </span>
                </div>

                {/* Titre */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                {/* Marque */}
                {product.brand && product.brand !== 'Marque non spécifiée' && (
                  <div className="mb-4">
                    <span className="text-gray-600">Marque: </span>
                    <span className="font-medium text-gray-800">{product.brand}</span>
                  </div>
                )}

                {/* Rating et stock */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(product.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700 font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStockColor(product.stock)}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Prix */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">${discountedPrice.toFixed(2)}</span>
                    
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-xl line-through text-gray-400">${product.price.toFixed(2)}</span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full">
                          -{product.discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  
                  {product.discountPercentage > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Vous économisez ${(product.price - discountedPrice).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quantité */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Quantité:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Réduire la quantité"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Sous-total: <span className="font-semibold">${(discountedPrice * quantity).toFixed(2)}</span>
                  </p>
                </div>

                {/* Bouton Ajouter au panier */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all ${
                    product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {product.stock === 0
                      ? 'Produit indisponible'
                      : `Ajouter au panier - $${(discountedPrice * quantity).toFixed(2)}`}
                  </span>
                </button>

                {/* Garanties */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Livraison gratuite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Retours sous 30 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Support 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      `}</style>
    </div>
  );
};

export default ProductDetailPage;