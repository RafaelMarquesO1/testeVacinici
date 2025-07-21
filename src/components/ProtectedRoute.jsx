import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading, currentUser } = useAuth();
  
  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    // Redireciona para a página de login se o usuário não estiver autenticado.
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }
  
  // Verifica se o usuário é administrador
  if (currentUser.cargo !== 'Administrador') {
    // Redireciona para a página de login se o usuário não for administrador
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;