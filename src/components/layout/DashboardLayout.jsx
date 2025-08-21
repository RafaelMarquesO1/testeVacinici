import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box, ThemeProvider, CssBaseline, createTheme, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// Tema Material UI customizado (apenas modo claro)
const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0057b8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb300',
      contrastText: '#23293a',
    },
    background: {
      default: '#f6f8fc',
      paper: '#fff',
    },
    info: {
      main: '#00bcd4',
    },
    success: {
      main: '#43a047',
    },
    warning: {
      main: '#ffa726',
    },
    error: {
      main: '#e53935',
    },
    divider: '#e3eafc',
    text: {
      primary: '#23293a',
      secondary: '#5f6a7d',
      disabled: '#b0bec5',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Poppins, Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.6rem', letterSpacing: '-1px' },
    h2: { fontWeight: 700, fontSize: '2.1rem' },
    h3: { fontWeight: 700, fontSize: '1.7rem' },
    h4: { fontWeight: 600, fontSize: '1.3rem' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, letterSpacing: '0.5px' },
    body1: { fontSize: '1.08rem' },
    body2: { fontSize: '0.98rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(120deg, #f6f8fc 0%, #e3eafc 100%)',
        },
        '*::-webkit-scrollbar': {
          width: '10px',
          background: '#e3eafc',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#b3c2e6',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #fff 0%, #e3eafc 100%)',
          color: '#23293a',
          boxShadow: '0 2px 12px 0 rgba(60,72,100,0.10)',
          borderBottom: '2px solid #e3eafc',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #fff 60%, #f6f8fc 100%)',
          borderRight: '2px solid #e3eafc',
          boxShadow: '2px 0 12px 0 rgba(60,72,100,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          padding: '10px 24px',
          boxShadow: '0 2px 8px 0 rgba(60,72,100,0.06)',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(0,87,184,0.10)',
            backgroundColor: '#1976d2',
            color: '#fff',
          },
        },
        containedSecondary: {
          color: '#23293a',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(120deg, #fff 80%, #e3eafc 100%)',
          borderRadius: 18,
          boxShadow: '0 4px 32px 0 rgba(60,72,100,0.10)',
          padding: '24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#f6f8fc',
          borderRadius: 12,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#f6f8fc',
        },
        input: {
          padding: '12px 14px',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          background: '#fff',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: '#e3eafc',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#0057b8',
        },
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #e3eafc',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0057b8',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.98rem',
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
});

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const triggerLogout = () => {
    document.body.classList.add('logging-out');
    setTimeout(() => {
      logout();
      navigate('/entrar');
      document.body.classList.remove('logging-out');
    }, 500);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          background: 'linear-gradient(120deg, #f6f8fc 0%, #e3eafc 100%)',
        }}
      >
        <Sidebar handleLogout={triggerLogout} />
        <Box
          sx={{
            flexGrow: 1,
            ml: { md: '260px', xs: 0 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header user={currentUser} />
          <Container
            maxWidth="xl"
            sx={{
              flexGrow: 1,
              py: { xs: 3, md: 5 },
              px: { xs: 1, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}