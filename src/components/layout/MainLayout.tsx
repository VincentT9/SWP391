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
  InputBase,
  Badge,
  Paper,
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
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { NurseMedicalEventsDashboard } from '../medical-events/nurse';

// Increased drawer width from 150 to 180 pixels
const drawerWidth = 250; // Increased from 150 to 180

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  role?: string[];
}

const menuItems: MenuItem[] = [
  { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
  { text: 'Hồ sơ sức khỏe', path: '/health-records', icon: <MedicalServicesIcon />, role: ['student']},
  { text: 'Học sinh', path: '/Students', icon: <MedicalServicesIcon />, role: ['nurse', 'parent']},
  { text: 'Dịch vụ y tế', path: '/medication-services', icon: <MedicationIcon />, role: ['nurse', 'parent', 'admin'] },
  { text: 'Sự kiện y tế', path: '/medical-events', icon: <EventIcon /> },
  { text: 'Vật tư Y tế', path: '/Storage', icon: <MedicalServicesIcon />, role: ['nurse', 'admin']},
  { text: 'Quản lí tài khoản', path: '/admin', icon: <SettingsIcon />, role: ['admin'] },
];

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  
  // Mock user state - in a real app, this would come from authentication context
  const [user] = useState({
    isAuthenticated: true,
    name: 'luanpro',
    role: 'parent',
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
    <Box sx={{ bgcolor: '#f0f0f0', height: '100%' }}>
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
                borderBottom: '1px solid #e0e0e0',
                '&:hover': { bgcolor: '#e3e3e3' },
                bgcolor: isActive ? '#e3e3e3' : 'transparent',
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{ 
                  py: 1.5,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ 
                  display: 'flex',
                  mr: 1.5,
                  ml: 4.5,
                  color: '#0066b3'  // Blue color for icons
                }}>
                  {item.icon}
                </Box>
                <Typography
                  sx={{ 
                    fontSize: '14px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: '#333333',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, // Keep this to make sure AppBar is above drawer
          bgcolor: '#034EA1',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '48px', px: 1, display: 'flex', justifyContent: 'space-between' }}>
          {/* Left section with logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
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
          
          {/* Center section with search box */}
          <Box 
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              borderRadius: 1,
              width: { xs: '40%', sm: '30%', md: '25%' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <InputBase
              placeholder="Tìm kiếm..."
              sx={{ 
                pl: 1,
                pr: 5,
                py: 0.5,
                width: '100%',
                fontSize: '14px'
              }}
            />
            <IconButton 
              sx={{ 
                position: 'absolute', 
                right: 0, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'gray'
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          
          {/* Right section with user info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user.isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1, fontSize: '14px' }}>
                  Xin chào, {user.name}
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
                    <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
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
              </Box>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" size="small">
                  Đăng nhập
                </Button>
                <Button color="inherit" component={Link} to="/register" size="small">
                  Đăng ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* MODIFY THIS: Adjust the spacer to perfectly match toolbar height */}
      <Toolbar sx={{ minHeight: '48px', display: 'block' }} />  
      
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ 
            width: { xs: 0, sm: drawerWidth }, 
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              border: 'none',
              bgcolor: '#f0f0f0',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              // MODIFY THESE TWO LINES to fix toolbar overlap:
              top: 'auto', // Remove fixed top position
              height: '100%', // Use full height instead of calculated height
              borderTop: 'none', // Remove any potential top border
            },
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                top: '48px',
                height: 'calc(100% - 48px)',
              }
            }}
          >
            {drawer}
          </Drawer>
          
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
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
            bgcolor: '#f8f8f8',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;