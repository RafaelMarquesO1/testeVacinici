import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/entrar" replace />;
  }

  // Apenas administradores podem acessar
  if (currentUser.tipoUsuario !== 'Administrador') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;