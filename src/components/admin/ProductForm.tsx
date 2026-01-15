import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useProducts } from '../../hook/useproducts';
import { useCategories } from '../../hook/usecategories';

// Schéma de validation Zod
const productSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').optional(),
  price: z.number().positive('Le prix doit être supérieur à 0'),
  discountPercentage: z.number().min(0, 'La remise ne peut pas être négative').max(100, 'La remise ne peut pas dépasser 100%').default(0),
  rating: z.number().min(0, 'La note doit être au moins 0').max(5, 'La note ne peut pas dépasser 5').default(0),
  stock: z.number().min(0, 'Le stock ne peut pas être négatif').default(0),
  brand: z.string().max(100, 'La marque ne peut pas dépasser 100 caractères').optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  thumbnail: z.string().url('URL invalide').min(1, "L'URL de l'image est requise"),
  images: z.array(z.string().url('URL invalide')).default([]),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { 
    allProducts,
    addProduct, 
    editProduct, 
    loading: productsLoading,
  } = useProducts();
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: '',
      category: '',
      thumbnail: '',
      images: [],
    },
  });

  const watchedValues = watch();
  const images = watch('images');
  const price = watch('price');
  const discountPercentage = watch('discountPercentage');

  // Charger le produit à éditer
  useEffect(() => {
    if (isEditing && id && allProducts.length > 0) {
      const productId = parseInt(id);
      const productToEdit = allProducts.find(p => p.id === productId);
      
      if (productToEdit) {
        reset({
          title: productToEdit.title || '',
          description: productToEdit.description || '',
          price: productToEdit.price || 0,
          discountPercentage: productToEdit.discountPercentage || 0,
          rating: productToEdit.rating || 0,
          stock: productToEdit.stock || 0,
          brand: productToEdit.brand || '',
          category: productToEdit.category || '',
          thumbnail: productToEdit.thumbnail || '',
          images: productToEdit.images || [],
        });
      } else {
        console.error('Produit non trouvé');
        setTimeout(() => navigate('/admin'), 2000);
      }
    }
  }, [id, isEditing, allProducts, reset, navigate]);

  // Calculer le prix final
  const calculateFinalPrice = () => {
    const discount = (price * discountPercentage) / 100;
    return price - discount;
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && id) {
        const productToUpdate = {
          id: parseInt(id),
          ...data,
        };
        await editProduct(productToUpdate);
      } else {
        await addProduct(data);
      }
      
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleAddImage = () => {
    const newImageUrl = window.prompt('Entrez l\'URL de l\'image:');
    if (newImageUrl?.trim()) {
      const currentImages = images || [];
      setValue('images', [...currentImages, newImageUrl.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages);
  };

  const handleCancel = () => {
    if (window.confirm('Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.')) {
      navigate('/admin');
    }
  };

  const isLoading = productsLoading || categoriesLoading || (isEditing && !watchedValues.title && allProducts.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Retour au tableau de bord
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Mettez à jour les informations du produit' 
                  : 'Ajoutez un nouveau produit à votre catalogue'
                }
              </p>
            </div>
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${watchedValues.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {watchedValues.stock > 0 ? `${watchedValues.stock} en stock` : 'Rupture'}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ${watchedValues.price.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {isSubmitSuccessful && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {isEditing ? 'Produit modifié avec succès !' : 'Produit créé avec succès !'}
              </p>
              <p className="text-sm text-green-600">
                Redirection vers le tableau de bord...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-blue-600" />
                  Informations de base
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du produit *
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors`}
                      placeholder="Ex: iPhone 14 Pro Max"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                      placeholder="Décrivez votre produit..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      {...register('brand')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                      placeholder="Ex: Apple, Samsung, etc."
                    />
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PhotoIcon className="h-5 w-5 text-blue-600" />
                  Images du produit
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image principale (thumbnail) *
                    </label>
                    <input
                      type="url"
                      {...register('thumbnail')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.thumbnail ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.thumbnail && (
                      <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>
                    )}
                    
                    {watchedValues.thumbnail && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">Aperçu:</div>
                        <img
                          src={watchedValues.thumbnail}
                          alt="Aperçu"
                          className="h-40 w-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Image+Non+Disponible';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Images supplémentaires
                      </label>
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Ajouter une image
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {images?.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Produit ${index + 1}`}
                            className="h-32 w-full object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Image+Non+Disponible';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <input type="hidden" {...register('images')} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                  Prix & Stock
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix ($) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors`}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remise (%)
                    </label>
                    <input
                      type="number"
                      {...register('discountPercentage', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.discountPercentage ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors`}
                    />
                    {errors.discountPercentage && (
                      <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>
                    )}
                    
                    {discountPercentage > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600">Prix final:</div>
                        <div className="text-xl font-bold text-blue-700">
                          ${calculateFinalPrice().toFixed(2)}
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            (Économie: {discountPercentage}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock disponible *
                    </label>
                    <input
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.stock ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ArchiveBoxIcon className="h-5 w-5 text-blue-600" />
                  Catégorie & Évaluation
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      {...register('category')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-300' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors bg-white`}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories
                        .filter(cat => cat !== 'all')
                        .map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      Note (0-5)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        {...register('rating', { valueAsNumber: true })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg font-bold text-gray-700 min-w-[60px]">
                        {watchedValues.rating.toFixed(1)}
                      </span>
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                    )}
                    
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(watchedValues.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : star <= watchedValues.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sauvegarde...
                </>
              ) : isEditing ? (
                'Mettre à jour'
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Créer le produit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}