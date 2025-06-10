import React, { useState, useEffect } from "react";
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
  useTheme,
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
  KeyboardArrowRight,
  Article,
  EmojiObjects,
  LocalHospital,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0px 4px 8px rgba(0,0,0,0.05)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0px 8px 16px rgba(0,0,0,0.08)",
    transition: { duration: 0.3 }
  }
};

// List of carousel images for hero section
const carouselImages = [
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmXrkzMSPWbRuxhYPkQadTWRuHfGdzA6ezMPrgs3kZYvF7",
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmRActe6qXHmyn9FJ4A5p6tCj3KotYk4FmBoyoMYZ8ZUx7",
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmdjQwgY2pLnDZSwnA7mb2oATnk1rogYUgGLXGivCTiSb6"
];

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
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();

  // Simulate page loading
  useEffect(() => {
    // Short timeout to ensure animations work properly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Automatic image carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenContactDialog = () => {
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
  };

  // Function to get phone URL safely
  const getPhoneUrl = () => {
    return `tel:${schoolInfo.phone.replace(/\D/g, "")}`;
  };

  // Function to get email URL safely
  const getEmailUrl = () => {
    return `mailto:${schoolInfo.email}`;
  };

  return (
    <Container
      maxWidth="xl"
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        mb: 8, 
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      {/* Hero section with animated elements - inspired by Collider design */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          height: { xs: "60vh", md: "70vh" },
          mb: 8,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          background: "linear-gradient(45deg, #e6f0ff 30%, #f7f9ff 90%)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left content area */}
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            zIndex: 1,
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h5"
              color="#034EA1"
              sx={{ fontWeight: 600, mb: 2, letterSpacing: 1 }}
            >
              TRƯỜNG THPT FSCHOOL
            </Typography>
            <Typography
              component="h1"
              variant="h3"
              color="#032845"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.2,
              }}
            >
              Hệ thống quản lý <br />
              y tế học đường
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                fontSize: "1.1rem", 
                lineHeight: 1.6, 
                mt: 3, 
                mb: 4,
                maxWidth: "500px"
              }}
            >
              Chăm sóc sức khỏe học sinh toàn diện, giúp phát triển thể chất và tinh thần 
              để đạt thành tích học tập tốt nhất.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenContactDialog}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: "none",
                background: "#034EA1",
                color: "white",
                "&:hover": {
                  background: "#023a7a",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }
              }}
            >
              Liên hệ ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderColor: "#034EA1",
                color: "#034EA1",
                "&:hover": {
                  borderColor: "#023a7a",
                  backgroundColor: "rgba(3, 78, 162, 0.04)",
                }
              }}
            >
              Tìm hiểu thêm
            </Button>
          </Stack>
        </Box>

        {/* Right image carousel area */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "55%" },
            height: { xs: "40%", md: "100%" },
            overflow: "hidden",
          }}
        >
          {/* Image carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${carouselImages[currentImageIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </AnimatePresence>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: { xs: "rgba(0,0,0,0.2)", md: "rgba(0,0,0,0.1)" },
              zIndex: 1,
            }}
          />
          
          {/* Decorative elements */}
          <Box
            component={motion.div}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              bottom: 40,
              right: 40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              zIndex: 2,
            }}
          />
          
          <Box
            component={motion.div}
            animate={{
              y: [0, 10, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              delay: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              top: 60,
              left: 60,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              zIndex: 2,
            }}
          />

          {/* Image carousel indicators */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 2,
            }}
          >
            {carouselImages.map((_, index) => (
              <Box
                key={index}
                component={motion.div}
                animate={{
                  scale: currentImageIndex === index ? 1.2 : 1,
                  opacity: currentImageIndex === index ? 1 : 0.6,
                }}
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Key health services section with visual cards - minimal design */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <Box component={motion.div} variants={itemVariants} sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "#032845",
              mb: 5,
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2.25rem" }
            }}
          >
            Dịch vụ Y tế Học Đường
          </Typography>

          <Box 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 3,
              justifyContent: "center" 
            }}
          >
            {schoolInfo.features.map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  width: { 
                    xs: "100%", 
                    sm: "calc(50% - 24px)", 
                    md: "calc(33.333% - 24px)" 
                  },
                  minWidth: { xs: "100%", sm: "280px", md: "280px" },
                  flexGrow: 1,
                }}
              >
                <Card
                  component={motion.div}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "none",
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.02)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        sx={{
                          bgcolor: "rgba(3, 78, 162, 0.1)",
                          borderRadius: "50%",
                          width: 70,
                          height: 70,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#034EA1"
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          fontSize: "large", 
                          sx: { color: "#034EA1" } 
                        })}
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      align="center"
                      gutterBottom
                      sx={{ 
                        fontWeight: 700, 
                        color: "#2D2A24", 
                        mb: 2,
                        fontSize: "1.1rem"
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      align="center"
                      sx={{ color: "text.secondary", lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* About section with a cleaner, minimal design */}
        <Box component={motion.div} variants={itemVariants} sx={{ mb: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: "#032845",
                mb: 5,
                position: "relative",
                display: "inline-block",
              }}
            >
              Giới thiệu
            </Typography>

            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: "row" },
                gap: 5
              }}
            >
              <Box sx={{ flex: "1 1 50%" }}>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                    color: "#424242",
                    mb: 4,
                  }}
                >
                  {schoolInfo.description}
                </Typography>

                <Box
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid rgba(3, 78, 162, 0.2)",
                    background: "white",
                  }}
                >
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        sx={{
                          bgcolor: "rgba(3, 78, 162, 0.1)",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex"
                        }}
                      >
                        <LocationOn sx={{ color: "#034EA1" }} />
                      </Box>
                      <Typography variant="body1" color="#424242">
                        <strong>Địa chỉ:</strong> {schoolInfo.address}
                      </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        sx={{
                          bgcolor: "rgba(3, 78, 162, 0.1)",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex"
                        }}
                      >
                        <Phone sx={{ color: "#034EA1" }} />
                      </Box>
                      <Typography variant="body1" color="#424242">
                        <strong>Điện thoại:</strong> {schoolInfo.phone}
                      </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        sx={{
                          bgcolor: "rgba(3, 78, 162, 0.1)",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex"
                        }}
                      >
                        <Email sx={{ color: "#034EA1" }} />
                      </Box>
                      <Typography variant="body1" color="#424242">
                        <strong>Email:</strong> {schoolInfo.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
              
              <Box sx={{ flex: "1 1 50%" }}>
                <Box
                  component={motion.img}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.01 }}
                  src="https://source.unsplash.com/random/600x400/?school"
                  alt={schoolInfo.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* News and Documents section with minimalist design - update colors */}
        <Box component={motion.div} variants={itemVariants} sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "#032845",
              mb: 5,
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2.25rem" }
            }}
          >
            Tin tức và Tài liệu
          </Typography>

          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" },
              gap: 4
            }}
          >
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}>
              <Paper
                component={motion.div}
                whileHover={{ y: -5 }}
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color="#032845"
                  sx={{
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <Article sx={{ color: "#034EA1" }} />
                  Tài liệu sức khỏe học đường
                </Typography>
                
                <Stack spacing={2}>
                  {schoolInfo.healthDocuments.map((doc, index) => (
                    <Button
                      key={index}
                      component={motion.a}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(3, 78, 162, 0.05)"
                      }}
                      href={doc.link}
                      variant="outlined"
                      sx={{
                        justifyContent: "space-between",
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1.2,
                        px: 2,
                        borderColor: "rgba(3, 78, 162, 0.3)",
                        color: "#424242",
                        fontWeight: 500,
                        transition: "all 0.2s",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#034EA1",
                        }
                      }}
                      endIcon={<KeyboardArrowRight sx={{ color: "#034EA1" }} />}
                    >
                      {doc.title}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Box>
            
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 70%" } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color="#032845"
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Bài viết mới nhất
                </Typography>
                
                {/* Replace Grid with Box + flexbox for blog posts */}
                <Box 
                  sx={{ 
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3
                  }}
                >
                  {schoolInfo.recentPosts.map((post, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        width: { 
                          xs: "100%", 
                          sm: "calc(50% - 12px)", 
                          md: "calc(33.333% - 16px)" 
                        },
                        flexGrow: 1
                      }}
                    >
                      <Card
                        component={motion.div}
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          overflow: "hidden",
                          boxShadow: "none",
                          border: "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={post.image}
                          alt={post.title}
                        />
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: "1rem",
                              color: "#2D2A24",
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "inline-block",
                              bgcolor: "rgba(158, 145, 125, 0.1)",
                              color: "#9E917D",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              mb: 1,
                              fontWeight: 500,
                            }}
                          >
                            {post.date}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ 
                              mt: 1, 
                              color: "#494641",
                              lineHeight: 1.6,
                            }}
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
      </motion.div>

      {/* Call to Action with clean design - update to blue */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        elevation={0}
        sx={{
          p: { xs: 5, md: 8 },
          textAlign: "center",
          borderRadius: 4,
          mb: 6,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #034EA1 0%, #1976d2 100%)",
        }}
      >
        {/* Decorative elements */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 6,
            delay: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <Box sx={{ position: "relative", maxWidth: 800, mx: "auto" }}>
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            color="white"
            fontWeight="800"
            sx={{ 
              fontSize: { xs: "2rem", md: "2.75rem" }, 
              lineHeight: 1.3,
              mb: 3,
            }}
          >
            Hãy cùng chăm sóc sức khỏe cho con em chúng ta
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ 
              maxWidth: 700, 
              mx: "auto", 
              mb: 5, 
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Phụ huynh có thể liên hệ với chúng tôi qua số điện thoại hoặc email
            để được tư vấn chi tiết về các dịch vụ y tế học đường.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenContactDialog}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                bgcolor: "white",
                color: "#034EA1",
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                }
              }}
            >
              Liên hệ ngay
            </Button>
          </motion.div>
        </Box>
      </Paper>

      {/* Dialog hiển thị thông tin liên hệ - update colors */}
      <AnimatePresence>
        {contactDialogOpen && (
          <Dialog
            open={contactDialogOpen}
            onClose={handleCloseContactDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: { 
                borderRadius: 12,
                overflow: "hidden",
                background: "transparent",
                boxShadow: "none"
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                background: "white",
                boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)"
              }}
            >
              <DialogTitle
                sx={{
                  bgcolor: "#034EA1",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Thông tin liên hệ</Typography>
                <motion.div whileHover={{ rotate: 90 }}>
                  <IconButton
                    onClick={handleCloseContactDialog}
                    sx={{ color: "white" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </motion.div>
              </DialogTitle>

              <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={4} sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component={motion.div}
                      whileHover={{ rotate: 15 }}
                      sx={{
                        bgcolor: "rgba(3, 78, 162, 0.1)",
                        p: 1.5,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LocationOn fontSize="large" sx={{ color: "#034EA1" }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Địa chỉ
                      </Typography>
                      <Typography variant="body1">{schoolInfo.address}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component={motion.div}
                      whileHover={{ rotate: 15 }}
                      sx={{
                        bgcolor: "rgba(3, 78, 162, 0.1)",
                        p: 1.5,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Phone fontSize="large" sx={{ color: "#034EA1" }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Điện thoại
                      </Typography>
                      <Button
                        href={getPhoneUrl()}
                        variant="text"
                        sx={{
                          p: 0,
                          textTransform: "none",
                          fontSize: "1rem",
                          color: "#034EA1",
                        }}
                      >
                        {schoolInfo.phone}
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component={motion.div}
                      whileHover={{ rotate: 15 }}
                      sx={{
                        bgcolor: "rgba(3, 78, 162, 0.1)",
                        p: 1.5,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Email fontSize="large" sx={{ color: "#034EA1" }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Email
                      </Typography>
                      <Button
                        href={getEmailUrl()}
                        variant="text"
                        sx={{
                          p: 0,
                          textTransform: "none",
                          fontSize: "1rem",
                          color: "#034EA1",
                        }}
                      >
                        {schoolInfo.email}
                      </Button>
                    </Box>
                  </Box>

                  <Paper
                    component={motion.div}
                    whileHover={{ y: -3 }}
                    sx={{
                      p: 2,
                      bgcolor: "rgba(3, 78, 162, 0.05)",
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "rgba(3, 78, 162, 0.3)",
                    }}
                  >
                    <Typography variant="body1" align="center">
                      Giờ làm việc: Thứ 2 - Thứ 6, 7:30 - 17:00
                    </Typography>
                  </Paper>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 3 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleCloseContactDialog}
                    variant="contained"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: "#034EA1",
                      "&:hover": {
                        bgcolor: "#023a7a",
                      }
                    }}
                  >
                    Đóng
                  </Button>
                </motion.div>
              </DialogActions>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default HomePage;
