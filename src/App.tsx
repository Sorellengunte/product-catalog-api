import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import ClientAuth from './auth/clientAuth';
import Home from './view/home';
import './App.css';
import ProductsPage from './view/ProductsPage';
import ProductDetailPage from './view/DetailProductPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientAuth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
