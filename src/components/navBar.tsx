import React, { useState } from 'react';
import { Link } from 'react-router';
import { HomeIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../api/CartContext';
import { useAuth } from '../auth/AuthContext'; // <-- importer AuthContext

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart(); 
  const { user, logout } = useAuth(); // <-- récupérer user et logout

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingCartIcon className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">MNS Store</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <HomeIcon className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Produits</span>
            </Link>
            <Link to="/panier" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Panier</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Mon compte + Déconnexion */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profil" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <UserIcon className="w-5 h-5" />
                  <span>Mon compte</span>
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/" className="text-blue-600 font-medium">Connexion</Link>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t pt-3 pb-3 space-y-2">
            <Link to="/home" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Produits</Link>
            <Link to="/panier" className="flex items-center justify-between py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              <span>Panier</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>
              )}
            </Link>
            {user ? (
              <div className="flex flex-col border-t pt-2">
                <Link to="/profil" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                 Mon compte
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full text-left py-2 text-red-500 hover:text-red-700"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/" className="block py-2 text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
