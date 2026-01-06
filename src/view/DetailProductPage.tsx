// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { fetchProductById } from '../api/ProductApi';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ChevronLeft, 
  Truck, 
  Shield, 
  RefreshCw,
  Plus,
  Minus,
  Share2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';


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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const productId = parseInt(id);
      const data = await fetchProductById(productId);
      
      if (data) {
        setProduct(data);
      } else {
        setError('Produit non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement du produit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const discountedPrice = product 
    ? product.price * (1 - product.discountPercentage / 100)
    : 0;

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock < 10) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'smartphones': 'bg-blue-50 text-blue-700 border-blue-200',
      'laptops': 'bg-purple-50 text-purple-700 border-purple-200',
      'fragrances': 'bg-pink-50 text-pink-700 border-pink-200',
      'skincare': 'bg-green-50 text-green-700 border-green-200',
      'groceries': 'bg-amber-50 text-amber-700 border-amber-200',
      'home-decoration': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleAddToCart = () => {
    if (product) {
     
      console.log('Ajouté au panier:', { product, quantity });
      
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des détails du produit...</p>
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
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
              <div className="text-2xl">😞</div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Produit non trouvé</h2>
            <p className="text-gray-600 mb-6">{error || "Ce produit n'existe pas ou a été supprimé."}</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
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
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Accueil</Link>
              <ChevronLeft className="w-4 h-4 mx-2" />
              <Link to="/products" className="hover:text-blue-600">Produits</Link>
              <ChevronLeft className="w-4 h-4 mx-2" />
              <span className="font-medium text-gray-900 line-clamp-1">{product.title}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Images */}
            <div className="lg:w-1/2">
              {/* Main Image */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={product.images[selectedImage] || product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Category and Brand */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Marque: <span className="font-semibold text-gray-900">{product.brand}</span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {product.title}
                </h1>

               
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating.toFixed(1)} ({product.rating} avis)
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockColor(product.stock)}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <>
                            <span className="text-xl text-gray-400 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                              -{product.discountPercentage}%
                            </span>
                          </>
                        )}
                      </div>
                      {product.discountPercentage > 0 && (
                        <p className="text-green-600 font-medium mt-2">
                          Économisez ${(product.price - discountedPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Quantité</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center text-xl font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 ml-2">
                      Max: {product.stock}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </button>
                  
                 
                </div>

              

                {/* Back Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux produits
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;