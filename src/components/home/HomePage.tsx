import React, { useState } from "react";
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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  HealthAndSafety,
  MedicalServices,
  VaccinesOutlined,
  School,
  FamilyRestroom,
  Phone,
  Email,
  LocationOn,
  Close as CloseIcon,
} from "@mui/icons-material";

// This would normally come from the API
const schoolInfo = {
  name: "Trường THPT Fschool",
  address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  phone: "(028) 3822 XXXX",
  email: "info@fpt.edu.vn",
  description:
    "Trường Fschool là một trong những trường có chất lượng giáo dục hàng đầu tại Việt Nam. Trường luôn đặt sự phát triển toàn diện của học sinh lên hàng đầu với chương trình học hiện đại, đội ngũ giáo viên tận tâm, và cơ sở vật chất tiên tiến.",
  features: [
    {
      title: "Phòng y tế hiện đại",
      description:
        "Được trang bị đầy đủ thiết bị y tế để xử lý các tình huống khẩn cấp.",
      icon: <MedicalServices fontSize="large" color="primary" />,
    },
    {
      title: "Chương trình tiêm chủng",
      description:
        "Thực hiện các chương trình tiêm chủng theo quy định của Bộ Y tế.",
      icon: <VaccinesOutlined fontSize="large" color="primary" />,
    },
    {
      title: "Kiểm tra sức khỏe định kỳ",
      description: "Tổ chức kiểm tra sức khỏe định kỳ cho học sinh mỗi học kỳ.",
      icon: <HealthAndSafety fontSize="large" color="primary" />,
    },
    {
      title: "Đội ngũ y tế chuyên nghiệp",
      description: "Đội ngũ y bác sĩ và y tá có chuyên môn cao, tận tâm.",
      icon: <School fontSize="large" color="primary" />,
    },
    {
      title: "Phối hợp với phụ huynh",
      description:
        "Thường xuyên trao đổi với phụ huynh về tình hình sức khỏe của học sinh.",
      icon: <FamilyRestroom fontSize="large" color="primary" />,
    },
  ],
  healthDocuments: [
    { title: "Hướng dẫn phòng chống dịch COVID-19", link: "#" },
    { title: "Dinh dưỡng học đường", link: "#" },
    { title: "Chăm sóc răng miệng", link: "#" },
    { title: "Phòng chống các bệnh mùa hè", link: "#" },
    { title: "Hướng dẫn chăm sóc thị lực", link: "#" },
  ],
  recentPosts: [
    {
      title: "Kết quả kiểm tra sức khỏe học kỳ 1",
      date: "15/10/2023",
      excerpt:
        "Kết quả kiểm tra sức khỏe định kỳ của học sinh trong học kỳ 1 năm học 2023-2024...",
      image: "https://source.unsplash.com/random/300x200/?health",
    },
    {
      title: "Chương trình tiêm chủng vắc-xin sắp tới",
      date: "05/09/2023",
      excerpt:
        "Nhà trường sẽ tổ chức tiêm chủng vắc-xin phòng bệnh cho học sinh vào ngày...",
      image: "https://source.unsplash.com/random/300x200/?vaccine",
    },
    {
      title: "Hướng dẫn phòng chống bệnh mùa đông",
      date: "01/11/2023",
      excerpt:
        "Với thời tiết chuyển lạnh, phụ huynh cần lưu ý một số biện pháp để bảo vệ sức khỏe học sinh...",
      image: "https://source.unsplash.com/random/300x200/?winter",
    },
  ],
};

