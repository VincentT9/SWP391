import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LocalPharmacy,
  Vaccines,
  HealthAndSafety,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const services = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: 'Gửi thuốc đến trường',
      description: 'Dịch vụ quản lý và gửi thuốc cho học sinh tại trường một cách an toàn và tiện lợi',
      path: '/promo/medication-delivery',
      color: theme.palette.primary.main
    },
    {
      icon: <Vaccines sx={{ fontSize: 60, color: theme.palette.success.main }} />,
      title: 'Tiêm phòng tại trường',
      description: 'Chương trình tiêm phòng đầy đủ và an toàn cho học sinh theo quy định của Bộ Y tế',
      path: '/promo/vaccination',
      color: theme.palette.success.main
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 60, color: theme.palette.info.main }} />,
      title: 'Kiểm tra sức khỏe định kỳ',
      description: 'Khám sức khỏe định kỳ toàn diện để theo dõi sự phát triển của học sinh',
      path: '/promo/health-check',
      color: theme.palette.info.main
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 10,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center">
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                HealthSchool
              </Typography>
              <Typography
                variant="h4"
                sx={{ 
                  mb: 6,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                Hệ thống quản lý sức khỏe học sinh toàn diện
                <br />
                Đảm bảo an toàn và chăm sóc tốt nhất cho con em bạn
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 6, 
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.2rem'
                  }}
                >
                  Bắt đầu ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 6, 
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.2rem'
                  }}
                >
                  Đăng nhập
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 8, fontWeight: 'bold' }}
          >
            Dịch vụ của chúng tôi
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    boxShadow: theme.shadows[8],
                    transition: 'all 0.3s ease-in-out',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: theme.shadows[20],
                      borderColor: service.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ mb: 4, lineHeight: 1.6 }}
                    >
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(service.path)}
                      sx={{ 
                        bgcolor: service.color,
                        '&:hover': {
                          bgcolor: alpha(service.color, 0.8)
                        },
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Tìm hiểu thêm
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            p: 8,
            borderRadius: 4,
            boxShadow: theme.shadows[8]
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Tham gia cùng hàng nghìn phụ huynh đã tin tưởng HealthSchool để chăm sóc sức khỏe con em
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              px: 8, 
              py: 3,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.3rem',
              fontWeight: 'bold'
            }}
          >
            Đăng ký miễn phí ngay
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
