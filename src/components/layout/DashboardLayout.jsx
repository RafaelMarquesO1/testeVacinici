import React from 'react';
import { Outlet } from 'react-router-dom';


import Header from './Header';
import { Box, Container, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const { logout, currentUser } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', background: theme.palette.mode === 'dark'
      ? 'linear-gradient(120deg, #0A1F12 0%, #0F2A18 100%)'
      : 'linear-gradient(120deg, #F0FDF4 0%, #ECFDF5 100%)', }}>
      <Header user={currentUser} onLogout={logout} />
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 3, md: 5 }, px: { xs: 1, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}