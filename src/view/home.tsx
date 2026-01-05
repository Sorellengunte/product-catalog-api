import React from 'react';
import { Link } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Découvrez notre collection
              </h1>
              <p className="text-xl text-blue-100 mb-10">
                Produits sélectionnés pour leur qualité
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Voir les produits
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Produits populaires
              </h2>
              <Link
                to="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir tout
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Produit 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">Produit Premium</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      Électronique
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">$199.99</span>
                  </div>
                </div>
              </div>

              {/* Produit 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">Produit Éco</h3>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                      Maison
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">$89.99</span>
                  </div>
                </div>
              </div>

              {/* Produit 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">Produit Luxe</h3>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                      Édition limitée
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">$349.99</span>
                  </div>
                </div>
              </div>

              {/* Produit 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">Produit Basique</h3>
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                      Essentiel
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">$49.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Recherche facile</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Large choix</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Meilleurs avis</h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à explorer ?
            </h2>
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-xl"
            >
              Voir tous les produits
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;