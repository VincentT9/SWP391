import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Event as EventIcon,
  VaccinesOutlined as VaccineIcon,
  HealthAndSafety as HealthCheckIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  AccountCircle,
} from '@mui/icons-material';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  role?: string[];
}

const menuItems: MenuItem[] = [
  { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
  { text: 'Hồ sơ sức khỏe', path: '/health-records', icon: <MedicalServicesIcon /> },
  { text: 'Quản lý thuốc', path: '/medication', icon: <MedicationIcon /> },
  { text: 'Sự kiện y tế', path: '/medical-events', icon: <EventIcon /> },
  { text: 'Tiêm chủng', path: '/vaccination', icon: <VaccineIcon /> },
  { text: 'Kiểm tra y tế', path: '/health-check', icon: <HealthCheckIcon /> },
  { text: 'Bảng điều khiển', path: '/dashboard', icon: <DashboardIcon />, role: ['admin', 'manager', 'nurse'] },
  { text: 'Trang cá nhân', path: '/profile', icon: <PersonIcon /> },
  { text: 'Quản trị', path: '/admin', icon: <SettingsIcon />, role: ['admin'] },
];

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  
  // Mock user state - in a real app, this would come from authentication context
  const [user] = useState({
    isAuthenticated: true,
    name: 'Nguyễn Văn A',
    role: 'admin',
    avatar: '',
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SMS Medical
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Skip items that the user doesn't have access to
          if (item.role && !item.role.includes(user.role)) return null;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hệ thống quản lý y tế học đường
          </Typography>
          
          {user.isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.avatar ? (
                  <Avatar alt={user.name} src={user.avatar} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Trang cá nhân</MenuItem>
                <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Đăng nhập
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Đăng ký
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 