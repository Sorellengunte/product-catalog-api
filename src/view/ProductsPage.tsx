import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductCard from '../components/productCard';
import {
  fetchAllProducts,
  fetchAllCategories,
  fetchProductsByCategory,
  searchProducts,
} from '../api/ProductApi';

// Type produit
interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand?: string;
  category: string;
  thumbnail: string;
  stock: number;
}

// Interface réponse API
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Chargement initial
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtrage local à chaque changement
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoriesData = await fetchAllCategories();
      setCategories(categoriesData.map((c) => c.toString()));

      const response = await fetchAllProducts(1, 20);
      setProducts(response.products);
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Impossible de charger les produits. Veuillez réessayer.');
      setCategories(['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries']);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await loadProductsByCategory(selectedCategory);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchResponse = await searchProducts(searchQuery, 1, 20);
      setProducts(searchResponse.products);
    } catch (err) {
      console.error('Erreur recherche API:', err);
      setError('Erreur lors de la recherche. Filtrage local activé.');
      filterProducts();
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      if (category === 'all') {
        const response = await fetchAllProducts(1, 20);
        setProducts(response.products);
      } else {
        const response = await fetchProductsByCategory(category, 1, 20);
        setProducts(response.products);
      }
    } catch (err) {
      console.error('Erreur chargement catégorie:', err);
      setError('Erreur de chargement. Filtrage local activé.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    loadInitialData();
  };

  const allCategories = ['all', ...categories];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-6">
        {/* Recherche et filtre */}
        <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="w-full md:w-48 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                loadProductsByCategory(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-white"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes catégories' : category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Erreur API */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Liste des produits avec ProductCard */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Voir tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={{
                id: product.id,
                title: product.title,
                price: product.price,
                discountPercentage: product.discountPercentage || 0,
                rating: product.rating,
                brand: product.brand || 'Marque inconnue',
                category: product.category,
                thumbnail: product.thumbnail,
                stock: product.stock,
              }} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
