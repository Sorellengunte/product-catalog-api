import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

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

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* LOGIN */}
            <Route path="/" element={<ClientAuth />} />

            {/* CLIENT */}
            <Route
              path="/home"
              element={
                <ClientRoute>
                  <Home />
                </ClientRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ClientRoute>
                  <ProductsPage />
                </ClientRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ClientRoute>
                  <ProductDetailPage />
                </ClientRoute>
              }
            />
            <Route
              path="/panier"
              element={
                <ClientRoute>
                  <Panier />
                </ClientRoute>
              }
            />
            {/* ROUTE PROFIL */}
            <Route
              path="/profil"
              element={
                <ClientRoute>
                  <ProfilePage />
                </ClientRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
