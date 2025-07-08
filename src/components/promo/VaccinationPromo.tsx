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
  Vaccines,
  Shield,
  CalendarMonth,
  MonitorHeart,
  Groups,
  School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const VaccinationPromo: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Vaccines sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Chương trình tiêm phòng đầy đủ',
      description: 'Tuân thủ nghiêm ngặt lịch tiêm phòng theo quy định của Bộ Y tế'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'An toàn tuyệt đối',
      description: 'Vắc xin chính hãng, quy trình tiêm phòng đạt chuẩn quốc tế'
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      title: 'Lịch trình linh hoạt',
      description: 'Sắp xếp lịch tiêm phù hợp với thời gian biểu của từng lớp học'
    },
    {
      icon: <MonitorHeart sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      title: 'Theo dõi sức khỏe',
      description: 'Giám sát tình trạng sức khỏe học sinh sau tiêm phòng'
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Bác sĩ, y tá có kinh nghiệm trong tiêm phòng cho trẻ em'
    },
    {
      icon: <School sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Thuận tiện tại trường',
      description: 'Tiêm phòng trực tiếp tại trường, không làm gián đoạn việc học'
    }
  ];

  const benefits = [
    {
      title: 'Bảo vệ sức khỏe cộng đồng',
      description: 'Ngăn chặn dịch bệnh lây lan trong môi trường trường học'
    },
    {
      title: 'Miễn dịch lâu dài',
      description: 'Tạo khả năng miễn dịch bền vững cho học sinh'
    },
    {
      title: 'Tiết kiệm thời gian',
      description: 'Phụ huynh không cần nghỉ làm để đưa con đi tiêm phòng'
    },
    {
      title: 'Giám sát chuyên nghiệp',
      description: 'Y tá trường theo dõi phản ứng sau tiêm 24/7'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.success.main, 0.1),
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
                    color: theme.palette.success.main,
                    mb: 3
                  }}
                >
                  Chương trình
                  <br />
                  <span style={{ color: theme.palette.primary.main }}>
                    tiêm phòng tại trường
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
                  Bảo vệ sức khỏe học sinh với chương trình tiêm phòng an toàn, 
                  tiện lợi và đạt chuẩn quốc tế
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="success"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Đăng ký tham gia
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="success"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Xem lịch tiêm
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 500 }}>
                <Box
                  component="img"
                  src="https://domf5oio6qrcr.cloudfront.net/medialibrary/15219/276ebdfb-7e12-479e-a1dc-58801bc4b793.jpg"
                  alt="Vaccination Program"
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
            Điểm nổi bật của chương trình
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

      {/* Benefits Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Lợi ích khi tham gia
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4
            }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.success.main
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Process Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Quy trình tiêm phòng
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[
                'Thông báo lịch tiêm trước 1 tuần',
                'Khám sàng lọc trước khi tiêm',
                'Tiêm phòng với vắc xin chính hãng',
                'Theo dõi phản ứng sau tiêm 30 phút',
                'Ghi nhận kết quả vào sổ tiêm chủng'
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: theme.palette.success.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {step}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Vaccines 
              sx={{ 
                fontSize: 200, 
                color: alpha(theme.palette.success.main, 0.3),
                mb: 2
              }} 
            />
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              An toàn - Hiệu quả - Tiện lợi
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              bgcolor: 'white',
              p: 6,
              borderRadius: 4,
              boxShadow: theme.shadows[8]
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Bảo vệ sức khỏe con em ngay hôm nay
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: 'text.secondary' }}
            >
              Tham gia chương trình tiêm phòng để con có sức khỏe tốt nhất
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 6, 
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.2rem'
              }}
            >
              Đăng ký ngay
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default VaccinationPromo;
