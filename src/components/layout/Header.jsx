import React from 'react';
import { Box, Typography } from '@mui/material';
import '../../styles/Dashboard.css';

export default function Header({ user }) {
  const userName = user ? user.nome_completo?.split(' ')[0] : "Usuário";
  const userRole = user && user.cargo ? user.cargo : (user && user.tipo === 'Funcionario' ? 'Funcionário' : '');

  return (
    <Box sx={{ height: 70, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 4 }}>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="subtitle1" color="text.secondary">
        Bem-vindo(a) de volta, <strong>{userName}!</strong>
        {userRole && <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>({userRole})</span>}
      </Typography>
    </Box>
  );
}