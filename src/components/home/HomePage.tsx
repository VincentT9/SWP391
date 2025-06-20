import React, { useState, useEffect, useRef } from "react"; // Add useRef import
import {
  Box,
  Container,
  Typography,
  Button,
  Tab,
  Tabs,
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
  GlobalStyles, // Add this import
} from "@mui/material";
import {
  ShoppingCart,
  ArrowForward,
  NavigateBefore,
  NavigateNext,
  East,
  MedicalServices,
  VaccinesOutlined,
  HealthAndSafety,
  School,
  FamilyRestroom,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

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

// School data
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
  ],
  healthDocuments: [
    { title: "Hướng dẫn phòng chống dịch COVID-19", link: "#" },
    { title: "Dinh dưỡng học đường", link: "#" },
    { title: "Chăm sóc răng miệng", link: "#" },
    { title: "Phòng chống các bệnh mùa hè", link: "#" },
  ],
  recentPosts: [
    {
      title: "Kết quả kiểm tra sức khỏe học kỳ 1",
      date: "15/10/2023",
      excerpt:
        "Kết quả kiểm tra sức khỏe định kỳ của học sinh trong học kỳ 1 năm học 2023-2024...",
      image: "https://qtnh.edu.vn/vnt_upload/news/10_2022/IMG_2677.jpg",
    },
    {
      title: "Chương trình tiêm chủng vắc-xin sắp tới",
      date: "05/09/2023",
      excerpt:
        "Nhà trường sẽ tổ chức tiêm chủng vắc-xin phòng bệnh cho học sinh vào ngày...",
      image:
        "https://www.fvhospital.com/wp-content/uploads/2021/07/vaccination-french-2.jpg",
    },
    {
      title: "Hướng dẫn phòng chống bệnh mùa đông",
      date: "01/11/2023",
      excerpt:
        "Với thời tiết chuyển lạnh, phụ huynh cần lưu ý một số biện pháp để bảo vệ sức khỏe học sinh...",
      image:
        "https://benhviennhitrunguong.gov.vn/wp-content/uploads/2022/03/web-canh-bao-dich-benh-mua-dong-xuan-1.png",
    },
  ],
};

// Hero carousel images
const carouselImages = [
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmXrkzMSPWbRuxhYPkQadTWRuHfGdzA6ezMPrgs3kZYvF7",
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmRActe6qXHmyn9FJ4A5p6tCj3KotYk4FmBoyoMYZ8ZUx7",
  "https://musical-indigo-mongoose.myfilebase.com/ipfs/QmdjQwgY2pLnDZSwnA7mb2oATnk1rogYUgGLXGivCTiSb6",
];

// Add a consistent margin size that will be used throughout the page
const pageMargins = { xs: "16px", sm: "24px", md: "40px", lg: "64px" };

