import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useProducts } from '../../hook/useproducts';
import { findProductInStorage } from '../../utils/productStorage';
import { useAuth } from '../../auth/AuthContext';

export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
  description?: string;
}

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { user, logout } = useAuth();
  
  const { products, addProduct, editProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    category: '',
    thumbnail: '',
    brand: '',
    rating: '',
    discountPercentage: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);
  
  const [formLoading, setFormLoading] = useState(isEditing);

  // 🔴 CORRECTION : Charger le produit depuis PLUSIEURS sources
  useEffect(() => {
    if (isEditing && id) {
      const productId = parseInt(id);
      
      // D'abord chercher dans localStorage
      let product = findProductInStorage(productId);
      
      // Si pas trouvé, chercher dans les produits chargés
      if (!product) {
        product = products.find(p => p.id === productId);
      }
      
      if (product) {
        setFormData({
          title: product.title || '',
          price: product.price?.toString() || '0',
          stock: product.stock?.toString() || '0',
          category: product.category || '',
          thumbnail: product.thumbnail || '',
          brand: product.brand || '',
          rating: product.rating?.toString() || '',
          discountPercentage: product.discountPercentage?.toString() || '',
          description: product.description || ''
        });
        setFormLoading(false);
      } else {
        // Attendre un peu plus longtemps avant d'afficher l'erreur
        const timer = setTimeout(() => {
          showNotification('warning', 'Chargement...', 
            'Le produit est en cours de chargement');
        }, 500);
        
        const errorTimer = setTimeout(() => {
          showNotification('error', 'Produit introuvable', 
            'Le produit n\'existe pas ou a été supprimé.');
          setTimeout(() => navigate('/admin'), 3000);
        }, 3000);
        
        return () => {
          clearTimeout(timer);
          clearTimeout(errorTimer);
        };
      }
    } else {
      setFormLoading(false);
    }
  }, [id, isEditing, products, navigate]);

  const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    const id = Date.now();
    const newNotification = { id, type, title, message };
    setNotification(newNotification);
    
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      showNotification('error', 'Erreur', 'Le nom du produit est requis');
      return false;
    }
    if (!formData.category.trim()) {
      showNotification('error', 'Erreur', 'La catégorie est requise');
      return false;
    }
    if (!formData.price.trim() || parseFloat(formData.price) <= 0) {
      showNotification('error', 'Erreur', 'Le prix doit être supérieur à 0');
      return false;
    }
    if (!formData.stock.trim() || parseInt(formData.stock) < 0) {
      showNotification('error', 'Erreur', 'Le stock ne peut pas être négatif');
      return false;
    }
    if (!formData.thumbnail.trim()) {
      showNotification('error', 'Erreur', 'L\'URL de l\'image est requise');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const productData: Omit<Product, 'id'> = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        thumbnail: formData.thumbnail.trim(),
        brand: formData.brand.trim() || undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
        description: formData.description.trim() || undefined
      };
      
      if (isEditing && id) {
        // Mode édition - créer l'objet complet
        const updatedProduct: Product = {
          ...productData,
          id: parseInt(id)
        };
        
        editProduct(updatedProduct);
        showNotification('success', 'Succès !', 'Produit modifié avec succès');
        
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // Mode ajout
        addProduct(productData);
        showNotification('success', 'Succès !', 'Produit ajouté avec succès');
        
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 max-w-md">
          <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getNotificationStyle(notification.type)} animate-slide-in`}>
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm mt-1">{notification.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-blue-200 text-sm">Gestion des produits</p>
        </div>
        
        <nav className="space-y-2 mb-8">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Tableau de bord</span>
          </Link>
          
          <Link
            to="/admin/products/add"
            className="flex items-center gap-3 p-3 bg-blue-700 rounded-lg"
          >
            <span className="font-medium">Ajouter un produit</span>
          </Link>
          
          <Link
            to="/home"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Retour au site</span>
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{user?.username || 'Admin'}</p>
              <p className="text-sm text-blue-200">Administrateur</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 text-red-200 hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <Link to="/admin" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-5 w-5" />
              Retour au tableau de bord
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Modifier un produit' : 'Ajouter un nouveau produit'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifiez les informations du produit' : 'Remplissez le formulaire pour ajouter un nouveau produit'}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl">
          {formLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Chargement du produit...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du produit */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="iPhone 15 Pro Max"
                    required
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="999.99"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="50"
                    min="0"
                    required
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="fragrances">Fragrances</option>
                    <option value="skincare">Skincare</option>
                    <option value="groceries">Groceries</option>
                    <option value="home-decoration">Home Decoration</option>
                    <option value="furniture">Furniture</option>
                    <option value="tops">Tops</option>
                    <option value="womens-dresses">Women's Dresses</option>
                    <option value="womens-shoes">Women's Shoes</option>
                    <option value="mens-shirts">Men's Shirts</option>
                    <option value="mens-shoes">Men's Shoes</option>
                    <option value="mens-watches">Men's Watches</option>
                    <option value="womens-watches">Women's Watches</option>
                    <option value="womens-bags">Women's Bags</option>
                    <option value="womens-jewellery">Women's Jewellery</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="automotive">Automotive</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="lighting">Lighting</option>
                  </select>
                </div>

                {/* Marque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Apple"
                  />
                </div>

                {/* URL Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.thumbnail}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                {/* Remise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remise (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="10"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                    placeholder="Description du produit..."
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/admin"
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Styles d'animation */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}