import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import instance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import PageHeader from '../common/PageHeader';

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
  role: string;
  image?: string; // Đổi từ avatar thành image
}

const UserProfilePage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Danh sách vai trò
  const ROLE_OPTIONS = [
    { value: 'Parent', label: 'Phụ huynh' },
    { value: 'Admin', label: 'Quản trị viên' },
    { value: 'Doctor', label: 'Bác sĩ' },
    { value: 'Nurse', label: 'Y tá' },
  ];

  // Fetch user profile data
  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Thay đổi URL API theo backend của bạn
      const response = await instance.get(`/api/User/get-user-by-id/${user?.id}`);
      setUserProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // setError('Không thể tải thông tin người dùng');
      // toast.error('Không thể tải thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      await instance.put(`/api/User/update-user/${user?.id}`, formData);
      
      // Fetch lại dữ liệu mới nhất từ server
      await fetchUserProfile();

      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await instance.post('/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // API trả về URL dạng string
      const avatarUrl = response.data;
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Không thể tải lên ảnh đại diện');
      throw error;
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      const avatarUrl = await uploadAvatar(file);
      
      // Cập nhật cả formData và userProfile để hiển thị ngay lập tức
      if (formData) {
        const updatedFormData = { ...formData, image: avatarUrl }; // Đổi từ avatar thành image
        setFormData(updatedFormData);
        
        // Cập nhật luôn userProfile để avatar hiển thị ngay
        setUserProfile(prev => prev ? { ...prev, image: avatarUrl } : null); // Đổi từ avatar thành image
      }
      
      toast.success('Tải lên ảnh đại diện thành công!');
    } catch (error) {
      // Error handled in uploadAvatar function
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...userProfile! });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...userProfile! });
  };

  const handleSave = () => {
    updateUserProfile();
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !userProfile) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            {error || 'Không thể tải thông tin người dùng'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <PageHeader 
          title="Trang cá nhân"
          subtitle="Quản lý thông tin cá nhân và cài đặt tài khoản"
        />

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header with avatar and basic info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  src={formData?.image || userProfile.image} // Đổi từ avatar thành image
                  sx={{ width: 120, height: 120 }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#2980b9',
                      color: 'white',
                      '&:hover': { bgcolor: '#1b4f72' }
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formData?.fullName || userProfile.fullName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  @{formData?.username || userProfile.username}
                </Typography>
                <Typography variant="body2" color="primary">
                  {ROLE_OPTIONS.find(role => role.value === (formData?.role || userProfile.role))?.label || (formData?.role || userProfile.role)}
                </Typography>
              </Box>
              <Box>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* User information form */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Thông tin cá nhân
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Row 1: Username and Full Name */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <TextField
                    label="Tên đăng nhập"
                    value={isEditing ? formData?.username || '' : userProfile.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    fullWidth
                    disabled={true}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <TextField
                    label="Họ và tên"
                    value={isEditing ? formData?.fullName || '' : userProfile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    fullWidth
                    disabled={!isEditing}
                    variant="outlined"
                    required
                  />
                </Box>
              </Box>

              {/* Row 2: Phone and Email */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <TextField
                    label="Số điện thoại"
                    value={isEditing ? formData?.phoneNumber || '' : userProfile.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    fullWidth
                    disabled={!isEditing}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <TextField
                    label="Email"
                    value={isEditing ? formData?.email || '' : userProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    fullWidth
                    disabled={true}
                    variant="outlined"
                    type="email"
                  />
                </Box>
              </Box>

              {/* Row 3: Address (full width) */}
              <Box>
                <TextField
                  label="Địa chỉ"
                  value={isEditing ? formData?.address || '' : userProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                  disabled={!isEditing}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Box>
            </Box>

            {isEditing && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  💡 Lưu ý: Tên đăng nhập và email không thể thay đổi sau khi tạo tài khoản.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UserProfilePage;
