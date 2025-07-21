import React from "react";
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
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
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
