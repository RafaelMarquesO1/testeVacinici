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
      await login(email, password);
      navigate('/admin/dashboard');
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={6} sx={{ display: 'flex', width: { xs: '100%', md: 700 }, p: 4, borderRadius: 3 }}>
        <Box sx={{ flex: 1, pr: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>Sistema Vacinici</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}><strong>Acesso restrito para funcionários cadastrados no sistema.</strong></Typography>
          <Typography variant="caption" color="primary.main" mb={2} display="block">
            💡 Apenas funcionários criados no sistema podem fazer login
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
                '& .MuiOutlinedInput-root': {
                  animation: error ? 'fieldShake 0.3s ease-in-out' : 'none'
                },
                '@keyframes fieldShake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-3px)' },
                  '75%': { transform: 'translateX(3px)' }
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
                '& .MuiOutlinedInput-root': {
                  animation: error ? 'fieldShake 0.3s ease-in-out' : 'none'
                },
                '@keyframes fieldShake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-3px)' },
                  '75%': { transform: 'translateX(3px)' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
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
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 1 }}
              startIcon={loading && <CircularProgress size={18} />}
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
                  animation: error ? 'shake 0.5s ease-in-out' : 'none',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
                  },
                  '& .MuiAlert-message': {
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }
                }}
              >
                {error}
              </Alert>
            </Fade>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
          <img src={vaciniilus} alt="Ilustração" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </Box>
      </Paper>
    </Box>
  );
}
