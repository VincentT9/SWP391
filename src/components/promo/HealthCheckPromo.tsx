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
  HealthAndSafety,
  Assignment,
  Timeline,
  Psychology,
  Visibility,
  FamilyRestroom,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HealthCheckPromo: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <HealthAndSafety sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Khám sức khỏe toàn diện',
      description: 'Kiểm tra tổng quát về chiều cao, cân nặng, thị lực, răng miệng'
    },
    {
      icon: <Assignment sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Hồ sơ sức khỏe số',
      description: 'Lưu trữ và theo dõi lịch sử sức khỏe học sinh một cách hệ thống'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      title: 'Theo dõi phát triển',
      description: 'Biểu đồ tăng trưởng và phát triển thể chất theo từng giai đoạn'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      title: 'Tư vấn chuyên nghiệp',
      description: 'Bác sĩ tư vấn về dinh dưỡng và chế độ sinh hoạt phù hợp'
    },
    {
      icon: <Visibility sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: 'Phát hiện sớm',
      description: 'Sàng lọc và phát hiện sớm các vấn đề sức khỏe tiềm ẩn'
    },
    {
      icon: <FamilyRestroom sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Báo cáo cho phụ huynh',
      description: 'Thông báo kết quả khám và khuyến nghị chi tiết cho gia đình'
    }
  ];

  const checkupItems = [
    {
      category: 'Thể chất',
      items: ['Chiều cao', 'Cân nặng', 'BMI', 'Vòng ngực', 'Tư thế']
    },
    {
      category: 'Thị giác',
      items: ['Thị lực', 'Khúc xạ', 'Nhãn áp', 'Màu sắc', 'Vận động mắt']
    },
    {
      category: 'Răng miệng',
      items: ['Sâu răng', 'Cao răng', 'Nướu', 'Cắn khớp', 'Vệ sinh']
    },
    {
      category: 'Tổng quát',
      items: ['Tim mạch', 'Hô hấp', 'Tiêu hóa', 'Thần kinh', 'Da liễu']
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.info.main, 0.1),
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
                    color: theme.palette.info.main,
                    mb: 3
                  }}
                >
                  Kiểm tra sức khỏe
                  <br />
                  <span style={{ color: theme.palette.primary.main }}>
                    định kỳ
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
                  Chương trình khám sức khỏe định kỳ toàn diện, đảm bảo sự phát triển 
                  khỏe mạnh của học sinh
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Đăng ký khám
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="info"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Xem kết quả
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 500 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: theme.shadows[10]
                  }}
                >
                  <HealthAndSafety 
                    sx={{ 
                      fontSize: 150, 
                      color: theme.palette.info.main,
                      opacity: 0.7
                    }} 
                  />
                </Box>
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
            Dịch vụ chăm sóc sức khỏe toàn diện
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

      {/* Checkup Items Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Nội dung khám sức khỏe
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4
            }}
          >
            {checkupItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: theme.shadows[4],
                    height: '100%',
                    border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    '&:hover': {
                      borderColor: theme.palette.info.main,
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.info.main,
                      textAlign: 'center',
                      mb: 3
                    }}
                  >
                    {item.category}
                  </Typography>
                  <Stack spacing={1}>
                    {item.items.map((checkItem, itemIndex) => (
                      <Box
                        key={itemIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.05)
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.info.main
                          }}
                        />
                        <Typography variant="body2">
                          {checkItem}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 4 }}
            >
              Tại sao nên khám sức khỏe định kỳ?
            </Typography>
            <Stack spacing={3}>
              {[
                {
                  title: 'Phát hiện sớm vấn đề sức khỏe',
                  description: 'Giúp điều trị kịp thời, hiệu quả và tiết kiệm chi phí'
                },
                {
                  title: 'Theo dõi phát triển thể chất',
                  description: 'Đánh giá tình trạng dinh dưỡng và tăng trưởng của con'
                },
                {
                  title: 'Tư vấn lối sống lành mạnh',
                  description: 'Hướng dẫn chế độ ăn uống và tập luyện phù hợp'
                },
                {
                  title: 'Yên tâm cho phụ huynh',
                  description: 'Cập nhật tình trạng sức khỏe con em thường xuyên'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.info.main,
                        mb: 1
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Assignment 
              sx={{ 
                fontSize: 200, 
                color: alpha(theme.palette.info.main, 0.3),
                mb: 2
              }} 
            />
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              Sức khỏe là tài sản quý giá nhất
            </Typography>
          </Box>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), py: 8 }}>
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
              Đặt lịch khám sức khỏe ngay hôm nay
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: 'text.secondary' }}
            >
              Chăm sóc sức khỏe con từ hôm nay để có tương lai tươi sáng
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                color="info"
                onClick={() => navigate('/register')}
                sx={{ 
                  px: 6, 
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.2rem'
                }}
              >
                Đăng ký khám
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="info"
                onClick={() => navigate('/health-check')}
                sx={{ 
                  px: 6, 
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.2rem'
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HealthCheckPromo;
