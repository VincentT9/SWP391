import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
} from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import { School } from '@mui/icons-material';

const PromoLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Bar */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/landing')}
            >
              <School sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                HealthSchool
              </Typography>
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                color="inherit"
                onClick={() => navigate('/promo/medication-delivery')}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Gửi thuốc
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/promo/vaccination')}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Tiêm phòng
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/promo/health-check')}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Khám sức khỏe
              </Button>
              
              {/* Auth Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/register')}
                  sx={{ textTransform: 'none' }}
                >
                  Đăng ký
                </Button>
              </Box>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Content */}
      <Outlet />
    </Box>
  );
};

export default PromoLayout;