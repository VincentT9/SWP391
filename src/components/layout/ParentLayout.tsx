import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  ListItemText,
  alpha,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";

// FPT Healthcare colors matching theme
const colors = {
  primary: "#2980b9", // FPT Blue
  primaryLight: "#5dade2",
  primaryDark: "#1b4f72",
  secondary: "#2980b9", // FPT Orange
  secondaryLight: "#f4b350",
  secondaryDark: "#d68910",
  success: "#2ecc71", // FPT Green
  warning: "#2980b9", // FPT Orange variant
  error: "#2980b9", // FPT Red
  text: "#2c3e50", // Dark text for readability
  textSecondary: "#7f8c8d", // Secondary text
  background: "#f8f9fa", // Clean light background
  backgroundDark: "#ffffff", // Card backgrounds
  divider: "#ecf0f1", // Divider color
  badge: "#2980b9", // FPT Red for notification badges
};

const menuItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Hồ sơ sức khỏe", path: "/health-records" },
  { label: "Sự kiện y tế", path: "/medical-events" },
  { label: "Gửi thuốc", path: "/medication" },
  { label: "Phiếu đồng ý", path: "/consent-forms" },
  // { label: "Tiêm phòng", path: "/vaccination" },
  { label: "Thông báo", path: "/notifications" },
];

const ParentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleUserMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar - Blue background matching homepage */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: colors.primary,
          color: "white",
          boxShadow: `0 4px 20px rgba(0,0,0,0.08)`,
          borderBottom: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo - matching homepage style */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mr: 4,
              }}
            >
              <Box
                component="img"
                src="https://musical-indigo-mongoose.myfilebase.com/ipfs/Qmf9vib7J7Rm85u4CTK5WCXXTQ6dxzoKWjwCrkVjiXhT35"
                alt="FPT"
                sx={{
                  height: { xs: 45, md: 55 },
                  width: "auto",
                }}
              />
            </Box>

            {/* Navigation Menu */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, md: 2 },
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path)
                        ? "white"
                        : "rgba(255,255,255,0.8)",
                      fontWeight: isActive(item.path) ? 600 : 500,
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      px: { xs: 1.5, md: 2.5 },
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        transform: "translateY(-1px)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        width: isActive(item.path) ? "80%" : "0%",
                        height: "2px",
                        background: "rgba(255,255,255,0.8)",
                        transform: "translateX(-50%)",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "80%",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* User Menu */}
            <Box
              component={motion.div}
              whileTap={{ scale: 0.97 }}
              onClick={handleUserMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                p: 1,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: "0.9rem",
                  mr: 1,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              {!isMobile && (
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "white" }}
                  >
                    {user?.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Phụ huynh
                  </Typography>
                </Box>
              )}
              <Box
                component="span"
                sx={{
                  ml: 0.5,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.8rem",
                }}
              >
                ▼
              </Box>
            </Box>

            {/* User Menu Dropdown */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: `0 8px 25px ${alpha(colors.primary, 0.15)}`,
                  border: `1px solid ${colors.divider}`,
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleUserMenuClose}
                sx={{ py: 1.5 }}
              >
                <ListItemText primary="Trang cá nhân" />
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: colors.error,
                }}
              >
                <ListItemText
                  primary="Đăng xuất"
                  primaryTypographyProps={{ color: colors.error }}
                />
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background,
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ParentLayout;
