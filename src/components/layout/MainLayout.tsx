import React, { useState, useEffect } from "react";
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
  Divider,
  Badge,
  Container,
  ListItemText,
  Tabs,
  Tab,
  alpha,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Chip,
} from "@mui/material";

import { useAuth } from "../auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Define animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.3,
};

// FPT Healthcare-focused color palette
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

// Define menu categories and items
interface MenuSubmenuItem {
  text: string;
  path: string;
  role?: string[];
  badge?: number;
}

interface MenuCategory {
  name: string;
  path?: string;
  role?: string[];
  badge?: number;
  submenu?: MenuSubmenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    name: "Trang chủ",
    path: "/",
  },
  // Promo menu items - chỉ hiển thị khi chưa đăng nhập
  {
    name: "Gửi thuốc đến trường",
    path: "/promo/medication-delivery",
  },
  {
    name: "Chương trình tiêm phòng",
    path: "/promo/vaccination",
  },
  {
    name: "Dịch vụ y tế học đường",
    path: "/promo/health-check",
  },
  // Main features - chỉ hiển thị khi đã đăng nhập
  {
    name: "Gửi thuốc cho con",
    role: ["Parent"],
    path: "/medication/parent",
  },
  {
    name: "Quản lý thuốc học sinh",
    role: ["MedicalStaff", "Admin"],
    path: "/medication/nurse",
  },
  {
    name: "Lịch tiêm phòng",
    role: ["MedicalStaff", "Admin"],
    path: "/vaccination",
  },
  {
    name: "Theo dõi tiêm phòng con",
    role: ["Parent"],
    path: "/vaccination/parent",
  },
  {
    name: "Xử lý sự cố y tế",
    role: ["MedicalStaff", "Admin"],
    path: "/medical-events",
  },
  {
    name: "Sức khỏe con em",
    role: ["Parent"],
    path: "/medical-events",
  },
  {
    name: "Hồ sơ sức khỏe",
    role: ["Parent", "MedicalStaff"],
    path: "/health-records",
  },
  {
    name: "Vật tư y tế",
    role: ["MedicalStaff", "Admin"],
    path: "/medical-supplier",
  },
  {
    name: "Quản lý học sinh",
    role: ["Admin"],
    path: "/admin/students",
  },
  {
    name: "Quản lý hệ thống",
    role: ["Admin"],
    path: "/user-management",
  },
];

