import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar se há um usuário logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('vacinici_user');
    const storedToken = localStorage.getItem('vacinici_token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('AuthContext: Chamando api.login com:', email);
      const response = await api.login(email, password);
      
      console.log('AuthContext: Resposta da API:', response);
      
      // A resposta da API Spring Boot tem token, id, email, nomeCompleto, tipoUsuario, cargo
      const userData = {
        id: response.id,
        email: response.email,
        nomeCompleto: response.nomeCompleto,
        tipoUsuario: response.tipoUsuario,
        cargo: response.cargo
      };
      
      console.log('Dados do usuário:', userData);
      
      // Verificar se o usuário é funcionário (administrador)
      if (response.tipoUsuario !== 'Funcionario') {
        setError('Acesso restrito apenas para funcionários.');
        throw new Error('Acesso restrito apenas para funcionários.');
      }
      
      setCurrentUser(userData);
      localStorage.setItem('vacinici_user', JSON.stringify(userData));
      localStorage.setItem('vacinici_token', response.token);
      console.log('Login realizado com sucesso!');
      return userData;
    } catch (err) {
      console.log('AuthContext: Erro capturado:', err);
      console.log('AuthContext: Mensagem do erro:', err.message);
      setError(err.message || 'Falha ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vacinici_user');
    localStorage.removeItem('vacinici_token');
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};