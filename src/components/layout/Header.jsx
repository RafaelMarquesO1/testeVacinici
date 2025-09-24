

import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, Stack, IconButton, Tooltip, Button, Menu, MenuItem, useTheme } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';



export default function Header({ user, onLogout }) {
  const userName = user ? user.nomeCompleto?.split(' ')[0] : 'Usuário';
  const userRole = user && user.cargo ? user.cargo : (user && user.tipoUsuario === 'Funcionario' ? 'Funcionário' : '');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Menu de navegação baseado no cargo
  const menuItems = [
    user?.cargo && /(admin|administrador)/i.test(user.cargo) && {
      label: 'Controle Geral',
      to: '/admin/controle',
    },
    user?.cargo && /(admin|administrador)/i.test(user.cargo) && {
      label: 'Usuários',
      to: '/admin/usuarios',
    },
    user?.cargo?.toLowerCase().includes('enfermeir') && {
      label: 'Agendamentos',
      to: '/admin/agendamentos',
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
      bgcolor: theme.palette.mode === 'dark' ? '#18181b' : '#f7fafc',
      color: theme.palette.mode === 'dark' ? '#fff' : '#222',
      borderBottom: theme.palette.mode === 'dark' ? '1px solid #232329' : '1px solid #e0e0e0',
      boxShadow: '0 2px 8px 0 rgba(42,157,143,0.04)',
    }}>
      <Toolbar sx={{ minHeight: 72, display: 'flex', justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.5, color: theme.palette.primary.main }}>
            Vacinici
          </Typography>
          {menuItems.length > 0 && (
            <>
              <Button
                color="inherit"
                onClick={handleMenu}
                sx={{ ml: 2, fontWeight: 700, textTransform: 'none', bgcolor: theme.palette.mode === 'dark' ? '#232329' : '#e0f7fa', borderRadius: 2, fontSize: 17, px: 3 }}
              >
                Menu
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { bgcolor: theme.palette.mode === 'dark' ? '#232329' : '#fff', color: theme.palette.mode === 'dark' ? '#fff' : '#222', borderRadius: 2, minWidth: 180 } }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    selected={location.pathname === item.to}
                    onClick={() => handleNavigate(item.to)}
                    sx={{ fontWeight: 600, fontSize: 16, borderRadius: 1.5, my: 0.5, color: location.pathname === item.to ? theme.palette.primary.main : undefined }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <ThemeToggle />
          <Box sx={{ textAlign: 'right', minWidth: 90 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 16 }}>Bem-vindo(a), <strong>{userName}</strong></Typography>
            {userRole && (
              <Typography variant="caption" color="text.secondary">{userRole}</Typography>
            )}
          </Box>
          <Tooltip title={user?.nomeCompleto || 'Usuário'}>
            <Avatar sx={{ width: 44, height: 44, bgcolor: theme.palette.primary.main, fontWeight: 700, fontSize: 22 }} src={user?.fotoPerfil}>
              {user?.nomeCompleto?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Tooltip>
          <Button onClick={onLogout} variant="outlined" color="error" size="medium" startIcon={<Logout />}
            sx={{ borderRadius: 2, fontWeight: 700, fontSize: 15, px: 2 }}>
            Sair
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}