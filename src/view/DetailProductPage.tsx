import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, ShoppingBag, ArrowLeft, } from 'lucide-react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductCard from '../components/productCard';
import { useCart } from '../api/CartContext';

// Type simplifié pour éviter les problèmes de typage
type ProductType = any;

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Pour récupérer tous les produits, on utilise un fetch direct
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Récupérer tous les produits
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        setAllProducts(data.products || []);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Récupérer le produit courant
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Produit non trouvé');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Récupérer les produits recommandés de la même catégorie
  useEffect(() => {
    if (product && allProducts.length > 0) {
      // Vérifier que product a une catégorie
      if (product.category) {
        // Filtrer les produits de la même catégorie, excluant le produit courant
        const sameCategoryProducts = allProducts.filter(p => 
          p && p.category === product.category && p.id !== product.id
        );
        
        // Mélanger et prendre les 4 premiers
        const shuffled = [...sameCategoryProducts]
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        
        setRecommendedProducts(shuffled);
      }
    }
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = product?.stock || 0;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  // Fonction pour préparer les données pour ProductCard
  const prepareProductForCard = (product: ProductType) => {
    return {
      id: product?.id || 0,
      title: product?.title || 'Sans titre',
      price: product?.price || 0,
      discountPercentage: product?.discountPercentage || 0,
      rating: product?.rating || 0,
      brand: product?.brand || 'Marque non spécifiée',
      category: product?.category || 'Non catégorisé',
      thumbnail: product?.thumbnail || 'https://via.placeholder.com/300',
      stock: product?.stock || 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement du produit...</p>
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Produit non trouvé</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retour aux produits
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Notification d'ajout au panier */}
      {showNotification && (
        <div className="fixed top-4 md:top-6 right-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{product.title}</p>
              <p className="text-xs text-green-600">Ajouté au panier</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Bouton retour */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>

        {/* Section produit principal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galerie d'images */}
            <div>
              {/* Image principale */}
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Miniatures */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit - PARTIE DROITE RÉORGANISÉE */}
            <div className="flex flex-col">
              {/* En-tête avec catégorie et titre */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                      {product.brand}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>

                {/* Rating et avis */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating.toFixed(1)}/5
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">128 avis</span>
                  </div>
                )}
              </div>

              {/* Prix - Section bien distincte */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ${discountedPrice}
                  </span>
                  {product.discountPercentage && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full">
                        -{product.discountPercentage.toFixed(0)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={product.stock > 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {product.stock > 0 ? '✓ En stock' : '✗ Rupture de stock'}
                  </span>
                </div>
              </div>

              {/* Description - Section mise en valeur */}
              {product.description && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-0.5 bg-blue-600"></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Description du produit
                    </h3>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Sélecteur de quantité et boutons */}
              <div className="mb-8">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-6 py-3 font-medium text-lg min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-lg">Ajouter au panier</span>
                  </button>
                 
                </div>
              </div>

              
            </div>
          </div>
        </section>

        {/* SECTION PRODUITS RECOMMANDÉS */}
        {recommendedProducts.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-0.5 bg-blue-600"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Recommandations
                  </h2>
                </div>
                <p className="text-gray-600 ml-4">
                  Découvrez d'autres produits de la catégorie "{product.category}"
                </p>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((recommendedProduct) => (
                    <div key={recommendedProduct.id} className="w-full">
                      <ProductCard
                        product={prepareProductForCard(recommendedProduct)}
                        addToCart={() => {
                          addToCart(recommendedProduct, 1);
                          setShowNotification(true);
                          setTimeout(() => setShowNotification(false), 3000);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
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
        
        .whitespace-pre-line {
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;