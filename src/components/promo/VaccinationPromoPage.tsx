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
  Vaccines,
  Shield,
  CalendarMonth,
  Notifications,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VaccinationPromoPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <Vaccines />,
      title: 'Chương trình tiêm phòng đầy đủ',
      description: 'Thực hiện đầy đủ các mũi tiêm phòng theo quy định của Bộ Y tế',
    },
    {
      icon: <CalendarMonth />,
      title: 'Lịch tiêm chính xác',
      description: 'Lập lịch tiêm phòng khoa học, đảm bảo đúng thời điểm và liều lượng',
    },
    {
      icon: <Notifications />,
      title: 'Thông báo kịp thời',
      description: 'Nhắc nhở phụ huynh về lịch tiêm và cập nhật tình hình sau tiêm',
    },
    {
      icon: <Shield />,
      title: 'An toàn tuyệt đối',
      description: 'Tuân thủ nghiêm ngặt quy trình an toàn và vệ sinh y tế',
    },
  ];

  const vaccinationSchedule = [
    {
      age: 'Sơ sinh - 24 tháng',
      vaccines: ['BCG', 'Viêm gan B', 'DPT', 'Bại liệt', 'Hib', 'Phế cầu'],
      status: 'completed',
    },
    {
      age: '18 tháng - 6 tuổi',
      vaccines: ['DPT nhắc lại', 'Bại liệt nhắc lại', 'Sởi - Rubella', 'Viêm não Nhật Bản'],
      status: 'ongoing',
    },
    {
      age: '6 - 11 tuổi',
      vaccines: ['DT nhắc lại', 'Viêm não Nhật Bản nhắc lại', 'HPV (nữ)'],
      status: 'upcoming',
    },
    {
      age: '12 - 18 tuổi',
      vaccines: ['Td nhắc lại', 'HPV (nữ)', 'Viêm màng não'],
      status: 'upcoming',
    },
  ];

  const benefits = [
    {
      title: 'Phòng ngừa bệnh tật',
      description: 'Bảo vệ trẻ khỏi các bệnh truyền nhiễm nguy hiểm',
      icon: <Shield sx={{ color: '#4caf50' }} />,
    },
    {
      title: 'Miễn dịch cộng đồng',
      description: 'Góp phần xây dựng hàng rào miễn dịch cho cộng đồng',
      icon: <Group sx={{ color: '#2196f3' }} />,
    },
    {
      title: 'Phát triển khỏe mạnh',
      description: 'Đảm bảo trẻ phát triển toàn diện về thể chất và tinh thần',
      icon: <School sx={{ color: '#ff9800' }} />,
    },
    {
      title: 'Tuân thủ quy định',
      description: 'Đáp ứng yêu cầu tiêm chủng theo quy định nhập học',
      icon: <VerifiedUser sx={{ color: '#9c27b0' }} />,
    },
  ];

  const testimonials = [
    {
      name: 'Chị Lê Thị Hoa',
      role: 'Phụ huynh học sinh lớp 2A',
      content: 'Rất yên tâm khi trường có chương trình tiêm phòng chuyên nghiệp. Các y tá rất tận tình và chu đáo.',
      rating: 5,
    },
    {
      name: 'Anh Phạm Văn Đức',
      role: 'Phụ huynh học sinh lớp 4B',
      content: 'Con tôi được tiêm phòng đầy đủ và an toàn. Nhà trường thông báo rất kịp thời.',
      rating: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'ongoing':
        return '#ff9800';
      case 'upcoming':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'ongoing':
        return 'Đang thực hiện';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
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
                  Chương trình tiêm phòng{' '}
                  <Box component="span" sx={{ color: '#c8e6c9' }}>
                    toàn diện
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
                  Bảo vệ sức khỏe học sinh với chương trình tiêm phòng khoa học, 
                  an toàn và đầy đủ theo khuyến nghị của Bộ Y tế.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: '#4caf50',
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
                    Xem lịch tiêm
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
                    alt="Vaccination Program"
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
            Ưu điểm chương trình tiêm phòng
          </Typography>
          <Typography variant="h6" sx={{ color: '#546e7a', maxWidth: 600, mx: 'auto' }}>
            Chúng tôi cam kết mang đến dịch vụ tiêm phòng chất lượng cao, 
            an toàn và hiệu quả nhất cho học sinh.
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
                        bgcolor: '#e8f5e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 30, color: '#4caf50' },
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

      {/* Vaccination Schedule Timeline */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: '#263238' }}
            >
              Lịch tiêm phòng theo độ tuổi
            </Typography>
            <Typography variant="h6" sx={{ color: '#546e7a' }}>
              Chương trình tiêm phòng được thiết kế khoa học theo từng độ tuổi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {vaccinationSchedule.map((schedule, index) => (
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
                        bgcolor: getStatusColor(schedule.status),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Vaccines sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <CardContent sx={{ p: 4, pt: 5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#263238' }}>
                          {schedule.age}
                        </Typography>
                        <Chip
                          label={getStatusText(schedule.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(schedule.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Các loại vaccine
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {schedule.vaccines.map((vaccine, vIndex) => (
                          <Chip
                            key={vIndex}
                            label={vaccine}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: getStatusColor(schedule.status),
                              color: getStatusColor(schedule.status),
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: '#263238' }}
          >
            Lợi ích của tiêm phòng
          </Typography>
          <Typography variant="h6" sx={{ color: '#546e7a' }}>
            Tiêm phòng mang lại nhiều lợi ích thiết thực cho sức khỏe và tương lai của trẻ
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#4caf50',
                      boxShadow: '0 8px 32px rgba(76, 175, 80, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ mr: 3, mt: 0.5 }}>
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: '#263238' }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography sx={{ color: '#546e7a', lineHeight: 1.6 }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: '#263238' }}
            >
              Phụ huynh tin tương
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
                            bgcolor: '#4caf50',
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
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
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
              Bắt đầu chương trình tiêm phòng
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Đăng ký ngay để con bạn được tham gia chương trình tiêm phòng 
              toàn diện và khoa học nhất.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: '#4caf50',
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

export default VaccinationPromoPage;
