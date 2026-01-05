import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProduct, 
    updateProduct, 
    currentProduct, 
    isLoading, 
    error,
    getAllCategories,
    categories 
  } = useProducts();

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      getProduct(parseInt(id));
      getAllCategories();
    }
  }, [id, getProduct, getAllCategories]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      const result = await updateProduct(parseInt(id), data);
      if (result) {
        setSuccessMessage('Produit mis à jour avec succès !');
        setTimeout(() => {
          navigate(`/products/${id}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/products/${id}`);
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
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/products/${id}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Retour au détail
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
                <p className="text-gray-600 mt-2">
                  Éditez les informations du produit "{currentProduct.title}"
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${id}`)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Formulaire */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ProductForm
              initialData={currentProduct}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              categories={categories}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductEdit;