import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) {
    return <Navigate to="/Admin_08080" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/Admin_08080" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;