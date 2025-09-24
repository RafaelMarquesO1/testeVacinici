import React from "react";
import { useAuth } from './contexts/AuthContext';
// Componente para redirecionar admin/enfermeiro corretamente
function AdminRedirect() {
  const { currentUser } = useAuth();
  if (currentUser?.tipoUsuario === 'Funcionario' && currentUser?.cargo?.toLowerCase().includes('enfermeir')) {
    return <Navigate to="agendamentos" replace />;
  } else if (currentUser?.tipoUsuario === 'Funcionario' && currentUser?.cargo?.toLowerCase().includes('admin')) {
    return <Navigate to="usuarios" replace />;
  } else {
    return <Navigate to="/entrar" replace />;
  }
}
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Seus componentes e páginas
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Politica from "./components/Politica/Politica";
import Login from "./components/Login/Login"; 
import DashboardLayout from "./components/layout/DashboardLayout"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import DashboardPage from "./pages/DashboardPage"; 
import UsersPage from "./pages/UsersPage";
import AgendamentosPage from "./pages/AgendamentosPage";
import AdminOverviewPage from "./pages/AdminOverviewPage";

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
          {/* Apenas admin pode acessar controle geral e usuários */}
          <Route path="controle" element={<ProtectedRoute><AdminOverviewPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          {/* Apenas enfermeiro pode acessar agendamentos */}
          <Route path="agendamentos" element={<ProtectedRoute><AgendamentosPage /></ProtectedRoute>} />
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
