import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../styles/Dashboard.css';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  // Função que adiciona a animação e depois executa o logout real
  const triggerLogout = () => {
    document.body.classList.add('logging-out'); // Adiciona classe para a animação CSS
    
    // Espera a animação terminar antes de deslogar e redirecionar
    setTimeout(() => {
      logout();
      navigate('/entrar');
      document.body.classList.remove('logging-out'); // Limpa a classe
    }, 500); // 500ms, mesma duração da animação no CSS
  };

  return (
    <div className="app-layout">
      {/* Passa a função triggerLogout para a Sidebar */}
      <Sidebar handleLogout={triggerLogout} /> 
      <div className="main-content-wrapper">
        <Header user={currentUser} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
