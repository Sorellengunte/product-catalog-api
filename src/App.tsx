import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import ClientAuth from './auth/clientAuth';
import Home from './view/home';
import ProductsPage from './view/ProductsPage';
import ProductDetailPage from './view/DetailProductPage';
import { CartProvider } from './api/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientAuth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
