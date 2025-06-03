import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext"; // Import useAuth

// Increased drawer width from 150 to 180 pixels
const drawerWidth = 250; // Increased from 150 to 180

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  role?: string[];
}

const menuItems: MenuItem[] = [
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
    role: ["nurse"],
  },
  {
    text: "Sự kiện y tế",
    path: "/medical-events",
    icon: <MedicalServicesIcon />,
    role: ["nurse", "admin", "parent"],
  },
  {
    text: "Hồ sơ sức khỏe học sinh",
    path: "/health-records",
    icon: <MedicalServicesIcon />,
    role: ["parent"],
  },
  {
    text: "Quản lý thuốc",
    path: "/medication",
    icon: <MedicationIcon />,
    role: ["nurse", "admin"],
  },
  {
    text: "Gửi thuốc đến trường",
    path: "/medication",
    icon: <MedicationIcon />,
    role: ["parent"],
  },
  {
    text: "Vật tư y tế",
    path: "/medical-supplier",
    icon: <MedicalServicesIcon />,
    role: ["nurse", "admin"],
  },
  {
    text: "Quản lý người dùng",
    path: "/user-management",
    icon: <SettingsIcon />,
    role: ["admin"],
  },
  { text: "Thông báo", path: "/notifications", icon: <NotificationsIcon /> },
];

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Use AuthContext instead of mock user
  const { user, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    <Box sx={{ bgcolor: "#f0f0f0", height: "100%" }}>
      <List sx={{ pt: 0, pb: 0 }}>
        {menuItems.map((item) => {
          // Skip items that the user doesn't have access to
          if (item.role && !item.role.includes(user.role)) return null;

          const isActive = location.pathname === item.path;

          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                borderBottom: "1px solid #e0e0e0",
                "&:hover": { bgcolor: "#e3e3e3" },
                bgcolor: isActive ? "#e3e3e3" : "transparent",
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  py: 1.5,
                  px: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    mr: 1.5,
                    ml: 4.5,
                    color: "#0066b3", // Blue color for icons
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: "#333333",
                    flexGrow: 1,
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#034EA1",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "48px",
            px: 1,
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
              marginLeft={4}
              component="img"
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
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
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
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Trang cá nhân
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
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

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { xs: 0, sm: drawerWidth },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              bgcolor: "background.paper",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              top: "auto",
              height: "100%",
              borderTop: "none",
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
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            bgcolor: "background.default",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
