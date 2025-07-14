import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Button,
  Menu,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MedicalServices as MedicalIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  MarkEmailRead as ReadIcon,
  MarkEmailUnread as UnreadIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'medical' | 'event';
  isRead: boolean;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  relatedUserId?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Lịch khám sức khỏe',
    message: 'Lịch khám sức khỏe định kỳ cho lớp 10A sẽ được tổ chức vào ngày mai lúc 8:00 AM.',
    type: 'event',
    isRead: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    priority: 'high',
    relatedUserId: 'nurse1'
  },
  {
    id: '2',
    title: 'Thuốc cần bổ sung',
    message: 'Paracetamol trong kho đã gần hết. Vui lòng liên hệ để bổ sung.',
    type: 'warning',
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: 'medium',
    relatedUserId: 'admin1'
  },
  {
    id: '3',
    title: 'Cập nhật hồ sơ sức khỏe',
    message: 'Hồ sơ sức khỏe của học sinh Nguyễn Văn A đã được cập nhật thành công.',
    type: 'success',
    isRead: true,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    priority: 'low',
    relatedUserId: 'nurse2'
  },
  {
    id: '4',
    title: 'Phụ huynh gửi thuốc',
    message: 'Phụ huynh của học sinh Trần Thị B đã gửi thuốc cho con em mình.',
    type: 'medical',
    isRead: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: 'medium',
    relatedUserId: 'parent1'
  },
  {
    id: '5',
    title: 'Thông báo hệ thống',
    message: 'Hệ thống sẽ được bảo trì từ 23:00 hôm nay đến 1:00 sáng mai.',
    type: 'info',
    isRead: false,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    priority: 'low',
    relatedUserId: 'admin1'
  },
];

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Filter notifications based on tab
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.isRead);
      case 2: // Important
        return notifications.filter(n => n.priority === 'high');
      default:
        return notifications;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    handleMenuClose();
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: false }
          : notification
      )
    );
    handleMenuClose();
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <MedicalIcon sx={{ color: '#e74c3c' }} />; // FPT Red
      case 'event':
        return <EventIcon sx={{ color: '#2980b9' }} />; // FPT Blue
      case 'warning':
        return <WarningIcon sx={{ color: '#f39c12' }} />; // FPT Orange
      case 'success':
        return <CheckIcon sx={{ color: '#2ecc71' }} />; // FPT Green
      default:
        return <InfoIcon sx={{ color: '#2980b9' }} />; // FPT Blue
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#e74c3c'; // FPT Red
      case 'medium':
        return '#f39c12'; // FPT Orange
      default:
        return '#2ecc71'; // FPT Green
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return timestamp.toLocaleDateString('vi-VN');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  if (!user?.isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Bạn cần đăng nhập để xem thông báo.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
              <NotificationsIcon sx={{ fontSize: 32, color: '#2980b9' }} />
            </Badge>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2980b9' }}>
              Thông báo
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{ color: '#2980b9', borderColor: '#2980b9' }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Tất cả (${notifications.length})`} />
            <Tab label={`Chưa đọc (${unreadCount})`} />
            <Tab label={`Quan trọng (${notifications.filter(n => n.priority === 'high').length})`} />
          </Tabs>
        </Box>

        {/* Notifications List */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Không có thông báo nào
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: notification.isRead ? 'transparent' : 'rgba(33, 150, 243, 0.05)',
                        borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: notification.isRead ? 'normal' : 'bold',
                                color: notification.isRead ? 'text.secondary' : 'text.primary',
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.priority}
                              size="small"
                              sx={{
                                bgcolor: getPriorityColor(notification.priority),
                                color: 'white',
                                fontSize: '10px',
                                height: '20px',
                              }}
                            />
                            {!notification.isRead && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#2980b9',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={(e) => handleMenuOpen(e, notification.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {selectedNotification && (
            <>
              {notifications.find(n => n.id === selectedNotification)?.isRead ? (
                <MenuItem onClick={() => markAsUnread(selectedNotification)}>
                  <UnreadIcon sx={{ mr: 1 }} />
                  Đánh dấu chưa đọc
                </MenuItem>
              ) : (
                <MenuItem onClick={() => markAsRead(selectedNotification)}>
                  <ReadIcon sx={{ mr: 1 }} />
                  Đánh dấu đã đọc
                </MenuItem>
              )}
              <MenuItem onClick={() => deleteNotification(selectedNotification)}>
                <DeleteIcon sx={{ mr: 1 }} />
                Xóa thông báo
              </MenuItem>
            </>
          )}
        </Menu>
      </Box>
    </Container>
  );
};

export default NotificationsPage;
