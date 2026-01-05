import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

// Icône SVG personnalisé
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Interface basée sur dummyjson.com/products
interface Product {
  id?: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images: string[];
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    brand: '',
    category: '',
    thumbnail: '',
    images: ['', '', ''], // Support pour 3 images
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrer les images vides
    const filteredImages = formData.images.filter(img => img.trim() !== '');
    
    // Créer un nouvel objet produit selon le format dummyjson
    const newProduct: Product = {
      id: Date.now(), // ID unique temporaire
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      stock: parseInt(formData.stock) || 0,
      brand: formData.brand || undefined,
      category: formData.category,
      thumbnail: formData.thumbnail || filteredImages[0] || '',
      images: filteredImages
    };

    // Récupérer les produits existants depuis localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Ajouter le nouveau produit
    const updatedProducts = [...existingProducts, newProduct];
    
    // Sauvegarder dans localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    console.log('Produit ajouté:', newProduct);
    
    // Afficher le message de succès
    setShowSuccessMessage(true);
    setIsSubmitted(true);
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        price: '',
        discountPercentage: '',
        rating: '',
        stock: '',
        brand: '',
        category: '',
        thumbnail: '',
        images: ['', '', ''],
      });
      setIsSubmitted(false);
      
      // Rediriger vers la page des produits après 2 secondes
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }, 3000);
  };

  const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Message de succès */}
          {showSuccessMessage && (
            <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg max-w-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold">Produit ajouté avec succès !</p>
                    <p className="text-sm mt-1">Redirection vers la liste des produits...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* En-tête */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <ArrowLeftIcon />
              <span className="ml-2 font-medium">Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ajouter un produit</h1>
            <p className="text-gray-600 mt-2">
              Remplissez le formulaire ci-dessous pour ajouter un nouveau produit
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Titre et Catégorie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Titre du produit *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Ex: iPhone 15 Pro Max"
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Brand et Prix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                          Marque
                        </label>
                        <input
                          type="text"
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Ex: Apple"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Prix (€) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            €
                          </span>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Décrivez votre produit en détail..."
                      />
                    </div>

                    {/* Stock, Note et Remise */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                          Stock *
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                          Note (0-5)
                        </label>
                        <input
                          type="number"
                          id="rating"
                          name="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="4.5"
                        />
                      </div>

                      <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                          Remise (%)
                        </label>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            %
                          </span>
                          <input
                            type="number"
                            id="discountPercentage"
                            name="discountPercentage"
                            value={formData.discountPercentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* URL de la miniature */}
                    <div>
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la miniature (image principale)
                      </label>
                      <input
                        type="url"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://exemple.com/thumbnail.jpg"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        URL de l'image principale qui servira de miniature
                      </p>
                    </div>

                    {/* Images supplémentaires */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images supplémentaires
                      </label>
                      <div className="space-y-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="url"
                              value={image}
                              onChange={(e) => handleImageChange(index, e.target.value)}
                              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder={`https://exemple.com/image-${index + 1}.jpg`}
                            />
                            {formData.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="px-4 py-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addImageField}
                          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                        >
                          + Ajouter une autre image
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Les images supplémentaires seront affichées dans la galerie du produit
                      </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isSubmitted}
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitted ? 'Ajout en cours...' : 'Ajouter le produit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            title: '',
                            description: '',
                            price: '',
                            discountPercentage: '',
                            rating: '',
                            stock: '',
                            brand: '',
                            category: '',
                            thumbnail: '',
                            images: ['', '', ''],
                          });
                        }}
                        className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        Réinitialiser
                      </button>
                      <Link
                        to="/products"
                        className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                      >
                        Voir les produits
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProduct;