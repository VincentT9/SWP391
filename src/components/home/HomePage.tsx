import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
  Divider,
  GlobalStyles,
  alpha,
  Chip,
} from "@mui/material";
import {
  ArrowForward,
  MedicalServices,
  VaccinesOutlined,
  HealthAndSafety,
  School,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  CalendarMonth,
  KeyboardArrowRight,
  Check,
  NotificationsActive,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Modern healthcare-focused color palette matching MainLayout
const colors = {
  primary: "#1e88e5", // Vibrant blue
  primaryLight: "#6ab7ff",
  primaryDark: "#005cb2",
  secondary: "#00b0ff", // Light blue accent
  secondaryLight: "#69e2ff",
  secondaryDark: "#0081cb",
  success: "#4caf50", // Green for success states
  warning: "#ff9800", // Orange for warnings
  error: "#f44336", // Red for errors
  text: "#263238", // Dark text for readability
  textSecondary: "#546e7a", // Secondary text
  background: "#f8fafd", // Light background with a slight blue tint
  backgroundDark: "#ffffff", // Card backgrounds
  divider: "#e0e0e0", // Divider color
  badge: "#ff1744", // Bright red for notification badges
};

// School data
const schoolInfo = {
  name: "FPTMED",
  address: "Lô E2a-7, Đường D1 Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh",
  phone: "(+84) 28 7300 2222",
  email: "info@fpt.edu.vn",
  description:
    "FPTMED là hệ thống quản lý y tế học đường hiện đại, cho phép giám sát sức khỏe học sinh toàn diện. Hệ thống giúp nhà trường, y tá và phụ huynh theo dõi tình hình sức khỏe, đảm bảo môi trường học tập an toàn và phát triển toàn diện cho học sinh.",
  features: [
    {
      title: "Phòng y tế tiên tiến",
      description:
        "Được trang bị thiết bị y tế hiện đại để xử lý mọi tình huống khẩn cấp.",
      icon: <MedicalServices />,
    },
    {
      title: "Quản lý tiêm chủng",
      description:
        "Theo dõi và quản lý lịch tiêm chủng của từng học sinh theo quy định.",
      icon: <VaccinesOutlined />,
    },
    {
      title: "Khám sức khỏe định kỳ",
      description: "Tổ chức kiểm tra sức khỏe định kỳ và theo dõi phát triển.",
      icon: <HealthAndSafety />,
    },
    {
      title: "Y tá chuyên trách",
      description: "Đội ngũ y tá và cán bộ y tế có chuyên môn cao, luôn sẵn sàng hỗ trợ.",
      icon: <School />,
    },
  ],
  events: [
    {
      title: "Khám sức khỏe đầu năm học",
      date: "25/06/2025",
      location: "Phòng Y tế",
      description: "Khám sức khỏe tổng quát cho học sinh các lớp 10.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=580&auto=format",
    },
    {
      title: "Tiêm vắc xin phòng bệnh",
      date: "30/06/2025",
      location: "Phòng Y tế",
      description: "Tiêm vắc xin phòng bệnh theo kế hoạch của Bộ Y tế.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=580&auto=format",
    },
    {
      title: "Tư vấn dinh dưỡng học đường",
      date: "02/07/2025",
      location: "Hội trường",
      description: "Chuyên gia dinh dưỡng tư vấn về chế độ ăn uống hợp lý cho học sinh.",
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=580&auto=format",
    },
  ],
  stats: [
    { number: "2,500+", label: "Học sinh" },
    { number: "99%", label: "Hài lòng" },
    { number: "24/7", label: "Hỗ trợ" },
    { number: "100%", label: "An toàn" },
  ],
};

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const featuresRef = useRef<HTMLDivElement>(null);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: colors.background, minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 4, md: 8 },
          pb: { xs: 10, md: 12 },
        }}
      >
        {/* Background gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `linear-gradient(135deg, ${alpha(colors.primary, 0.05)} 0%, ${alpha(colors.secondaryLight, 0.07)} 100%)`,
            zIndex: -1,
          }}
        />

        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha(colors.primary, 0.07)} 0%, ${alpha(colors.secondaryLight, 0.07)} 100%)`,
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha(colors.secondaryLight, 0.05)} 0%, ${alpha(colors.primary, 0.07)} 100%)`,
            zIndex: -1,
          }}
        />

        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center',
            gap: 4
          }}>
            {/* Left side content */}
            <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Chip 
                  label="Y TẾ HỌC ĐƯỜNG CHẤT LƯỢNG CAO" 
                  color="primary" 
                  size="small"
                  sx={{ mb: 2, fontWeight: 600, borderRadius: 1 }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    mb: 2,
                    color: colors.text,
                    lineHeight: 1.2,
                  }}
                >
                  Chăm sóc{" "}
                  <Box
                    component="span"
                    sx={{
                      position: "relative",
                      color: colors.primary,
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -2,
                        left: 0,
                        width: "100%",
                        height: "30%",
                        background: `linear-gradient(transparent 40%, ${alpha(colors.primary, 0.2)} 40%)`,
                        zIndex: -1,
                      },
                    }}
                  >
                    sức khỏe
                  </Box>{" "}
                  học đường toàn diện
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    mb: 4,
                    color: colors.textSecondary,
                    maxWidth: "90%",
                  }}
                >
                  Hệ thống quản lý y tế học đường thông minh, giúp theo dõi sức khỏe và
                  phòng ngừa dịch bệnh cho học sinh một cách hiệu quả.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleExploreClick}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: colors.primary,
                      boxShadow: `0 8px 25px ${alpha(colors.primary, 0.3)}`,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: colors.primaryDark,
                        boxShadow: `0 10px 30px ${alpha(colors.primary, 0.4)}`,
                      },
                    }}
                  >
                    Khám phá ngay
                  </Button>
                  
                </Stack>

                {/* Stats */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    mt: 8,
                    mb: { xs: 4, md: 0 },
                    gap: { xs: 3, md: 4 },
                  }}
                >
                  {schoolInfo.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    >
                      <Box sx={{ textAlign: "center", minWidth: 100 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: colors.primary,
                            mb: 0.5,
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.textSecondary }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>

            {/* Hero image */}
            <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      width: "90%",
                      height: "90%",
                      top: "10%",
                      left: "10%",
                      borderRadius: 4,
                      bgcolor: alpha(colors.primary, 0.1),
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://cdn.fpt-is.com/vi/asian-doctor-with-stethoscope-around-neck-sitting-office-working-computer-scaled.jpg"
                    alt="School Health Services"
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 4,
                      boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        ref={featuresRef}
        sx={{
          py: { xs: 8, md: 12 },
          background: "#fff",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                color: colors.primary,
                letterSpacing: 1,
                mb: 1,
              }}
            >
              Tính năng nổi bật
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 2, color: colors.text }}
            >
              Giải pháp Y tế học đường toàn diện
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 700,
                mx: "auto",
                color: colors.textSecondary,
              }}
            >
              Hệ thống cung cấp đầy đủ các tính năng giúp quản lý sức khỏe học sinh
              hiệu quả, đảm bảo môi trường học tập an toàn và lành mạnh.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              flexWrap: 'wrap', 
              mx: -2 
            }}
          >
            {schoolInfo.features.map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  width: { xs: '100%', sm: '50%', md: '25%' }, 
                  px: 2,
                  mb: 4 
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      height: "100%",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: 2,
                          bgcolor: alpha(colors.primary, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: colors.primary,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: "2rem" },
                        })}
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${alpha(colors.primary, 0.04)} 0%, ${alpha(colors.secondaryLight, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
          }}>
            {/* Text content */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: colors.text,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Đội ngũ y tế chuyên nghiệp, trang thiết bị hiện đại
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: colors.textSecondary }}
                >
                  {schoolInfo.description}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  {[
                    "Đội ngũ y bác sĩ có trình độ chuyên môn cao",
                    "Phòng y tế được trang bị đầy đủ thiết bị",
                    "Hệ thống theo dõi sức khỏe học sinh thông minh",
                    "Kết nối trực tiếp với phụ huynh và giáo viên",
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Check
                        sx={{
                          mr: 1.5,
                          color: colors.success,
                          bgcolor: alpha(colors.success, 0.1),
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      />
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </motion.div>
            </Box>

            {/* Image content */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                sx={{
                  width: "100%",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: -15,
                    right: -15,
                    width: "70%",
                    height: "90%",
                    border: `2px solid ${colors.primary}`,
                    borderRadius: 4,
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://matquocte.vn/wp-content/uploads/2023/08/gioi-thieu-doi-ngu-dnd-scaled.webp"
                  alt="Medical Team"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 4,
                    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                color: colors.primary,
                letterSpacing: 1,
                mb: 1,
              }}
            >
              Sắp diễn ra
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 2, color: colors.text }}
            >
              Sự kiện y tế
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 700,
                mx: "auto",
                color: colors.textSecondary,
              }}
            >
              Các sự kiện y tế sắp diễn ra tại trường giúp chăm sóc và nâng cao sức khỏe
              cho học sinh.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'wrap',
              mx: -2
            }}
          >
            {schoolInfo.events.map((event, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: '50%', md: '33.33%' },
                  px: 2,
                  mb: 4
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          icon={<CalendarMonth />}
                          label={event.date}
                          size="small"
                          sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}
                        />
                        <Chip
                          icon={<LocationOn />}
                          label={event.location}
                          size="small"
                          sx={{ bgcolor: alpha(colors.secondary, 0.1), color: colors.secondary }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {event.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {event.description}
                      </Typography>

                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        endIcon={<KeyboardArrowRight />}
                        sx={{ textTransform: "none", fontWeight: 500 }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              component={Link}
              to="/medical-events"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 4,
              }}
            >
              Xem tất cả sự kiện
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 10 },
          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* Background circles */}
        <Box
          sx={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 100,
            bottom: -150,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />

        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center'
          }}>
            {/* CTA text */}
            <Box sx={{ width: { xs: '100%', md: '60%' }, mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "2.75rem" } }}
              >
                Bắt đầu sử dụng nền tảng <br /> Y tế học đường ngay hôm nay
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, opacity: 0.9, fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Hãy tham gia cùng hàng nghìn trường học đang sử dụng nền tảng của
                chúng tôi để nâng cao chất lượng chăm sóc sức khỏe học sinh.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: "white",
                    color: colors.primary,
                    px: 4,
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Đăng ký ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/contact"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                    textTransform: "none",
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Liên hệ tư vấn
                </Button>
              </Box>
            </Box>
            
            {/* CTA logo */}
            <Box sx={{ width: { xs: '100%', md: '40%' }, display: { xs: "none", md: "block" } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <Box
                  component="img"
                  src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x"
                  alt="FPTMED"
                  sx={{
                   
                    width: "100%",
                    maxWidth: 250,
                    mx: "auto",
                    display: "block",
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: colors.backgroundDark,
          py: 6,
          borderTop: `1px solid ${colors.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            mx: -2
          }}>
            {/* Company info */}
            <Box sx={{ width: { xs: '100%', md: '40%' }, px: 2, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color={colors.primary} fontWeight={700} gutterBottom>
                  {schoolInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nền tảng quản lý y tế học đường hiện đại hàng đầu Việt Nam, giúp chăm sóc sức khỏe học sinh toàn diện.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                    (social) => (
                      <IconButton
                        key={social}
                        size="small"
                        sx={{
                          color: colors.primary,
                          "&:hover": { bgcolor: alpha(colors.primary, 0.1) },
                        }}
                      >
                        {/* <Box
                          component="img"
                          src={`https://source.unsplash.com/random/20x20?${social}`}
                          sx={{ width: 20, height: 20, borderRadius: "50%" }}
                        /> */}
                      </IconButton>
                    )
                  )}
                </Box>
              </Box>
            </Box>

            {/* Contact info */}
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2, mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="subtitle2"
                color={colors.text}
                fontWeight={600}
                gutterBottom
              >
                Liên hệ
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                <Box component="li" sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn
                      fontSize="small"
                      sx={{ color: colors.primary, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {schoolInfo.address}
                    </Typography>
                  </Box>
                </Box>
                <Box component="li" sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Phone
                      fontSize="small"
                      sx={{ color: colors.primary, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {schoolInfo.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box component="li" sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email
                      fontSize="small"
                      sx={{ color: colors.primary, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {schoolInfo.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Newsletter */}
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '35%' }, px: 2 }}>
              <Typography
                variant="subtitle2"
                color={colors.text}
                fontWeight={600}
                gutterBottom
              >
                Đăng ký nhận tin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nhận thông báo về các sự kiện y tế sắp tới và tin tức sức khỏe học đường.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Email của bạn"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: alpha(colors.primary, 0.05),
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: colors.primary,
                    color: "white",
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "center" },
              gap: 1,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} FPTMED. Bản quyền thuộc về FPT Software.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                component={Link}
                to="/privacy"
                sx={{ textDecoration: "none" }}
              >
                Chính sách bảo mật
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                component={Link}
                to="/terms"
                sx={{ textDecoration: "none" }}
              >
                Điều khoản sử dụng
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;