

import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, Stack, Tooltip, Button, Menu, MenuItem } from '@mui/material';
import { Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';



export default function Header({ user, onLogout }) {
  const userName = user ? user.nomeCompleto?.split(' ')[0] : 'Usuário';
  const userRole = user && user.cargo ? user.cargo : (user && user.tipoUsuario === 'Funcionario' ? 'Funcionário' : '');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu de navegação baseado no cargo
  const menuItems = [
    user?.cargo && /(admin|administrador)/i.test(user.cargo) && {
      label: 'Usuários',
      to: '/admin/usuarios',
    },
    user?.cargo?.toLowerCase().includes('enfermeir') && {
      label: 'Agendamentos',
      to: '/admin/agendamentos',
    },
    user?.tipoUsuario === 'Funcionario' && {
      label: 'Carteirinha',
      to: '/admin/carteirinha',
    },
  ].filter(Boolean);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNavigate = (to) => {
    navigate(to);
    handleClose();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      color: '#065f46',
      borderBottom: '1px solid #d9f99d',
      boxShadow: '0 4px 12px rgba(134, 239, 172, 0.1)',
    }}>
      <Toolbar sx={{ minHeight: 72, display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Vacinici
          </Typography>
          {menuItems.length > 0 && (
            <>
              <Button
                onClick={handleMenu}
                startIcon={<MenuIcon />}
                sx={{ 
                  fontWeight: 600, 
                  textTransform: 'none', 
                  backgroundColor: '#dcfce7',
                  color: '#065f46',
                  borderRadius: 2, 
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#bbf7d0'
                  }
                }}
              >
                Menu
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ 
                  sx: { 
                    bgcolor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(12px)',
                    color: '#065f46', 
                    borderRadius: 2, 
                    minWidth: 180,
                    border: '1px solid #d9f99d',
                    boxShadow: '0 4px 12px rgba(134, 239, 172, 0.2)'
                  } 
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    selected={location.pathname === item.to}
                    onClick={() => handleNavigate(item.to)}
                    sx={{ 
                      fontWeight: 600, 
                      borderRadius: 1.5, 
                      my: 0.5,
                      mx: 1,
                      color: location.pathname === item.to ? '#10b981' : '#047857',
                      backgroundColor: location.pathname === item.to ? '#f0fdf4' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#f0fdf4'
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ textAlign: 'right', minWidth: 120 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#065f46' }}>
              Olá, <strong>{userName}</strong>
            </Typography>
            {userRole && (
              <Typography variant="caption" sx={{ color: '#047857' }}>{userRole}</Typography>
            )}
          </Box>
          <Tooltip title={user?.nomeCompleto || 'Usuário'}>
            <Avatar sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: '#10b981', 
              fontWeight: 700, 
              fontSize: 20,
              border: '2px solid #d9f99d'
            }} src={user?.fotoPerfil}>
              {user?.nomeCompleto?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Tooltip>
          <Button 
            onClick={onLogout} 
            variant="outlined" 
            startIcon={<Logout />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600, 
              px: 3,
              py: 1,
              borderColor: '#dc2626',
              color: '#dc2626',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#b91c1c',
                backgroundColor: '#fef2f2'
              }
            }}
          >
            Sair
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}