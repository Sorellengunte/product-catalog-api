import React from 'react';
import { Link } from 'react-router';
import { Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    rating: number;
    brand: string;
    category: string;
    thumbnail: string;
    stock: number;
  };
  addToCart?: (product: { id: number; title: string; price: number; thumbnail: string }, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche la propagation du clic
    if (addToCart) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail
      }, 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group w-full max-w-[280px] mx-auto">
      {/* Image avec badge */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Badge réduction */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
            -{product.discountPercentage.toFixed(0)}%
          </div>
        )}
        
        {/* Badge stock */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.stock > 0 ? 'En stock' : 'Rupture'}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie et rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Titre */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem] group-hover:underline">
            {product.title}
          </h3>
        </Link>

        {/* Marque */}
        <p className="text-sm text-gray-500 mb-3">{product.brand}</p>

        {/* Prix */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">${discountedPrice}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Économisez ${(product.price - parseFloat(discountedPrice)).toFixed(2)}
            </p>
          )}
        </div>

        {/* Boutons - positionnés aux extrémités */}
        <div className="flex items-center justify-between">
          {/* Bouton Détails à gauche */}
          <Link 
            to={`/product/${product.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 group/detail"
          >
            <Eye className="w-4 h-4 group-hover/detail:scale-110 transition-transform" />
            <span className="text-sm font-medium">Détails</span>
          </Link>

          {/* Bouton Ajouter au panier à droite */}
          {addToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm hover:shadow-md group/cart"
              title="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4 group-hover/cart:scale-110 transition-transform" />
              <span className="text-sm font-medium"> panier</span> {/* Texte changé */}
            </button>
          )}
          
          {/* État rupture de stock */}
          {product.stock === 0 && (
            <div className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
              <span className="text-sm font-medium">Rupture</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;