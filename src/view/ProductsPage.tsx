import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import { Search, Filter, Loader2, ShoppingBag, X, Plus } from 'lucide-react'; 
import ProductCard from '../components/productCard';
import { fetchProducts } from '../api/ProductApi';
import Navbar from '../components/navBar'; 
import Footer from '../components/footer';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const ProductsPage: React.FC = () => {
  // Charger les produits depuis localStorage au démarrage
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(products.length === 0); // Charger seulement si localStorage vide
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // État pour la modal d'ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    stock: '',
    thumbnail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sauvegarder les produits dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Fetch products depuis l'API seulement si localStorage est vide
  useEffect(() => {
    if (products.length === 0) {
      loadProductsFromAPI();
    } else {
      setFilteredProducts(products);
      setLoading(false);
    }
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const loadProductsFromAPI = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
      localStorage.setItem('products', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la modal d'ajout
  const openAddModal = () => {
    setNewProduct({
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      stock: '',
      thumbnail: ''
    });
    setErrors({});
    setShowAddModal(true);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newProduct.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }
    
    const price = parseFloat(newProduct.price);
    if (!newProduct.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }
    
    if (!newProduct.category) {
      newErrors.category = 'La catégorie est obligatoire';
    }
    
    const stock = parseInt(newProduct.stock);
    if (!newProduct.stock || isNaN(stock) || stock < 0) {
      newErrors.stock = 'Le stock doit être un nombre positif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour gérer l'ajout de produit
  const handleAddProduct = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Générer un ID unique basé sur le timestamp
    const newId = Date.now();
    
    const productToAdd: Product = {
      id: newId,
      title: newProduct.title,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      discountPercentage: 0,
      rating: Math.random() * 5, // Note aléatoire pour l'exemple
      stock: parseInt(newProduct.stock),
      brand: newProduct.brand || 'Generic',
      category: newProduct.category,
      thumbnail: newProduct.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image',
      images: newProduct.thumbnail ? [newProduct.thumbnail] : ['https://via.placeholder.com/300x200?text=No+Image']
    };
    
    // Ajouter le nouveau produit au début de la liste
    const updatedProducts = [productToAdd, ...products];
    setProducts(updatedProducts);
    
    // Réinitialiser le formulaire et fermer la modal
    setShowAddModal(false);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      stock: '',
      thumbnail: ''
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Fonction pour réinitialiser les données (optionnel)
  const resetToAPIData = async () => {
    if (window.confirm('Voulez-vous réinitialiser aux données de l\'API ? Vos produits ajoutés seront perdus.')) {
      await loadProductsFromAPI();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Notification de persistance */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <p className="text-blue-700 text-sm">
              <span className="font-medium">💾 Données sauvegardées : </span>
              Les produits sont stockés dans votre navigateur et resteront après l'actualisation.
            </p>
            <button
              onClick={resetToAPIData}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Réinitialiser aux données API
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Nos Produits</h1>
                </div>
                <p className="text-blue-100">
                  {products.length} produits disponibles • Stocké localement
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors whitespace-nowrap"
                >
                  ← Retour à l'accueil
                </Link>
                
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un produit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Toutes catégories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Filters Button */}
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} correspond{filteredProducts.length !== 1 ? 'ent' : ''} à votre recherche
            </p>
            <div className="text-sm text-gray-500">
              {products.length - filteredProducts.length > 0 && (
                <span>{products.length - filteredProducts.length} produit{products.length - filteredProducts.length !== 1 ? 's' : ''} masqué{products.length - filteredProducts.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez avec d'autres termes ou catégories</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir tous les produits
                </button>
                <button
                  onClick={openAddModal}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter un produit
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal pour ajouter un produit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Ajouter un nouveau produit
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                    placeholder="Nom du produit"
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Description du produit"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      disabled={isSubmitting}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-2 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      disabled={isSubmitting}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Marque"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image
                  </label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={newProduct.thumbnail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Laisser vide pour utiliser une image par défaut
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    * Champs obligatoires
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddProduct}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Ajout...
                        </>
                      ) : (
                        'Ajouter'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;