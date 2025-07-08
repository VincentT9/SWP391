import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Badge,
  Container,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Admin-focused color palette - professional and modern
const adminColors = {
  primary: "#1565c0", // Deep blue
  primaryLight: "#42a5f5",
  secondary: "#424242", // Dark gray
  accent: "#ff6f00", // Orange accent
  background: "#f4f6f8",
  surface: "#ffffff",
  sidebar: "#263238", // Dark sidebar
  sidebarText: "#ffffff",
  text: "#212121",
  textSecondary: "#757575",
  success: "#388e3c",
  warning: "#f57c00",
  error: "#d32f2f",
  border: "#e0e0e0",
};

// Admin sidebar width
const DRAWER_WIDTH = 280;

interface MenuItem {
  name: string;
  path: string;
  description: string;
  badge?: number | null;
  roles?: ("Admin" | "MedicalStaff")[]; // Roles allowed to see this item
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
  roles?: ("Admin" | "MedicalStaff")[]; // Roles allowed to see this category
}

// Admin & MedicalStaff menu items - phân chia theo role
const adminMenuCategories: MenuCategory[] = [
  {
    title: "Quản lý chung",
    roles: ["Admin","MedicalStaff"], // Chỉ Admin mới thấy
    items: [
      {
        name: "Quản lý học sinh",
        path: "/admin/students",
        description: "Danh sách và thông tin học sinh",
        roles: ["Admin"]
      },
      {
        name: "Quản lý người dùng",
        path: "/user-management",
        description: "Quản lý tài khoản người dùng",
        roles: ["Admin"]
      },
      {
        name: "Kho vật tư",
        path: "/medical-supplier",
        description: "Quản lý nhà cung cấp",
        roles: ["Admin", "MedicalStaff"]
      }
    ]
  },
  {
    title: "Hoạt động y tế",
    roles: ["Admin", "MedicalStaff"], // Cả Admin và MedicalStaff
    items: [
      {
        name: "Sự kiện y tế",
        path: "/medical-events",
        description: "Quản lý sự kiện y tế",
        roles: ["Admin", "MedicalStaff"]
      },
      {
        name: "Hồ sơ sức khỏe",
        path: "/health-check",
        description: "Hồ sơ khám sức khỏe học sinh",
        roles: ["Admin", "MedicalStaff"]
      }
    ]
  },
  {
    title: "Thuốc & Tiêm phòng",
    roles: ["Admin", "MedicalStaff"], // Cả Admin và MedicalStaff
    items: [
      {
        name: "Quản lý thuốc",
        path: "/medication/nurse",
        description: "Quản lý thuốc và đơn thuốc",
        roles: ["Admin", "MedicalStaff"]
      },
      {
        name: "Chương trình tiêm phòng",
        path: "/vaccination",
        description: "Quản lý tiêm phòng",
        roles: ["Admin", "MedicalStaff"]
      }
    ]
  },
  {
    title: "Khác",
    roles: ["Admin", "MedicalStaff"], // Cả Admin và MedicalStaff
    items: [
      {
        name: "Thông báo",
        path: "/notifications",
        description: "Quản lý thông báo",
        roles: ["Admin", "MedicalStaff"]
      },
      {
        name: "Trang cá nhân",
        path: "/profile",
        description: "Thông tin cá nhân",
        roles: ["Admin", "MedicalStaff"]
      }
    ]
  }
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

const AdminLayout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

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

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(path));
  };

  // Filter menu items based on user role
  const getFilteredMenuCategories = () => {
    if (!user?.role) return [];
    
    return adminMenuCategories.filter(category => {
      // If category has no role restriction or user role is in allowed roles
      if (!category.roles || category.roles.includes(user.role as "Admin" | "MedicalStaff")) {
        // Filter items within the category
        category.items = category.items.filter(item => {
          return !item.roles || item.roles.includes(user.role as "Admin" | "MedicalStaff");
        });
        // Only show category if it has at least one item
        return category.items.length > 0;
      }
      return false;
    });
  };

  // Sidebar content
  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      backgroundColor: adminColors.sidebar,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Sidebar header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${adminColors.border}`, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${adminColors.primary}, ${adminColors.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            ⚕️
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              color: adminColors.sidebarText, 
              fontWeight: 'bold',
              lineHeight: 1
            }}>
              {user?.role === 'Admin' ? 'Quản trị viên' : 'Nhân viên y tế'}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1
            }}>
              Hệ thống sức khỏe học đường
            </Typography>
          </Box>
        </Box>
        
        {/* User info in sidebar */}
        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                backgroundColor: adminColors.primary,
                mr: 1.5,
                fontSize: '0.8rem'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: adminColors.sidebarText,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.name || 'Admin'}
                </Typography>
                <Chip 
                  label={user?.role === 'Admin' ? 'Quản trị viên' : 'Nhân viên y tế'} 
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    backgroundColor: adminColors.primary,
                    color: 'white'
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Navigation menu */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'hidden',
        py: 2,
        '&:hover': {
          overflow: 'auto'
        },
        // Hide scrollbar but keep functionality
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {getFilteredMenuCategories().map((category) => (
          <Box key={category.title} sx={{ mb: 3 }}>
            {/* Category Title */}
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '1px',
                px: 3,
                pb: 1,
                display: 'block'
              }}
            >
              {category.title}
            </Typography>
            
            {/* Category Items - Always visible */}
            <List>
              {category.items.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => isMobile && setMobileDrawerOpen(false)}
                    sx={{
                      mx: 2,
                      mb: 0.5,
                      borderRadius: 1,
                      backgroundColor: isActivePath(item.path) ? adminColors.primary : 'transparent',
                      color: isActivePath(item.path) ? 'white' : 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: isActivePath(item.path) ? adminColors.primary : 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={item.name}
                      secondary={item.description}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: isActivePath(item.path) ? 600 : 400
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: isActivePath(item.path) ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: adminColors.background }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: adminColors.surface,
          color: adminColors.text,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          borderBottom: `1px solid ${adminColors.border}`
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Box component="span" sx={{ fontSize: '1.5rem' }}>☰</Box>
          </IconButton>

          {/* Page title */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {/* Dynamic title based on current route */}
            {getFilteredMenuCategories()
              .flatMap(cat => cat.items)
              .find(item => isActivePath(item.path))?.name || 
              (user?.role === 'Admin' ? 'Quản trị hệ thống' : 'Y tế học đường')}
          </Typography>

          {/* Notifications */}
          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Box component="span" sx={{ fontSize: '1.2rem' }}>🔔</Box>
            </Badge>
          </IconButton>

          {/* User menu */}
          <Box
            component={motion.div}
            whileTap={{ scale: 0.95 }}
            onClick={handleUserMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
              p: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: adminColors.background,
              },
            }}
          >
            <Avatar sx={{ 
              width: 36, 
              height: 36, 
              backgroundColor: adminColors.primary,
              fontSize: '0.9rem'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {user?.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: adminColors.textSecondary }}>
                {user?.role || 'Quản trị viên'}
              </Typography>
            </Box>
            <Box component="span" sx={{ fontSize: '0.7rem', ml: 0.5 }}>▼</Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* User menu popover */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/admin/profile')}>
          <ListItemText primary="Thông tin cá nhân" />
        </MenuItem>
        <MenuItem onClick={() => navigate('/admin/settings')}>
          <ListItemText primary="Cài đặt" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText 
            primary="Đăng xuất" 
            primaryTypographyProps={{ color: adminColors.error }}
          />
        </MenuItem>
      </Menu>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pt: 8, // Use padding instead of margin to avoid white space
          minHeight: "100vh",
          backgroundColor: adminColors.background,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
