import React from 'react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopApp</h3>
            <p className="text-gray-400">
              Votre boutique en ligne pour tous vos besoins.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="text-gray-400 hover:text-white">
                  Ajouter produit
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@shopapp.com</li>
              <li>+237 699178452</li>
              <li>bafoussam, cameroun</li>
            </ul>
          </div>
        </div>

      
      </div>
    </footer>
  );
};

export default Footer;