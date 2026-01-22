// src/components/navBar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router';
import { HomeIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon,ShoppingBagIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext'; // Corrige le chemin
import { useAuth } from '../auth/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart(); // cartCount = nombre de produits uniques
  const { user, logout } = useAuth();

  const menuItems = [
    { to: "/home", icon: HomeIcon, label: "Accueil" },
    { to: "/products", icon: ShoppingCartIcon, label: "Produits" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              MNS Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Cart */}
            <Link 
              to="/panier" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 relative"
            >
              <div className="relative">
                <ShoppingCartIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Panier ({cartCount})</span>
            </Link>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Link 
                  to="/profil" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Compte</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/clientAuth" 
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <UserIcon className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2 bg-white rounded-b-lg shadow-lg">
            {menuItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <Link 
              to="/panier" 
              className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Panier</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile User Section */}
            {user ? (
              <>
                <Link 
                  to="/profil" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Mon compte</span>
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <Link 
                to="/clientAuth" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;