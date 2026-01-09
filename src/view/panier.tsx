import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { useCart } from '../api/CartContext'; 
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, CreditCard, Check } from 'lucide-react';

const Panier: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, cartCount } = useCart();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = () => {
    // Afficher le message de confirmation
    setShowSuccess(true);
    
    // Vider le panier et rediriger après 2 secondes
    setTimeout(() => {
      clearCart();
      setShowSuccess(false);
      navigate('/products');
    }, 2000);
  };

  if (cart.length === 0) { 
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center bg-white rounded-2xl shadow-lg p-12">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Votre panier est vide</h1>
              <p className="text-gray-600 mb-8">Ajoutez des produits pour les voir ici.</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux produits
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Message de confirmation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Commande envoyée !</h2>
            <p className="text-gray-600 mb-6">Votre commande a été envoyée avec succès.</p>
            <div className="animate-pulse text-gray-500 text-sm">
              Redirection en cours...
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mon Panier</h1>
            <p className="text-gray-600">{cartCount} article{cartCount > 1 ? 's' : ''}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 border-b last:border-b-0 flex gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.title}</h3>
                          <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Minus className="w-4 h-4 mx-auto" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                        <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-6 flex justify-between">
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Continuer mes achats
                  </button>
                  <button
                    onClick={clearCart}
                    className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Panier;