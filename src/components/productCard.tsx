import React from "react";
import { Link } from "react-router";
import { Star, ShoppingBag, Eye, Loader2 } from "lucide-react";

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
  addToCart?: (
    product: { id: number; title: string; price: number; thumbnail: string },
    quantity: number
  ) => void;
  isLoading?: boolean; // ✅ AJOUT
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  addToCart,
  isLoading = false,
}) => {
  const discountedPrice = (
    product.price * (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart && !isLoading) {
      addToCart(
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        },
        1
      );
    }
  };

  return (
    <div
      className="
        relative
        bg-white
        rounded-xl
        shadow-sm
        border
        border-gray-100
        hover:shadow-md
        transition
        duration-300
        flex
        flex-col
        w-full
        h-full
        active:scale-[0.98]
      "
    >
      {/* ==================== LOADING OVERLAY ==================== */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-t-xl">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={`w-full h-full object-cover ${
              isLoading ? "opacity-60" : ""
            }`}
          />
        </Link>

        {/* Réduction */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{product.discountPercentage.toFixed(0)}%
          </span>
        )}

        {/* Stock */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock > 0 ? "Stock" : "Rupture"}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Catégorie + Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Titre */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        {/* Marque */}
        <p className="text-xs text-gray-500 mt-1 mb-2">{product.brand}</p>

        {/* Prix */}
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="block text-xs text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Boutons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          {/* Détails */}
          <Link
            to={`/product/${product.id}`}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              py-2
              rounded-lg
              bg-gray-100
              text-gray-700
              text-xs
              font-medium
              hover:bg-gray-200
              w-full
              sm:w-1/2
              disabled:opacity-60
            "
          >
            <Eye className="w-4 h-4" />
            Détails
          </Link>

          {/* Ajouter */}
          {addToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="
                flex
                items-center
                justify-center
                gap-1.5
                py-2
                rounded-lg
                bg-blue-500
                text-white
                text-xs
                font-semibold
                hover:bg-blue-600
                disabled:bg-gray-300
                w-full
                sm:w-1/2
              "
            >
              <ShoppingBag className="w-4 h-4" />
              Ajouter
            </button>
          )}

          {/* Rupture */}
          {product.stock === 0 && (
            <div className="w-full py-2 rounded-lg bg-gray-100 text-gray-400 text-xs font-semibold text-center">
              Rupture
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
