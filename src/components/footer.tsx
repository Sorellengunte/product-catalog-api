import React from 'react';
import { Link } from 'react-router';
import { ShoppingBagIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  

  const quickLinks = [
    { to: "/", label: "Accueil" },
    { to: "/products", label: "Produits" },
    { to: "/panier", label: "panier" },
  ];

  const contactInfo = [
    { icon: EnvelopeIcon, text: "contact@MNS Store.com" },
    { icon: PhoneIcon, text: "+237 699178452" },
    { icon: MapPinIcon, text: "bafoussam, cameroun" },
  ];

  return (
    <footer className=" from-gray-900 to-black text-white bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10  from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MNS Store</span>
            </div>
            <p className="text-gray-400">
              Votre boutique en ligne premium pour tous vos besoins.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                 <li key={link.to}>
                 <Link to={link.to} className="text-gray-400 hover:text-white">
                     {link.label}
                  </Link>
    </li>
  ))}
</ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-400">
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;