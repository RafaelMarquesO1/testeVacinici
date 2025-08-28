import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, Stack, IconButton, Tooltip, Button } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export default function Header({ user, onLogout }) {
  const userName = user ? user.nomeCompleto?.split(' ')[0] : 'Usuário';
  const userRole = user && user.cargo ? user.cargo : (user && user.tipoUsuario === 'Funcionario' ? 'Funcionário' : '');

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ minHeight: 70, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Painel Administrativo</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <ThemeToggle />
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Bem-vindo(a), <strong>{userName}</strong></Typography>
            {userRole && (
              <Typography variant="caption" color="text.secondary">{userRole}</Typography>
            )}
          </Box>
          <Tooltip title={user?.nomeCompleto || 'Usuário'}>
            <Avatar sx={{ width: 40, height: 40 }} src={user?.fotoPerfil} />
          </Tooltip>
          <Button onClick={onLogout} variant="outlined" color="error" size="small" startIcon={<Logout />}
            sx={{ borderRadius: 2 }}>
            Sair
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}