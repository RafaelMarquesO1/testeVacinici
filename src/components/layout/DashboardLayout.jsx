import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box, Container, useTheme, Tabs, Tab } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const theme = useTheme();
  const location = useLocation();

  const tabValue = location.pathname.includes('/admin/usuarios') ? 1 : 0;

  const triggerLogout = () => {
    document.body.classList.add('logging-out');
    setTimeout(() => {
      logout();
      navigate('/entrar');
      document.body.classList.remove('logging-out');
    }, 500);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(120deg, #0A1F12 0%, #0F2A18 100%)'
          : 'linear-gradient(120deg, #F0FDF4 0%, #ECFDF5 100%)',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header user={currentUser} />
        <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>
          <Tabs value={tabValue} onChange={(_, v) => navigate(v === 0 ? '/admin/dashboard' : '/admin/usuarios')} textColor="primary" indicatorColor="primary" sx={{ mb: 1 }}>
            <Tab label="Dashboard" />
            <Tab label="Usuários" />
          </Tabs>
        </Box>
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: { xs: 3, md: 5 },
            px: { xs: 1, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}