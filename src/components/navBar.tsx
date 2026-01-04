import React from 'react';
import { Link } from 'react-router';
import { ShoppingCartIcon, HomeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingCartIcon className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">ShopApp</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Produits</span>
            </Link>
            
            <Link
              to="/add-product"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Ajouter</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t mt-2 pt-2">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600 py-2">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 py-2">
              Produits
            </Link>
            <Link to="/add-product" className="text-gray-700 hover:text-blue-600 py-2">
              Ajouter un produit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;