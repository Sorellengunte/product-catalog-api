import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './view/home';
import ProductsPage from './view/ProductsPage';
import ProductCreate from './view/productCreate';
import ProductEdit from './view/productEdit';
import ProductDetail from './view/productDetail';
import AddProduct from './view/addproduct';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
           <Route path="/add-product" element={<AddProduct />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;