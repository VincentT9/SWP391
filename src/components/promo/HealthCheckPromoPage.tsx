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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  HealthAndSafety,
  MonitorHeart,
  Visibility,
  Height,
  Scale,
  CheckCircle,
  School,
  MedicalServices,
  Assignment,
  VerifiedUser,
  AccessTime,
  Group,
  Star,
  EventNote,
  LocalHospital,
  Security,
  Timeline,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HealthCheckPromoPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <HealthAndSafety />,
      title: 'Khám tổng quát định kỳ',
      description: 'Thực hiện khám sức khỏe toàn diện theo quy định của Bộ GD-ĐT',
    },
    {
      icon: <MonitorHeart />,
      title: 'Theo dõi chỉ số sức khỏe',
      description: 'Giám sát thường xuyên các chỉ số phát triển thể chất và tinh thần',
    },
    {
      icon: <Assessment />,
      title: 'Báo cáo chi tiết',
      description: 'Cung cấp báo cáo sức khỏe chi tiết và khuyến nghị chuyên môn',
    },
    {
      icon: <TrendingUp />,
      title: 'Phát hiện sớm vấn đề',
      description: 'Phát hiện sớm các vấn đề sức khỏe để can thiệp kịp thời',
    },
  ];

  const healthCheckItems = [
    {
      category: 'Thể chất',
      items: ['Chiều cao', 'Cân nặng', 'BMI', 'Vòng ngực', 'Tư thế'],
      color: '#2196f3',
      icon: <Scale />,
    },
    {
      category: 'Thị lực',
      items: ['Khúc xạ', 'Thị lực xa', 'Thị lực gần', 'Màu sắc'],
      color: '#4caf50',
      icon: <Visibility />,
    },
    {
      category: 'Tim mạch',
      items: ['Nhịp tim', 'Huyết áp', 'Thổi tim', 'Điện tâm đồ'],
      color: '#f44336',
      icon: <MonitorHeart />,
    },
    {
      category: 'Tổng quát',
      items: ['Da', 'Tai mũi họng', 'Răng miệng', 'Cột sống'],
      color: '#ff9800',
      icon: <HealthAndSafety />,
    },
  ];

  const checkupProcess = [
    {
      title: 'Đăng ký lịch khám',
      description: 'Phụ huynh đăng ký lịch khám sức khỏe định kỳ cho con',
    },
    {
      title: 'Chuẩn bị trước khám',
      description: 'Chuẩn bị hồ sơ y tế và thông tin cần thiết',
    },
    {
      title: 'Thực hiện khám',
      description: 'Đội ngũ y bác sĩ chuyên nghiệp thực hiện khám tổng quát',
    },
    {
      title: 'Nhận kết quả',
      description: 'Nhận báo cáo sức khỏe chi tiết và tư vấn từ bác sĩ',
    },
    {
      title: 'Theo dõi sau khám',
      description: 'Theo dõi sức khỏe và thực hiện các khuyến nghị y tế',
    },
  ];

  const benefits = [
    {
      title: 'Phát hiện sớm bệnh tật',
      description: 'Phát hiện sớm các vấn đề sức khỏe để điều trị kịp thời',
      percentage: 95,
      color: '#4caf50',
    },
    {
      title: 'Theo dõi phát triển',
      description: 'Giám sát quá trình phát triển thể chất và tinh thần',
      percentage: 88,
      color: '#2196f3',
    },
    {
      title: 'Tư vấn dinh dưỡng',
      description: 'Đưa ra khuyến nghị về chế độ ăn uống phù hợp',
      percentage: 92,
      color: '#ff9800',
    },
    {
      title: 'Phòng ngừa bệnh tật',
      description: 'Tư vấn các biện pháp phòng ngừa và bảo vệ sức khỏe',
      percentage: 90,
      color: '#9c27b0',
    },
  ];

  const testimonials = [
    {
      name: 'Chị Nguyễn Thị Lan',
      role: 'Phụ huynh học sinh lớp 1B',
      content: 'Chương trình khám sức khỏe định kỳ rất chu đáo. Các bác sĩ tận tình và báo cáo rất chi tiết.',
      rating: 5,
    },
    {
      name: 'Anh Trần Minh Tuấn',
      role: 'Phụ huynh học sinh lớp 3A',
      content: 'Rất hài lòng với dịch vụ. Nhờ có khám định kỳ mà phát hiện sớm vấn đề thị lực của con.',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
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
                  Kiểm tra sức khỏe{' '}
                  <Box component="span" sx={{ color: '#90caf9' }}>
                    định kỳ
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
                  Chăm sóc sức khỏe toàn diện cho học sinh với chương trình 
                  khám sức khỏe định kỳ chuyên nghiệp và khoa học.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: '#2196f3',
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
                    Xem quy trình
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
                    alt="Health Check Program"
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
            Dịch vụ khám sức khỏe toàn diện
          </Typography>
          <Typography variant="h6" sx={{ color: '#546e7a', maxWidth: 600, mx: 'auto' }}>
            Chúng tôi cung cấp dịch vụ khám sức khỏe định kỳ chuyên nghiệp, 
            đảm bảo theo dõi và chăm sóc sức khỏe tốt nhất cho học sinh.
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
                        sx: { fontSize: 30, color: '#2196f3' },
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

      {/* Health Check Items */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: '#263238' }}
            >
              Nội dung kiểm tra sức khỏe
            </Typography>
            <Typography variant="h6" sx={{ color: '#546e7a' }}>
              Chương trình khám sức khỏe toàn diện bao gồm tất cả các hạng mục quan trọng
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {healthCheckItems.map((item, index) => (
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
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        left: 20,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { color: 'white', fontSize: 30 },
                      })}
                    </Box>
                    <CardContent sx={{ p: 4, pt: 5 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: '#263238', mb: 3 }}
                      >
                        {item.category}
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {item.items.map((checkItem, itemIndex) => (
                          <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircle sx={{ color: item.color, fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={checkItem}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.95rem',
                                  color: '#546e7a',
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Process Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: '#263238' }}
          >
            Quy trình khám sức khỏe
          </Typography>
          <Typography variant="h6" sx={{ color: '#546e7a' }}>
            Quy trình khám sức khỏe được thiết kế khoa học và thuận tiện
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Stepper activeStep={-1} orientation="vertical">
            {checkupProcess.map((step, index) => (
              <Step key={index} expanded>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#263238',
                    },
                  }}
                >
                  {step.title}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: '#546e7a', lineHeight: 1.6, pb: 2 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Container>

      {/* Benefits with Progress */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: '#263238' }}
            >
              Hiệu quả đạt được
            </Typography>
            <Typography variant="h6" sx={{ color: '#546e7a' }}>
              Những lợi ích thiết thực từ chương trình khám sức khỏe định kỳ
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: '#263238', flexGrow: 1 }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: benefit.color }}
                        >
                          {benefit.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={benefit.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 2,
                          bgcolor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: benefit.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography sx={{ color: '#546e7a', lineHeight: 1.6 }}>
                        {benefit.description}
                      </Typography>
                    </CardContent>
                  </Card>
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
            Phản hồi từ phụ huynh
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
                          bgcolor: '#2196f3',
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
          background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
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
              Bắt đầu chăm sóc sức khỏe
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Đăng ký ngay để con bạn được tham gia chương trình kiểm tra 
              sức khỏe định kỳ chuyên nghiệp và toàn diện nhất.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: '#2196f3',
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
              Đăng ký ngay
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HealthCheckPromoPage;
