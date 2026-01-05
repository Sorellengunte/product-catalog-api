import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useProducts } from '../hook/useproducts';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, deleteProduct, currentProduct, isLoading } = useProducts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      getProduct(parseInt(id));
    }
  }, [id, getProduct]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteProduct(parseInt(id));
      if (success) {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading && !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour aux produits
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Retour au catalogue
          </Link>
        </div>

        {/* En-tête avec actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProduct.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {currentProduct.category}
              </span>
              <div className="flex items-center">
                <span className="text-amber-500">★</span>
                <span className="ml-1 font-medium">{currentProduct.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/products/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer "{currentProduct.title}" ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <img
                src={currentProduct.thumbnail}
                alt={currentProduct.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Galerie d'images */}
            {currentProduct.images && currentProduct.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {currentProduct.images.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700">{currentProduct.description}</p>
            </div>

            {/* Détails */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Détails du produit</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Marque</p>
                  <p className="font-medium">{currentProduct.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${currentProduct.price}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {currentProduct.discountPercentage}% de réduction
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock disponible</p>
                  <p className="font-medium">{currentProduct.stock} unités</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Note</p>
                  <div className="flex items-center">
                    <div className="flex text-amber-500">
                      {'★'.repeat(Math.round(currentProduct.rating))}
                      {'☆'.repeat(5 - Math.round(currentProduct.rating))}
                    </div>
                    <span className="ml-2 font-medium">{currentProduct.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{currentProduct.rating}</p>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{currentProduct.stock}</p>
                  <p className="text-sm text-gray-600">En stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;