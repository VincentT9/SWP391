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
  Security,
  Schedule,
  Notifications,
  CheckCircle,
  Phone,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MedicationDeliveryPromo: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Gửi thuốc an toàn',
      description: 'Hệ thống quản lý thuốc chuyên nghiệp, đảm bảo an toàn cho học sinh của bạn'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Bảo mật thông tin',
      description: 'Thông tin thuốc và sức khỏe của con được bảo mật tuyệt đối'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      title: 'Lịch uống thuốc',
      description: 'Thiết lập lịch uống thuốc chi tiết, không bỏ sót bất kỳ liều nào'
    },
    {
      icon: <Notifications sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      title: 'Thông báo real-time',
      description: 'Nhận thông báo ngay khi con uống thuốc hoặc có vấn đề gì xảy ra'
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: 'Theo dõi hiệu quả',
      description: 'Báo cáo chi tiết về tình trạng sử dụng thuốc của học sinh'
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ y tế chuyên nghiệp sẵn sàng hỗ trợ mọi lúc'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản phụ huynh và cung cấp thông tin học sinh'
    },
    {
      step: '2',
      title: 'Gửi yêu cầu thuốc',
      description: 'Điền thông tin thuốc cần gửi và lịch trình sử dụng'
    },
    {
      step: '3',
      title: 'Xác nhận từ y tá',
      description: 'Y tá trường sẽ xem xét và xác nhận yêu cầu'
    },
    {
      step: '4',
      title: 'Theo dõi real-time',
      description: 'Nhận thông báo về tình trạng sử dụng thuốc của con'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          py: 8,
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    mb: 3
                  }}
                >
                  Dịch vụ gửi thuốc
                  <br />
                  <span style={{ color: theme.palette.secondary.main }}>
                    đến trường
                  </span>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 4,
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  Giải pháp quản lý thuốc thông minh, giúp phụ huynh yên tâm 
                  về việc chăm sóc sức khỏe con em tại trường học
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Đăng ký ngay
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 500 }}>
                <Box
                  component="img"
                  src="/src/assets/Picture1.png"
                  alt="Medication Delivery"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: theme.shadows[10]
                  }}
                />
              </Box>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Tại sao chọn dịch vụ của chúng tôi?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 4
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    boxShadow: theme.shadows[4],
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* How it works Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Quy trình sử dụng
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            p: 6,
            borderRadius: 4
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Sẵn sàng bắt đầu?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            Đăng ký ngay hôm nay để trải nghiệm dịch vụ tuyệt vời
          </Typography>
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
            Đăng ký miễn phí
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MedicationDeliveryPromo;
