import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
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

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const productId = parseInt(id);
      const data = await fetchProductById(productId);
      if (data) setProduct(data); else setError('Produit non trouvé');
    } catch (err) { setError('Erreur lors du chargement du produit'); console.error(err); }
    finally { setLoading(false); }
  };

  const discountedPrice = product ? product.price * (1 - product.discountPercentage / 100) : 0;

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
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail
      }, quantity);
      
      // Afficher la notification
      setShowNotification(true);
      
      // Rediriger vers la page produits après 1.5 secondes
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    }
  };

  if (loading) return (<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></main><Footer /></div>);
  if (error || !product) return (<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow flex items-center justify-center bg-gray-50"><div className="bg-white p-8 rounded-lg text-center shadow-lg"><h2>{error || 'Produit non trouvé'}</h2><button onClick={() => navigate('/products')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Retour</button></div></main><Footer /></div>);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top- right-4 z-50 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 shadow-lg transform transition-all duration-300 animate-fade-in">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium">
              {product.title} a été ajouté au panier ({quantity} {quantity > 1 ? 'articles' : 'article'})
            </span>
          </div>
        
        </div>
      )}

      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          {/* Images */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <img src={product.images[selectedImage] || product.thumbnail} alt={product.title} className="w-full h-full object-cover"/>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 border-2 rounded ${selectedImage===i?'border-blue-500':'border-gray-200'}`}>
                  <img src={img} alt={product.title} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(product.category)}`}>{product.category}</span>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i<Math.floor(product.rating)?'fill-amber-500 text-amber-500':'fill-gray-200 text-gray-200'}`} />)}
              <span>{product.rating.toFixed(1)}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockColor(product.stock)}`}>{product.stock>0?`${product.stock} en stock`:'Rupture'}</span>
            </div>
            <p>{product.description}</p>

            {/* Price */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage>0 && <span className="line-through text-gray-400">${product.price.toFixed(2)}</span>}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button onClick={()=>setQuantity(Math.max(1, quantity-1))} disabled={quantity<=1} className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><Minus className="w-4 h-4"/></button>
              <span className="text-xl font-bold">{quantity}</span>
              <button onClick={()=>setQuantity(Math.min(product.stock, quantity+1))} disabled={quantity>=product.stock} className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><Plus className="w-4 h-4"/></button>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAddToCart} disabled={product.stock===0} className={`py-4 rounded-xl font-bold text-white ${product.stock===0?'bg-gray-300':'bg-blue-600 hover:bg-blue-700'}`}>
              <ShoppingBag className="inline w-5 h-5 mr-2"/>
              {product.stock===0?'Rupture':'Ajouter au panier'}
            </button>

            <button onClick={()=>navigate('/products')} className="text-blue-600 mt-4 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>Retour aux produits</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;