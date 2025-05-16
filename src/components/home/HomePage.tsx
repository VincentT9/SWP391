import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  HealthAndSafety,
  MedicalServices,
  VaccinesOutlined,
  School,
  FamilyRestroom
} from '@mui/icons-material';

// This would normally come from the API
const schoolInfo = {
  name: 'Trường THCS Nguyễn Huệ',
  address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
  phone: '(028) 3822 XXXX',
  email: 'info@nguyenhue.edu.vn',
  description: 'Trường THCS Nguyễn Huệ là một trong những trường có chất lượng giáo dục hàng đầu tại TP. Hồ Chí Minh. Trường luôn đặt sức khỏe của học sinh lên hàng đầu với đội ngũ y tế chuyên nghiệp và trang thiết bị hiện đại.',
  features: [
    {
      title: 'Phòng y tế hiện đại',
      description: 'Được trang bị đầy đủ thiết bị y tế để xử lý các tình huống khẩn cấp.',
      icon: <MedicalServices fontSize="large" color="primary" />
    },
    {
      title: 'Chương trình tiêm chủng',
      description: 'Thực hiện các chương trình tiêm chủng theo quy định của Bộ Y tế.',
      icon: <VaccinesOutlined fontSize="large" color="primary" />
    },
    {
      title: 'Kiểm tra sức khỏe định kỳ',
      description: 'Tổ chức kiểm tra sức khỏe định kỳ cho học sinh mỗi học kỳ.',
      icon: <HealthAndSafety fontSize="large" color="primary" />
    },
    {
      title: 'Đội ngũ y tế chuyên nghiệp',
      description: 'Đội ngũ y bác sĩ và y tá có chuyên môn cao, tận tâm.',
      icon: <School fontSize="large" color="primary" />
    },
    {
      title: 'Phối hợp với phụ huynh',
      description: 'Thường xuyên trao đổi với phụ huynh về tình hình sức khỏe của học sinh.',
      icon: <FamilyRestroom fontSize="large" color="primary" />
    }
  ],
  healthDocuments: [
    { title: 'Hướng dẫn phòng chống dịch COVID-19', link: '#' },
    { title: 'Dinh dưỡng học đường', link: '#' },
    { title: 'Chăm sóc răng miệng', link: '#' },
    { title: 'Phòng chống các bệnh mùa hè', link: '#' },
    { title: 'Hướng dẫn chăm sóc thị lực', link: '#' }
  ],
  recentPosts: [
    { 
      title: 'Kết quả kiểm tra sức khỏe học kỳ 1', 
      date: '15/10/2023',
      excerpt: 'Kết quả kiểm tra sức khỏe định kỳ của học sinh trong học kỳ 1 năm học 2023-2024...',
      image: 'https://source.unsplash.com/random/300x200/?health'
    },
    { 
      title: 'Chương trình tiêm chủng vắc-xin sắp tới', 
      date: '05/09/2023',
      excerpt: 'Nhà trường sẽ tổ chức tiêm chủng vắc-xin phòng bệnh cho học sinh vào ngày...',
      image: 'https://source.unsplash.com/random/300x200/?vaccine'
    },
    { 
      title: 'Hướng dẫn phòng chống bệnh mùa đông', 
      date: '01/11/2023',
      excerpt: 'Với thời tiết chuyển lạnh, phụ huynh cần lưu ý một số biện pháp để bảo vệ sức khỏe học sinh...',
      image: 'https://source.unsplash.com/random/300x200/?winter'
    }
  ]
};

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://source.unsplash.com/random/1200x400/?school,health)`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
          }}
        >
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Hệ thống quản lý y tế học đường
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            {schoolInfo.name}
          </Typography>
          <Button variant="contained" color="primary">
            Tìm hiểu thêm
          </Button>
        </Box>
      </Paper>

      {/* School Information */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Giới thiệu
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flexBasis: { xs: '100%', md: 'calc(50% - 16px)' } }}>
            <Typography variant="body1" paragraph>
              {schoolInfo.description}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Địa chỉ:</strong> {schoolInfo.address} <br />
              <strong>Điện thoại:</strong> {schoolInfo.phone} <br />
              <strong>Email:</strong> {schoolInfo.email}
            </Typography>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', md: 'calc(50% - 16px)' } }}>
            <Box component="img" 
              src="https://source.unsplash.com/random/600x400/?school" 
              alt={schoolInfo.name}
              sx={{ 
                width: '100%', 
                maxHeight: 300, 
                objectFit: 'cover',
                borderRadius: 2
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Dịch vụ y tế học đường
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {schoolInfo.features.map((feature, index) => (
            <Box 
              key={index}
              sx={{ 
                flexBasis: { 
                  xs: '100%', 
                  sm: 'calc(50% - 12px)', 
                  md: 'calc(33.333% - 12px)' 
                } 
              }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Health Resources and Blog */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
        <Box sx={{ flexBasis: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <Typography variant="h5" gutterBottom>
            Tài liệu sức khỏe học đường
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {schoolInfo.healthDocuments.map((doc, index) => (
              <Button 
                key={index}
                component="a" 
                href={doc.link}
                variant="outlined" 
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                {doc.title}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flexBasis: { xs: '100%', md: 'calc(66.666% - 16px)' } }}>
          <Typography variant="h5" gutterBottom>
            Bài viết mới nhất
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {schoolInfo.recentPosts.map((post, index) => (
              <Box 
                key={index} 
                sx={{ 
                  flexBasis: { 
                    xs: '100%', 
                    sm: 'calc(50% - 8px)', 
                    md: 'calc(33.333% - 8px)' 
                  } 
                }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Call to Action */}
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mb: 6, backgroundColor: 'primary.light' }}>
        <Typography variant="h5" component="div" gutterBottom color="white">
          Hãy cùng chăm sóc sức khỏe cho con em chúng ta!
        </Typography>
        <Typography variant="body1" paragraph color="white">
          Phụ huynh có thể liên hệ với chúng tôi qua số điện thoại hoặc email để được tư vấn.
        </Typography>
        <Button variant="contained" color="secondary">
          Liên hệ ngay
        </Button>
      </Paper>
    </Container>
  );
};

export default HomePage; 