import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useProducts } from '../hook/useproducts';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, currentProduct, isLoading } = useProducts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      getProduct(parseInt(id));
    }
  }, [id, getProduct]);

  // Fonction pour supprimer du localStorage
  const deleteFromLocalStorage = (productId: number) => {
    try {
      // Récupérer les produits depuis localStorage
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Filtrer pour enlever le produit à supprimer
      const updatedProducts = products.filter((product: any) => 
        product.id !== productId
      );
      
      // Sauvegarder dans localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      console.log(`✅ Produit ${productId} supprimé du localStorage`);
      console.log(`📦 Produits restants: ${updatedProducts.length}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du localStorage:', error);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const productId = parseInt(id);
      
      // 1. Supprimer du localStorage
      const localStorageSuccess = deleteFromLocalStorage(productId);
      
      // 2. Déclencher un événement pour notifier ProductsPage
      window.dispatchEvent(new Event('productDeleted'));
      
      // 3. Si vous avez une API, vous pouvez aussi supprimer de l'API
      // const apiSuccess = await deleteProduct(productId);
      
      if (localStorageSuccess) {
        // Afficher un message temporaire
        setShowDeleteConfirm(false);
        
        // Rediriger vers la liste des produits après un court délai
        setTimeout(() => {
          navigate('/products');
        }, 500);
      }
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    } finally {
      setIsDeleting(false);
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
                Êtes-vous sûr de vouloir supprimer "{currentProduct.title}" ? 
                Cette action est irréversible et supprimera le produit définitivement.
              </p>
              
              {/* Information sur le type de produit */}
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-yellow-700">
                    Ce produit sera supprimé de votre stock local
                  </span>
                </div>
              </div>
              
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </>
                  ) : 'Supprimer définitivement'}
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