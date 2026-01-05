import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

// Icônes SVG personnalisées
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

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
  isLocal?: boolean;
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
    if (formData.images.length <= 1) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    
    try {
      // Filtrer les images vides
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      
      // Créer un nouvel objet produit selon le format dummyjson
      const newProduct: Product = {
        id: Date.now(), // ID unique temporaire
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        stock: parseInt(formData.stock) || 0,
        brand: formData.brand || 'Unknown',
        category: formData.category,
        thumbnail: formData.thumbnail || (filteredImages[0] || 'https://via.placeholder.com/300x200?text=No+Image'),
        images: filteredImages,
        isLocal: true
      };

      // Récupérer les produits existants depuis localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Ajouter le nouveau produit
      const updatedProducts = [newProduct, ...existingProducts]; // Ajouter au début
      
      // Sauvegarder dans localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      console.log('✅ Produit ajouté:', newProduct);
      
      // Déclencher un événement pour notifier ProductsPage
      window.dispatchEvent(new Event('productAdded'));
      
      // Afficher le message de succès
      setShowSuccessMessage(true);
      
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
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du produit:', error);
      setIsSubmitted(false);
      alert('Une erreur est survenue lors de l\'ajout du produit. Veuillez réessayer.');
    }
  };

  const resetForm = () => {
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

  // Fonction pour formater le nom de catégorie
  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
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
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <ArrowLeftIcon />
                <span className="ml-2 font-medium group-hover:underline">Retour à l'accueil</span>
              </Link>
              
              <Link
                to="/products"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors group"
              >
                <span className="font-medium group-hover:underline">Voir tous les produits</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Ajouter un nouveau produit
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Remplissez le formulaire ci-dessous pour ajouter un produit à votre catalogue.
                Tous les champs marqués d'un * sont obligatoires.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    {/* Section 1: Informations de base */}
                    <div className="border-b border-gray-200 pb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de base</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Titre */}
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
                          <p className="text-sm text-gray-500 mt-1">Nom complet et descriptif du produit</p>
                        </div>

                        {/* Catégorie */}
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
                                {formatCategoryName(cat)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Détails du produit */}
                    <div className="border-b border-gray-200 pb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Détails du produit</h2>
                      
                      {/* Description */}
                      <div className="mb-6">
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
                        <p className="text-sm text-gray-500 mt-1">
                          Incluez les caractéristiques principales, les avantages et les spécifications
                        </p>
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

                      {/* Stock, Note et Remise */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                    </div>

                    {/* Section 3: Images */}
                    <div className="border-b border-gray-200 pb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Images du produit</h2>
                      
                      {/* URL de la miniature */}
                      <div className="mb-6">
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
                          Cette image sera utilisée comme miniature dans la liste des produits
                        </p>
                      </div>

                      {/* Images supplémentaires */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Images supplémentaires
                          </label>
                          <button
                            type="button"
                            onClick={addImageField}
                            className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                          >
                            <PlusIcon />
                            <span className="ml-1">Ajouter une image</span>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-3 items-start">
                              <div className="flex-grow">
                                <input
                                  type="url"
                                  value={image}
                                  onChange={(e) => handleImageChange(index, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder={`https://exemple.com/image-${index + 1}.jpg`}
                                />
                                {image && (
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    URL valide
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                disabled={formData.images.length <= 1}
                                className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                       
                      </div>
                    </div>

                    

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitted}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[200px]"
                      >
                        {isSubmitted ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Ajout en cours...
                          </span>
                        ) : 'Ajouter le produit'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 flex-1 min-w-[150px]"
                      >
                        Réinitialiser
                      </button>
                      
                      <Link
                        to="/products"
                        className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center flex-1 min-w-[150px]"
                      >
                        Annuler et retour
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