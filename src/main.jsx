import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
// import './styles/global.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline, responsiveFontSizes } from '@mui/material';
import { ThemeProvider as AppThemeProvider, useTheme as useAppTheme } from './contexts/ThemeContext';

function MUIThemeBridge({ children }) {
  const { isDark } = useAppTheme();
  let theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      // Tailwind green palette inspired (softened) com títulos/ícones mais escuros
      primary: { main: '#15803D', contrastText: '#ECFDF5' }, // green-700 para títulos/ícones
      secondary: { main: '#34D399', contrastText: '#053026' }, // green-400 para botões/accent
      success: { main: '#22C55E' },
      info: { main: '#2DD4BF' },
      warning: { main: '#CA8A04' },
      error: { main: '#DC2626' },
      background: {
        default: isDark ? '#0A1F12' : '#F7FEE7', // lime-50 mix for softer base
        paper: isDark ? '#0F2A18' : '#E9F8EF' // softer green-50
      },
      text: { primary: isDark ? '#E7F7EE' : '#064E3B', secondary: isDark ? '#B7E4C7' : '#047857' },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Poppins, Inter, Roboto, Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.5px' },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.3px' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, padding: '10px 22px' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(180%) blur(10px)',
            background: isDark
              ? 'rgba(10, 31, 18, 0.7)'
              : 'rgba(240, 253, 244, 0.7)',
            color: isDark ? '#E7F7EE' : '#052E16',
            boxShadow: '0 8px 30px rgba(5, 80, 64, 0.12)',
            borderBottom: isDark ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(6,95,70,0.10)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(6,95,70,0.08) 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(5,80,64,0.12)'
          }
        }
      },
    },
  });
  theme = responsiveFontSizes(theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppThemeProvider>
      <MUIThemeBridge>
        <App />
      </MUIThemeBridge>
    </AppThemeProvider>
  </React.StrictMode>
);
