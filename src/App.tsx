import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './view/home';
import ProductsPage from './view/productsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;