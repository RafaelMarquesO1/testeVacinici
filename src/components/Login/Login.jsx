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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #142D1F 0%, #1A3A2F 100%)' : 'linear-gradient(120deg, #F0FDF4 0%, #C7F2E6 100%)' }}>
      <Fade in timeout={700}>
        <Paper elevation={12} sx={{ display: 'flex', width: { xs: '100%', md: 700 }, p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 12px 48px rgba(34,197,94,0.18)', border: '1.5px solid', borderColor: theme => theme.palette.mode === 'dark' ? '#1A3A2F' : '#C7F2E6', background: theme => theme.palette.mode === 'dark' ? 'rgba(26,58,47,0.85)' : 'rgba(247,255,249,0.85)', backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -40, left: -40, width: 180, height: 180, bgcolor: theme => theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light', opacity: 0.12, borderRadius: '50%', filter: 'blur(12px)' }} />
          <Box sx={{ flex: 1, pr: { xs: 0, md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
            <Typography variant="h4" fontWeight={900} mb={1} color={theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main'}>Sistema Vacinici</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}><strong>Acesso restrito para funcionários cadastrados no sistema.</strong></Typography>
            <Typography variant="caption" color={theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main'} mb={2} display="block">
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
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1A3A2F' : '#F7FFF9',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    animation: error ? 'fieldShake 0.3s ease-in-out' : 'none',
                    color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
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
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1A3A2F' : '#F7FFF9',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    animation: error ? 'fieldShake 0.3s ease-in-out' : 'none',
                    color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
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
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" sx={{ color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main' }}>
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
                sx={{ mt: 1, fontWeight: 800, borderRadius: 2, boxShadow: '0 2px 8px rgba(34,197,94,0.10)', bgcolor: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main', color: theme => theme.palette.mode === 'dark' ? 'primary.main' : '#fff', transition: '0.2s', '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? 'primary.main' : 'success.light', color: theme => theme.palette.mode === 'dark' ? '#fff' : 'primary.main' } }}
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
                    bgcolor: theme => theme.palette.mode === 'dark' ? '#4B2323' : '#FFF6F6',
                    color: theme => theme.palette.mode === 'dark' ? 'error.light' : 'error.main',
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
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <Box sx={{ p: 2, borderRadius: 4, boxShadow: '0 4px 24px rgba(34,197,94,0.18)', bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(26,58,47,0.85)' : 'rgba(247,255,249,0.85)', backdropFilter: 'blur(8px)' }}>
              <img src={vaciniilus} alt="Ilustração" style={{ maxWidth: 220, borderRadius: 16, boxShadow: '0 2px 8px rgba(34,197,94,0.10)', border: '2px solid #34c77a' }} />
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
