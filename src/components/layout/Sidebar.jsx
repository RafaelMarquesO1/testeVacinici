import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton, Button, Divider, Drawer, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, useTheme } from '@mui/material';
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiLogOut, FiMenu, FiBarChart2 } from "react-icons/fi";

const drawerWidth = 88;

export default function Sidebar({ handleLogout }) {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const menuItems = [
    currentUser?.cargo && /(admin|administrador)/i.test(currentUser.cargo) && {
      label: 'Controle Geral',
      to: '/admin/controle',
      icon: <FiBarChart2 size={28} />,
    },
    currentUser?.cargo && /(admin|administrador)/i.test(currentUser.cargo) && {
      label: 'Usuários',
      to: '/admin/usuarios',
      icon: <FiUsers size={28} />,
    },
    currentUser?.cargo?.toLowerCase().includes('enfermeir') && {
      label: 'Agendamentos',
      to: '/admin/agendamentos',
      icon: <RxDashboard size={28} />,
    },
  ].filter(Boolean);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', top: 15, left: 15, zIndex: 1301, color: theme.palette.primary.main, bgcolor: theme.palette.background.paper, '&:hover': { bgcolor: theme.palette.primary.light } }}
        aria-label="Abrir menu"
      >
        <FiMenu size={28} />
      </IconButton>
      <Drawer
        variant="permanent"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: theme.palette.mode === 'dark' ? '#18181b' : '#f7fafc',
            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
            borderRight: 'none',
            pt: 2,
            px: 0,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            boxShadow: '2px 0 12px 0 rgba(42,157,143,0.10)',
            transition: 'width 0.3s',
          },
        }}
      >
        <Avatar sx={{ width: 52, height: 52, mb: 2, bgcolor: theme.palette.primary.main, fontWeight: 700, fontSize: 26 }}>
          {currentUser?.nome?.[0]?.toUpperCase() || 'V'}
        </Avatar>
        <Divider sx={{ bgcolor: theme.palette.primary.main, width: '60%', mb: 2 }} />
        <List sx={{ width: '100%' }}>
          {menuItems.map((item, idx) => (
            <NavLink to={item.to} key={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton sx={{ justifyContent: 'center', py: 2.2, borderRadius: 2, '&.active, &:hover': { bgcolor: theme.palette.primary.main, color: '#fff' } }}>
                    <ListItemIcon sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </NavLink>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ mb: 2 }}>
          <Tooltip title="Sair" placement="right" arrow>
            <IconButton onClick={handleLogout} sx={{ color: '#fff', bgcolor: theme.palette.error.main, '&:hover': { bgcolor: theme.palette.error.dark }, width: 48, height: 48 }}>
              <FiLogOut size={26} />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Drawer mobile */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 220,
            bgcolor: theme.palette.mode === 'dark' ? '#18181b' : '#f7fafc',
            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
            pt: 2,
            px: 0,
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            minHeight: '100vh',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main, fontWeight: 700, fontSize: 22 }}>
            {currentUser?.nome?.[0]?.toUpperCase() || 'V'}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'inherit' }}>{currentUser?.nome || 'Vacinici'}</Typography>
        </Box>
        <Divider sx={{ bgcolor: theme.palette.primary.main, width: '80%', mb: 2, mx: 'auto' }} />
        <List>
          {menuItems.map((item, idx) => (
            <NavLink to={item.to} key={item.to} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setOpen(false)}>
              <ListItem disablePadding>
                <ListItemButton sx={{ py: 2.2, borderRadius: 2, '&.active, &:hover': { bgcolor: theme.palette.primary.main, color: '#fff' } }}>
                  <ListItemIcon sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ ml: 2 }} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ mb: 2, px: 2 }}>
          <Button onClick={handleLogout} startIcon={<FiLogOut />} color="error" fullWidth variant="contained" sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1 }}>
            Sair
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
// ...código novo acima...
