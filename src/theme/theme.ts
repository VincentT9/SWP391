import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2980b9',  // FPT Blue - Main brand color
      light: '#5dade2',
      dark: '#1b4f72',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f19936',  // FPT Orange - Secondary brand color
      light: '#f4b350',
      dark: '#d68910',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e74c3c',  // Slightly adjusted red to fit FPT theme
    },
    warning: {
      main: '#f39c12',  // FPT Orange variant for warnings
    },
    info: {
      main: '#2980b9',  // Use FPT Blue for info
    },
    success: {
      main: '#2ecc71',  // FPT Green for success
    },
    background: {
      default: '#f8f9fa',  // Clean light background
      paper: '#ffffff',    // White for cards and containers
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8f9fa',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#2980b9',
          '&:hover': {
            backgroundColor: '#1b4f72',
          },
        },
        containedSecondary: {
          backgroundColor: '#f19936',
          '&:hover': {
            backgroundColor: '#d68910',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(41, 128, 185, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(41, 128, 185, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2980b9',
          boxShadow: '0 2px 10px rgba(41, 128, 185, 0.2)',
        },
      },
    },
  },
});

export default theme; 