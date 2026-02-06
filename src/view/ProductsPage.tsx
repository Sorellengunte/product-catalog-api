
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/navBar";
import Footer from "../components/footer";
import ProductCard from "../components/productCard";
import { Search, Filter, Loader2 } from "lucide-react";
import { useProductsPage } from "../hook/useProductsPage";
import { useCart } from "../context/CartContext";
import { Pagination } from "../components/pagination";
import type { Product } from "../hook/useProductsPage";

const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    loading,
    isFetching,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,


  } = useProductsPage();

  const { addToCart } = useCart();
  const [localSearch, setLocalSearch] = useState(searchQuery);


  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(localSearch), 300);
    return () => clearTimeout(t);
  }, [localSearch, setSearchQuery]);

  const mappedProducts = useMemo(() =>
    products.map((p: Product) => ({
      id: p.id,
      title: p.title ?? "Sans titre",
      price: p.price ?? 0,
      thumbnail: p.thumbnail || "https://via.placeholder.com/300",
      stock: p.stock ?? 0,
      rating: p.rating ?? 0,
      discountPercentage: p.discountPercentage ?? 0,
      brand: p.brand ?? "Inconnue",
      category: p.category ?? "Non catégorisé",
    })),
    [products]
  );

  /* ==================== LOADING ==================== */
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-lg">Chargement des produits…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />


      <main className="flex-1 max-w-10xl mx-auto px-4 py-6 w-full">

        <section className="w-full overflow-hidden mb-8">
          <div >
            <div className="relative h-[300px] md:h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Produits de qualité"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/85 via-blue-700/75 to-blue-500/80" />

              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    Nos Produits
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-full mb-6"></div>
                <p className="text-xl md:text-2xl text-center text-blue-50 font-light tracking-wide">
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    Excellence & Raffinement
                  </span>
                </p>


              </div>
            </div>
          </div>
        </section>


        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            )}
          </div>

          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              disabled={isFetching}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

      
        {isFetching && products.length > 0 && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-700">chargement des produits…</p>
            </div>
          </div>
        )}

      
        {products.length === 0 && !isFetching ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-gray-400 text-sm">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mappedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={() => addToCart(product as Product, 1)}
                  isLoading={isFetching}
                />
              ))}
            </div>
          </>
        )}

        {/* ==================== PAGINATION ==================== */}
        {products.length > 0 && (
          <div className="mt-10">
            <Pagination
              showPageInfo
              showNavigation
              maxVisiblePages={5}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;