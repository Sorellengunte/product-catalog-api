import React, { useState } from "react";
import Navbar from "../../components/navBar";
import Footer from "../../components/footer";
import Button from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { useCart } from "../../api/CartContext";
import { ShoppingCart, CreditCard, Check } from "lucide-react";
import { useNavigate } from "react-router";

export default function ProfileDashboard() {
  const { user, logout } = useAuth();
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  if (!user) return <p>Chargement...</p>;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setShowCheckoutSuccess(false);
      navigate("/products");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Notification succès checkout */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Commande passée !</h2>
            <p className="text-gray-600 mb-6">Merci {user.username}, votre commande a été envoyée avec succès.</p>
            <div className="animate-pulse text-gray-500 text-sm">Redirection vers les produits...</div>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Accueil */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Bonjour {user.username} ! 👋</h1>
          <p className="text-gray-600 text-lg">
            Bienvenue sur votre tableau de bord. Vous pouvez consulter votre panier, passer vos commandes et continuer vos achats facilement.
          </p>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <Button onClick={() => navigate("/products")} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              Explorer les produits
            </Button>
            {cart.length > 0 && (
              <Button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Passer la commande (${getTotalPrice().toFixed(2)})
              </Button>
            )}
          </div>
        </div>

        {/* Résumé du panier */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Panier actuel</h2>
          {cart.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Votre panier est vide pour le moment.</p>
              <Button onClick={() => navigate("/products")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Continuer vos achats
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total :</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

       
      </main>

      <Footer />
    </div>
  );
}