// Type guard for checking if a menu item has a badge
const hasBadge = (
  item: MenuSubmenuItem
): item is MenuSubmenuItem & { badge: number } => {
  return item.badge !== undefined && typeof item.badge === "number";
};

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchors, setMenuAnchors] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Use AuthContext
  const { user, logout } = useAuth();

  // Filter menu categories based on user role
  const visibleCategories = menuCategories.filter((category) => {
    // If user is not authenticated, only show home and promo pages
    if (!user?.isAuthenticated) {
      return (
        category.name === "Trang chủ" || category.path?.startsWith("/promo/")
      );
    }
    // If authenticated, show based on role but EXCLUDE promo pages
    return (
      !category.path?.startsWith("/promo/") &&
      (!category.role || category.role.includes(user?.role || ""))
    );
  });

  // Set active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const tabIndex = visibleCategories.findIndex((category) => {
      if (category.path === currentPath) return true;
      if (category.submenu) {
        return category.submenu.some((item) => item.path === currentPath);
      }
      return false;
    });

    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [location.pathname, visibleCategories]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const category = visibleCategories[newValue]; // Use visibleCategories instead of menuCategories
    if (category.path) {
      navigate(category.path);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    menuName: string
  ) => {
    setMenuAnchors({
      ...menuAnchors,
      [menuName]: event.currentTarget,
    });
  };

  const handleMenuClose = (menuName: string) => {
    setMenuAnchors({
      ...menuAnchors,
      [menuName]: null,
    });
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleUserMenuClose();
  };

  // Navigate to page and close menus
  const navigateTo = (path: string, menuName?: string) => {
    navigate(path);
    if (menuName) {
      handleMenuClose(menuName);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top Navigation Bar with gradient background */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo - Just a styled circle with gradient */}
            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{
                mr: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x"
                alt="FPTMED"
                sx={{
                  height: { xs: 34, md: 40 },
                  transition: "all 0.2s ease",
                }}
              />
            </Box>

            {/* Mobile Toggle Menu - Only show for authenticated users */}
            {isMobile && user?.isAuthenticated && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 2 }}
              >
                <Box component="span" sx={{ fontSize: "1.2rem" }}>
                  ☰
                </Box>
              </IconButton>
            )}

            {/* Desktop Navigation - Show for all users */}
            {!isMobile && (
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isTablet ? "scrollable" : "standard"}
                scrollButtons={isTablet ? "auto" : false}
                sx={{
                  flexGrow: 1,
                  minHeight: 70,
                  "& .MuiTab-root": {
                    minHeight: 70,
                    px: 3,
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "rgba(255, 255, 255, 0.85)",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    position: "relative",
                    "&:hover": {
                      color: "#ffffff",
                      background: "rgba(255, 255, 255, 0.1)",
                    },
                    alignItems: "center",
                  },
                  "& .Mui-selected": {
                    color: "#ffffff !important", // Ensure text remains visible when selected
                    fontWeight: 600,
                    opacity: 1, // Make sure opacity is set to 1
                    visibility: "visible", // Explicitly set visibility
                    zIndex: 1, // Ensure it's on top
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "30%",
                      height: 3,
                      borderRadius: 3,
                      backgroundColor: "#ffffff",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                {visibleCategories.map(
                  (
                    category,
                    index // Use visibleCategories instead of filtering inline
                  ) => (
                    <Tab
                      key={category.name}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            component="span"
                            sx={{ fontWeight: "inherit" }}
                          >
                            {category.name}
                          </Typography>
                          {category.badge && (
                            <Chip
                              size="small"
                              label={category.badge}
                              sx={{
                                ml: 1,
                                height: 18,
                                minWidth: 18,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                bgcolor: "rgba(255, 255, 255, 0.9)",
                                color: colors.primary,
                              }}
                            />
                          )}
                          {category.submenu && (
                            <Box
                              component="span"
                              sx={{ ml: 0.5, fontSize: "0.8rem" }}
                            >
                              ▼
                            </Box>
                          )}
                        </Box>
                      }
                      onClick={
                        category.submenu
                          ? (e) => {
                              e.preventDefault();
                              handleMenuOpen(e, category.name);
                            }
                          : undefined
                      }
                    />
                  )
                )}
              </Tabs>
            )}

            {/* Spacer when not authenticated to push auth buttons to the right */}
            {!user?.isAuthenticated && <Box sx={{ flexGrow: 1 }} />}

            {/* Right side - notifications, user menu or auth buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Show login/register buttons for unauthenticated users */}
              {!user?.isAuthenticated && (
                <>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    sx={{
                      borderRadius: 28,
                      textTransform: "none",
                      px: { xs: 2, md: 3 },
                      py: 1,
                      mr: 1,
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        borderColor: "white",
                        background: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{
                      borderRadius: 28,
                      textTransform: "none",
                      px: { xs: 2, md: 3 },
                      py: 1,
                      background: "rgba(255, 255, 255, 0.9)",
                      color: colors.primary,
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        background: "white",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                </>
              )}

              {/* Show user menu only for authenticated users */}
              {user?.isAuthenticated && (
                <>
                  {/* User Menu */}
                  <Box
                    component={motion.div}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUserMenuOpen}
                    sx={{
                      ml: 1,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      py: 0.5,
                      px: { xs: 0.5, md: 1.5 },
                      borderRadius: 28,
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      transition: "all 0.2s",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.18)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "white",
                        color: colors.primary,
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      alt={user.name || "User"}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                    {!isMobile && (
                      <>
                        <Box sx={{ ml: 1.5 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ lineHeight: 1.2, color: "white" }}
                          >
                            {user?.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            {user?.role}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            ml: 0.5,
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.8rem",
                          }}
                        >
                          ▼
                        </Box>
                      </>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Only render these menus if user is authenticated */}
      {user?.isAuthenticated && (
        <>
          {/* Dropdown Menus for Navigation Categories */}
          {visibleCategories.map((category) => {
            if (!category.submenu) return null;

            return (
              <Popover
                key={`menu-${category.name}`}
                open={Boolean(menuAnchors[category.name])}
                anchorEl={menuAnchors[category.name]}
                onClose={() => handleMenuClose(category.name)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  mt: 1,
                  "& .MuiPaper-root": {
                    borderRadius: 3,
                    minWidth: 220,
                    overflow: "hidden",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <List sx={{ p: 1 }}>
                  {category.submenu.map((item) => {
                    // Filter based on user role
                    if (item.role && !item.role.includes(user.role))
                      return null;

                    return (
                      <ListItem disablePadding key={item.text}>
                        <ListItemButton
                          component={motion.div}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigateTo(item.path, category.name)}
                          sx={{
                            py: 1.2,
                            px: 2,
                            borderRadius: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: alpha(colors.primary, 0.08),
                            },
                          }}
                        >
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: "0.95rem",
                              fontWeight: 500,
                            }}
                          />
                          {hasBadge(item) && (
                            <Chip
                              size="small"
                              label={item.badge}
                              sx={{
                                bgcolor: colors.primary,
                                color: "white",
                                height: 22,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                ml: 1,
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Popover>
            );
          })}

          {/* User Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                width: 250,
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                borderRadius: 3,
                mt: 1.5,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.97)",
                backdropFilter: "blur(10px)",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  margin: "0 auto",
                  border: "4px solid rgba(255, 255, 255, 0.6)",
                  bgcolor: "white",
                  color: colors.primary,
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, fontWeight: 600, color: "white" }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {user?.role}
              </Typography>
            </Box>

            <MenuItem
              component={motion.div}
              whileHover={{ x: 3 }}
              onClick={() => {
                navigate("/profile");
                handleUserMenuClose();
              }}
              sx={{ py: 1.5, px: 2.5 }}
            >
              <ListItemText primary="Trang cá nhân" />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              component={motion.div}
              whileHover={{ x: 3 }}
              onClick={handleLogout}
              sx={{ py: 1.5, px: 2.5 }}
            >
              <ListItemText
                primary="Đăng xuất"
                primaryTypographyProps={{ color: colors.error }}
              />
            </MenuItem>
          </Menu>

          {/* Mobile Navigation Menu */}
          <Menu
            anchorEl={document.body}
            open={mobileMenuOpen}
            onClose={handleMobileMenuToggle}
            PaperProps={{
              sx: {
                width: "100%",
                maxWidth: "100%",
                top: "64px !important",
                left: "0px !important",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                background: "rgba(255, 255, 255, 0.97)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <List sx={{ py: 2 }}>
              {visibleCategories.flatMap((category) => {
                // For categories with submenu, add title and then all items
                if (category.submenu) {
                  return [
                    // Category heading
                    <ListItem
                      key={`category-${category.name}`}
                      sx={{ py: 0.5, px: 3 }}
                    >
                      <Typography
                        variant="overline"
                        color={colors.primary}
                        fontWeight={700}
                        sx={{ letterSpacing: 1.5 }}
                      >
                        {category.name}
                      </Typography>
                    </ListItem>,
                    // Category items
                    ...category.submenu
                      .filter(
                        (item) => !item.role || item.role.includes(user.role)
                      )
                      .map((item) => (
                        <ListItem disablePadding key={item.text}>
                          <ListItemButton
                            component={motion.div}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              navigate(item.path);
                              handleMobileMenuToggle();
                            }}
                            sx={{
                              py: 1.5,
                              px: 3,
                              borderRadius: 2,
                              mx: 1.5,
                              my: 0.3,
                              transition: "all 0.2s",
                            }}
                          >
                            <ListItemText
                              primary={item.text}
                              primaryTypographyProps={{
                                fontWeight:
                                  location.pathname === item.path ? 600 : 400,
                                color:
                                  location.pathname === item.path
                                    ? colors.primary
                                    : colors.text,
                              }}
                            />
                            {hasBadge(item) && (
                              <Chip
                                size="small"
                                label={item.badge}
                                sx={{
                                  bgcolor: colors.primary,
                                  color: "white",
                                  height: 20,
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                      )),
                  ];
                } else {
                  // For standalone categories without submenu
                  return [
                    <ListItem disablePadding key={category.name}>
                      <ListItemButton
                        component={motion.div}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate(category.path || "/");
                          handleMobileMenuToggle();
                        }}
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          mx: 1.5,
                          my: 0.3,
                          bgcolor:
                            location.pathname === category.path
                              ? alpha(colors.primary, 0.1)
                              : "transparent",
                        }}
                      >
                        <ListItemText
                          primary={category.name}
                          primaryTypographyProps={{
                            fontWeight:
                              location.pathname === category.path ? 600 : 400,
                            color:
                              location.pathname === category.path
                                ? colors.primary
                                : colors.text,
                          }}
                        />
                        {category.badge && (
                          <Chip
                            size="small"
                            label={category.badge}
                            sx={{
                              bgcolor: colors.primary,
                              color: "white",
                              height: 24,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>,
                  ];
                }
              })}
            </List>
          </Menu>
        </>
      )}

      {/* Main Content with background pattern */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 10 },
          pb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 4, md: 5 },
          backgroundImage:
            "radial-gradient(rgba(26, 115, 232, 0.04) 2px, transparent 0)",
          backgroundSize: "30px 30px",
          minHeight: "100vh",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default MainLayout;
