import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const { logout, currentUser } = useAuth();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
    }}>
      <Header user={currentUser} onLogout={logout} />
      <Outlet />
    </Box>
  );
}