import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

// Icône SVG
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

interface Product {
  id: number;
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

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    images: [''],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Récupérer le produit à modifier
  useEffect(() => {
    const loadProduct = () => {
      try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const productId = parseInt(id || '0');
        
        console.log('Recherche du produit ID:', productId);
        console.log('Produits disponibles:', products);
        
        // Rechercher le produit
        const productToEdit = products.find((p: Product) => p.id === productId);
        
        if (productToEdit) {
          console.log('Produit trouvé:', productToEdit);
          setFormData({
            title: productToEdit.title || '',
            description: productToEdit.description || '',
            price: productToEdit.price?.toString() || '0',
            discountPercentage: productToEdit.discountPercentage?.toString() || '',
            rating: productToEdit.rating?.toString() || '',
            stock: productToEdit.stock?.toString() || '0',
            brand: productToEdit.brand || '',
            category: productToEdit.category || '',
            thumbnail: productToEdit.thumbnail || '',
            images: productToEdit.images?.length > 0 ? productToEdit.images : [''],
          });
        } else {
          setError(`Produit avec ID ${id} non trouvé`);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement du produit');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Gérer les changements du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer les images
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

  // Soumettre les modifications
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const productId = parseInt(id || '0');
      
      // Récupérer les produits existants
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Mettre à jour le produit
      const updatedProducts = products.map((product: Product) => {
        if (product.id === productId) {
          return {
            ...product,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
            rating: formData.rating ? parseFloat(formData.rating) : 0,
            stock: parseInt(formData.stock) || 0,
            brand: formData.brand || '',
            category: formData.category,
            thumbnail: formData.thumbnail || '',
            images: formData.images.filter(img => img.trim() !== ''),
          };
        }
        return product;
      });
      
      // Sauvegarder
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      console.log('✅ Produit mis à jour:', productId);
      
      // Afficher le succès
      setShowSuccess(true);
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Catégories disponibles
  const categories = [
    'smartphones', 'laptops', 'fragrances', 'skincare',
    'groceries', 'home-decoration', 'furniture', 'tops',
    'womens-dresses', 'womens-shoes', 'mens-shirts',
    'mens-shoes', 'mens-watches', 'womens-watches',
    'womens-bags', 'womens-jewellery', 'sunglasses',
    'automotive', 'motorcycle', 'lighting'
  ];

  // Format de catégorie
  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error}
            </h2>
            <div className="space-y-3">
              <Link
                to="/products"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour aux produits
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Message de succès */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-center">
                <CheckIcon />
                <div className="ml-3">
                  <p className="font-bold">Produit mis à jour !</p>
                  <p className="text-sm mt-1">Redirection...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mb-8">
          <Link
            to={`/products/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon />
            <span className="ml-2">Retour au produit</span>
          </Link>
        </div>

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
          <p className="text-gray-600 mt-2">Mettez à jour les informations ci-dessous</p>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du produit *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du produit"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {formatCategory(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description détaillée du produit"
                  />
                </div>

                {/* Prix et Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Marque et Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Apple, Samsung..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Remise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remise (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Miniature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image principale
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>

                {/* Images supplémentaires */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images supplémentaires
                  </label>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`URL de l'image ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          disabled={formData.images.length <= 1}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      + Ajouter une image
                    </button>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex-1 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                  
                  <Link
                    to={`/products/${id}`}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1 text-center"
                  >
                    Annuler
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProduct;