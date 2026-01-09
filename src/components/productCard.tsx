import React from 'react';
import { Link } from 'react-router';
import { Star } from 'lucide-react';
import DetailsButton from './DetailsButton';

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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      smartphones: 'text-blue-600',
      laptops: 'text-purple-600',
      fragrances: 'text-pink-600',
      skincare: 'text-green-600',
      groceries: 'text-amber-600',
      'home-decoration': 'text-orange-600',
    };
    return colors[category] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group w-full max-w-[280px] mx-auto">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
            -{product.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-700 font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mb-2 truncate">{product.brand}</p>

        <div className="mb-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-gray-900">${discountedPrice}</span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-[10px] text-green-600 font-medium mt-0.5">
              Économisez ${(product.price - parseFloat(discountedPrice)).toFixed(2)}
            </p>
          )}
        </div>

        {/* Bouton Détails */}
        <div className="flex items-center justify-between mt-2">
          <DetailsButton productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
