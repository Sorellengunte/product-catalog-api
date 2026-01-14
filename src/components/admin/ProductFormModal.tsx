import { XMarkIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
}

interface ProductFormModalProps {
  isOpen: boolean;
  editingId: number | null;
  formData: Product;
  categories: string[];
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (field: keyof Product, value: string | number) => void;
}

export default function ProductFormModal({
  isOpen,
  editingId,
  formData,
  categories,
  onClose,
  onSubmit,
  onFormChange,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  // Fonction pour formater le nom d'affichage des catégories
  const formatCategoryName = (category: string): string => {
    if (!category || category.trim() === '') return '';
    
    // S'assurer que c'est une string
    const categoryStr = typeof category === 'string' ? category : String(category);
    
    // Vérifier que categoryStr est bien une string non vide
    if (categoryStr.trim() === '') return '';
    
    // Mettre en majuscule la première lettre seulement
    return categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
  };

  const fields = [
    { key: 'title' as const, label: 'Nom du produit', placeholder: 'iPhone 15 Pro Max', type: 'text' },
    { key: 'price' as const, label: 'Prix ($)', placeholder: '999.99', type: 'number' },
    { key: 'stock' as const, label: 'Stock', placeholder: '50', type: 'number' },
    { key: 'thumbnail' as const, label: 'URL de l\'image', placeholder: 'https://example.com/image.jpg', type: 'text' },
    { key: 'brand' as const, label: 'Marque', placeholder: 'Apple', type: 'text' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingId ? 'Modifier produit' : 'Ajouter un produit'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder={placeholder}
                  type={type}
                  value={formData[key] !== undefined ? formData[key] : ''}
                  onChange={(e) => onFormChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                value={formData.category || ''}
                onChange={(e) => onFormChange('category', e.target.value)}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories
                  .filter((c) => c && c !== 'all' && c.trim() !== '')
                  .map((c) => {
                    // S'assurer que c est une string
                    const categoryValue = typeof c === 'string' ? c : String(c);
                    return (
                      <option key={categoryValue} value={categoryValue}>
                        {formatCategoryName(categoryValue)}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (0-5)</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="4.5"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating !== undefined ? formData.rating : ''}
                  onChange={(e) => onFormChange('rating', Number(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="10"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage !== undefined ? formData.discountPercentage : ''}
                  onChange={(e) => onFormChange('discountPercentage', Number(e.target.value))}
                />
              </div>
            </div>

            <button
              onClick={onSubmit}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all mt-4"
            >
              {editingId ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}