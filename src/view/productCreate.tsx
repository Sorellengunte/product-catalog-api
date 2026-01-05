import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useProducts } from '../hook/useproducts';
import ProductForm from '../components/productForm';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, isLoading, error, getAllCategories, categories } = useProducts();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await createProduct(data);
      if (result) {
        setSuccessMessage('Produit créé avec succès !');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Retour aux produits
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau produit</h1>
            <p className="text-gray-600 mt-2">
              Remplissez les informations ci-dessous pour ajouter un nouveau produit au catalogue.
            </p>
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
              <p className="text-green-600 text-sm mt-1">Redirection en cours...</p>
            </div>
          )}

          {/* Formulaire */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ProductForm
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

export default ProductCreate;