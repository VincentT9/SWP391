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
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
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
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import instance from '../../utils/axiosConfig';
import PageHeader from '../common/PageHeader';

interface Notification {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  returnUrl: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  campaign?: Campaign;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface NotificationFormData {
  campaignId: string;
  title: string;
  returnUrl: string;
}



const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
    campaignId: '',
    title: '',
    returnUrl: ''
  });

  // Check if user is admin
  const isAdmin = user?.role === 'Admin';
  const isParent = user?.role === 'Parent';
  const isMedicalStaff = user?.role === 'MedicalStaff';
  
  // Phân quyền: 
  // - Admin: có thể quản lý (tạo, sửa, xóa) và xem tất cả thông báo
  // - Parent & MedicalStaff: chỉ có thể xem thông báo của chính họ
  const canManageNotifications = isAdmin;
  const canViewNotifications = isAdmin || isParent || isMedicalStaff;

  useEffect(() => {
    fetchNotifications();
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await instance.get('/api/Campaign/get-all-campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let apiUrl = '';
      
      // Chỉ Admin mới có thể xem tất cả thông báo
      if (isAdmin) {
        apiUrl = '/api/Notification/get-all-notifications';
      } else if ((isParent || isMedicalStaff) && user?.id) {
        // Parent và MedicalStaff (Nurse) chỉ xem thông báo của chính họ
        apiUrl = `/api/Notification/get-notifications-by-user-id/${user.id}`;
      } else {
        // Trường hợp không có userId hoặc role không hợp lệ
        setError('Không thể xác định thông tin người dùng để tải thông báo.');
        return;
      }
      
      const response = await instance.get(apiUrl);
      
      // Transform API response to match our interface
      const transformedNotifications = response.data.map((notif: any) => ({
        id: notif.id,
        campaignId: notif.campaignId,
        title: notif.title,
        content: notif.content || '', // Map content từ API
        returnUrl: notif.returnUrl,
        createdAt: notif.createdAt,
        updatedAt: notif.updatedAt,
        isRead: false, // Default since API doesn't provide this
        campaign: notif.campaign
      }));
      
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (isAdmin) {
        setError('Không thể tải tất cả thông báo. Vui lòng thử lại.');
      } else {
        setError('Không thể tải thông báo của bạn. Vui lòng thử lại.');
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    if (!canManageNotifications) return;
    
    try {
      const payload = {
        campaignId: formData.campaignId,
        title: formData.title,
        returnUrl: formData.returnUrl
      };

      await instance.post('/api/Notification/create-notification', payload);

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
        campaignId: formData.campaignId,
        title: formData.title,
        returnUrl: formData.returnUrl
      };

      await instance.put(`/api/Notification/update-notification/${editingNotification.id}`, payload);

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
      await instance.delete(`/api/Notification/delete-notification/${notificationId}`);

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
      campaignId: '',
      title: '',
      returnUrl: ''
    });
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      campaignId: notification.campaignId,
      title: notification.title,
      returnUrl: notification.returnUrl
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  // Filter notifications based on tab
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Campaign related (important)
        return notifications.filter(n => n.campaign && n.campaign.name);
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const campaignCount = notifications.filter(n => n.campaign && n.campaign.name).length;
  const filteredNotifications = getFilteredNotifications();

  if (!user?.isAuthenticated || !canViewNotifications) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            {!user?.isAuthenticated 
              ? "Bạn cần đăng nhập để xem thông báo."
              : "Bạn không có quyền truy cập trang này. Chỉ Admin, Parent và MedicalStaff mới có thể xem thông báo."
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
          subtitle={
            isAdmin 
              ? "Quản lý và theo dõi tất cả các thông báo hệ thống" 
              : isParent 
                ? "Theo dõi các thông báo liên quan đến con em bạn"
                : isMedicalStaff
                  ? "Theo dõi các thông báo công việc của bạn"
                  : "Theo dõi các thông báo hệ thống"
          }
          showRefresh={true}
          onRefresh={fetchNotifications}
          actions={
            <Box sx={{ display: 'flex', gap: 1 }}>
            </Box>
          }
        />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Tất cả (${notifications.length})`} />
            <Tab label={`Chiến dịch (${campaignCount})`} />
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
                        borderLeft: `4px solid #2980b9`,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                          <InfoIcon sx={{ color: '#2980b9' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                              variant="subtitle1"
                            >
                              {notification.title}
                            </Typography>
                            
                            {notification.campaign && (
                              <Chip
                                label={notification.campaign.name}
                                size="small"
                                sx={{
                                  bgcolor: '#3498db',
                                  color: 'white',
                                  fontSize: '10px',
                                  height: '20px',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            {notification.content && (
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {notification.content}
                              </Typography>
                            )}
                            {notification.returnUrl ? (
                              <Box sx={{ mt: 0.5 }}>
                                <Button
                                  size="small"
                                  startIcon={<LinkIcon />}
                                  href={`http://localhost:3000${notification.returnUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    textTransform: 'none',
                                    color: '#2980b9',
                                    '&:hover': {
                                      backgroundColor: 'rgba(41, 128, 185, 0.1)'
                                    }
                                  }}
                                >
                                  {`localhost:3000${notification.returnUrl}`}
                                </Button>
                              </Box>
                            ) : (
                              <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                Không có link chi tiết
                              </Typography>
                            )}
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
              <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                <InputLabel>Chọn chiến dịch</InputLabel>
                <Select
                  value={formData.campaignId}
                  onChange={(e) => {
                    const selectedCampaign = campaigns.find(c => c.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      campaignId: e.target.value,
                      title: selectedCampaign ? selectedCampaign.name : formData.title,
                      returnUrl: selectedCampaign ? `/vaccination/campaign/${selectedCampaign.id}` : formData.returnUrl
                    });
                  }}
                >
                  <SelectMenuItem value="">
                    <em>Chọn chiến dịch</em>
                  </SelectMenuItem>
                  {campaigns.map((campaign) => (
                    <SelectMenuItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Tiêu đề"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
                helperText="Để trống để sử dụng tên chiến dịch"
              />

              <TextField
                margin="dense"
                label="Link chi tiết (returnUrl)"
                fullWidth
                variant="outlined"
                value={formData.returnUrl}
                onChange={(e) => setFormData({ ...formData, returnUrl: e.target.value })}
                helperText="Link sẽ được tự động tạo khi chọn chiến dịch"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
            <Button 
              onClick={createNotification}
              variant="contained"
              disabled={!formData.campaignId || !formData.title.trim()}
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
              <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                <InputLabel>Chọn chiến dịch</InputLabel>
                <Select
                  value={formData.campaignId}
                  onChange={(e) => {
                    const selectedCampaign = campaigns.find(c => c.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      campaignId: e.target.value,
                      title: selectedCampaign ? selectedCampaign.name : formData.title,
                      returnUrl: selectedCampaign ? `/vaccination/campaign/${selectedCampaign.id}` : formData.returnUrl
                    });
                  }}
                >
                  <SelectMenuItem value="">
                    <em>Chọn chiến dịch</em>
                  </SelectMenuItem>
                  {campaigns.map((campaign) => (
                    <SelectMenuItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Tiêu đề"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
                helperText="Để trống để sử dụng tên chiến dịch"
              />
              
              <TextField
                margin="dense"
                label="Link chi tiết (returnUrl)"
                fullWidth
                variant="outlined"
                value={formData.returnUrl}
                onChange={(e) => setFormData({ ...formData, returnUrl: e.target.value })}
                helperText="Link sẽ được tự động tạo khi chọn chiến dịch"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button 
              onClick={updateNotification}
              variant="contained"
              disabled={!formData.campaignId || !formData.title.trim()}
            >
              Cập nhật thông báo
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
