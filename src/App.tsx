import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './view/home';
import ProductsPage from './view/ProductsPage';
import ProductDetailPage from './view/DetailProductPage';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
         <Route path="/product/:id" element={<ProductDetailPage />} />
        
       
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;