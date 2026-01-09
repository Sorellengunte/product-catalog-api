import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductCard from '../components/productCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../hook/useproducts';
import { useCart } from '../api/CartContext';

const ProductsPage: React.FC = () => {
  const {
    products, categories, loading, error,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    currentPage, setCurrentPage, totalPages
  } = useProducts();
  const { addToCart } = useCart();

  if (loading) return (<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></main><Footer /></div>);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
          <select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)} className="w-full md:w-48 pl-3 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="all">Toutes</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</option>)}
          </select>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

        {products.length===0 ? <div className="bg-white rounded-lg p-8 text-center"><h3>Aucun produit trouvé</h3></div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>}

        {totalPages>1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={()=>setCurrentPage(Math.max(1,currentPage-1))} disabled={currentPage===1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"><ChevronLeft /></button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={()=>setCurrentPage(Math.min(totalPages,currentPage+1))} disabled={currentPage===totalPages} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"><ChevronRight /></button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
