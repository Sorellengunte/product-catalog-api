import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import ClientAuth from './auth/clientAuth';
import Home from './view/home';
import ProductsPage from './view/ProductsPage';
import ProductDetailPage from './view/DetailProductPage';
import Panier from './view/panier';
import ProfilePage from './view/client/Profile';
import AdminDashboard from './view/admin/AdminDashboard';
import ProductFormPage from './components/admin/ProductForm';

import { CartProvider } from './api/CartContext';
import { AuthProvider } from './auth/AuthContext';
import ClientRoute from './auth/ClientRoute';
import AdminRoute from './auth/AdminRoute';
<<<<<<< HEAD
=======
;
import AdminDashboard from './view/admin/AdminDashboard';
>>>>>>> ffb347138f66b59f211acb6a9153d71e1b2d9c38

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/panier" element={<Panier />} />
            
            {/* LOGIN - accessible seulement si non connecté */}
            <Route path="/clientauth" element={<ClientAuth />} />

            {/* ROUTES PROTÉGÉES CLIENT */}
            <Route path="/profil" element={
              <ClientRoute>
                <ProfilePage />
              </ClientRoute>
            } />

            {/* ROUTES ADMIN */}
            {/* Tableau de bord admin */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Route spécifique pour la liste des produits admin (redirige vers /admin) */}
            <Route path="/admin/products" element={
              <AdminRoute>
                <Navigate to="/admin" replace />
              </AdminRoute>
            } />
            
            {/* Formulaire pour créer un nouveau produit */}
            <Route path="/admin/products/new" element={
              <AdminRoute>
                <ProductFormPage />
              </AdminRoute>
            } />
            
            {/* Formulaire pour modifier un produit existant */}
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <ProductFormPage />
              </AdminRoute>
            } />

            {/* REDIRECTION POUR LES ROUTES INCONNUES */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;