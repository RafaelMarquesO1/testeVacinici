import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton, Button, Divider, useTheme } from '@mui/material';
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import '../../styles/Dashboard.css';

export default function Sidebar({ handleLogout }) {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };



  return (
    <>
      <IconButton
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        sx={{ display: { md: 'none', xs: 'flex' }, position: 'fixed', top: 15, left: 15, zIndex: 1201 }}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </IconButton>
      <Box
        className={`sidebar${isCollapsed ? ' collapsed' : ''}${isMobileMenuOpen ? ' open' : ''}`}
        sx={{
          width: isCollapsed ? 88 : 264,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,42,24,0.8)' : 'rgba(233,248,239,0.9)',
          color: 'text.primary',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          display: { xs: isMobileMenuOpen ? 'block' : 'none', md: 'block' },
          transition: 'width 0.3s',
          boxShadow: '0 10px 30px rgba(5,80,64,0.12)',
          borderRight: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {isCollapsed ? 'V' : 'Vacinici'}
          </Typography>
          <IconButton onClick={() => setIsCollapsed(v => !v)} size="small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'column', px: 1 }}>
          <NavLink to="/admin/dashboard" className="nav-link" onClick={handleLinkClick} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}>
              <RxDashboard />
              {!isCollapsed && <span>Dashboard</span>}
            </Box>
          </NavLink>
          <NavLink to="/admin/usuarios" className="nav-link" onClick={handleLinkClick} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}>
              <FiUsers />
              {!isCollapsed && <span>Usuários</span>}
            </Box>
          </NavLink>
        </Box>
        <Box sx={{ mt: 'auto', p: 2.5 }}>
          <Button onClick={handleLogout} startIcon={<FiLogOut />} color="error" fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
            {!isCollapsed && 'Sair'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
