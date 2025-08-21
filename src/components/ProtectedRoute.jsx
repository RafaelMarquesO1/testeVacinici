import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading, currentUser } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - loading:', loading);
  console.log('ProtectedRoute - currentUser:', currentUser);
  
  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando...');
    // Redireciona para a página de login se o usuário não estiver autenticado.
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }
  
  // Verifica se o usuário é funcionário
  if (currentUser.tipoUsuario !== 'Funcionario') {
    console.log('Usuário não é funcionário, redirecionando...');
    // Redireciona para a página de login se o usuário não for funcionário
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  console.log('Acesso autorizado, renderizando children');
  return children;
};

export default ProtectedRoute;