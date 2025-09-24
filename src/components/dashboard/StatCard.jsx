import React from 'react';
import { Paper, Box, Typography, Avatar, useTheme } from '@mui/material';

export default function StatCard({ icon, title, value, change, color = 'primary' }) {
  const theme = useTheme();
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Paper
      elevation={3}
      className="dashboard-card"
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 4,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        boxShadow: '0 2px 8px var(--shadow)',
        border: '1px solid var(--border-color)',
        minWidth: 220,
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <Avatar
        sx={{
          bgcolor: color === 'primary' ? 'var(--primary-color)' : palette.main,
          width: 56,
          height: 56,
          color: '#fff',
          fontWeight: 700,
          fontSize: 32,
          border: '2px solid var(--border-color)',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-family)' }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>{value}</Typography>
        {change && (
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, fontFamily: 'var(--font-family)' }}>
            {change}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
