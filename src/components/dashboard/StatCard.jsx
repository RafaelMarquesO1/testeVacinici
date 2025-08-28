import React from 'react';
import { Paper, Box, Typography, Avatar, useTheme } from '@mui/material';

export default function StatCard({ icon, title, value, change, color = 'primary' }) {
  const theme = useTheme();
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 3,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(120deg, rgba(34,197,94,0.08) 0%, rgba(6,95,70,0.08) 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
        boxShadow: '0 4px 24px rgba(6, 95, 70, 0.15)'
      }}
    >
      <Avatar
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(34,197,94,0.2)' : palette.light,
          width: 56,
          height: 56,
          color: palette.main,
          border: `2px solid ${theme.palette.divider}`
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
        {change && (
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
            {change}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
