import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Fab,
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
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import PageHeader from '../common/PageHeader';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'medical' | 'event';
  isRead: boolean;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  relatedUserId?: string;
  createdBy?: string;
  targetRole?: string;
}

interface NotificationFormData {
  title: string;
  content: string;
  type: string;
}



const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    content: '',
    type: ''
  });

  // Check if user is admin
  const isAdmin = user?.role === 'Admin';
  const isParent = user?.role === 'Parent';
  const isMedicalStaff = user?.role === 'MedicalStaff';
  const canManageNotifications = isAdmin;
  const canViewNotifications = isAdmin || isParent || isMedicalStaff;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/Notification/get-all-notifications');
      
      // Transform API response to match our interface
      const transformedNotifications = response.data.map((notif: any) => ({
        id: notif.id || notif.notificationId,
        title: notif.title,
        message: notif.content || notif.message,  // Use content from API, fallback to message
        type: notif.type || 'info',
        isRead: notif.isRead || false,
        timestamp: new Date(notif.createdAt || notif.timestamp || Date.now()),
        priority: 'medium', // Default since API doesn't provide this
        relatedUserId: notif.relatedUserId,
        createdBy: notif.createdBy,
        targetRole: notif.targetRole
      }));
      
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải thông báo. Vui lòng thử lại.');
      // Fallback to mock data for demo
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    if (!canManageNotifications) return;
    
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type
      };

      await axiosInstance.post('/api/Notification/create-notification', payload);

      setSuccess('Tạo thông báo thành công!');
      setOpenCreateDialog(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Không thể tạo thông báo. Vui lòng thử lại.');
    }
  };

  const updateNotification = async () => {
    if (!canManageNotifications || !editingNotification) return;
    
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type
      };

      await axiosInstance.put(`/api/Notification/update-notification/${editingNotification.id}`, payload);

      setSuccess('Cập nhật thông báo thành công!');
      setOpenEditDialog(false);
      setEditingNotification(null);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      setError('Không thể cập nhật thông báo. Vui lòng thử lại.');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!canManageNotifications) return;
    
    try {
      await axiosInstance.delete(`/api/Notification/delete-notification/${notificationId}`);

      setSuccess('Xóa thông báo thành công!');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Không thể xóa thông báo. Vui lòng thử lại.');
    }
    handleMenuClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: ''
    });
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      content: notification.message,
      type: notification.type
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  // Filter notifications based on tab
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.isRead);
      case 2: // Important (based on type)
        return notifications.filter(n => 
          n.type?.toLowerCase().includes('medical') || 
          n.type?.toLowerCase().includes('warning') ||
          n.type?.toLowerCase().includes('cảnh báo') ||
          n.type?.toLowerCase().includes('y tế')
        );
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

  const markAsRead = async (notificationId: string) => {
    try {
      // Update locally first for better UX
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Call API if needed - you might want to implement this endpoint
      // await axios.put(`/api/Notification/mark-read/${notificationId}`);
      
    } catch (error) {
      console.error('Error marking as read:', error);
      // Revert on error
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: false }
            : notification
        )
      );
    }
    handleMenuClose();
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: false }
            : notification
        )
      );
      
      // Call API if needed
      // await axios.put(`/api/Notification/mark-unread/${notificationId}`);
      
    } catch (error) {
      console.error('Error marking as unread:', error);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    }
    handleMenuClose();
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Call API if needed
      // await axios.put('/api/Notification/mark-all-read');
      
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <MedicalIcon sx={{ color: '#2980b9' }} />;
      case 'event':
        return <EventIcon sx={{ color: '#2980b9' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#f39c12' }} />;
      case 'success':
        return <CheckIcon sx={{ color: '#2ecc71' }} />;
      default:
        return <InfoIcon sx={{ color: '#2980b9' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      default:
        return '#2ecc71';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medical':
      case 'y tế':
        return '#e74c3c'; // Red for medical
      case 'warning':
      case 'cảnh báo':
        return '#f39c12'; // Orange for warning
      case 'success':
      case 'thành công':
        return '#2ecc71'; // Green for success
      case 'event':
      case 'sự kiện':
        return '#9b59b6'; // Purple for events
      case 'info':
      case 'thông tin':
        return '#3498db'; // Blue for info
      default:
        return '#95a5a6'; // Gray for unknown types
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
  const importantCount = notifications.filter(n => 
    n.type?.toLowerCase().includes('medical') || 
    n.type?.toLowerCase().includes('warning') ||
    n.type?.toLowerCase().includes('cảnh báo') ||
    n.type?.toLowerCase().includes('y tế')
  ).length;
  const filteredNotifications = getFilteredNotifications();

  if (!user?.isAuthenticated || !canViewNotifications) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            {!user?.isAuthenticated 
              ? "Bạn cần đăng nhập để xem thông báo."
              : "Bạn không có quyền truy cập trang này."
            }
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <PageHeader 
          title="Thông báo"
          subtitle="Quản lý và theo dõi các thông báo hệ thống"
          showRefresh={true}
          onRefresh={fetchNotifications}
          actions={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                sx={{ color: '#2980b9', borderColor: '#2980b9' }}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            </Box>
          }
        />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Tất cả (${notifications.length})`} />
            <Tab label={`Chưa đọc (${unreadCount})`} />
            <Tab label={`Quan trọng (${importantCount})`} />
          </Tabs>
        </Box>

        {/* Notifications List */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Đang tải thông báo...
                </Typography>
              </Box>
            ) : filteredNotifications.length === 0 ? (
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
                        borderLeft: `4px solid ${getTypeColor(notification.type)}`,
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: notification.isRead ? 'normal' : 'bold',
                                color: notification.isRead ? 'text.secondary' : 'text.primary',
                              }}
                            >
                              {notification.title}
                            </Typography>
                            
                            {notification.type && (
                              <Chip
                                label={notification.type}
                                size="small"
                                sx={{
                                  bgcolor: getTypeColor(notification.type),
                                  color: 'white',
                                  fontSize: '10px',
                                  height: '20px',
                                }}
                              />
                            )}
                            
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
              
              {canManageNotifications && (
                <>
                  <MenuItem 
                    onClick={() => {
                      const notification = notifications.find(n => n.id === selectedNotification);
                      if (notification) handleEditClick(notification);
                    }}
                  >
                    <EditIcon sx={{ mr: 1 }} />
                    Chỉnh sửa
                  </MenuItem>
                  <MenuItem 
                    onClick={() => selectedNotification && deleteNotification(selectedNotification)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon sx={{ mr: 1 }} />
                    Xóa thông báo
                  </MenuItem>
                </>
              )}
            </>
          )}
        </Menu>

        {/* Floating Action Button for Admin */}
        {canManageNotifications && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => {
              resetForm();
              setOpenCreateDialog(true);
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Create Notification Dialog */}
        <Dialog 
          open={openCreateDialog} 
          onClose={() => setOpenCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tạo thông báo mới</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Tiêu đề"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="Nội dung"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Loại thông báo"
                fullWidth
                variant="outlined"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Ví dụ: info, warning, success, medical, event"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
            <Button 
              onClick={createNotification}
              variant="contained"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              Tạo thông báo
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Notification Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Tiêu đề"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="Nội dung"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Loại thông báo"
                fullWidth
                variant="outlined"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Ví dụ: info, warning, success, medical, event"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button 
              onClick={updateNotification}
              variant="contained"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          message={success}
        />

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default NotificationsPage;
