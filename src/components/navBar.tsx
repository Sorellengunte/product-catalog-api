import React, { useState } from 'react';
import { Link } from 'react-router';
import { HomeIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingCartIcon className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">MNS Store</span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex space-x-6">
            <Link to="/home" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <HomeIcon className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Produits</span>
            </Link>
            <Link to="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Panier</span>
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">2</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <UserIcon className="w-5 h-5" />
              <span>Mon Compte</span>
            </Link>
          </div>

          {/* Menu mobile button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t pt-3 pb-3">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              Produits
            </Link>
            <Link to="/cart" className="flex items-center justify-between py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              <span>Panier</span>
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">2</span>
            </Link>
            <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              Mon Compte
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;