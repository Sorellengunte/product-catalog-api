import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import ClientAuth from './auth/clientAuth';
import Home from './view/home';
import ProductsPage from './view/ProductsPage';
import ProductDetailPage from './view/DetailProductPage';
import Panier from './view/panier';
import ProfilePage from './view/client/Profile';

import { CartProvider } from './api/CartContext';
import { AuthProvider } from './auth/AuthContext';
import ClientRoute from './auth/ClientRoute';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './view/admin/AdminDashboard';
import ProductFormPage from './components/admin/ProductFormPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/panier" element={<Panier/>} />
            <Route path="/clientauth" element={<ClientAuth />} />

            {/* Protected Client Routes */}
            <Route path="/profil" element={
              <ClientRoute>
                <ProfilePage />
              </ClientRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products/add" element={
              <AdminRoute>
                <ProductFormPage />
              </AdminRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <ProductFormPage />
              </AdminRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;