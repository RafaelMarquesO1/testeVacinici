import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Seus componentes e páginas
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Politica from "./components/Politica/Politica";
import Login from "./components/Login/Login"; 
import DashboardLayout from "./components/layout/DashboardLayout"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import DashboardPage from "./pages/DashboardPage"; 
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UsersPage from "./pages/UsersPage";
import AgendamentosPage from "./pages/AgendamentosPage";
import AdminOverviewPage from "./pages/AdminOverviewPage";
import CarteirinhaPage from "./pages/CarteirinhaPage";
import MobileAgendamentosPage from "./pages/MobileAgendamentosPage";

// Componente para redirecionar admin/enfermeiro corretamente
function AdminRedirect() {
  const { currentUser } = useAuth();
  if (currentUser?.tipoUsuario === 'Administrador') {
    return <Navigate to="admin-dashboard" replace />;
  } else if (currentUser?.tipoUsuario === 'Funcionario' && currentUser?.cargo?.toLowerCase().includes('enfermeir')) {
    return <Navigate to="agendamentos" replace />;
  } else if (currentUser?.tipoUsuario === 'Funcionario' && currentUser?.cargo?.toLowerCase().includes('admin')) {
    return <Navigate to="usuarios" replace />;
  } else {
    return <Navigate to="/entrar" replace />;
  }
}

const PublicLayout = ({ children }) => (
  <div>
    <Navbar />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        
        {/* Rotas Públicas */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/politica" element={<PublicLayout><Politica /></PublicLayout>} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/mobile" element={<MobileAgendamentosPage />} />

        {/* Rotas da Área Administrativa */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardLayout /> 
            </ProtectedRoute>
          }
        >
          {/* Redirecionamento inteligente para admin ou enfermeiro */}
          <Route index element={<AdminRedirect />} />
          {/* Dashboard exclusivo para administradores */}
          <Route path="admin-dashboard" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
          {/* Dashboard para funcionários */}
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          {/* Apenas admin pode acessar usuários */}
          <Route path="usuarios" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          {/* Apenas enfermeiro pode acessar agendamentos */}
          <Route path="agendamentos" element={<ProtectedRoute><AgendamentosPage /></ProtectedRoute>} />
          {/* Carteirinha acessível para funcionários */}
          <Route path="carteirinha" element={<ProtectedRoute><CarteirinhaPage /></ProtectedRoute>} />
        </Route>
        
        {/* Redirecionamentos e 404 */}
        <Route path='/Enter' element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={ <PublicLayout> <div>Página Não Encontrada</div> </PublicLayout> } />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