const HomePage = () => {
  // State để kiểm soát dialog thông tin liên hệ
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleOpenContactDialog = () => {
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero section với nút liên hệ */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(https://source.unsplash.com/random/1200x400/?school,health&seed=fschool)`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            p: { xs: 3, md: 6 },
          }}
        >
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Hệ thống quản lý y tế học đường
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            {schoolInfo.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" color="primary">
              Tìm hiểu thêm
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
              onClick={handleOpenContactDialog}
            >
              Liên hệ ngay
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Phần Dịch vụ y tế - đưa lên đầu tiên sau banner */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Dịch vụ y tế học đường
        </Typography>
        <Divider sx={{ mb: 3, borderWidth: 2, borderColor: "primary.light" }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {schoolInfo.features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 12px)",
                },
              }}
            >
              <Card
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    align="center"
                    gutterBottom
                  >
                    {feature.title}
                  </Typography>
                  <Typography align="center">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Giới thiệu - cải thiện phần liên hệ */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Giới thiệu
        </Typography>
        <Divider sx={{ mb: 3, borderWidth: 2, borderColor: "primary.light" }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 16px)" } }}>
            <Typography variant="body1" paragraph>
              {schoolInfo.description}
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: 5,
                borderColor: "primary.main",
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocationOn color="primary" />
                  <Typography variant="body1">
                    <strong>Địa chỉ:</strong> {schoolInfo.address}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Phone color="primary" />
                  <Typography variant="body1">
                    <strong>Điện thoại:</strong> {schoolInfo.phone}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Email color="primary" />
                  <Typography variant="body1">
                    <strong>Email:</strong> {schoolInfo.email}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
          <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 16px)" } }}>
            <Box
              component="img"
              src="https://source.unsplash.com/random/600x400/?school"
              alt={schoolInfo.name}
              sx={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Tin tức và Tài liệu - gộp vào một phần */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Tin tức và Tài liệu
        </Typography>
        <Divider sx={{ mb: 3, borderWidth: 2, borderColor: "primary.light" }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box sx={{ flexBasis: { xs: "100%", md: "calc(33.333% - 16px)" } }}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Tài liệu sức khỏe học đường
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {schoolInfo.healthDocuments.map((doc, index) => (
                  <Button
                    key={index}
                    component="a"
                    href={doc.link}
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      borderLeft: 3,
                      borderColor: "primary.main"
                    }}
                  >
                    {doc.title}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Box>
          <Box sx={{ flexBasis: { xs: "100%", md: "calc(66.666% - 16px)" } }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Bài viết mới nhất
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {schoolInfo.recentPosts.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexBasis: {
                        xs: "100%",
                        sm: "calc(50% - 8px)",
                        md: "calc(33.333% - 8px)",
                      },
                    }}
                  >
                    <Card
                      sx={{ height: "100%" }}
                    >
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {post.excerpt}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Cải thiện Call to Action */}
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          mb: 6,
          backgroundImage: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <Box sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            color="white"
            fontWeight="bold"
          >
            Hãy cùng chăm sóc sức khỏe cho con em chúng ta!
          </Typography>
          <Typography
            variant="body1"
            paragraph
            color="white"
            sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
          >
            Phụ huynh có thể liên hệ với chúng tôi qua số điện thoại hoặc email
            để được tư vấn chi tiết về các dịch vụ y tế học đường.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleOpenContactDialog}
            sx={{ px: 4, py: 1, boxShadow: 3 }}
          >
            Liên hệ ngay
          </Button>
        </Box>
      </Paper>

      {/* Dialog hiển thị thông tin liên hệ */}
      <Dialog
        open={contactDialogOpen}
        onClose={handleCloseContactDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Thông tin liên hệ</Typography>
          <IconButton
            onClick={handleCloseContactDialog}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocationOn fontSize="large" color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Địa chỉ
                </Typography>
                <Typography variant="body1">{schoolInfo.address}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone fontSize="large" color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Điện thoại
                </Typography>
                <Button
                  href={`tel:${schoolInfo.phone.replace(/\D/g, "")}`}
                  variant="text"
                  color="primary"
                  sx={{
                    p: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {schoolInfo.phone}
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Email fontSize="large" color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
                <Button
                  href={`mailto:${schoolInfo.email}`}
                  variant="text"
                  color="primary"
                  sx={{
                    p: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {schoolInfo.email}
                </Button>
              </Box>
            </Box>

            <Paper
              sx={{
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" align="center">
                Giờ làm việc: Thứ 2 - Thứ 6, 7:30 - 17:00
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseContactDialog}
            variant="contained"
            color="primary"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
