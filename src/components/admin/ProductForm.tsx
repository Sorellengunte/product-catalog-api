// src/pages/admin/ProductFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon, PlusIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useProducts } from '../../hook/useproducts';
import { useCategories } from '../../hook/usecategories';

interface ProductFormData {
  title: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  discountPercentage: number;
}

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { allProducts, addProduct, editProduct } = useProducts();
  const { categories } = useCategories();

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    images: [],
    rating: 0,
    discountPercentage: 0,
  });

  const [submitted, setSubmitted] = useState(false);

  // Charger le produit si on édite
  useEffect(() => {
    if (isEditing && id && allProducts.length > 0) {
      const productId = parseInt(id);
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        setFormData({
          title: product.title || '',
          price: product.price || 0,
          stock: product.stock || 0,
          brand: product.brand || '',
          category: product.category || '',
          thumbnail: product.thumbnail || '',
          images: product.images || [],
          rating: product.rating || 0,
          discountPercentage: product.discountPercentage || 0,
        });
      } else {
        setTimeout(() => navigate('/admin'), 2000);
      }
    }
  }, [id, isEditing, allProducts, navigate]);

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    const url = window.prompt("Entrez l'URL de l'image :");
    if (url?.trim()) setFormData(prev => ({ ...prev, images: [...prev.images, url.trim()] }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const calculateFinalPrice = () => formData.price - (formData.price * formData.discountPercentage) / 100;

  const handleCancel = () => {
    if (window.confirm('Voulez-vous vraiment annuler ?')) navigate('/admin');
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && id) await editProduct({ id: parseInt(id), ...formData });
      else await addProduct(formData);
      setSubmitted(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      console.error('Erreur :', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <button onClick={handleCancel} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeftIcon className="h-5 w-5" /> Retour
        </button>

        <h1 className="text-2xl font-bold">{isEditing ? 'Modifier produit' : 'Ajouter un produit'}</h1>

        {submitted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <p className="text-green-800 font-medium">
              {isEditing ? 'Produit modifié avec succès !' : 'Produit créé avec succès !'} Redirection...
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="iPhone 15 Pro Max"
            />
          </div>

          {/* Prix et remise */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => handleChange('price', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label>
              <input
                type="number"
                value={formData.discountPercentage}
                onChange={e => handleChange('discountPercentage', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {formData.discountPercentage > 0 && (
                <div className="mt-2 p-2 bg-blue-50 rounded">
                  <span className="font-medium">Prix final : </span>${calculateFinalPrice().toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={e => handleChange('stock', parseInt(e.target.value))}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <input
              type="text"
              value={formData.brand}
              onChange={e => handleChange('brand', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.filter(c => c && c !== 'all').map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image principale (thumbnail)</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={e => handleChange('thumbnail', e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {formData.thumbnail && <img src={formData.thumbnail} alt="Aperçu" className="h-40 w-40 object-cover mt-2 rounded border border-gray-200" />}
          </div>

          {/* Images supplémentaires */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Images supplémentaires</label>
              <button type="button" onClick={handleAddImage} className="text-blue-600 flex items-center gap-1">
                <PlusIcon className="h-4 w-4" /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt={`img-${i}`} className="h-32 w-full object-cover rounded border border-gray-200" />
                  <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <StarIcon className="h-4 w-4 text-yellow-500" /> Note (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={formData.rating}
              onChange={e => handleChange('rating', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={handleCancel} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
            <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all">
              {isEditing ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
