import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import '../../styles/Dashboard.css';

export default function Sidebar({ handleLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLinkClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

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
          width: isCollapsed ? 88 : 260,
          bgcolor: 'background.paper',
          color: 'text.primary',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          display: { xs: isMobileMenuOpen ? 'block' : 'none', md: 'block' },
          transition: 'width 0.3s'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {isCollapsed ? 'V' : 'Vacinici'}
          </Typography>
          <IconButton onClick={() => setIsCollapsed(v => !v)} size="small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          <NavLink to="/admin/dashboard" className="nav-link" onClick={handleLinkClick} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <RxDashboard />
              {!isCollapsed && <span>Dashboard</span>}
            </Box>
          </NavLink>
          <NavLink to="/admin/usuarios" className="nav-link" onClick={handleLinkClick} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <FiUsers />
              {!isCollapsed && <span>Usuários</span>}
            </Box>
          </NavLink>
        </Box>
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button onClick={toggleTheme} startIcon={isDarkMode ? <FiSun /> : <FiMoon />} fullWidth>
            {!isCollapsed && (isDarkMode ? 'Modo Claro' : 'Modo Escuro')}
          </Button>
          <Button onClick={handleLogout} startIcon={<FiLogOut />} color="error" fullWidth>
            {!isCollapsed && 'Sair'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
