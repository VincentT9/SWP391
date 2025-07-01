import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  LocalPharmacy,
  Schedule,
  Security,
  Notifications,
  CheckCircle,
  School,
  MedicalServices,
  Assignment,
  VerifiedUser,
  AccessTime,
  Group,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MedicationPromoPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalPharmacy />,
      title: 'Gửi thuốc an toàn',
      description: 'Gửi thuốc đến trường một cách an toàn và có kiểm soát chặt chẽ',
    },
    {
      icon: <Schedule />,
      title: 'Theo dõi lịch uống',
      description: 'Thiết lập và theo dõi lịch uống thuốc của con một cách chi tiết',
    },
    {
      icon: <Notifications />,
      title: 'Thông báo tức thì',
      description: 'Nhận thông báo khi con đã uống thuốc hoặc có vấn đề gì xảy ra',
    },
    {
      icon: <Security />,
      title: 'Bảo mật cao',
      description: 'Thông tin y tế được bảo mật và chỉ chia sẻ với nhân viên y tế',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Tạo yêu cầu gửi thuốc',
      description: 'Điền thông tin thuốc, liều lượng và thời gian sử dụng',
    },
    {
      step: '02',
      title: 'Y tá kiểm tra và xác nhận',
      description: 'Nhân viên y tế sẽ kiểm tra và xác nhận yêu cầu của bạn',
    },
    {
      step: '03',
      title: 'Theo dõi quá trình',
      description: 'Theo dõi lịch uống thuốc và nhận thông báo cập nhật',
    },
  ];

  const testimonials = [
    {
      name: 'Chị Nguyễn Thị Mai',
      role: 'Phụ huynh học sinh lớp 3A',
      content: 'Rất yên tâm khi gửi thuốc cho con qua hệ thống. Y tá luôn cập nhật tình hình đều đặn.',
      rating: 5,
    },
    {
      name: 'Anh Trần Văn Nam',
      role: 'Phụ huynh học sinh lớp 5B',
      content: 'Hệ thống rất tiện lợi, giúp tôi theo dõi được lịch uống thuốc của con mọi lúc.',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Gửi thuốc đến trường{' '}
                  <Box component="span" sx={{ color: '#90caf9' }}>
                    an toàn
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Đảm bảo con bạn được uống thuốc đúng giờ, đúng liều lượng với sự giám sát
                  chuyên nghiệp của đội ngũ y tế trường học.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: '#1e88e5',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Đăng ký ngay
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Tìm hiểu thêm
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src="/api/placeholder/500/400"
                    alt="Medication Management"
                    sx={{
                      width: '100%',
                      maxWidth: 500,
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: '#263238' }}
          >
            Tại sao chọn dịch vụ của chúng tôi?
          </Typography>
          <Typography variant="h6" sx={{ color: '#546e7a', maxWidth: 600, mx: 'auto' }}>
            Chúng tôi cung cấp giải pháp toàn diện để đảm bảo con bạn nhận được sự chăm sóc
            y tế tốt nhất tại trường.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        bgcolor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 30, color: '#1e88e5' },
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: '#263238' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: '#546e7a', lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: '#263238' }}
            >
              Quy trình đơn giản
            </Typography>
            <Typography variant="h6" sx={{ color: '#546e7a' }}>
              Chỉ 3 bước đơn giản để bắt đầu sử dụng dịch vụ
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: '#1e88e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: '#263238' }}
                    >
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: '#546e7a', lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: '#263238' }}
          >
            Phụ huynh nói gì về chúng tôi
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography
                      sx={{
                        color: '#546e7a',
                        lineHeight: 1.6,
                        mb: 3,
                        fontStyle: 'italic',
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: '#1e88e5',
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: '#263238' }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#546e7a' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
          py: { xs: 8, md: 12 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Sẵn sàng bắt đầu?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Đăng ký ngay hôm nay để đảm bảo con bạn nhận được sự chăm sóc y tế tốt nhất
              tại trường.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: '#1e88e5',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Đăng ký miễn phí
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MedicationPromoPage;
