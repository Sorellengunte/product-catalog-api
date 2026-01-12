import { useState } from 'react';
import {
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/AuthContext';
import { useProducts } from '../../hook/useproducts';

/* 🔹 Product local */
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const {
    products,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    editProduct,
    deleteProduct,
  } = useProducts();

  /* 🔹 MODAL */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Product>({
    id: 0,
    title: '',
    price: 0,
    stock: 0,
    category: '',
    thumbnail: '',
    brand: '',
    rating: 0,
    discountPercentage: 0,
  });

  const openAddModal = () => {
    setFormData({
      id: 0,
      title: '',
      price: 0,
      stock: 0,
      category: '',
      thumbnail: '',
      brand: '',
      rating: 0,
      discountPercentage: 0,
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.thumbnail) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingId !== null) {
      editProduct(formData);
    } else {
      const { id, ...data } = formData;
      addProduct(data);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      '⚠️ Êtes-vous sûr de vouloir supprimer ce produit ?'
    );
    if (confirmDelete) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Admin Dashboard</h2>
        <div className="flex items-center gap-2 mb-6">
          <ChartBarIcon className="h-6 w-6" /> Produits
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-300"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          Déconnexion
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        <header className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Bienvenue {user?.username || 'Admin'}
          </h1>
          <UserCircleIcon className="h-10 w-10 text-blue-600" />
        </header>

        {/* ACTIONS */}
        <div className="flex gap-2 mb-4">
          <input
            className="border px-3 py-2 rounded flex-1"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="bg-green-500 text-white px-4 rounded"
          >
            + Ajouter
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t text-center">
                  <td>
                    <img src={p.thumbnail} className="h-12 mx-auto" />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.stock}</td>
                  <td>{p.category}</td>
                  <td>{p.price} €</td>
                  <td className="flex justify-center gap-2 py-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 relative">
            <XMarkIcon
              className="h-6 w-6 absolute top-3 right-3 cursor-pointer"
              onClick={() => setModalOpen(false)}
            />

            {['title', 'price', 'stock', 'thumbnail'].map((field) => (
              <input
                key={field}
                className="border p-2 w-full mb-2"
                placeholder={field}
                type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field]:
                      field === 'price' || field === 'stock'
                        ? +e.target.value
                        : e.target.value,
                  })
                }
              />
            ))}

            <select
              className="border p-2 w-full mb-4"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Choisir catégorie</option>
              {categories
                .filter((c) => c !== 'all')
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {editingId ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
