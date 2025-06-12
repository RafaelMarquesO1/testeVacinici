import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redireciona para a página de login se o usuário não estiver autenticado.
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;