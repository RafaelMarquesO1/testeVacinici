import React, { useState } from "react"; // Importe useState
import { BrowserRouter, Route, Routes, Navigate, NavLink, useNavigate } from 'react-router-dom';

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

const PublicLayout = ({ children }) => (
  <div>
    <Navbar />
    {children}
    <Footer />
  </div>
);

function App() {
  // Lógica de Autenticação com Estado
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Começa como logado para teste

  // Função de Login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Função de Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Em um app real, você também limparia tokens, etc.
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rotas Públicas */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/politica" element={<PublicLayout><Politica /></PublicLayout>} />
        <Route path="/entrar" element={<Login onLogin={handleLogin} />} />

        {/* Rotas da Área Administrativa */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout handleLogout={handleLogout} /> 
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
        </Route>
        
        {/* Redirecionamentos e 404 */}
        <Route path='/Enter' element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={ <PublicLayout> <div>Página Não Encontrada</div> </PublicLayout> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
