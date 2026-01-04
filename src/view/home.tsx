import React from 'react';
import { Link } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

// Icônes SVG personnalisées (sans @heroicons/react)
const ShoppingBagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Découvrez nos produits
              </h1>
              <p className="text-xl mb-8">
                Une sélection de produits de qualité pour tous vos besoins
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <ShoppingBagIcon />
                  <span className="ml-2">Voir les produits</span>
                </Link>
                <Link
                  to="/add-product"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Ajouter un produit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon />
                </div>
                <h3 className="text-xl font-bold mb-2">Recherche facile</h3>
                <p className="text-gray-600">
                  Trouvez rapidement les produits qui vous intéressent grâce à notre moteur de recherche puissant
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon />
                </div>
                <h3 className="text-xl font-bold mb-2">Large choix</h3>
                <p className="text-gray-600">
                  Des centaines de produits soigneusement sélectionnés pour répondre à tous vos besoins
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon />
                </div>
                <h3 className="text-xl font-bold mb-2">Meilleurs avis</h3>
                <p className="text-gray-600">
                  Consultez les notes et avis des utilisateurs pour faire le meilleur choix
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Produits populaires</h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Voir tous les produits
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Produit 1 */}
              <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Produit Premium</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Un produit exceptionnel avec des fonctionnalités avancées
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">$199.99</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Électronique
                    </span>
                  </div>
                </div>
              </div>

              {/* Produit 2 */}
              <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-green-400 to-green-500"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Produit Éco</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Produit respectueux de l'environnement et durable
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">$89.99</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Maison
                    </span>
                  </div>
                </div>
              </div>

              {/* Produit 3 */}
              <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-500"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Produit Luxe</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Édition limitée pour les connaisseurs
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">$349.99</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Luxe
                    </span>
                  </div>
                </div>
              </div>

              {/* Produit 4 */}
              <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-red-400 to-red-500"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Produit Basique</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Solution simple et efficace pour les besoins courants
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">$49.99</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      Essentiel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et découvrez les meilleurs produits
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Explorer les produits
              </Link>
              <Link
                to="/add-product"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
              >
                Ajouter votre produit
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;