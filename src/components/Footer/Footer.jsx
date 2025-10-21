import React from 'react';
import { Box, Typography, Link, IconButton, Stack, useTheme } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? '#0F2A18' : '#D1FAE5',
        color: isDark ? '#E7F7EE' : '#052E16',
        py: 5,
        px: { xs: 2, md: 8 },
        mt: 8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 6,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Sobre nós
          </Typography>
          <Stack spacing={1}>
            <Link href="#" underline="hover" color="inherit">FAQ</Link>
            <Link href="#" underline="hover" color="inherit">Termos e Condições</Link>
            <Link href="/politica" underline="hover" color="inherit">Política de Privacidade</Link>
          </Stack>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Acompanhe a gente
          </Typography>
          <Stack direction="row" spacing={2} mt={1}>
            <IconButton href="https://instagram.com" target="_blank" color="primary" sx={{ bgcolor: isDark ? 'background.paper' : '#fff', borderRadius: 2 }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href="https://facebook.com" target="_blank" color="primary" sx={{ bgcolor: isDark ? 'background.paper' : '#fff', borderRadius: 2 }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" color="primary" sx={{ bgcolor: isDark ? 'background.paper' : '#fff', borderRadius: 2 }}>
              <XIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
