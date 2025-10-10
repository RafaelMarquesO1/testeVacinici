import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Alert, CircularProgress, Paper, Collapse, Fade } from '@mui/material';
import { Visibility, VisibilityOff, ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import vaciniilus from '../../assets/vaciniilus.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validations = [
    { regex: /.{6,}/, label: 'Mínimo 6 caracteres' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      setError('Por favor, preencha o email e a senha para continuar.');
      return;
    }

    const isValid = validations.every(({ regex }) => regex.test(password));
    if (!isValid) {
      setError('A senha não atende todos os critérios de segurança.');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      const user = await login(email, password);
      if (user?.tipoUsuario === 'Funcionario' && user?.cargo?.toLowerCase().includes('admin')) {
        navigate('/admin/usuarios');
      } else if (user?.tipoUsuario === 'Funcionario' && user?.cargo?.toLowerCase().includes('enfermeir')) {
        navigate('/admin/agendamentos');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log('Erro capturado no login:', err);
      console.log('Mensagem do erro:', err.message);
      // Exibe a mensagem específica do backend ou uma mensagem genérica
      const errorMessage = err.message || 'Usuário não encontrado!';
      console.log('Definindo erro como:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
    }}>
      <Fade in timeout={700}>
        <Paper elevation={0} sx={{ 
          display: 'flex', 
          width: { xs: '95%', sm: '500px', md: '800px' }, 
          p: { xs: 3, md: 5 }, 
          borderRadius: 3, 
          boxShadow: '0 20px 40px rgba(134, 239, 172, 0.15)', 
          border: '1px solid #d9f99d',
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(12px)'
        }}>
          <Box sx={{ 
            flex: 1, 
            pr: { xs: 0, md: 4 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Typography 
              variant="h3" 
              sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Entrar
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#047857', 
                mb: 4,
                fontSize: '1rem'
              }}
            >
              Acesse sua conta para continuar
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                error={!!error}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f7fee7',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#86efac'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#047857',
                    '&.Mui-focused': {
                      color: '#10b981'
                    }
                  }
                }}
              />
              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                inputProps={{ maxLength: 50 }}
                error={!!error}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f7fee7',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#86efac'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#047857',
                    '&.Mui-focused': {
                      color: '#10b981'
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" sx={{ color: '#047857' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ mb: 2 }}>
                {validations.map(({ regex, label }, i) => (
                  <Typography key={i} variant="caption" color={regex.test(password) ? 'success.main' : 'error'}>
                    {regex.test(password) ? '✔' : '✖'} {label}
                  </Typography>
                ))}
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  backgroundColor: '#86efac',
                  color: '#065f46',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(134, 239, 172, 0.3)',
                  '&:hover': {
                    backgroundColor: '#6ee7b7',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(134, 239, 172, 0.4)'
                  },
                  '&:disabled': {
                    backgroundColor: '#d9f99d',
                    color: '#047857'
                  },
                  transition: 'all 0.3s ease'
                }}
                startIcon={loading && <CircularProgress size={18} sx={{ color: '#047857' }} />}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            <Collapse in={!!error}>
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  icon={<ErrorOutline />}
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    '& .MuiAlert-message': {
                      fontWeight: 500
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            </Collapse>
          </Box>
          <Box sx={{ 
            flex: 1, 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            justifyContent: 'center',
            pl: 4
          }}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: 'rgba(240, 253, 244, 0.5)',
              border: '1px solid #d9f99d'
            }}>
              <img 
                src={vaciniilus} 
                alt="Ilustração" 
                style={{ 
                  maxWidth: 280, 
                  borderRadius: 12, 
                  boxShadow: '0 8px 25px rgba(134, 239, 172, 0.2)'
                }} 
              />
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
