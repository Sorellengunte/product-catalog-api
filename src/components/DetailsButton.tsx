import React from 'react';
import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';

interface DetailsButtonProps {
  productId: number;
  className?: string;
}

const DetailsButton: React.FC<DetailsButtonProps> = ({ productId, className }) => {
  return (
    <Link
      to={`/product/${productId}`}
      className={`px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 ml-auto ${className || ''}`}
    >
      <ShoppingBag className="w-3 h-3" />
      Détails
    </Link>
  );
};

export default DetailsButton;