const globalStylesContent = {
  html: {
    overflowX: "hidden",
  },
  body: {
    overflowX: "hidden",
    margin: 0,
    padding: 0,
  },
  "::-webkit-scrollbar": {
    display: "none",
  },
  "*": {
    msOverflowStyle: "none" /* IE and Edge */,
    scrollbarWidth: "none" /* Firefox */,
    boxSizing: "border-box",
  },
};

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoaded, setIsLoaded] = useState(false);

  // Add ref for the "We are the best" section
  const bestSectionRef = useRef<HTMLDivElement>(null);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Automatic image carousel - changed from 5000ms to 3000ms (3 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenContactDialog = () => {
    setContactDialogOpen(true);
  };

  // Add scroll handler function
  const handleLearnMoreClick = () => {
    bestSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <GlobalStyles styles={globalStylesContent} />

      <Box
        sx={{
          background: "white",
          color: "#333",
          pb: 4,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: { xs: 0, sm: 0, md: 0, lg: 0 },
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Hero Section - Ensure symmetric margins */}
          <Box
            sx={{
              position: "relative",
              bgcolor: "#002866",
              color: "white",
              borderRadius: { xs: 0, md: "0 0 0 100px" },
              overflow: "hidden",
              mb: 4,
              minHeight: { xs: "80vh", md: "90vh" },
              display: "flex",
              flexDirection: "column",
              mx: {
                xs: pageMargins.xs,
                sm: pageMargins.sm,
                md: pageMargins.md,
                lg: pageMargins.lg,
              },
              width: {
                xs: `calc(100% - ${2 * parseInt(pageMargins.xs)}px)`,
                sm: `calc(100% - ${2 * parseInt(pageMargins.sm)}px)`,
                md: `calc(100% - ${2 * parseInt(pageMargins.md)}px)`,
                lg: `calc(100% - ${2 * parseInt(pageMargins.lg)}px)`,
              },
            }}
          >
            {/* Content Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flexGrow: 1, // Takes available space
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Left Content */}
              <Box
                sx={{
                  width: { xs: "100%", md: "40%" },
                  py: 6,
                  px: { xs: 4, md: 6 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  gutterBottom
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    mb: 3,
                    lineHeight: 1.2,
                  }}
                >
                  Best Caring,
                  <br />
                  <Typography
                    component="span"
                    variant="h3"
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "2.5rem", md: "4rem" },
                    }}
                  >
                    Better Doctors
                  </Typography>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    opacity: 0.8,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                  }}
                >
                  Chăm sóc sức khỏe học sinh toàn diện, giúp phát triển thể chất
                  và tinh thần để đạt thành tích học tập tốt nhất.
                </Typography>

                {/* Call to action buttons - Moved to below the description */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "center", sm: "flex-start" },
                    gap: 2,
                    mt: 0,
                    zIndex: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleLearnMoreClick} // Change from handleOpenContactDialog
                    startIcon={<MedicalServices />}
                    sx={{
                      bgcolor: "#51b848",
                      color: "#002866",
                      px: 3,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#f37021",
                      },
                      borderRadius: 5,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                    }}
                  >
                    TÌM HIỂU THÊM
                  </Button>
                </Box>
              </Box>

              {/* Right Content - Featured Image */}
              <Box
                sx={{
                  width: { xs: "100%", md: "60%" },
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  flexGrow: 1, // Takes available space
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={carouselImages[currentImageIndex]}
                      alt={`Medical professional ${currentImageIndex + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center", // Center the image
                        zIndex: 2,
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay gradient for better text visibility */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #002866 0%, rgba(0,40,102,0.7) 50%, rgba(0,40,102,0) 100%)",
                    zIndex: 3,
                  }}
                />

                {/* Blue circle background */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -150,
                    right: -150,
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    bgcolor: "#034EA2",
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                />
              </Box>
            </Box>

            {/* Remove the old buttons container that was previously here */}

            {/* Image carousel indicators */}
            <Box
              sx={{
                position: "absolute",
                bottom: 15,
                right: 20,
                display: "flex",
                gap: 1,
                zIndex: 10,
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
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: currentImageIndex === index ? "#7ECFB8" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </Box>
          </Box>

          {/* Blue Service Boxes - Symmetric margins */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 6,
              mx: {
                xs: pageMargins.xs,
                sm: pageMargins.sm,
                md: pageMargins.md,
                lg: pageMargins.lg,
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                bgcolor: "#034EA2",
                borderRadius: 3,
                p: 3,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#034EA2",
                }}
              >
                <MedicalServices />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Tư vấn Sức Khỏe
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Tư vấn với bác sĩ chuyên khoa
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: "#034EA2",
                borderRadius: 3,
                p: 3,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#034EA2",
                }}
              >
                <HealthAndSafety />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Đội ngũ chuyên môn
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Y bác sĩ nhiều kinh nghiệm
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Services Section */}
          <Box
            sx={{
              py: 6,
              px: {
                xs: pageMargins.xs,
                sm: pageMargins.sm,
                md: pageMargins.md,
                lg: pageMargins.lg,
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Typography variant="subtitle1" color="primary" fontWeight={500}>
                TRƯỜNG HỌC FSCHOOL
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Extra Ordinary Health Solutions
              </Typography>
              <Typography
                variant="body1"
                sx={{ maxWidth: 600, mx: "auto", color: "text.secondary" }}
              >
                Chăm sóc sức khỏe học sinh toàn diện, giúp phát triển thể chất
                và tinh thần để đạt thành tích học tập tốt nhất.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
                mt: 6,
              }}
            >
              {schoolInfo.features.map((feature, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 3,
                    border: "1px solid #eee",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "#f0f6ff", // Light blue background
                      color: "#034EA2",
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(feature.icon, { fontSize: "large" })}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "#333",
                      fontSize: "1.1rem",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    {feature.description}
                  </Typography>

                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ArrowForward />}
                    sx={{ mt: "auto", textTransform: "none" }}
                  >
                    Chi tiết
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>

          {/* We Are Best Professional - Update to have symmetric margins instead of full width */}
          <Box
            ref={bestSectionRef} // Add this ref
            className="best-section" // Optional class for easier identification
            sx={{
              py: 6,
              bgcolor: "#f9f9f9",
              my: 4,
              mx: {
                xs: pageMargins.xs,
                sm: pageMargins.sm,
                md: pageMargins.md,
                lg: pageMargins.lg,
              },
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Content container with symmetric padding */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  We Are The Best Professionals
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mb: 4 }}>
                  In Medical Sectors
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: { xs: 4, md: 8 },
                  px: { xs: 2, md: 3 }, // Minimal padding
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: "75%" }, // Increased width proportion
                    maxHeight: { md: 650 }, // Taller image container
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="https://cdn.fpt-is.com/vi/asian-doctor-with-stethoscope-around-neck-sitting-office-working-computer-scaled.jpg"
                    alt="Medical Team"
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      objectFit: "cover",
                      height: { md: "100%" },
                    }}
                  />
                </Box>

                <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {schoolInfo.description}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {/* Replace problematic mapping with a direct approach */}
                    {/* Bullet Point 1 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: "#034EA2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body1">
                        Đội ngũ y bác sĩ giỏi chuyên môn
                      </Typography>
                    </Box>

                    {/* Bullet Point 2 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: "#034EA2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body1">
                        Chăm sóc sức khoẻ học sinh toàn diện
                      </Typography>
                    </Box>

                    {/* Bullet Point 3 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: "#034EA2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body1">
                        Trang thiết bị y tế hiện đại
                      </Typography>
                    </Box>

                    {/* Bullet Point 4 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: "#034EA2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body1">
                        Phương pháp khám chữa bệnh tiên tiến
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* News Section */}
          <Box
            sx={{
              py: 5,
              px: {
                xs: pageMargins.xs,
                sm: pageMargins.sm,
                md: pageMargins.md,
                lg: pageMargins.lg,
              },
              bgcolor: "white",
            }}
          >
            {/* Section Title */}
            <Box
              component="div"
              sx={{
                bgcolor: "#023b7a",
                borderRadius: 0,
                display: "inline-block",
                px: 4,
                py: 1.5,
                mb: 5,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 700,
                }}
              >
                TIN TỨC MỚI NHẤT
              </Typography>
            </Box>

            {/* News Cards Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                justifyContent: { xs: "center", md: "space-between" },
                alignItems: "stretch",
              }}
            >
              {schoolInfo.recentPosts.map((post, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    height: "100%",
                    boxShadow: 3,
                    flex: 1,
                    maxWidth: { xs: "100%", md: "32%" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={post.image}
                      alt={post.title}
                    />
                    {/* Date label positioned over the image */}
                    <Box
                      sx={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        bgcolor: "#023b7a",
                        color: "white",
                        py: 0.5,
                        px: 2,
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        borderRadius: 0.5,
                      }}
                    >
                      {post.date}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#034EA2",
                        mb: 1,
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        mt: 1,
                        fontSize: "0.85rem",
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Footer - Update padding to be symmetric */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 6,
              pb: 3,
              px: { xs: 2, md: 4, lg: 6 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    p: 4,
                    bgcolor: "#023b7a",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "white" }}
                  >
                    THÔNG TIN LIÊN HỆ
                  </Typography>

                  <Stack spacing={3} sx={{ mt: 3, color: "white" }}>
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
                          bgcolor: "#51b848",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex",
                        }}
                      >
                        <LocationOn sx={{ color: "white" }} />
                      </Box>
                      <Typography variant="body1">
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
                          bgcolor: "#51b848",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex",
                        }}
                      >
                        <Phone sx={{ color: "white" }} />
                      </Box>
                      <Typography variant="body1">
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
                          bgcolor: "#51b848",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex",
                        }}
                      >
                        <Email sx={{ color: "white" }} />
                      </Box>
                      <Typography variant="body1">
                        <strong>Email:</strong> {schoolInfo.email}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Divider between contact info and bottom section */}
                  <Box
                    sx={{
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      my: 4,
                      pt: 4,
                      width: "100%",
                    }}
                  />

                  {/* Logo and email signup section - moved into blue container */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: { xs: "center", md: "flex-start" },
                      justifyContent: "space-between",
                      gap: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        component="img"
                        src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x"
                        alt="Logo"
                        sx={{
                          height: 40,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ maxWidth: 300, color: "white", opacity: 0.8 }}
                      >
                        Hệ thống quản lý y tế học đường. Chăm sóc sức khỏe học
                        sinh toàn diện, giúp phát triển thể chất và tinh thần.
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: "white" }}>
                        ĐĂNG KÝ
                      </Typography>
                      <Box sx={{ position: "relative", width: 240 }}>
                        <TextField
                          placeholder="NHẬP EMAIL CỦA BẠN"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "white",
                              borderRadius: 0,
                              pr: 5,
                            },
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            height: "100%",
                            bgcolor: "#51b848",
                            borderRadius: 0,
                            "&:hover": {
                              bgcolor: "#f37021",
                            },
                          }}
                        >
                          <ArrowForward sx={{ color: "#034EA2" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ maxWidth: 200, color: "white", opacity: 0.8 }}
                      >
                        Đăng ký để nhận thông tin mới nhất về các sự kiện y tế
                        và chương trình sức khỏe!
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Bottom Bar - Update padding to be symmetric */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              py: 2,
              px: { xs: 2, md: 4, lg: 6 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
              gap: 1,
              textTransform: "uppercase",
              color: "#51b848",
            }}
          >
            <Typography variant="subtitle2">FSCHOOL</Typography>
            <Typography variant="subtitle2">Y TẾ HỌC ĐƯỜNG</Typography>
            <Typography variant="subtitle2">CHĂM SÓC SỨC KHỎE</Typography>
            <Typography variant="subtitle2">FTPMED</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
