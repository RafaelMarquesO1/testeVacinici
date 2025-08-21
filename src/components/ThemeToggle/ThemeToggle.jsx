import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 87, 184, 0.1)',
          color: isDark ? '#4CAF50' : '#0057b8',
          border: isDark ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(0, 87, 184, 0.3)',
          borderRadius: 2,
          width: 44,
          height: 44,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 87, 184, 0.2)',
            transform: 'scale(1.05)',
          },
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;