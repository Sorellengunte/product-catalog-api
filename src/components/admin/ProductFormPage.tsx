import  { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,

  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProducts } from '../../hook/useproducts';
import { findProductInStorage } from '../../utils/productStorage';

import { productSchema } from '../../components/admin/schema';
import Sidebar from '../../components/Sidebar';

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

// Déclaration locale de ProductFormData en utilisant le schéma importé
type ProductFormData = z.infer<typeof productSchema>;

// Déclaration locale des valeurs par défaut
const defaultFormValues: ProductFormData = {
  title: '',
  price: '',
  stock: '',
  category: '',
  thumbnail: '',
  brand: '',
  rating: '',
  discountPercentage: '',
  description: '',
};

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { products, addProduct, editProduct } = useProducts();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(isEditing);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  // Initialisation de React Hook Form avec Zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: defaultFormValues
  });

  // Chargement du produit
  useEffect(() => {
    if (isEditing && id) {
      const productId = parseInt(id);
      let product = findProductInStorage(productId);
      
      if (!product) {
        product = products.find(p => p.id === productId);
      }
      
      if (product) {
        // Reset du formulaire avec les données du produit
        const formData: ProductFormData = {
          title: product.title || '',
          price: product.price?.toString() || '0',
          stock: product.stock?.toString() || '0',
          category: product.category || '',
          thumbnail: product.thumbnail || '',
          brand: product.brand || '',
          rating: product.rating?.toString() || '',
          discountPercentage: product.discountPercentage?.toString() || '',
          description: product.description || '',
        };
        
        reset(formData);
        setFormLoading(false);
      } else {
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
  }, [id, isEditing, products, reset, navigate]);

  const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    
    try {
      const productData: Omit<Product, 'id'> = {
        title: data.title.trim(),
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        category: data.category,
        thumbnail: data.thumbnail.trim(),
        brand: data.brand?.trim() || undefined,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage) : undefined,
        description: data.description?.trim() || undefined
      };
      
      if (isEditing && id) {
        const updatedProduct: Product = {
          ...productData,
          id: parseInt(id)
        };
        
        editProduct(updatedProduct);
        showNotification('success', 'Succès !', 'Produit modifié avec succès');
        
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        addProduct(productData);
        showNotification('success', 'Succès !', 'Produit ajouté avec succès');
        
        setTimeout(() => navigate('/admin'), 1500);
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

  // Composant pour afficher les erreurs
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    
    return (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{message}</span>
      </p>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 lg:top-6 lg:right-6 z-50 max-w-sm">
          <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getNotificationStyle(notification.type)} animate-slide-in`}>
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{notification.title}</div>
              <div className="text-sm mt-1 truncate">{notification.message}</div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header mobile */}
        <div className="lg:hidden bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <h1 className="text-lg font-semibold">
              {isEditing ? 'Modifier produit' : 'Nouveau produit'}
            </h1>
            
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 lg:p-6 overflow-auto">
          {/* Header desktop */}
          <div className="mb-6 lg:mb-8">
            <div className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
              <Link to="/admin" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-5 w-5" />
                Retour au tableau de bord
              </Link>
            </div>
            
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {isEditing ? 'Modifier un produit' : 'Ajouter un nouveau produit'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                {isEditing ? 'Modifiez les informations du produit' : 'Remplissez le formulaire pour ajouter un nouveau produit'}
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="max-w-4xl mx-auto">
            {formLoading ? (
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
                <div className="inline-block w-10 h-10 lg:w-12 lg:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 text-sm lg:text-base">Chargement du produit...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* Nom du produit */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du produit *
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.title 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="iPhone 15 Pro Max"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.title?.message} />
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix ($) *
                    </label>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.price 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="999.99"
                          min="0"
                          step="0.01"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.price?.message} />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock *
                    </label>
                    <Controller
                      name="stock"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.stock 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="50"
                          min="0"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.stock?.message} />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none bg-white text-sm lg:text-base ${
                            errors.category 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="smartphones">Smartphones</option>
                          <option value="laptops">Laptops</option>
                          <option value="fragrances">Parfums</option>
                          <option value="skincare">Soins de la peau</option>
                          <option value="groceries">Épicerie</option>
                          <option value="home-decoration">Décoration maison</option>
                          <option value="furniture">Meubles</option>
                          <option value="tops">Hauts</option>
                          <option value="womens-dresses">Robes femmes</option>
                          <option value="womens-shoes">Chaussures femmes</option>
                          <option value="mens-shirts">Chemises hommes</option>
                          <option value="mens-shoes">Chaussures hommes</option>
                          <option value="mens-watches">Montres hommes</option>
                          <option value="womens-watches">Montres femmes</option>
                          <option value="womens-bags">Sacs femmes</option>
                          <option value="womens-jewellery">Bijoux femmes</option>
                          <option value="sunglasses">Lunettes de soleil</option>
                          <option value="automotive">Automobile</option>
                          <option value="motorcycle">Moto</option>
                          <option value="lighting">Éclairage</option>
                        </select>
                      )}
                    />
                    <ErrorMessage message={errors.category?.message} />
                  </div>

                  {/* Marque */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.brand 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="Apple"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.brand?.message} />
                  </div>

                  {/* URL Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de l'image *
                    </label>
                    <Controller
                      name="thumbnail"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="url"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                              errors.thumbnail 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                            placeholder="https://example.com/image.jpg"
                          />
                          {field.value && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                              <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={field.value}
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
                      )}
                    />
                    <ErrorMessage message={errors.thumbnail?.message} />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note (0-5)
                    </label>
                    <Controller
                      name="rating"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.rating 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="4.5"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.rating?.message} />
                  </div>

                  {/* Remise */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remise (%)
                    </label>
                    <Controller
                      name="discountPercentage"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none text-sm lg:text-base ${
                            errors.discountPercentage 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="10"
                          min="0"
                          max="100"
                        />
                      )}
                    />
                    <ErrorMessage message={errors.discountPercentage?.message} />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none resize-none text-sm lg:text-base ${
                            errors.description 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                          placeholder="Description du produit..."
                        />
                      )}
                    />
                    <ErrorMessage message={errors.description?.message} />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/admin"
                    className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center text-sm lg:text-base"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                  >
                    {loading || isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enregistrement...
                      </span>
                    ) : isEditing ? 'Mettre à jour' : 'Créer le produit'}
                  </button>
                </div>
              </form>
            )}
          </div>
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