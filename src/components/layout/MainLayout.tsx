import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Fab,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  ChevronLeft,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Modified drawer width and added collapsed state width
const drawerWidth = 250;
const collapsedDrawerWidth = 70;

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
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

// Define animation for list items
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

// Define animation for the drawer
const drawerVariants = {
  closed: {
    width: collapsedDrawerWidth,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    width: drawerWidth,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

// Define animation for the toggle button
const toggleButtonVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

// Define animation for content - remove margins completely
const contentVariants = {
  narrow: {
    marginLeft: 0,
    paddingLeft: `${collapsedDrawerWidth}px`,
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
  wide: {
    marginLeft: 0,
    paddingLeft: `${drawerWidth}px`,
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
};

interface MenuItemType {
  text: string;
  path: string;
  icon: React.ReactNode;
  role?: string[];
}

const menuItems: MenuItemType[] = [
  { text: "Trang chủ", path: "/", icon: <HomeIcon /> },
  {
    text: "Sức khỏe của tôi",
    path: "/my-health",
    icon: <MedicalServicesIcon />,
    role: ["student"],
  },
  {
    text: "Sức Khỏe học sinh",
    path: "/health-check",
    icon: <MedicalServicesIcon />,
    role: ["MedicalStaff"],
  },
  {
    text: "Sự kiện y tế",
    path: "/medical-events",
    icon: <MedicalServicesIcon />,
    role: ["MedicalStaff", "Admin", "Parent"],
  },
  {
    text: "Hồ sơ sức khỏe học sinh",
    path: "/health-records",
    icon: <MedicalServicesIcon />,
    role: ["Parent"],
  },
  {
    text: "Quản lý thuốc",
    path: "/medication",
    icon: <MedicationIcon />,
    role: ["MedicalStaff", "Admin"],
  },
  {
    text: "Gửi thuốc đến trường",
    path: "/medication",
    icon: <MedicationIcon />,
    role: ["Parent"],
  },
  {
    text: "Vật tư y tế",
    path: "/medical-supplier",
    icon: <MedicalServicesIcon />,
    role: ["MedicalStaff", "Admin"],
  },
  {
    text: "Quản lý người dùng",
    path: "/user-management",
    icon: <SettingsIcon />,
    role: ["Admin"],
  },
  { text: "Thông báo", path: "/notifications", icon: <NotificationsIcon /> },
];

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Use AuthContext instead of mock user
  const { user, logout } = useAuth();

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !isMobile &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, isMobile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  // Show loading or redirect if user is not authenticated
  if (!user?.isAuthenticated) {
    return null; // or a loading spinner
  }

  const drawer = (
    <Box
      ref={sidebarRef}
      sx={{
        background: "#f0f2f5", // Changed from #f5f9ff to more gray tone
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements with blue color scheme */}
      <Box
        component={motion.div}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          borderRadius: "50%",
          width: 100,
          height: 100,
          background:
            "radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(3, 78, 162, 0.05) 100%)",
          zIndex: 0,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <List sx={{ pt: 3, pb: 0, position: "relative", zIndex: 1 }}>
        <AnimatePresence>
          {menuItems.map((item, index) => {
            // Skip items that the user doesn't have access to
            if (item.role && !item.role.includes(user.role)) return null;

            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.text}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={listItemVariants}
              >
                <Tooltip
                  title={!sidebarOpen ? item.text : ""}
                  placement="right"
                  arrow
                >
                  <ListItem
                    disablePadding
                    sx={{
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      "&:hover": {
                        bgcolor: "rgba(3, 78, 162, 0.08)",
                      },
                      bgcolor: isActive
                        ? "rgba(3, 78, 162, 0.12)"
                        : "transparent",
                      borderLeft: isActive
                        ? `4px solid #034ea2`
                        : "4px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      sx={{
                        py: 1.8,
                        px: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: sidebarOpen ? "flex-start" : "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.15 }}
                        sx={{
                          display: "flex",
                          mr: sidebarOpen ? 1.5 : 0,
                          ml: sidebarOpen ? 1 : 0,
                          color: isActive ? "#034ea2" : "rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        {item.icon}
                      </Box>
                      {sidebarOpen && (
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "#034ea2" : "rgba(0, 0, 0, 0.75)",
                            flexGrow: 1,
                            letterSpacing: "0.01em",
                            opacity: sidebarOpen ? 1 : 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          {item.text}
                        </Typography>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f0f2f5", // Changed from #f5f9ff to more gray tone
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <AppBar
        component={motion.div}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #034EA2 0%, #1976d2 100%)", // Blue gradient updated with new primary color
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "48px",
            px: { xs: 1, sm: 2 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Left section with logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* FPTMED Logo */}
            <Box
              component={motion.img}
              whileHover={{ scale: 1.05 }}
              marginLeft={{ xs: 1, sm: 4 }}
              src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x"
              alt="FPTMED"
              sx={{ height: 35, mr: 1 }}
            />
          </Box>
          {/* Right section with user info */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user?.isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1, fontSize: "14px" }}>
                  Xin chào, {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mr: 1, fontSize: "12px", opacity: 0.8 }}
                >
                  ({user.role})
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    size="small"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    {user.avatar ? (
                      <Avatar
                        alt={user.name}
                        src={user.avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          border: "2px solid rgba(255,255,255,0.7)",
                        }}
                      />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                </motion.div>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                    sx={{
                      py: 1.2,
                      px: 2.5,
                      "&:hover": {
                        bgcolor: "rgba(158, 145, 125, 0.08)",
                      },
                    }}
                  >
                    Trang cá nhân
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.2,
                      px: 2.5,
                      "&:hover": {
                        bgcolor: "rgba(244, 67, 54, 0.04)",
                        color: "error.main",
                      },
                    }}
                  >
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  size="small"
                >
                  Đăng nhập
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  size="small"
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: "48px", display: "block" }} />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{
            width: {
              xs: 0,
              sm: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
            },
            flexShrink: 0,
            transition: "width 0.3s",
            position: "absolute",
            height: "calc(100vh - 48px)",
            zIndex: 1200,
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              border: "none",
              bgcolor: "#f0f2f5", // Changed from #f5f9ff to more gray tone
              boxShadow: "none",
              top: "auto",
              height: "100%",
              borderTop: "none",
              overflow: "hidden",
            },
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                top: "48px",
                height: "calc(100% - 48px)",
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
                transition: "width 0.3s",
              },
            }}
            open
          >
            <AnimatePresence>
              <motion.div
                initial={false}
                animate={sidebarOpen ? "open" : "closed"}
                variants={drawerVariants}
              >
                {drawer}
              </motion.div>
            </AnimatePresence>
          </Drawer>
        </Box>

        {/* Toggle sidebar button */}
        {!isMobile && (
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: sidebarOpen ? drawerWidth - 22 : collapsedDrawerWidth - 22,
              zIndex: theme.zIndex.drawer + 2,
              transition: "left 0.3s",
            }}
          >
            <Fab
              component={motion.button}
              initial={false}
              animate={sidebarOpen ? "open" : "closed"}
              variants={toggleButtonVariants}
              size="small"
              color="primary"
              aria-label="toggle sidebar"
              onClick={toggleSidebar}
              sx={{
                bgcolor: "#034EA2", // Updated to use the requested color
                "&:hover": {
                  bgcolor: "#023a7a",
                },
              }}
            >
              <ChevronLeft />
            </Fab>
          </Box>
        )}

        {/* Main Content with Page Transitions - responsive to sidebar state */}
        <Box
          component={motion.div}
          initial={false}
          animate={sidebarOpen && !isMobile ? "wide" : "narrow"}
          variants={!isMobile ? contentVariants : {}}
          sx={{
            flexGrow: 1,
            p: 0,
            bgcolor: "#f0f2f5", // Changed from #f5f9ff to more gray tone
            overflow: "auto",
            width: "100%",
            ml: 0,
            height: "100%",
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#034EA2",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#023a7a",
            },
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
              style={{ minHeight: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;